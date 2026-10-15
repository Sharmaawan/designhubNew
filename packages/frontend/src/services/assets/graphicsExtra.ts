import type { Graphic } from './graphics'

// More original built-in graphics, drawn as simple vector art on a 200 x 200 grid.
const svg = (inner: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${inner}</svg>`

export const EXTRA_ILLUSTRATIONS: Graphic[] = [
  { id: 'sparkle', name: 'Sparkle', colored: true, svg: svg('<path d="M100 8Q108 92 192 100Q108 108 100 192Q92 108 8 100Q92 92 100 8Z" fill="#FFB547"/>') },
  { id: 'ribbon', name: 'Ribbon', colored: true, svg: svg('<path d="M14 62h172v52H14z" fill="#FF5A36"/><path d="M14 114L2 150l26-10 14 30 26-58zM186 114l12 36-26-10-14 30-26-58z" fill="#B23A22"/>') },
  { id: 'sun-rays', name: 'Sun with rays', colored: true, svg: svg(`<circle cx="100" cy="100" r="34" fill="#FFB547"/>${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return `<line x1="${100 + Math.cos(a) * 52}" y1="${100 + Math.sin(a) * 52}" x2="${100 + Math.cos(a) * 80}" y2="${100 + Math.sin(a) * 80}" stroke="#FFB547" stroke-width="10" stroke-linecap="round"/>` }).join('')}`) },
  { id: 'crescent', name: 'Crescent moon', colored: true, svg: svg('<path d="M120 20a80 80 0 1 0 60 130A66 66 0 0 1 120 20z" fill="#F4D35E"/>') },
  { id: 'rainbow', name: 'Rainbow', colored: true, svg: svg('<path d="M20 150a80 80 0 0 1 160 0" fill="none" stroke="#FF5A36" stroke-width="18"/><path d="M40 150a60 60 0 0 1 120 0" fill="none" stroke="#FFB547" stroke-width="18"/><path d="M60 150a40 40 0 0 1 80 0" fill="none" stroke="#2EC4B6" stroke-width="18"/>') },
  { id: 'badge-star', name: 'Star badge', colored: true, svg: svg('<circle cx="100" cy="100" r="80" fill="#151515"/><path d="M100 40l16 34 37 4-28 25 8 37-33-19-33 19 8-37-28-25 37-4z" fill="#FFD400"/>') },
  { id: 'flower', name: 'Flower', colored: true, svg: svg(`${Array.from({ length: 6 }, (_, i) => { const a = (i * Math.PI) / 3; return `<ellipse cx="${100 + Math.cos(a) * 46}" cy="${100 + Math.sin(a) * 46}" rx="34" ry="30" fill="#FF8FB1" transform="rotate(${(i * 360) / 6} ${100 + Math.cos(a) * 46} ${100 + Math.sin(a) * 46})"/>` }).join('')}<circle cx="100" cy="100" r="22" fill="#FFD400"/>`) },
  { id: 'curve-arrow', name: 'Curved arrow', colored: true, svg: svg('<path d="M24 160C40 40 140 30 170 104" fill="none" stroke="#151515" stroke-width="10" stroke-linecap="round"/><path d="M146 92l26 14-8 28" fill="none" stroke="#151515" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>') },
  { id: 'pyramid', name: 'Pyramid', colored: true, svg: svg('<path d="M100 22L184 170H16z" fill="#2EC4B6"/><path d="M100 22L140 96L100 170L60 96z" fill="#1B8F85"/>') },
  { id: 'lightning', name: 'Lightning', colored: true, svg: svg('<path d="M116 12L38 112h58L82 188l80-104h-58z" fill="#FFD400"/>') },
  { id: 'pill', name: 'Pill', colored: true, svg: svg('<rect x="20" y="70" width="160" height="60" rx="30" fill="#2563EB"/>') },
  { id: 'stripes', name: 'Stripes', colored: true, svg: svg(Array.from({ length: 6 }, (_, i) => `<rect x="${-20 + i * 40}" y="0" width="20" height="200" fill="#151515" transform="rotate(30 100 100)"/>`).join('')) },
]
