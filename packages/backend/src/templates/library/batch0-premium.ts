import { image, LibraryTemplate, rect, text } from './types.js'

// Pilot designs built around licensed Pixabay photography (Pixabay License: free for commercial use,
// no attribution required). The API key in this environment returns 1280 px renditions, so every photo
// is shown at or near its native size to keep it sharp.
const LUXURY_PHOTO = 'https://pixabay.com/get/g9b08ddc5f2eddb9e28615d6a036afb7e60512e1704c99f0534188daa69d36dd6bb3ab737d8f9ea0f2f581e710549f9430bc941c2d761c2178cfd0f085c35cd53_1280.jpg'
const EDITORIAL_PHOTO = 'https://pixabay.com/get/gb13a58392dee862ec20ca57b87321276f6a6843abd2e6cd10e9d3ed16d473deda05fd68db88dafefb8ed44dc26a9a08331ac1b2a25a44f2af79f8074c8992968_1280.jpg'
const BOLD_PHOTO = 'https://pixabay.com/get/gfa6066c827272d8d7938c13c3fc6ab25d43aa649a1e8f612c117596b4bb16341d3324297cc518da08e94bf51369d41ed8135ff5a2c8d28108e3f1f158129373f_1280.jpg'

export const batch0Premium: LibraryTemplate[] = [
  {
    slug: 'instagram-post', title: 'Maison evening edit', tags: 'luxury,fashion,premium,photo', width: 1080, height: 1080, background: '#0E0D0B',
    thumbnailFile: 'premium-luxury.jpg',
    elements: [
      image(520, 290, 500, 500, LUXURY_PHOTO, 1280, 637, { x: 321, y: 0, width: 637, height: 637 }),
      text(72, 110, 420, 50, 'Maison Aurelle', { family: 'Playfair Display', size: 34, weight: 400, fill: '#C9A96E' }),
      text(72, 330, 420, 300, 'The evening edit', { family: 'Playfair Display', size: 92, weight: 800, fill: '#F5EFE6', lh: 1.02 }),
      rect(72, 680, 80, 3, '#C9A96E'),
      text(72, 712, 400, 110, 'Limited pieces, cut in Jaipur. On sale Friday.', { family: 'Inter Tight', size: 28, weight: 400, fill: '#B9B0A3', lh: 1.4 }),
      text(72, 960, 420, 40, 'Autumn collection, No. 03', { family: 'Inter Tight', size: 22, weight: 500, fill: '#C9A96E' }),
    ],
  },
  {
    slug: 'instagram-post', title: 'Quiet light study', tags: 'editorial,art,minimal,photo', width: 1080, height: 1350, background: '#F4F0E8',
    thumbnailFile: 'premium-editorial.jpg',
    elements: [
      text(80, 90, 920, 50, 'Studio notes, No. 14', { family: 'Manrope', size: 28, weight: 600, fill: '#1B1B1B' }),
      image(120, 170, 840, 840, EDITORIAL_PHOTO, 1280, 849, { x: 215, y: 0, width: 849, height: 849 }),
      text(80, 1040, 920, 130, 'Quiet light', { family: 'Fraunces', size: 120, weight: 800, fill: '#1B1B1B', lh: 1.0 }),
      text(80, 1190, 760, 100, 'A study in shadow and proportion, shot in a single afternoon.', { family: 'Manrope', size: 30, weight: 400, fill: '#4A4A4A', lh: 1.4 }),
    ],
  },
  {
    slug: 'instagram-post', title: 'Colour is a verb', tags: 'bold,colour,campaign,photo', width: 1080, height: 1080, background: '#FFD400',
    thumbnailFile: 'premium-bold.jpg',
    elements: [
      image(0, 0, 1080, 720, BOLD_PHOTO, 1280, 853, { x: 0, y: 0, width: 1280, height: 853 }),
      text(60, 770, 960, 230, 'Colour is a verb.', { family: 'Archivo Black', size: 112, weight: 400, fill: '#111111', lh: 1.0 }),
      text(60, 1010, 960, 50, 'Five artists, one wall, no rules.', { family: 'Manrope', size: 38, weight: 800, fill: '#111111' }),
    ],
  },
]
