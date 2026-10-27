import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, unlink } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { createRequire } from 'node:module'

const ffmpegPath = createRequire(import.meta.url)('ffmpeg-static') as string | null

export interface ExportClip {
  id: string
  kind: 'video' | 'image' | 'audio' | 'text'
  start: number
  duration: number
  trimIn: number
  assetUrl?: string
  volume: number
  muted?: boolean
  text?: string
  fontSize?: number
  color?: string
}

export interface ExportTrack {
  kind: 'video' | 'audio' | 'text'
  muted: boolean
  hidden: boolean
  clips: ExportClip[]
}

export interface ExportInput {
  width: number
  height: number
  fps: number
  tracks: ExportTrack[]
}

export interface ExportJob {
  status: 'queued' | 'rendering' | 'done' | 'error'
  progress: number
  error?: string
  outputPath?: string
}

const jobs = new Map<string, ExportJob>()
const MAX_DURATION_SECONDS = 600

export function getExportJob(jobId: string): ExportJob | undefined {
  return jobs.get(jobId)
}

function projectDuration(input: ExportInput): number {
  return input.tracks.reduce((max, t) => Math.max(max, ...t.clips.map((c) => c.start + c.duration), 0), 0)
}

/** Replicates the editor preview's "first clip covering this instant" rule so export matches what was seen. */
function segmentsForTrack(clips: ExportClip[], duration: number): { start: number; end: number; clip: ExportClip | null }[] {
  const bounds = new Set<number>([0, duration])
  for (const c of clips) {
    bounds.add(Math.max(0, Math.min(duration, c.start)))
    bounds.add(Math.max(0, Math.min(duration, c.start + c.duration)))
  }
  const sorted = [...bounds].sort((a, b) => a - b)
  const raw: { start: number; end: number; clip: ExportClip | null }[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i]!
    const end = sorted[i + 1]!
    if (end - start < 0.01) continue
    const mid = (start + end) / 2
    const clip = clips.find((c) => mid >= c.start && mid < c.start + c.duration) ?? null
    raw.push({ start, end, clip })
  }
  const merged: typeof raw = []
  for (const seg of raw) {
    const last = merged[merged.length - 1]
    if (last && last.clip?.id === seg.clip?.id) last.end = seg.end
    else merged.push({ ...seg })
  }
  return merged
}

function escapeDrawtext(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "\\'").replace(/\r?\n/g, ' ')
}

function run(bin: string, args: string[], onProgress?: (frac: number) => void, totalSeconds = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args)
    let stderr = ''
    child.stdout.on('data', (buf: Buffer) => {
      const text = buf.toString()
      const match = text.match(/out_time_ms=(\d+)/)
      if (match && onProgress) onProgress(Math.min(1, Number(match[1]) / 1e6 / totalSeconds))
    })
    child.stderr.on('data', (buf: Buffer) => { stderr += buf.toString() })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-2000)}`))
    })
  })
}

async function renderVideoProject(
  outputPath: string,
  input: ExportInput,
  resolveAssetPath: (url: string) => string,
  onProgress: (frac: number) => void,
) {
  if (!ffmpegPath) throw new Error('The ffmpeg binary could not be located on this server.')
  const { width, height, fps } = input
  const duration = projectDuration(input)
  if (duration <= 0) throw new Error('Add at least one clip to the timeline before exporting.')
  if (duration > MAX_DURATION_SECONDS) throw new Error(`Videos longer than ${MAX_DURATION_SECONDS / 60} minutes are not supported yet.`)

  const videoTracks = input.tracks.filter((t) => t.kind === 'video' && !t.hidden)

  const args: string[] = []
  const audioLabels: string[] = []
  let inputIndex = 0
  const filters: string[] = []

  // Bottom layer: the first video track, concatenated across its full duration (gaps filled with black).
  const baseTrack = videoTracks[0]
  const baseSegments = baseTrack ? segmentsForTrack(baseTrack.clips, duration) : [{ start: 0, end: duration, clip: null }]
  const baseLabels: string[] = []
  for (const seg of baseSegments) {
    const segDuration = Math.max(0.05, seg.end - seg.start)
    const label = `v${inputIndex}`
    if (!seg.clip) {
      args.push('-f', 'lavfi', '-t', segDuration.toFixed(3), '-i', `color=c=black:s=${width}x${height}:r=${fps}`)
      filters.push(`[${inputIndex}:v]fps=${fps},format=yuv420p[${label}]`)
    } else if (seg.clip.kind === 'image') {
      args.push('-loop', '1', '-t', segDuration.toFixed(3), '-i', resolveAssetPath(seg.clip.assetUrl ?? ''))
      filters.push(`[${inputIndex}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${fps},format=yuv420p[${label}]`)
    } else {
      const trimIn = seg.clip.trimIn + (seg.start - seg.clip.start)
      args.push('-ss', trimIn.toFixed(3), '-t', segDuration.toFixed(3), '-i', resolveAssetPath(seg.clip.assetUrl ?? ''))
      filters.push(`[${inputIndex}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${fps},format=yuv420p[${label}]`)
      if (!baseTrack?.muted && !seg.clip.muted && seg.clip.volume > 0) {
        const alabel = `a${inputIndex}`
        const delayMs = Math.round(seg.start * 1000)
        filters.push(`[${inputIndex}:a]asetpts=PTS-STARTPTS,adelay=${delayMs}|${delayMs},volume=${seg.clip.volume}[${alabel}]`)
        audioLabels.push(alabel)
      }
    }
    baseLabels.push(`[${label}]`)
    inputIndex++
  }
  filters.push(`${baseLabels.join('')}concat=n=${baseLabels.length}:v=1:a=0[layer0]`)
  let compositeOut = 'layer0'

  // Additional video tracks stack on top, each clip only visible during its own time window (overlay's `enable`),
  // so gaps on an upper track let the layer beneath show through instead of going black.
  for (let trackIdx = 1; trackIdx < videoTracks.length; trackIdx++) {
    const track = videoTracks[trackIdx]!
    for (const clip of track.clips) {
      const segDuration = Math.max(0.05, clip.duration)
      const label = `v${inputIndex}`
      if (clip.kind === 'image') {
        args.push('-loop', '1', '-t', segDuration.toFixed(3), '-i', resolveAssetPath(clip.assetUrl ?? ''))
      } else if (clip.kind === 'video') {
        args.push('-ss', clip.trimIn.toFixed(3), '-t', segDuration.toFixed(3), '-i', resolveAssetPath(clip.assetUrl ?? ''))
        if (!track.muted && !clip.muted && clip.volume > 0) {
          const alabel = `a${inputIndex}`
          const delayMs = Math.round(clip.start * 1000)
          filters.push(`[${inputIndex}:a]asetpts=PTS-STARTPTS,adelay=${delayMs}|${delayMs},volume=${clip.volume}[${alabel}]`)
          audioLabels.push(alabel)
        }
      } else {
        continue
      }
      filters.push(`[${inputIndex}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${fps},format=yuv420p,setpts=PTS+${clip.start}/TB[${label}]`)
      const next = `layer${trackIdx}_${inputIndex}`
      filters.push(`[${compositeOut}][${label}]overlay=enable='between(t,${clip.start},${clip.start + clip.duration})'[${next}]`)
      compositeOut = next
      inputIndex++
    }
  }

  for (const track of input.tracks) {
    if (track.kind !== 'audio' || track.muted) continue
    for (const clip of track.clips) {
      if (clip.volume <= 0 || clip.muted || !clip.assetUrl) continue
      args.push('-ss', clip.trimIn.toFixed(3), '-t', clip.duration.toFixed(3), '-i', resolveAssetPath(clip.assetUrl))
      const alabel = `a${inputIndex}`
      const delayMs = Math.round(clip.start * 1000)
      filters.push(`[${inputIndex}:a]asetpts=PTS-STARTPTS,adelay=${delayMs}|${delayMs},volume=${clip.volume}[${alabel}]`)
      audioLabels.push(alabel)
      inputIndex++
    }
  }

  let videoOut = compositeOut
  let textIndex = 0
  const fontFile = process.env.EXPORT_FONT_FILE ?? 'C:/Windows/Fonts/arial.ttf'
  const hasFont = existsSync(fontFile)
  for (const track of input.tracks) {
    if (track.kind !== 'text' || track.hidden) continue
    for (const clip of track.clips) {
      if (!clip.text?.trim()) continue
      const next = `txt${textIndex++}`
      const fontArg = hasFont ? `fontfile='${fontFile.replace(/:/g, '\\:')}':` : ''
      filters.push(
        `[${videoOut}]drawtext=${fontArg}text='${escapeDrawtext(clip.text)}':fontsize=${Math.round(clip.fontSize ?? 48)}:fontcolor=${(clip.color ?? '#ffffff').replace('#', '0x')}:x=(w-text_w)/2:y=h-text_h-60:enable='between(t,${clip.start},${clip.start + clip.duration})'[${next}]`,
      )
      videoOut = next
    }
  }

  if (audioLabels.length === 0) {
    args.push('-f', 'lavfi', '-t', duration.toFixed(3), '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100')
    filters.push(`[${inputIndex}:a]anull[outa]`)
    inputIndex++
  } else if (audioLabels.length === 1) {
    filters.push(`[${audioLabels[0]}]anull[outa]`)
  } else {
    filters.push(`${audioLabels.map((l) => `[${l}]`).join('')}amix=inputs=${audioLabels.length}:duration=longest:dropout_transition=0[outa]`)
  }

  args.push(
    '-filter_complex', filters.join(';'),
    '-map', `[${videoOut}]`,
    '-map', '[outa]',
    '-t', duration.toFixed(3),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '23', '-r', String(fps),
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    '-progress', 'pipe:1', '-nostats',
    '-y', outputPath,
  )

  await run(ffmpegPath, args, onProgress, duration)
}

export function startExportJob(input: ExportInput, resolveAssetPath: (url: string) => string): string {
  const jobId = randomBytes(12).toString('hex')
  jobs.set(jobId, { status: 'queued', progress: 0 })
  const tmpDir = path.join(os.tmpdir(), 'designhub-video-export')
  const outputPath = path.join(tmpDir, `${jobId}.mp4`)
  void (async () => {
    try {
      await mkdir(tmpDir, { recursive: true })
      jobs.set(jobId, { status: 'rendering', progress: 0 })
      await renderVideoProject(outputPath, input, resolveAssetPath, (progress) => {
        jobs.set(jobId, { status: 'rendering', progress })
      })
      jobs.set(jobId, { status: 'done', progress: 1, outputPath })
    } catch (error) {
      jobs.set(jobId, { status: 'error', progress: 0, error: (error as Error).message })
    }
  })()
  return jobId
}

export async function readExportOutput(jobId: string): Promise<Buffer> {
  const job = jobs.get(jobId)
  if (!job?.outputPath) throw new Error('Export output not found.')
  return readFile(job.outputPath)
}

export async function cleanupExportJob(jobId: string) {
  const job = jobs.get(jobId)
  if (job?.outputPath) await unlink(job.outputPath).catch(() => undefined)
  jobs.delete(jobId)
}
