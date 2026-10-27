/** Centralized video canvas presets, used by the new-video picker, the custom-size modal and the
 * in-editor canvas settings control. Never hardcode these dimensions elsewhere. */
export interface VideoPreset {
  id: string
  label: string
  group: 'Instagram' | 'YouTube' | 'Facebook' | 'Other'
  width: number
  height: number
  ratio: string
}

export const VIDEO_PRESETS: VideoPreset[] = [
  { id: 'ig-post', label: 'Instagram Post', group: 'Instagram', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'ig-portrait-post', label: 'Instagram Portrait Post', group: 'Instagram', width: 1080, height: 1350, ratio: '4:5' },
  { id: 'ig-story', label: 'Instagram Story', group: 'Instagram', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'ig-reel', label: 'Instagram Reel', group: 'Instagram', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'ig-landscape-post', label: 'Instagram Landscape Post', group: 'Instagram', width: 1080, height: 566, ratio: '1.91:1' },

  { id: 'yt-video', label: 'YouTube Video', group: 'YouTube', width: 1920, height: 1080, ratio: '16:9' },
  { id: 'yt-shorts', label: 'YouTube Shorts', group: 'YouTube', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'yt-thumbnail', label: 'YouTube Thumbnail', group: 'YouTube', width: 1280, height: 720, ratio: '16:9' },

  { id: 'fb-post', label: 'Facebook Post', group: 'Facebook', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'fb-story', label: 'Facebook Story', group: 'Facebook', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'fb-landscape-video', label: 'Facebook Landscape Video', group: 'Facebook', width: 1920, height: 1080, ratio: '16:9' },
  { id: 'fb-cover', label: 'Facebook Cover', group: 'Facebook', width: 1640, height: 624, ratio: '2.63:1' },

  { id: 'pinterest-pin', label: 'Pinterest Pin', group: 'Other', width: 1000, height: 1500, ratio: '2:3' },
  { id: 'linkedin-banner', label: 'LinkedIn Banner', group: 'Other', width: 1584, height: 396, ratio: '4:1' },
  { id: 'a4-document', label: 'A4 Document', group: 'Other', width: 1240, height: 1754, ratio: '0.71:1' },
]

export const VIDEO_PRESET_GROUPS: VideoPreset['group'][] = ['Instagram', 'YouTube', 'Facebook', 'Other']

/** The first preset whose dimensions match exactly, or undefined for a custom size. */
export function findPreset(width: number, height: number): VideoPreset | undefined {
  return VIDEO_PRESETS.find((p) => p.width === width && p.height === height)
}

function simplifyRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const d = gcd(Math.round(width), Math.round(height))
  if (d > 0 && width / d <= 32 && height / d <= 32) return `${width / d}:${height / d}`
  return `${(width / height).toFixed(2)}:1`
}

/** Human label for the canvas info readout, e.g. "Instagram Reel" or "Custom size". */
export function canvasLabel(width: number, height: number): string {
  return findPreset(width, height)?.label ?? 'Custom size'
}

/** Aspect ratio label for the canvas info readout, preferring the preset's documented ratio. */
export function canvasRatio(width: number, height: number): string {
  return findPreset(width, height)?.ratio ?? simplifyRatio(width, height)
}
