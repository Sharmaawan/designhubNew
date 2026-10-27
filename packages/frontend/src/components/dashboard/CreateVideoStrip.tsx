import { Icon } from '@/components/ui/Icon'
import { VIDEO_PRESETS, type VideoPreset } from '@/models/videoPresets'

interface CreateVideoStripProps {
  onPick: (preset: { title: string; width: number; height: number }) => void
  onCustom: () => void
  disabled?: boolean
}

function presetButton(p: VideoPreset, onPick: CreateVideoStripProps['onPick'], disabled?: boolean) {
  const scale = 64 / Math.max(p.width, p.height)
  return (
    <button
      key={p.id}
      role="listitem"
      className="preset"
      disabled={disabled}
      onClick={() => onPick({ title: `Untitled ${p.label.toLowerCase()}`, width: p.width, height: p.height })}
    >
      <span className="preset__box">
        <span className="preset__shape" style={{ width: Math.max(24, p.width * scale), height: Math.max(24, p.height * scale), display: 'grid', placeItems: 'center' }}>
          <Icon name="video" size={18} />
        </span>
      </span>
      <span className="preset__name">{p.label}</span>
      <span className="preset__size">
        {p.width} × {p.height}
      </span>
    </button>
  )
}

/** Platform-sized starting points for a new video project, mirroring CreateStrip's pattern for designs. */
export function CreateVideoStrip({ onPick, onCustom, disabled }: CreateVideoStripProps) {
  return (
    <div className="strip" role="list" aria-label="Start a new video">
      {VIDEO_PRESETS.map((p) => presetButton(p, onPick, disabled))}
      <button role="listitem" className="preset" disabled={disabled} onClick={onCustom}>
        <span className="preset__box">
          <Icon name="plus" size={26} />
        </span>
        <span className="preset__name">Custom video size</span>
      </button>
    </div>
  )
}
