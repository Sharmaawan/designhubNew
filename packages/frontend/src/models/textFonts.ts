/** Fonts offered for text clips. Every entry here must have a matching regular/bold/italic/bold-italic
 * mapping in the backend's export font table (packages/backend/src/videoExport.ts) — otherwise the
 * exported video silently falls back to the default font instead of what the preview showed. */
export interface TextFont {
  id: string
  label: string
  /** CSS font-family value, with a sensible generic fallback for the live preview. */
  css: string
}

export const TEXT_FONTS: TextFont[] = [
  { id: 'arial', label: 'Arial', css: "Arial, Helvetica, sans-serif" },
  { id: 'georgia', label: 'Georgia', css: "Georgia, 'Times New Roman', serif" },
  { id: 'times', label: 'Times New Roman', css: "'Times New Roman', Times, serif" },
  { id: 'courier', label: 'Courier New', css: "'Courier New', Courier, monospace" },
  { id: 'verdana', label: 'Verdana', css: "Verdana, Geneva, sans-serif" },
  { id: 'comic', label: 'Comic Sans MS', css: "'Comic Sans MS', 'Comic Sans', cursive" },
  { id: 'impact', label: 'Impact', css: "Impact, 'Arial Narrow', sans-serif" },
  { id: 'trebuchet', label: 'Trebuchet MS', css: "'Trebuchet MS', sans-serif" },
]

export function textFontCss(id: string | undefined): string {
  return TEXT_FONTS.find((f) => f.id === id)?.css ?? TEXT_FONTS[0]!.css
}
