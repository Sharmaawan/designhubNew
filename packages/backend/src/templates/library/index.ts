import type { LibraryTemplate } from './types.js'
import { thumbnailFor } from './thumbnail.js'
import { batch0Premium } from './batch0-premium.js'

// Templates seeded on startup. Each one is inserted only when its category and title are missing.
export const libraryTemplates: LibraryTemplate[] = [
  ...batch0Premium,
]
