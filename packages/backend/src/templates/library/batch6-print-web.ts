import { LibraryTemplate, rect, text } from './types.js'
import { photoImage } from './photos.js'

const SERIF = 'Playfair Display'
const SANS = 'Inter Tight'

export const batch6PrintWeb: LibraryTemplate[] = [
  {
    slug: 'a4-document', title: 'Letterhead, Northwind', tags: 'letter,stationery,corporate,minimal', width: 1240, height: 1754, background: '#FFFFFF',
    elements: [
      text(100, 90, 700, 70, 'Northwind', { family: SANS, size: 48, weight: 800, fill: '#0F172A' }),
      text(100, 150, 700, 40, 'Studio for brand systems', { family: SANS, size: 26, weight: 400, fill: '#64748B' }),
      text(740, 90, 400, 130, '12 Harbour Road\nBengaluru 560001\nhello@northwind.example', { family: SANS, size: 24, weight: 400, fill: '#64748B', align: 'right', lh: 1.45 }),
      rect(100, 270, 1040, 2, '#0F172A'),
      text(100, 360, 1040, 40, '14 October 2026', { family: SANS, size: 28, weight: 500, fill: '#334155' }),
      text(100, 460, 1040, 60, 'Dear Ms. Rao,', { family: SANS, size: 32, weight: 400, fill: '#0F172A' }),
      text(100, 540, 1040, 900, 'Thank you for meeting us last week. As discussed, we have attached the revised brand proposal, with three identity directions and a rollout plan for the next quarter.\n\nWe would be glad to walk you through the options in person, at a time that suits your team.\n\nWith warm regards,\n\nArjun Mehta\nPrincipal, Northwind', { family: SANS, size: 32, weight: 400, fill: '#1E293B', lh: 1.55 }),
      rect(100, 1640, 1040, 1, '#CBD5E1'),
      text(100, 1660, 1040, 40, 'Northwind Studio Pvt. Ltd.  |  northwind.example', { family: SANS, size: 22, weight: 400, fill: '#94A3B8' }),
    ],
  },
  {
    slug: 'a4-document', title: 'Coffee menu', tags: 'menu,cafe,food,warm', width: 1240, height: 1754, background: '#F8F1E7',
    elements: [
      photoImage('coffee', 0, 0, 1240, 620, { focus: { x: 0.5, y: 0.5 } }),
      text(100, 690, 1040, 150, 'Coffee menu', { family: SERIF, size: 120, weight: 800, fill: '#2B1D14' }),
      text(100, 850, 1040, 50, 'Single origin, roasted every Tuesday', { family: SANS, size: 32, weight: 400, fill: '#7A5C44' }),
      rect(100, 920, 1040, 2, '#2B1D14'),
      text(100, 970, 760, 50, 'Espresso', { family: SERIF, size: 40, weight: 600, fill: '#2B1D14' }),
      text(900, 970, 240, 50, '120', { family: SANS, size: 36, weight: 600, fill: '#2B1D14', align: 'right' }),
      text(100, 1040, 760, 50, 'Flat white', { family: SERIF, size: 40, weight: 600, fill: '#2B1D14' }),
      text(900, 1040, 240, 50, '180', { family: SANS, size: 36, weight: 600, fill: '#2B1D14', align: 'right' }),
      text(100, 1110, 760, 50, 'Cold brew, 12 hours', { family: SERIF, size: 40, weight: 600, fill: '#2B1D14' }),
      text(900, 1110, 240, 50, '210', { family: SANS, size: 36, weight: 600, fill: '#2B1D14', align: 'right' }),
      text(100, 1180, 760, 50, 'Pour over, seasonal', { family: SERIF, size: 40, weight: 600, fill: '#2B1D14' }),
      text(900, 1180, 240, 50, '240', { family: SANS, size: 36, weight: 600, fill: '#2B1D14', align: 'right' }),
      rect(100, 1300, 1040, 2, '#D9C7AE'),
      text(100, 1340, 1040, 60, 'Oat, almond or whole milk at no extra cost.', { family: SANS, size: 30, weight: 400, fill: '#7A5C44' }),
      text(100, 1640, 1040, 50, 'Open daily, 7am to 9pm  |  Corner of Park and Fifth', { family: SANS, size: 26, weight: 500, fill: '#7A5C44' }),
    ],
  },
  {
    slug: 'a4-document', title: 'Project brief', tags: 'brief,proposal,editorial,marble', width: 1240, height: 1754, background: '#F6F3EE',
    elements: [
      photoImage('marble', 0, 0, 1240, 560, { focus: { x: 0.5, y: 0.5 } }),
      text(100, 650, 1040, 80, 'PROJECT BRIEF', { family: SANS, size: 28, weight: 700, fill: '#8A7B6A' }),
      text(100, 730, 1040, 300, 'Hearth and Co. rebrand', { family: SERIF, size: 112, weight: 800, fill: '#1F1B16', lh: 1.02 }),
      text(100, 1040, 1040, 90, 'Scope, timeline and budget for a 12-week identity programme.', { family: SANS, size: 36, weight: 400, fill: '#4B4337', lh: 1.4 }),
      rect(100, 1180, 1040, 2, '#1F1B16'),
      text(100, 1210, 300, 40, 'Scope', { family: SANS, size: 26, weight: 700, fill: '#8A7B6A' }),
      text(480, 1210, 660, 40, 'Identity, packaging, web direction', { family: SANS, size: 30, weight: 400, fill: '#1F1B16' }),
      text(100, 1290, 300, 40, 'Timeline', { family: SANS, size: 26, weight: 700, fill: '#8A7B6A' }),
      text(480, 1290, 660, 40, 'Twelve weeks, from 1 November', { family: SANS, size: 30, weight: 400, fill: '#1F1B16' }),
      text(100, 1370, 300, 40, 'Budget', { family: SANS, size: 26, weight: 700, fill: '#8A7B6A' }),
      text(480, 1370, 660, 40, 'Fixed fee, three milestones', { family: SANS, size: 30, weight: 400, fill: '#1F1B16' }),
    ],
  },
  {
    slug: 'a4-document', title: 'Garden symposium programme', tags: 'event,programme,botanical,schedule', width: 1240, height: 1754, background: '#EEF2EA',
    elements: [
      rect(0, 0, 1240, 1754, '#EEF2EA'),
      photoImage('plant', 740, 60, 400, 480, { focus: { x: 0.5, y: 0.5 } }),
      text(100, 110, 480, 200, 'Garden symposium', { family: SERIF, size: 80, weight: 800, fill: '#1E2D22', lh: 1.02 }),
      text(100, 340, 480, 150, 'Two days of talks on urban planting, soil and seasonal food.', { family: SANS, size: 30, weight: 400, fill: '#3E5442', lh: 1.45 }),
      rect(100, 540, 1040, 2, '#1E2D22'),
      text(100, 580, 220, 50, '9:30', { family: SANS, size: 32, weight: 700, fill: '#2F6B3F' }),
      text(340, 580, 800, 50, 'Opening walk through the beds', { family: SANS, size: 32, weight: 500, fill: '#1E2D22' }),
      text(100, 690, 220, 50, '11:00', { family: SANS, size: 32, weight: 700, fill: '#2F6B3F' }),
      text(340, 690, 800, 50, 'Soil, compost and the first ten centimetres', { family: SANS, size: 32, weight: 500, fill: '#1E2D22' }),
      text(100, 800, 220, 50, '13:00', { family: SANS, size: 32, weight: 700, fill: '#2F6B3F' }),
      text(340, 800, 800, 50, 'Lunch from the market garden', { family: SANS, size: 32, weight: 500, fill: '#1E2D22' }),
      text(100, 910, 220, 50, '15:00', { family: SANS, size: 32, weight: 700, fill: '#2F6B3F' }),
      text(340, 910, 800, 50, 'Panel: food forests in cities', { family: SANS, size: 32, weight: 500, fill: '#1E2D22' }),
      text(100, 1020, 220, 50, '17:00', { family: SANS, size: 32, weight: 700, fill: '#2F6B3F' }),
      text(340, 1020, 800, 50, 'Seed swap and closing tea', { family: SANS, size: 32, weight: 500, fill: '#1E2D22' }),
      text(100, 1600, 1040, 50, 'Saturday 22 and Sunday 23 November  |  Riverside Hall', { family: SANS, size: 28, weight: 600, fill: '#2F6B3F' }),
    ],
  },
  {
    slug: 'a4-document', title: 'Product sprint notes', tags: 'notes,product,minimal,planning', width: 1240, height: 1754, background: '#FFFFFF',
    elements: [
      text(100, 110, 1040, 120, 'Sprint 14 notes', { family: 'Space Grotesk', size: 92, weight: 700, fill: '#111827' }),
      text(100, 240, 1040, 50, 'Wednesday 15 October  |  Product, design, engineering', { family: 'Space Grotesk', size: 28, weight: 400, fill: '#6B7280' }),
      rect(100, 320, 1040, 2, '#111827'),
      text(100, 370, 1040, 50, 'Decisions', { family: 'Space Grotesk', size: 36, weight: 700, fill: '#111827' }),
      text(100, 440, 1040, 220, '1. Ship templates behind a flag.\n2. Keep the old onboarding until week 16.\n3. Pricing page copy goes to legal on Friday.', { family: 'Space Grotesk', size: 32, weight: 400, fill: '#1F2937', lh: 1.6 }),
      text(100, 740, 1040, 50, 'Action items', { family: 'Space Grotesk', size: 36, weight: 700, fill: '#111827' }),
      text(100, 810, 1040, 260, 'Mira: review the template thumbnails\nTom: load-test the export queue\nAsha: draft the release note', { family: 'Space Grotesk', size: 32, weight: 400, fill: '#1F2937', lh: 1.6 }),
      rect(100, 1120, 1040, 1, '#E5E7EB'),
      text(100, 1150, 1040, 50, 'Next sprint starts 22 October.', { family: 'Space Grotesk', size: 28, weight: 500, fill: '#2563EB' }),
    ],
  },
  {
    slug: 'linkedin-banner', title: 'Join our Chennai team', tags: 'hiring,linkedin,culture,career', width: 1584, height: 396, background: '#0E3B43',
    elements: [
      photoImage('beach', 1040, 0, 544, 396, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 70, 900, 100, 'Join our Chennai team', { family: SANS, size: 72, weight: 800, fill: '#FFFFFF' }),
      text(80, 190, 900, 90, 'Product, design and operations roles. Hybrid, with a sea view.', { family: SANS, size: 36, weight: 400, fill: '#BEE3E3' }),
      rect(80, 290, 240, 56, '#F5B942', 28),
      text(80, 304, 240, 40, 'See open roles', { family: SANS, size: 28, weight: 700, fill: '#0E3B43', align: 'center' }),
    ],
  },
  {
    slug: 'linkedin-banner', title: 'New essay: slow design', tags: 'article,editorial,linkedin,thought leadership', width: 1584, height: 396, background: '#F5F1EA',
    elements: [
      photoImage('book', 0, 0, 420, 396, { focus: { x: 0.5, y: 0.5 } }),
      text(480, 70, 1000, 100, 'Slow design, fast decisions', { family: SERIF, size: 78, weight: 800, fill: '#1F1B16' }),
      text(480, 190, 1000, 90, 'Why the best teams spend less time on screens and more on paper.', { family: SANS, size: 36, weight: 400, fill: '#4B4337' }),
      rect(480, 290, 200, 4, '#B45309'),
      text(700, 270, 800, 50, 'Read the essay, five minutes', { family: SANS, size: 30, weight: 600, fill: '#B45309' }),
    ],
  },
  {
    slug: 'facebook-cover', title: 'Summer studio sale', tags: 'sale,summer,beach,facebook', width: 1640, height: 624, background: '#0EA5A4',
    elements: [
      photoImage('beach', 900, 0, 740, 624, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 90, 800, 200, 'Summer studio sale', { family: 'Archivo Black', size: 96, weight: 400, fill: '#FFFFFF', lh: 1.0 }),
      text(80, 300, 800, 90, 'Up to 40% off the spring collection, this weekend only.', { family: SANS, size: 36, weight: 500, fill: '#E0FFFE' }),
      rect(80, 430, 280, 84, '#FFFFFF', 42),
      text(80, 448, 280, 50, 'Shop the sale', { family: SANS, size: 32, weight: 700, fill: '#0EA5A4', align: 'center' }),
    ],
  },
  {
    slug: 'facebook-cover', title: 'Studio open day', tags: 'event,open day,community,facebook', width: 1640, height: 624, background: '#FAF3E6',
    elements: [
      text(80, 80, 900, 170, 'Open studio day', { family: SERIF, size: 116, weight: 800, fill: '#2B1D14', lh: 1.0 }),
      text(80, 270, 900, 90, 'Tours, tea and a chance to try the wheel. Saturday 10am to 4pm.', { family: SANS, size: 34, weight: 400, fill: '#5C4A3A' }),
      rect(80, 400, 260, 84, '#2B1D14', 42),
      text(80, 418, 260, 50, 'Free entry', { family: SANS, size: 32, weight: 700, fill: '#FAF3E6', align: 'center' }),
      photoImage('ceramic', 1180, 0, 460, 624, { focus: { x: 0.5, y: 0.5 } }),
    ],
  },
]
