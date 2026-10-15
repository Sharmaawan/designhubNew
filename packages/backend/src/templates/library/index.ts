import type { LibraryTemplate } from './types.js'
import { thumbnailFor } from './thumbnail.js'
import { batch0Premium } from './batch0-premium.js'
import { batch4Social } from './batch4-social.js'
import { batch5PresentationPoster } from './batch5-presentation-poster.js'
import { batch6PrintWeb } from './batch6-print-web.js'
import { batch7Navratri } from './batch7-navratri.js'

// Templates seeded on startup. Each one is inserted only when its category and title are missing.
export const libraryTemplates: LibraryTemplate[] = [
  ...batch0Premium,
  ...batch4Social,
  ...batch5PresentationPoster,
  ...batch6PrintWeb,
  ...batch7Navratri,
]
