import { readFileSync } from 'node:fs'
import type { LibraryTemplate } from './types.js'

// Builds the SVG preview stored with each template. It mirrors the editor's element data closely enough
// to show layout, colour and type. Fonts fall back to the system sans because <img> SVGs cannot load web fonts.
interface ThumbnailTemplate {
  width: number
  height: number
  background: string
  elements: { type: string; data: Record<string, unknown> }[]
}

const GLYPH_WIDTH = 0.55

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!)
}

function wrapLines(content: string, width: number, fontSize: number): string[] {
  const maxChars = Math.max(1, Math.floor(width / (fontSize * GLYPH_WIDTH)))
  const lines: string[] = []
  for (const paragraph of content.split('\n')) {
    let line = ''
    for (const word of paragraph.split(' ')) {
      const next = line ? `${line} ${word}` : word
      if (next.length > maxChars && line) {
        lines.push(line)
        line = word
      } else {
        line = next
      }
    }
    lines.push(line)
  }
  return lines
}

function renderElement({ type, data }: { type: string; data: Record<string, unknown> }): string {
  const x = Number(data.x ?? 0)
  const y = Number(data.y ?? 0)
  const width = Number(data.width ?? 0)
  const height = Number(data.height ?? 0)
  const fill = escapeXml(String(data.fill ?? '#151515'))

  if (type === 'shape') {
    if (data.shape === 'ellipse') {
      return `<ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${fill}"/>`
    }
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${Number(data.cornerRadius ?? 0)}" fill="${fill}"/>`
  }

  if (type === 'frame') {
    // Photo placeholders show as a tinted block with a soft outline, so the layout reads as an image slot.
    const shape = data.frame === 'ellipse'
      ? `<ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${fill}" stroke="#00000022" stroke-width="2"/>`
      : `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${data.frame === 'rounded' ? Math.min(width, height) * 0.12 : 0}" fill="${fill}" stroke="#00000022" stroke-width="2"/>`
    return shape
  }

  if (type === 'text') {
    const fontSize = Number(data.fontSize ?? 32)
    const lineHeight = Number(data.lineHeight ?? 1.2)
    const align = String(data.align ?? 'left')
    const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start'
    const anchorX = align === 'center' ? x + width / 2 : align === 'right' ? x + width : x
    const family = `${escapeXml(String(data.fontFamily ?? 'Arial'))},Arial,sans-serif`
    const spans = wrapLines(String(data.text ?? ''), width, fontSize)
      .map((line, index) => `<tspan x="${anchorX}" dy="${index ? fontSize * lineHeight : 0}">${escapeXml(line)}</tspan>`)
      .join('')
    return `<text x="${anchorX}" y="${y + fontSize}" text-anchor="${anchor}" fill="${fill}" font-family="${family}" font-size="${fontSize}" font-weight="${Number(data.fontWeight ?? 400)}">${spans}</text>`
  }

  return ''
}

export function templateThumbnail(template: ThumbnailTemplate): string {
  const elements = template.elements.map(renderElement).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${template.width} ${template.height}"><rect width="100%" height="100%" fill="${escapeXml(template.background)}"/>${elements}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** Uses a pre-rendered JPEG preview when the template names one, otherwise falls back to the SVG preview. */
export function thumbnailFor(template: LibraryTemplate): string {
  // Named preview wins; otherwise the preview is expected at assets/<title-slug>.jpg.
  const name = template.thumbnailFile ?? `${template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.jpg`
  const file = new URL(`./assets/${name}`, import.meta.url)
  try {
    return `data:image/jpeg;base64,${readFileSync(file).toString('base64')}`
  } catch {
    return templateThumbnail(template)
  }
}
