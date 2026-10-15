import { LibraryTemplate, rect, text, ellipse } from './types.js'
import { photoImage } from './photos.js'

// Navratri templates for colleges. Placeholder names and dates are meant to be edited by the college.
const SERIF = 'Playfair Display'
const SANS = 'Inter Tight'

export const batch7Navratri: LibraryTemplate[] = [
  {
    slug: 'instagram-post', title: 'Navratri nights, campus edition', tags: 'navratri,festival,college,garba,event', width: 1080, height: 1350, background: '#2A0D14',
    elements: [
      photoImage('garbaSkirts', 0, 0, 1080, 760, { focus: { x: 0.5, y: 0.45 } }),
      rect(0, 760, 1080, 4, '#E8B84A'),
      text(80, 820, 920, 60, 'Your college name', { family: SANS, size: 30, weight: 600, fill: '#E8B84A' }),
      text(80, 880, 920, 240, 'Navratri Garba Night', { family: SERIF, size: 104, weight: 800, fill: '#FFF4E0', lh: 1.02 }),
      text(80, 1110, 920, 100, '11 to 19 October, every evening from 7pm', { family: SANS, size: 36, weight: 500, fill: '#F6C86A' }),
      text(80, 1200, 920, 90, 'Traditional dress code, live dhol and prizes for the best dancers.', { family: SANS, size: 30, weight: 400, fill: '#E9D5C2', lh: 1.4 }),
      rect(80, 1290, 920, 1, '#5A2633'),
    ],
  },
  {
    slug: 'instagram-story', title: 'Nine nights, one campus', tags: 'navratri,story,countdown,college', width: 1080, height: 1920, background: '#1B0B12',
    elements: [
      photoImage('marigold', 0, 0, 1080, 900, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 980, 920, 110, 'Nine nights,', { family: SERIF, size: 112, weight: 800, fill: '#FFF4E0', lh: 1.0 }),
      text(80, 1100, 920, 110, 'one campus.', { family: SERIF, size: 112, weight: 800, fill: '#F6C86A', lh: 1.0 }),
      text(80, 1270, 920, 90, 'Navratri celebrations at Your college name', { family: SANS, size: 38, weight: 500, fill: '#E9D5C2', lh: 1.35 }),
      rect(80, 1420, 920, 2, '#5A2633'),
      text(80, 1450, 920, 60, 'Day 1: Ghatasthapana, 11 October', { family: SANS, size: 32, weight: 600, fill: '#FFF4E0' }),
      text(80, 1520, 920, 60, 'Day 5: Rangoli contest, 15 October', { family: SANS, size: 32, weight: 600, fill: '#FFF4E0' }),
      text(80, 1590, 920, 60, 'Day 9: Dandiya finale, 19 October', { family: SANS, size: 32, weight: 600, fill: '#FFF4E0' }),
      rect(80, 1720, 920, 110, '#E8B84A', 20),
      text(80, 1752, 920, 50, 'Register at the student desk', { family: SANS, size: 34, weight: 700, fill: '#2A0D14', align: 'center' }),
    ],
  },
  {
    slug: 'poster', title: 'Dandiya night poster', tags: 'navratri,dandiya,poster,college,event', width: 1587, height: 2245, background: '#2A0D14',
    elements: [
      photoImage('redDress', 0, 0, 1587, 1300, { focus: { x: 0.5, y: 0.5 } }),
      rect(0, 1240, 1587, 1005, '#2A0D14'),
      text(120, 1300, 1347, 80, 'Your college name presents', { family: SANS, size: 46, weight: 500, fill: '#E8B84A' }),
      text(120, 1380, 1347, 300, 'Dandiya Night', { family: SERIF, size: 180, weight: 800, fill: '#FFF4E0', lh: 1.0 }),
      text(120, 1660, 1347, 80, 'Live dhol, folk dance and a prize for every group', { family: SANS, size: 46, weight: 400, fill: '#E9D5C2' }),
      rect(120, 1800, 1347, 2, '#5A2633'),
      text(120, 1840, 1347, 60, 'Friday 16 October, 7pm to 10pm', { family: SANS, size: 44, weight: 700, fill: '#FFF4E0' }),
      text(120, 1920, 1347, 60, 'Main ground, Gate 2  |  Entry with student ID', { family: SANS, size: 40, weight: 400, fill: '#E9D5C2' }),
    ],
  },
  {
    slug: 'a4-document', title: 'Navratri utsav programme', tags: 'navratri,programme,schedule,college,print', width: 1240, height: 1754, background: '#FFF8EE',
    elements: [
      rect(0, 0, 1240, 380, '#2A0D14'),
      text(100, 90, 1040, 70, 'Your college name', { family: SANS, size: 32, weight: 600, fill: '#E8B84A' }),
      text(100, 160, 1040, 150, 'Navratri Utsav 2026', { family: SERIF, size: 96, weight: 800, fill: '#FFF4E0' }),
      text(100, 440, 1040, 60, 'Programme of events, 11 to 19 October', { family: SANS, size: 34, weight: 500, fill: '#7A2E3E' }),
      rect(100, 520, 1040, 2, '#2A0D14'),
      text(100, 560, 260, 50, '11 Oct', { family: SANS, size: 32, weight: 700, fill: '#7A2E3E' }),
      text(380, 560, 760, 50, 'Ghatasthapana and opening puja, 9am', { family: SANS, size: 32, weight: 400, fill: '#2A0D14' }),
      text(100, 660, 260, 50, '15 Oct', { family: SANS, size: 32, weight: 700, fill: '#7A2E3E' }),
      text(380, 660, 760, 50, 'Rangoli contest, open to all departments', { family: SANS, size: 32, weight: 400, fill: '#2A0D14' }),
      text(100, 760, 260, 50, '16 Oct', { family: SANS, size: 32, weight: 700, fill: '#7A2E3E' }),
      text(380, 760, 760, 50, 'Dandiya night on the main ground, 7pm', { family: SANS, size: 32, weight: 400, fill: '#2A0D14' }),
      text(100, 860, 260, 50, '18 Oct', { family: SANS, size: 32, weight: 700, fill: '#7A2E3E' }),
      text(380, 860, 760, 50, 'Garba workshop for beginners, 5pm', { family: SANS, size: 32, weight: 400, fill: '#2A0D14' }),
      text(100, 960, 260, 50, '19 Oct', { family: SANS, size: 32, weight: 700, fill: '#7A2E3E' }),
      text(380, 960, 760, 50, 'Closing ceremony and prize distribution', { family: SANS, size: 32, weight: 400, fill: '#2A0D14' }),
      photoImage('marigold', 100, 1120, 1040, 380, { focus: { x: 0.5, y: 0.5 } }),
      text(100, 1560, 1040, 60, 'Dress code: traditional. Students are requested to carry their ID cards.', { family: SANS, size: 28, weight: 400, fill: '#5A2633' }),
    ],
  },
  {
    slug: 'linkedin-banner', title: 'Navratri celebrations, campus banner', tags: 'navratri,banner,college,festival,web', width: 1584, height: 396, background: '#2A0D14',
    elements: [
      photoImage('diya', 1080, 0, 504, 396, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 70, 960, 90, 'Navratri at Your college name', { family: SANS, size: 60, weight: 700, fill: '#FFF4E0' }),
      text(80, 190, 960, 60, 'Garba, dandiya and rangoli, 11 to 19 October', { family: SANS, size: 34, weight: 400, fill: '#E9D5C2' }),
      rect(80, 290, 240, 56, '#E8B84A', 28),
      text(80, 304, 240, 40, 'Join us', { family: SANS, size: 28, weight: 700, fill: '#2A0D14', align: 'center' }),
    ],
  },
  {
    slug: 'facebook-cover', title: 'Garba on the lawn', tags: 'navratri,garba,event,facebook,cover', width: 1640, height: 624, background: '#2A0D14',
    elements: [
      photoImage('garbaSkirts', 900, 0, 740, 624, { focus: { x: 0.5, y: 0.5 } }),
      text(80, 70, 780, 200, 'Garba on the lawn', { family: SERIF, size: 96, weight: 800, fill: '#FFF4E0', lh: 1.02 }),
      text(80, 300, 780, 80, 'Every evening, 7pm to 10pm, 11 to 19 October', { family: SANS, size: 34, weight: 500, fill: '#F6C86A' }),
      rect(80, 420, 300, 84, '#E8B84A', 42),
      text(80, 440, 300, 50, 'Register now', { family: SANS, size: 32, weight: 700, fill: '#2A0D14', align: 'center' }),
    ],
  },
]
