import { LibraryTemplate, rect, text } from './types.js'
import { photoImage } from './photos.js'

const SANS = 'Inter Tight'

export const batch5PresentationPoster: LibraryTemplate[] = [
  {
    slug: 'presentation', title: 'Mobility, reimagined', tags: 'startup,pitch,cover,dark', width: 1920, height: 1080, background: '#0C1222',
    elements: [
      photoImage('car', 1000, 0, 920, 1080, { focus: { x: 0.5, y: 0.5 } }),
      rect(120, 150, 80, 6, '#38BDF8'),
      text(120, 230, 820, 320, 'Mobility, reimagined.', { family: 'Space Grotesk', size: 132, weight: 700, fill: '#F8FAFC', lh: 1.0 }),
      text(120, 600, 760, 120, 'Seed round deck. Ride-share for the last mile, built on quiet electric fleets.', { family: 'Space Grotesk', size: 32, weight: 400, fill: '#94A3B8', lh: 1.4 }),
      text(120, 900, 700, 50, 'Priya Nair, CEO', { family: 'Space Grotesk', size: 28, weight: 700, fill: '#F8FAFC' }),
    ],
  },
  {
    slug: 'presentation', title: 'Case study: 3 months in', tags: 'case study,metrics,corporate,light', width: 1920, height: 1080, background: '#FFFFFF',
    elements: [
      text(120, 110, 1000, 180, 'Case study: three months in', { family: SANS, size: 80, weight: 700, fill: '#0F172A', lh: 1.05 }),
      text(120, 330, 900, 80, 'How the new onboarding cut drop-off in half.', { family: SANS, size: 36, weight: 400, fill: '#475569' }),
      text(120, 470, 380, 160, '48%', { family: SANS, size: 128, weight: 700, fill: '#2563EB' }),
      text(120, 650, 380, 120, 'Fewer drop-offs after step two', { family: SANS, size: 28, weight: 500, fill: '#334155', lh: 1.35 }),
      text(540, 470, 380, 160, '3.2x', { family: SANS, size: 128, weight: 700, fill: '#0F172A' }),
      text(540, 650, 380, 120, 'Faster activation for new teams', { family: SANS, size: 28, weight: 500, fill: '#334155', lh: 1.35 }),
      photoImage('laptop', 1080, 430, 720, 480, { focus: { x: 0.5, y: 0.5 } }),
      rect(120, 900, 1680, 2, '#E2E8F0'),
      text(120, 930, 1680, 60, 'Source: onboarding funnel, June to August 2026', { family: SANS, size: 24, weight: 400, fill: '#64748B' }),
    ],
  },
  {
    slug: 'presentation', title: 'Forest report', tags: 'sustainability,report,green,nature', width: 1920, height: 1080, background: '#F4F7F1',
    elements: [
      photoImage('forest', 0, 0, 760, 1080, { focus: { x: 0.5, y: 0.5 } }),
      text(880, 150, 920, 200, 'Sustainability report', { family: 'Fraunces', size: 80, weight: 800, fill: '#17331F', lh: 1.0 }),
      text(880, 370, 900, 300, 'We planted 42,000 native trees, cut our office energy by a third, and moved every supplier to renewable power.', { family: SANS, size: 38, weight: 400, fill: '#2F4A36', lh: 1.45 }),
      rect(880, 680, 100, 4, '#3F8F5A'),
      text(880, 720, 880, 60, 'Impact at a glance', { family: SANS, size: 30, weight: 700, fill: '#17331F' }),
      text(880, 800, 420, 120, '42k', { family: 'Fraunces', size: 104, weight: 800, fill: '#3F8F5A' }),
      text(1340, 800, 420, 120, '33%', { family: 'Fraunces', size: 104, weight: 800, fill: '#3F8F5A' }),
      text(880, 930, 420, 60, 'Trees planted', { family: SANS, size: 26, weight: 500, fill: '#2F4A36' }),
      text(1340, 930, 420, 60, 'Energy cut', { family: SANS, size: 26, weight: 500, fill: '#2F4A36' }),
    ],
  },
  {
    slug: 'presentation', title: 'Agenda for today', tags: 'agenda,minimal,list,clean', width: 1920, height: 1080, background: '#FBF8F3',
    elements: [
      text(140, 120, 900, 120, 'Agenda', { family: 'Fraunces', size: 96, weight: 800, fill: '#1B1B1B' }),
      rect(140, 260, 1640, 2, '#1B1B1B'),
      text(140, 320, 160, 80, '01', { family: 'Fraunces', size: 56, weight: 600, fill: '#B45309' }),
      text(360, 320, 900, 80, 'Where we are this quarter', { family: SANS, size: 44, weight: 600, fill: '#1B1B1B' }),
      text(140, 470, 160, 80, '02', { family: 'Fraunces', size: 56, weight: 600, fill: '#B45309' }),
      text(360, 470, 900, 80, 'Product roadmap, next six months', { family: SANS, size: 44, weight: 600, fill: '#1B1B1B' }),
      text(140, 620, 160, 80, '03', { family: 'Fraunces', size: 56, weight: 600, fill: '#B45309' }),
      text(360, 620, 900, 80, 'Hiring plan and budget', { family: SANS, size: 44, weight: 600, fill: '#1B1B1B' }),
      text(140, 770, 160, 80, '04', { family: 'Fraunces', size: 56, weight: 600, fill: '#B45309' }),
      text(360, 770, 900, 80, 'Questions and next steps', { family: SANS, size: 44, weight: 600, fill: '#1B1B1B' }),
      photoImage('desert', 1280, 200, 500, 760, { focus: { x: 0.5, y: 0.5 } }),
    ],
  },
  {
    slug: 'presentation', title: 'Thank you, questions', tags: 'closing,dark,marble,elegant', width: 1920, height: 1080, background: '#16130F',
    elements: [
      photoImage('marble', 0, 0, 1920, 1080, { focus: { x: 0.5, y: 0.5 } }),
      rect(120, 230, 1680, 680, '#16130F'),
      text(160, 330, 1600, 260, 'Thank you.', { family: 'Playfair Display', size: 200, weight: 800, fill: '#F5EFE6', lh: 1.0 }),
      text(160, 620, 1000, 70, 'Questions, ideas and feedback are always welcome.', { family: SANS, size: 40, weight: 400, fill: '#CFC6B6' }),
      rect(160, 760, 120, 3, '#C9A96E'),
      text(160, 800, 1000, 50, 'hello@yourcompany.com', { family: SANS, size: 32, weight: 500, fill: '#C9A96E' }),
    ],
  },
  {
    slug: 'poster', title: 'Neon night market', tags: 'night,market,neon,event', width: 1587, height: 2245, background: '#0B0B12',
    elements: [
      photoImage('neon', 0, 0, 1587, 1400, { focus: { x: 0.5, y: 0.5 } }),
      rect(0, 1300, 1587, 945, '#0B0B12'),
      text(120, 1360, 1347, 220, 'Night Market', { family: 'Archivo Black', size: 180, weight: 400, fill: '#FFFFFF', lh: 0.95 }),
      text(120, 1620, 1347, 90, 'Street food, live DJs and 80 stalls.', { family: SANS, size: 56, weight: 400, fill: '#FF4D8D' }),
      rect(120, 1790, 1347, 2, '#2A2A3A'),
      text(120, 1830, 1347, 60, 'Fridays and Saturdays, 6pm to midnight', { family: SANS, size: 44, weight: 600, fill: '#FFFFFF' }),
      text(120, 1910, 1347, 60, 'Harbour Square, Gate 4', { family: SANS, size: 40, weight: 400, fill: '#94A3B8' }),
    ],
  },
  {
    slug: 'poster', title: 'Desert rally', tags: 'bold,sport,desert,poster', width: 1587, height: 2245, background: '#E7B265',
    elements: [
      photoImage('desert', 0, 1000, 1587, 1245, { focus: { x: 0.5, y: 0.5 } }),
      text(100, 110, 1387, 380, 'DESERT', { family: 'Bebas Neue', size: 380, weight: 400, fill: '#1B1410', lh: 0.95 }),
      text(100, 470, 1387, 380, 'RALLY', { family: 'Bebas Neue', size: 380, weight: 400, fill: '#1B1410', lh: 0.95 }),
      text(100, 860, 1387, 100, '12 stages. 900 kilometres. One finish line.', { family: 'Archivo Black', size: 58, weight: 400, fill: '#1B1410' }),
      rect(100, 2080, 1387, 2, '#1B1410'),
      text(100, 2110, 1387, 60, 'Sunday 22 November, 7am start', { family: SANS, size: 42, weight: 700, fill: '#1B1410' }),
    ],
  },
  {
    slug: 'poster', title: 'Weekend on two wheels', tags: 'retro,cycling,stripes,poster', width: 1587, height: 2245, background: '#F6EBD9',
    elements: [
      rect(0, 0, 1587, 300, '#C0392B'),
      rect(0, 300, 1587, 40, '#F6EBD9'),
      rect(0, 340, 1587, 40, '#E67E22'),
      text(100, 470, 1387, 260, 'Ride', { family: 'Righteous', size: 260, weight: 400, fill: '#2C1A12', lh: 1.0 }),
      text(100, 700, 1387, 260, 'together.', { family: 'Righteous', size: 210, weight: 400, fill: '#C0392B', lh: 1.0 }),
      photoImage('bike', 100, 1000, 1387, 900, { focus: { x: 0.5, y: 0.5 } }),
      text(100, 1980, 1387, 80, 'Saturday morning ride, 20 km, coffee at the end', { family: SANS, size: 46, weight: 600, fill: '#2C1A12' }),
      text(100, 2080, 1387, 60, 'Meet at the old bridge, 8am', { family: SANS, size: 40, weight: 400, fill: '#6B4B3A' }),
    ],
  },
  {
    slug: 'poster', title: 'Tools for slow makers', tags: 'workshop,craft,editorial,poster', width: 1587, height: 2245, background: '#EFEAE0',
    elements: [
      text(120, 130, 1347, 120, 'Workshop series', { family: 'Fraunces', size: 58, weight: 600, fill: '#3B3026' }),
      photoImage('tools', 120, 290, 1347, 1150, { focus: { x: 0.5, y: 0.5 } }),
      text(120, 1520, 1347, 340, 'Tools for slow makers.', { family: 'Fraunces', size: 150, weight: 800, fill: '#1F1A15', lh: 1.02 }),
      text(120, 1900, 1100, 120, 'Four Saturdays of hand tools, sharpening and finishing. Small groups only.', { family: SANS, size: 42, weight: 400, fill: '#4D4237', lh: 1.4 }),
      rect(120, 2080, 1347, 2, '#1F1A15'),
      text(120, 2110, 1347, 60, 'Maker space, Unit 12  |  Starts 14 March', { family: SANS, size: 38, weight: 600, fill: '#1F1A15' }),
    ],
  },
  {
    slug: 'youtube-thumbnail', title: 'Jewellery making, step one', tags: 'tutorial,craft,gold,video', width: 1280, height: 720, background: '#14110D',
    elements: [
      photoImage('jewelry', 620, 0, 660, 720, { focus: { x: 0.5, y: 0.5 } }),
      text(60, 90, 560, 220, 'Make your first ring', { family: 'Bebas Neue', size: 104, weight: 400, fill: '#E9C98B', lh: 0.95 }),
      text(60, 330, 540, 120, 'Simple tools, one afternoon, no soldering.', { family: SANS, size: 36, weight: 500, fill: '#F5EFE6', lh: 1.35 }),
      rect(60, 500, 330, 90, '#E9C98B', 16),
      text(60, 520, 330, 50, 'Watch now', { family: SANS, size: 36, weight: 700, fill: '#14110D', align: 'center' }),
    ],
  },
  {
    slug: 'youtube-thumbnail', title: 'Running 5K in 30 days', tags: 'fitness,running,challenge,video', width: 1280, height: 720, background: '#F97316',
    elements: [
      photoImage('running', 0, 0, 1280, 720, { focus: { x: 0.5, y: 0.5 } }),
      rect(0, 0, 1280, 720, '#F97316'),
      text(60, 60, 1160, 210, '30 days', { family: 'Anton', size: 200, weight: 400, fill: '#FFFFFF', lh: 1.0 }),
      text(60, 270, 1160, 120, 'to my first 5K', { family: 'Archivo Black', size: 84, weight: 400, fill: '#111111' }),
      rect(60, 580, 380, 90, '#111111', 16),
      text(60, 600, 380, 50, 'Day 1 to Day 30', { family: SANS, size: 36, weight: 700, fill: '#FFFFFF', align: 'center' }),
    ],
  },
  {
    slug: 'youtube-thumbnail', title: 'Best cafes in town', tags: 'food,travel,cafe,list', width: 1280, height: 720, background: '#2B1E16',
    elements: [
      photoImage('cafe', 0, 0, 780, 720, { focus: { x: 0.5, y: 0.5 } }),
      text(830, 110, 400, 300, 'Top 5 cafes', { family: 'Playfair Display', size: 96, weight: 800, fill: '#FFF6E8', lh: 1.0 }),
      text(830, 360, 400, 160, 'Ranked by coffee, not by Instagram.', { family: SANS, size: 34, weight: 400, fill: '#E7D7BF', lh: 1.35 }),
      rect(830, 560, 120, 4, '#E9C98B'),
      text(830, 590, 400, 50, 'Part 2 of the city guide', { family: SANS, size: 30, weight: 600, fill: '#E9C98B' }),
    ],
  },
]
