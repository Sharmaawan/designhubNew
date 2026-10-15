import { icon, LibraryTemplate, rect, text, ellipse } from './types.js'
import { photoImage } from './photos.js'

const SERIF = 'Playfair Display'
const SANS = 'Inter Tight'
const LEAF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>'

export const batch4Social: LibraryTemplate[] = [
  {
    slug: 'instagram-post', title: 'Slow mornings', tags: 'minimal,lifestyle,coffee,calm', width: 1080, height: 1080, background: '#F3EEE6',
    elements: [
      photoImage('coffee', 540, 110, 440, 560, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 110, 400, 60, 'Slow mornings', { family: 'Manrope', size: 26, weight: 600, fill: '#6B5B4B' }),
      text(80, 200, 430, 300, 'Start the day without rushing.', { family: SERIF, size: 78, weight: 600, fill: '#2B211A', lh: 1.08 }),
      text(80, 560, 400, 120, 'Pour a cup, open the window, let the first hour be yours.', { family: SANS, size: 28, weight: 400, fill: '#5B4E43', lh: 1.45 }),
      rect(80, 960, 920, 1, '#CDBFAE'),
      text(80, 990, 600, 40, 'Morning ritual, No. 07', { family: SANS, size: 26, weight: 500, fill: '#2B211A' }),
      text(700, 990, 300, 40, 'Brewed slowly', { family: SERIF, size: 26, weight: 400, fill: '#8A6F55', align: 'right' }),
    ],
  },
  {
    slug: 'instagram-post', title: 'Mountain air', tags: 'futuristic,outdoor,travel,clean', width: 1080, height: 1080, background: '#0B1D2E',
    elements: [
      photoImage('mountain', 0, 0, 1080, 620, { focus: { x: 0.5, y: 0.4 } }),
      rect(0, 620, 1080, 3, '#38BDF8'),
      text(72, 690, 940, 140, 'Above the clouds', { family: 'Space Grotesk', size: 96, weight: 700, fill: '#F8FAFC', lh: 1.0 }),
      text(72, 850, 820, 90, 'Ten days of trails, cold lakes and early starts. The route, mapped.', { family: 'Space Grotesk', size: 30, weight: 400, fill: '#93C5FD', lh: 1.4 }),
      rect(72, 980, 300, 56, '#38BDF8', 28),
      text(72, 994, 300, 40, 'Read the route', { family: 'Space Grotesk', size: 28, weight: 700, fill: '#0B1D2E', align: 'center' }),
      text(620, 990, 388, 40, 'Trail notes, 2026', { family: 'Space Grotesk', size: 24, weight: 500, fill: '#64748B', align: 'right' }),
    ],
  },
  {
    slug: 'instagram-post', title: 'Studio hours', tags: 'corporate,office,business,clean', width: 1080, height: 1080, background: '#FFFFFF',
    elements: [
      rect(0, 0, 1080, 120, '#0F172A'),
      text(72, 42, 500, 40, 'Northwind Studio', { family: 'Manrope', size: 28, weight: 800, fill: '#FFFFFF' }),
      text(600, 42, 408, 40, 'Open 9 to 6', { family: 'Manrope', size: 28, weight: 600, fill: '#94A3B8', align: 'right' }),
      photoImage('office', 72, 170, 936, 470, { focus: { x: 0.5, y: 0.5 } }),
      text(72, 690, 936, 160, 'Book a desk, not a meeting room.', { family: 'Manrope', size: 72, weight: 800, fill: '#0F172A', lh: 1.05 }),
      text(72, 860, 720, 110, 'Flexible desks, quiet rooms and fast Wi-Fi in the heart of the city. Visit this week.', { family: 'Manrope', size: 30, weight: 400, fill: '#475569', lh: 1.4 }),
      rect(72, 980, 936, 1, '#E2E8F0'),
      text(72, 1000, 936, 40, 'northwind.example/desks', { family: 'Manrope', size: 26, weight: 600, fill: '#2563EB' }),
    ],
  },
  {
    slug: 'instagram-post', title: 'Concrete calm', tags: 'minimal,architecture,grey,quiet', width: 1080, height: 1080, background: '#8E8B86',
    elements: [
      photoImage('concrete', 0, 0, 1080, 1080, { focus: { x: 0.5, y: 0.5 } }),
      rect(72, 700, 936, 308, '#F4F2EE'),
      text(120, 760, 840, 130, 'Quiet by design.', { family: 'Manrope', size: 92, weight: 800, fill: '#1C1C1C', lh: 1.0 }),
      text(120, 900, 840, 60, 'Concrete, light and empty space.', { family: 'Manrope', size: 34, weight: 400, fill: '#4B4B4B' }),
    ],
  },
  {
    slug: 'instagram-post', title: 'Garden party', tags: 'playful,flowers,event,pastel', width: 1080, height: 1080, background: '#FCE4EC',
    elements: [
      ellipse(-140, 640, 480, 480, '#FFD6E0'),
      ellipse(760, -120, 420, 420, '#FFE8A3'),
      photoImage('flowers', 260, 160, 560, 560, { focus: { x: 0.5, y: 0.5 }, radius: 280 }),
      text(80, 770, 920, 130, 'Garden party!', { family: 'DM Sans', size: 110, weight: 700, fill: '#7A1F3D', align: 'center' }),
      text(80, 900, 920, 60, 'Saturday, 4pm, under the big tree', { family: 'DM Sans', size: 36, weight: 500, fill: '#7A1F3D', align: 'center' }),
      rect(390, 990, 300, 60, '#7A1F3D', 30),
      text(390, 1000, 300, 44, 'Reserve your spot', { family: 'DM Sans', size: 28, weight: 700, fill: '#FFFFFF', align: 'center' }),
    ],
  },
  {
    slug: 'instagram-story', title: 'Yoga at sunrise', tags: 'wellness,yoga,calm,story', width: 1080, height: 1920, background: '#E7EDE3',
    elements: [
      photoImage('yoga', 0, 0, 1080, 1180, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 1240, 920, 240, 'Breathe in. Stretch out.', { family: SERIF, size: 104, weight: 600, fill: '#26342A', lh: 1.05 }),
      text(80, 1500, 900, 120, 'Thirty-minute sessions for beginners, every weekday at 6am.', { family: SANS, size: 36, weight: 400, fill: '#4D5E52', lh: 1.4 }),
      rect(80, 1700, 420, 96, '#26342A', 48),
      text(80, 1724, 420, 50, 'Join the class', { family: SANS, size: 36, weight: 700, fill: '#FFFFFF', align: 'center' }),
    ],
  },
  {
    slug: 'instagram-story', title: 'City after dark', tags: 'night,city,bold,story', width: 1080, height: 1920, background: '#0A0A14',
    elements: [
      photoImage('citylights', 0, 0, 1080, 1920, { focus: { x: 0.5, y: 0.5 } }),
      rect(0, 1100, 1080, 820, '#0A0A14'),
      text(80, 1160, 920, 120, 'Late night,', { family: 'Archivo Black', size: 110, weight: 400, fill: '#FFFFFF', lh: 1.0 }),
      text(80, 1290, 920, 120, 'open till two.', { family: 'Archivo Black', size: 110, weight: 400, fill: '#FF4D8D', lh: 1.0 }),
      text(80, 1460, 900, 120, 'Rooftop bar, live sets, and the best view in the city.', { family: SANS, size: 36, weight: 400, fill: '#CBD5E1', lh: 1.4 }),
      rect(80, 1700, 380, 96, '#FF4D8D', 48),
      text(80, 1724, 380, 50, 'Get the guest list', { family: SANS, size: 34, weight: 700, fill: '#0A0A14', align: 'center' }),
    ],
  },
  {
    slug: 'instagram-story', title: 'New arrivals', tags: 'sale,fashion,sneakers,bold', width: 1080, height: 1920, background: '#FFE14D',
    elements: [
      text(80, 140, 920, 230, 'NEW', { family: 'Anton', size: 260, weight: 400, fill: '#111111', lh: 0.9 }),
      text(80, 360, 920, 150, 'Sneakers are in.', { family: 'Archivo Black', size: 92, weight: 400, fill: '#111111', lh: 1.0 }),
      photoImage('sneaker', 80, 620, 920, 860, { focus: { x: 0.5, y: 0.5 } }),
      rect(80, 1560, 920, 140, '#111111', 20),
      text(130, 1600, 820, 60, 'Up to 30% off, this week only', { family: SANS, size: 42, weight: 700, fill: '#FFE14D', align: 'center' }),
      text(80, 1740, 920, 60, 'Swipe up to shop the drop', { family: SANS, size: 34, weight: 600, fill: '#111111', align: 'center' }),
    ],
  },
  {
    slug: 'instagram-story', title: "Chef's special", tags: 'restaurant,food,warm,story', width: 1080, height: 1920, background: '#2A1A12',
    elements: [
      photoImage('chef', 0, 0, 1080, 1100, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 1160, 920, 80, "Tonight's", { family: SERIF, size: 70, weight: 400, fill: '#E9C98B' }),
      text(80, 1240, 920, 240, "Chef's special", { family: SERIF, size: 116, weight: 800, fill: '#FFF6E8', lh: 1.0 }),
      text(80, 1500, 900, 130, 'Slow-braised short rib, charred leeks and a red wine jus. Limited to 20 plates.', { family: SANS, size: 34, weight: 400, fill: '#D9C7AE', lh: 1.4 }),
      rect(80, 1720, 400, 96, '#E9C98B', 48),
      text(80, 1744, 400, 50, 'Reserve a table', { family: SANS, size: 34, weight: 700, fill: '#2A1A12', align: 'center' }),
    ],
  },
  {
    slug: 'pinterest-pin', title: 'Fresh salad week', tags: 'food,salad,healthy,recipe', width: 1000, height: 1500, background: '#EEF5E8',
    elements: [
      photoImage('salad', 0, 0, 1000, 880, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 940, 840, 240, '7 salads for a fresh week', { family: 'Fraunces', size: 96, weight: 800, fill: '#1F3B1F', lh: 1.0 }),
      text(80, 1200, 840, 120, 'Lunch that travels well. Every recipe under 15 minutes.', { family: SANS, size: 34, weight: 400, fill: '#3E5B3E', lh: 1.4 }),
      rect(80, 1360, 840, 1, '#B9CDB0'),
      text(80, 1390, 840, 50, 'Save this board', { family: SANS, size: 30, weight: 700, fill: '#3E7B3E' }),
    ],
  },
  {
    slug: 'pinterest-pin', title: 'Ceramic studio', tags: 'art,handmade,craft,artistic', width: 1000, height: 1500, background: '#EFE7DA',
    elements: [
      photoImage('ceramic', 150, 130, 700, 700, { focus: { x: 0.5, y: 0.5 }, radius: 350 }),
      icon(430, 870, 140, 'leaf', LEAF, '#7A5C3E'),
      text(80, 1040, 840, 140, 'Make it by hand.', { family: SERIF, size: 96, weight: 600, fill: '#3A2B1E', align: 'center', lh: 1.02 }),
      text(120, 1210, 760, 130, 'Weekend pottery workshops for beginners. Clay, wheels and a warm kiln.', { family: SANS, size: 32, weight: 400, fill: '#5C4A38', align: 'center', lh: 1.4 }),
      text(80, 1380, 840, 50, 'Book a wheel', { family: SANS, size: 30, weight: 700, fill: '#7A5C3E', align: 'center' }),
    ],
  },
]
