export interface VideoClip {
  id: string
  kind: 'video' | 'image' | 'audio' | 'text'
  /** Seconds, where this clip starts on the timeline. */
  start: number
  /** Seconds, how long this clip plays on the timeline. */
  duration: number
  /** Seconds into the source media where playback begins (ignored for text). */
  trimIn: number
  /** Full duration of the source media, in seconds (ignored for text). Bounds how far trimIn/duration can go. */
  sourceDuration?: number
  assetUrl?: string
  volume: number
  muted?: boolean
  text?: string
  fontSize?: number
  fontFamily?: string
  color?: string
  bold?: boolean
  italic?: boolean
  textAlign?: 'left' | 'center' | 'right'
  /** 0–1, fraction of the project canvas opacity. */
  opacity?: number
  /** 0–1, fraction of the canvas width/height — the text's center point. Defaults to bottom-center. */
  x?: number
  y?: number
}

export interface VideoTrack {
  id: string
  kind: 'video' | 'audio' | 'text'
  name: string
  locked: boolean
  muted: boolean
  hidden: boolean
  clips: VideoClip[]
}

export interface VideoTimeline {
  tracks: VideoTrack[]
}

export interface VideoProjectSummary {
  id: number
  title: string
  width: number
  height: number
  fps: number
  durationSeconds: number
  createdAt: string
  updatedAt: string
}

export interface VideoProject extends VideoProjectSummary {
  timeline: VideoTimeline
}
