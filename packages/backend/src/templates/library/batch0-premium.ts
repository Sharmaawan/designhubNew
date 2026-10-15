import { icon, image, LibraryTemplate, rect, text } from './types.js'

// Pilot designs built around licensed Pixabay photography (Pixabay License: free for commercial use,
// no attribution required). The API returns 1280 px renditions, so photos are shown at or near native size.
const LUXURY_PHOTO = 'https://pixabay.com/get/g9b08ddc5f2eddb9e28615d6a036afb7e60512e1704c99f0534188daa69d36dd6bb3ab737d8f9ea0f2f581e710549f9430bc941c2d761c2178cfd0f085c35cd53_1280.jpg'
const EDITORIAL_PHOTO = 'https://pixabay.com/get/gb13a58392dee862ec20ca57b87321276f6a6843abd2e6cd10e9d3ed16d473deda05fd68db88dafefb8ed44dc26a9a08331ac1b2a25a44f2af79f8074c8992968_1280.jpg'
const BOLD_PHOTO = 'https://pixabay.com/get/gfa6066c827272d8d7938c13c3fc6ab25d43aa649a1e8f612c117596b4bb16341d3324297cc518da08e94bf51369d41ed8135ff5a2c8d28108e3f1f158129373f_1280.jpg'

// Line icons in the same style as the editor's Lucide set (24 px grid, 2 px stroke).
const GEM = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>'
const ARROW = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>'

export const batch0Premium: LibraryTemplate[] = [
  {
    // Luxury: a full-width photograph, a serif headline, and a quiet footer rule.
    slug: 'instagram-post', title: 'Maison evening edit', tags: 'luxury,fashion,premium,photo', width: 1080, height: 1350, background: '#0E0D0B',
    thumbnailFile: 'premium-luxury.jpg',
    elements: [
      image(0, 0, 1080, 537, LUXURY_PHOTO, 1280, 637, { x: 0, y: 0, width: 1280, height: 637 }),
      icon(80, 600, 52, 'gem', GEM, '#C9A96E'),
      text(80, 690, 920, 40, 'Autumn collection, No. 03', { family: 'Manrope', size: 26, weight: 600, fill: '#C9A96E' }),
      text(80, 740, 920, 300, 'The evening edit', { family: 'Playfair Display', size: 120, weight: 800, fill: '#F5EFE6', lh: 1.0 }),
      text(80, 1010, 760, 110, 'Limited pieces, cut in Jaipur. Available from Friday, while the collection lasts.', { family: 'Manrope', size: 30, weight: 400, fill: '#B9B0A3', lh: 1.4 }),
      rect(80, 1200, 920, 1, '#2A2723'),
      text(80, 1226, 500, 40, 'Maison Aurelle', { family: 'Playfair Display', size: 28, weight: 400, fill: '#C9A96E' }),
      text(500, 1226, 500, 40, 'Shop the edit', { family: 'Manrope', size: 26, weight: 600, fill: '#F5EFE6', align: 'right' }),
    ],
  },
  {
    // Editorial: an oversized numeral behind a square photograph, with a serif title below.
    slug: 'instagram-post', title: 'Quiet light study', tags: 'editorial,art,minimal,photo', width: 1080, height: 1350, background: '#F4F0E8',
    thumbnailFile: 'premium-editorial.jpg',
    elements: [
      text(80, 60, 600, 50, 'Studio notes, No. 14', { family: 'Manrope', size: 26, weight: 600, fill: '#1B1B1B' }),
      text(560, 60, 440, 240, '14', { family: 'Fraunces', size: 220, weight: 800, fill: '#E2D9C6', align: 'right', lh: 1.0 }),
      image(200, 300, 800, 800, EDITORIAL_PHOTO, 1280, 849, { x: 215, y: 0, width: 849, height: 849 }),
      text(80, 1120, 920, 130, 'Quiet light', { family: 'Fraunces', size: 120, weight: 800, fill: '#1B1B1B', lh: 1.0 }),
      text(80, 1250, 700, 90, 'A study in shadow and proportion, shot in one afternoon.', { family: 'Manrope', size: 30, weight: 400, fill: '#4A4A4A', lh: 1.4 }),
    ],
  },
  {
    // Bold: a wide photograph over a saturated yellow field, with a black badge and a heavy headline.
    slug: 'instagram-post', title: 'Colour is a verb', tags: 'bold,colour,campaign,photo', width: 1080, height: 1080, background: '#FFD400',
    thumbnailFile: 'premium-bold.jpg',
    elements: [
      image(0, 0, 1080, 720, BOLD_PHOTO, 1280, 853, { x: 0, y: 0, width: 1280, height: 853 }),
      rect(880, 640, 140, 140, '#111111', 70),
      icon(916, 676, 68, 'arrow-up-right', ARROW, '#FFFFFF'),
      text(60, 770, 900, 230, 'Colour is a verb.', { family: 'Archivo Black', size: 112, weight: 400, fill: '#111111', lh: 1.0 }),
      text(60, 1010, 960, 50, 'Five artists, one wall, no rules.', { family: 'Manrope', size: 38, weight: 800, fill: '#111111' }),
    ],
  },
]
