import { useEffect, useState, type ReactNode } from 'react'
import type { Category } from '@/models/api'
import { contentApi } from '@/services/api/contentApi'
import { Icon } from '@/components/ui/Icon'

interface CreateStripProps {
  onPick: (preset: { title: string; width: number; height: number }) => void
  onCustom: () => void
  trailing?: ReactNode
}

const artworkPalettes = [
  { background: '#ffe8dc', sun: '#ff9d75', distant: '#f8bb9f', foreground: '#e66f60', detail: '#fff4e9', ink: '#793e3e' },
  { background: '#d9eff2', sun: '#ffd28b', distant: '#9acbd0', foreground: '#438c91', detail: '#fff1d7', ink: '#245f68' },
  { background: '#f3e9d4', sun: '#f0a66c', distant: '#c6c5dc', foreground: '#8181ac', detail: '#fffaf0', ink: '#4b496f' },
  { background: '#242a49', sun: '#ffc66e', distant: '#59628c', foreground: '#343c68', detail: '#fff1d7', ink: '#ffffff' },
  { background: '#dff0df', sun: '#ffbd79', distant: '#a4d3b2', foreground: '#579b83', detail: '#fff8e9', ink: '#315f58' },
  { background: '#ede4fa', sun: '#f5a6a0', distant: '#c0b2e5', foreground: '#7666ae', detail: '#fff6ec', ink: '#51477d' },
] as const

function PresetArtwork({ variant }: { variant: number }) {
  const palette = artworkPalettes[variant % artworkPalettes.length]!
  return (
    <svg className={`preset__art preset__art--${variant % artworkPalettes.length}`} viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="160" height="100" fill={palette.background} />
      <circle cx="128" cy="27" r="17" fill={palette.sun} />
      <path d="M0 66 C24 45 43 52 65 68 S112 80 160 48 V100 H0Z" fill={palette.distant} />
      <path d="M0 82 C27 62 48 70 73 82 S124 88 160 68 V100 H0Z" fill={palette.foreground} />
      <rect x="12" y="12" width="54" height="5" rx="2.5" fill={palette.ink} opacity=".82" />
      <rect x="12" y="21" width="36" height="3" rx="1.5" fill={palette.ink} opacity=".4" />
      <rect x="12" y="76" width="48" height="14" rx="4" fill={palette.detail} opacity=".94" />
      <circle cx="138" cy="76" r="9" fill={palette.detail} opacity=".86" />
      <path d="M134 72 L143 76 L134 80Z" fill={palette.ink} opacity=".82" />
    </svg>
  )
}

/** Each size is drawn at its real aspect ratio so people choose by shape, not by reading numbers. */
export function CreateStrip({ onPick, onCustom, trailing }: CreateStripProps) {
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    void contentApi.categories().then(setCategories).catch(() => setCategories([]))
  }, [])

  return (
    <div className="strip" role="list" aria-label="Start a new design">
      {categories.map((c, index) => {
        const scale = 64 / Math.max(c.width, c.height)
        return (
          <button key={c.id} role="listitem" className="preset" onClick={() => onPick({ title: `Untitled ${c.name.toLowerCase()}`, width: c.width, height: c.height })}>
            <span className="preset__box">
              <span className="preset__shape" style={{ width: Math.max(24, c.width * scale), height: Math.max(24, c.height * scale) }}>
                <PresetArtwork variant={index} />
              </span>
            </span>
            <span className="preset__name">{c.name}</span>
            <span className="preset__size">
              {c.width} × {c.height}
            </span>
          </button>
        )
      })}
      <button role="listitem" className="preset" onClick={onCustom}>
        <span className="preset__box">
          <Icon name="plus" size={26} />
        </span>
        <span className="preset__name">Custom size</span>
      </button>
      {trailing}
    </div>
  )
}
