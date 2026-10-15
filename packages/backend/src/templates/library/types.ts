// Helpers for describing original template designs in the same element shape the editor stores.
export type ShapeName = 'rect' | 'ellipse' | 'triangle' | 'diamond' | 'star' | 'chevron' | 'line'
export type FrameName = 'rect' | 'ellipse' | 'rounded' | 'star' | 'heart'

export interface LibraryElement {
  type: 'text' | 'shape' | 'frame' | 'image'
  data: Record<string, unknown>
}

export interface LibraryTemplate {
  slug: string
  title: string
  tags: string
  width: number
  height: number
  background: string
  elements: LibraryElement[]
  /** Optional pre-rendered JPEG preview in this folder, used instead of the SVG preview. */
  thumbnailFile?: string
}

export interface TextStyle {
  family: string
  size: number
  weight: number
  fill: string
  align?: 'left' | 'center' | 'right'
  lh?: number
  ls?: number
}

export function rect(x: number, y: number, width: number, height: number, fill: string, cornerRadius = 0): LibraryElement {
  return { type: 'shape', data: { x, y, width, height, shape: 'rect', fill, cornerRadius } }
}

export function ellipse(x: number, y: number, width: number, height: number, fill: string): LibraryElement {
  return { type: 'shape', data: { x, y, width, height, shape: 'ellipse', fill } }
}

export function frame(kind: FrameName, x: number, y: number, width: number, height: number, name: string, fill = '#E4E2DC'): LibraryElement {
  return { type: 'frame', data: { x, y, width, height, frame: kind, fill, name } }
}

export function text(x: number, y: number, width: number, height: number, content: string, style: TextStyle): LibraryElement {
  return {
    type: 'text',
    data: {
      x, y, width, height,
      text: content,
      fontFamily: style.family,
      fontSize: style.size,
      fontWeight: style.weight,
      fill: style.fill,
      align: style.align ?? 'left',
      lineHeight: style.lh ?? 1.15,
      letterSpacing: style.ls ?? 0,
    },
  }
}

export interface ImageCrop {
  x: number
  y: number
  width: number
  height: number
}

/** A licensed photo. Crop is in source-image pixels, as the editor expects. */
export function image(x: number, y: number, width: number, height: number, src: string, naturalWidth: number, naturalHeight: number, crop?: ImageCrop): LibraryElement {
  return { type: 'image', data: { x, y, width, height, src, naturalWidth, naturalHeight, ...(crop ? { crop } : {}), alt: '' } }
}
