const thumbCache = new Map<string, Promise<string[]>>()
const waveformCache = new Map<string, Promise<number[]>>()

/** Extracts JPEG frame thumbnails from a video at the given source timestamps (seconds). Cached per (url, times). */
export function getVideoThumbnails(url: string, times: number[]): Promise<string[]> {
  const key = `${url}|${times.map((t) => t.toFixed(2)).join(',')}`
  const cached = thumbCache.get(key)
  if (cached) return cached
  const promise = extractFrames(url, times)
  thumbCache.set(key, promise)
  promise.catch(() => thumbCache.delete(key))
  return promise
}

async function extractFrames(url: string, times: number[]): Promise<string[]> {
  const video = document.createElement('video')
  video.src = url
  video.muted = true
  video.preload = 'auto'
  video.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve()
    video.onerror = () => reject(new Error('Could not load video for thumbnails.'))
  })
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 54
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported.')
  const frames: string[] = []
  for (const t of times) {
    const target = Math.max(0, Math.min(video.duration - 0.05, t))
    await new Promise<void>((resolve) => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked)
        resolve()
      }
      video.addEventListener('seeked', onSeeked)
      video.currentTime = target
    })
    const vw = video.videoWidth || 16
    const vh = video.videoHeight || 9
    const scale = Math.max(canvas.width / vw, canvas.height / vh)
    const dw = vw * scale
    const dh = vh * scale
    ctx.drawImage(video, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
    frames.push(canvas.toDataURL('image/jpeg', 0.6))
  }
  return frames
}

/** Decodes an audio file and returns normalized (0..1) amplitude peaks spread evenly across its full duration. Cached per url. */
export function getAudioWaveform(url: string, buckets = 200): Promise<number[]> {
  const cached = waveformCache.get(url)
  if (cached) return cached
  const promise = extractWaveform(url, buckets)
  waveformCache.set(url, promise)
  promise.catch(() => waveformCache.delete(url))
  return promise
}

async function extractWaveform(url: string, buckets: number): Promise<number[]> {
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioCtx()
  try {
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
    const channel = audioBuffer.getChannelData(0)
    const bucketSize = Math.max(1, Math.floor(channel.length / buckets))
    const peaks: number[] = []
    for (let i = 0; i < buckets; i++) {
      const start = i * bucketSize
      let max = 0
      for (let j = start; j < start + bucketSize && j < channel.length; j++) {
        const abs = Math.abs(channel[j]!)
        if (abs > max) max = abs
      }
      peaks.push(max)
    }
    const peak = Math.max(...peaks, 0.001)
    return peaks.map((p) => p / peak)
  } finally {
    void ctx.close()
  }
}
