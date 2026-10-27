import { useState } from 'react'
import { useVideoEditorStore } from '@/stores/videoEditorStore'
import { VIDEO_PRESETS, VIDEO_PRESET_GROUPS, canvasLabel, canvasRatio, findPreset } from '@/models/videoPresets'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TextField } from '@/components/ui/Fields'
import { Icon } from '@/components/ui/Icon'

/** Canvas info readout + "Canvas settings" control shown near the preview, per the video editor spec. */
export function CanvasSettings() {
  const width = useVideoEditorStore((s) => s.width)
  const height = useVideoEditorStore((s) => s.height)
  const hasClips = useVideoEditorStore((s) => s.tracks.some((t) => t.clips.length > 0))
  const setCanvasSize = useVideoEditorStore((s) => s.setCanvasSize)
  const [open, setOpen] = useState(false)

  function applySize(w: number, h: number) {
    if (w === width && h === height) return
    if (hasClips && !window.confirm(
      `Change the canvas to ${w} × ${h} px? Existing clips keep their timing, but the frame and exported video will use the new size.`,
    )) return
    setCanvasSize(w, h)
    setOpen(false)
  }

  return (
    <>
      <button className="video-canvas-info" onClick={() => setOpen(true)} title="Change canvas size">
        <Icon name="frame" size={14} />
        <span>{canvasLabel(width, height)}</span>
        <span className="video-canvas-info__dims">{width} × {height} px · {canvasRatio(width, height)}</span>
        <Icon name="settings" size={14} />
      </button>
      {open && <CanvasSettingsModal width={width} height={height} onApply={applySize} onClose={() => setOpen(false)} />}
    </>
  )
}

function CanvasSettingsModal({ width, height, onApply, onClose }: {
  width: number
  height: number
  onApply: (w: number, h: number) => void
  onClose: () => void
}) {
  const [w, setW] = useState(String(width))
  const [h, setH] = useState(String(height))
  const wNum = Number(w)
  const hNum = Number(h)
  const valid = wNum >= 64 && wNum <= 4096 && hNum >= 64 && hNum <= 4096
  const activePreset = findPreset(wNum, hNum)

  return (
    <Modal
      title="Canvas settings"
      onClose={onClose}
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!valid} onClick={() => onApply(wNum, hNum)}>Apply</Button>
        </>
      }
    >
      {VIDEO_PRESET_GROUPS.map((group) => (
        <div key={group} style={{ marginBottom: 12 }}>
          <p className="field__label">{group}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {VIDEO_PRESETS.filter((p) => p.group === group).map((p) => (
              <Button
                key={p.id}
                size="sm"
                variant={activePreset?.id === p.id ? 'primary' : 'default'}
                onClick={() => { setW(String(p.width)); setH(String(p.height)) }}
              >
                {p.label} ({p.width}×{p.height})
              </Button>
            ))}
          </div>
        </div>
      ))}
      <div className="size-row">
        <TextField label="Width (px)" type="number" inputMode="numeric" value={w} onChange={(e) => setW(e.target.value)} hint="Between 64 and 4096 px" />
        <TextField label="Height (px)" type="number" inputMode="numeric" value={h} onChange={(e) => setH(e.target.value)} hint="Between 64 and 4096 px" />
      </div>
    </Modal>
  )
}
