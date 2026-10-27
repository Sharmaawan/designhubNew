import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TextField } from '@/components/ui/Fields'

interface Props {
  busy: boolean
  onCreate: (data: { title: string; width: number; height: number }) => void
  onClose: () => void
}

const LIMIT_HINT = 'Between 64 and 4096 px'
const ORIENTATIONS = [
  { label: 'Portrait', width: 1080, height: 1920 },
  { label: 'Landscape', width: 1920, height: 1080 },
  { label: 'Square', width: 1080, height: 1080 },
] as const

export function NewVideoModal({ busy, onCreate, onClose }: Props) {
  const [title, setTitle] = useState('Untitled video')
  const [width, setWidth] = useState('1080')
  const [height, setHeight] = useState('1920')
  const w = Number(width)
  const h = Number(height)
  const valid = title.trim() && w >= 64 && w <= 4096 && h >= 64 && h <= 4096
  const previewScale = Math.min(120 / Math.max(w, 1), 90 / Math.max(h, 1)) || 0

  return (
    <Modal
      title="Custom video size"
      onClose={onClose}
      locked={busy}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" loading={busy} disabled={!valid} onClick={() => onCreate({ title: title.trim(), width: w, height: h })}>
            Create video
          </Button>
        </>
      }
    >
      <TextField label="Name" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
      <div className="size-row" style={{ display: 'flex', gap: 8 }}>
        {ORIENTATIONS.map((o) => (
          <Button key={o.label} size="sm" variant={w === o.width && h === o.height ? 'primary' : 'default'} onClick={() => { setWidth(String(o.width)); setHeight(String(o.height)) }}>
            {o.label}
          </Button>
        ))}
      </div>
      <div className="size-row">
        <TextField label="Width (px)" type="number" inputMode="numeric" value={width} onChange={(e) => setWidth(e.target.value)} hint={LIMIT_HINT} />
        <TextField label="Height (px)" type="number" inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value)} hint={LIMIT_HINT} />
      </div>
      {valid && (
        <div style={{ display: 'grid', placeItems: 'center', padding: '12px 0' }}>
          <div style={{ width: w * previewScale, height: h * previewScale, background: '#16161a', border: '1px solid var(--border)', borderRadius: 4 }} />
          <span className="field__hint" style={{ marginTop: 6 }}>
            {w} × {h} · {(w / h).toFixed(2)}:1
          </span>
        </div>
      )}
    </Modal>
  )
}
