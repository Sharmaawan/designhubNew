import { useEffect, useState } from 'react'
import { getAudioWaveform, getVideoThumbnails } from '@/services/video/mediaPreview'

/** Row of real frame thumbnails spanning a video clip's trimmed source range, sized to fill the clip's current pixel width. */
export function VideoThumbnails({ assetUrl, trimIn, duration, widthPx }: { assetUrl: string; trimIn: number; duration: number; widthPx: number }) {
  const count = Math.max(1, Math.min(8, Math.round(widthPx / 70)))
  const [frames, setFrames] = useState<string[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const times = Array.from({ length: count }, (_, i) => trimIn + (duration * (i + 0.5)) / count)
    setFrames(null)
    getVideoThumbnails(assetUrl, times).then((f) => {
      if (!cancelled) setFrames(f)
    }).catch(() => {
      if (!cancelled) setFrames([])
    })
    return () => {
      cancelled = true
    }
  }, [assetUrl, trimIn, duration, count])

  if (!frames?.length) return null
  return (
    <div className="video-clip__thumbs">
      {frames.map((src, i) => (
        <img key={i} src={src} alt="" draggable={false} />
      ))}
    </div>
  )
}

/** Bar-chart waveform sliced to the clip's trimmed range from the full-file peak data. */
export function AudioWaveform({ assetUrl, trimIn, duration, sourceDuration }: { assetUrl: string; trimIn: number; duration: number; sourceDuration?: number }) {
  const [peaks, setPeaks] = useState<number[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getAudioWaveform(assetUrl).then((p) => {
      if (!cancelled) setPeaks(p)
    }).catch(() => {
      if (!cancelled) setPeaks([])
    })
    return () => {
      cancelled = true
    }
  }, [assetUrl])

  if (!peaks?.length) return null
  const total = sourceDuration ?? trimIn + duration
  const startFrac = Math.max(0, trimIn / total)
  const endFrac = Math.min(1, (trimIn + duration) / total)
  const startIdx = Math.floor(startFrac * peaks.length)
  const endIdx = Math.max(startIdx + 1, Math.ceil(endFrac * peaks.length))
  const slice = peaks.slice(startIdx, endIdx)

  return (
    <div className="video-clip__wave" aria-hidden="true">
      {slice.map((p, i) => (
        <span key={i} style={{ height: `${Math.max(8, p * 100)}%` }} />
      ))}
    </div>
  )
}
