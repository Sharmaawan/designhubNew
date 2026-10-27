import type { ReactNode } from 'react'
import { useVideoEditorStore } from '@/stores/videoEditorStore'
import { TextField } from '@/components/ui/Fields'
import { NumField } from '@/components/editor/inspector/controls'
import { Icon } from '@/components/ui/Icon'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="video-props__section">
      <p className="video-props__section-title">{title}</p>
      {children}
    </div>
  )
}

export function VideoPropertiesPanel() {
  const selection = useVideoEditorStore((s) => s.selection)
  const tracks = useVideoEditorStore((s) => s.tracks)
  const updateClip = useVideoEditorStore((s) => s.updateClip)
  const clip = selection.length === 1 ? tracks.flatMap((t) => t.clips).find((c) => c.id === selection[0]) : undefined

  if (!clip) {
    return (
      <div className="video-panel video-props__empty">
        <Icon name="settings" size={28} />
        <p className="video-props__empty-title">No clip selected</p>
        <p className="field__hint">Select a clip on the timeline, or add media from the library, to edit its properties here.</p>
      </div>
    )
  }

  const maxDuration = clip.sourceDuration != null ? Math.max(0.2, clip.sourceDuration - clip.trimIn) : 100000
  const maxTrimIn = clip.sourceDuration != null ? Math.max(0, clip.sourceDuration - 0.2) : 100000
  const kindLabel = clip.kind === 'text' ? 'Text' : clip.kind === 'audio' ? 'Audio clip' : clip.kind === 'image' ? 'Image clip' : 'Video clip'

  return (
    <div className="video-panel video-props">
      <Section title="Clip">
        <h3 className="video-props__kind">{kindLabel}</h3>
        {clip.kind !== 'text' && clip.assetUrl && (
          <p className="field__hint" style={{ wordBreak: 'break-all' }}>{clip.assetUrl.split('/').pop()}</p>
        )}
        {clip.kind === 'text' && (
          <TextField label="Text" value={clip.text ?? ''} onChange={(e) => updateClip(clip.id, { text: e.target.value })} />
        )}
      </Section>

      <Section title="Timing">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <NumField label="Start" ariaLabel="Timeline start (seconds)" value={clip.start} min={0} onChange={(v) => updateClip(clip.id, { start: v })} />
          <NumField label="Duration" ariaLabel="Duration (seconds)" value={clip.duration} min={0.2} max={maxDuration} onChange={(v) => updateClip(clip.id, { duration: v })} />
        </div>
      </Section>

      {clip.kind !== 'text' && clip.kind !== 'image' && (
        <Section title="Trim">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NumField
              label="Trim in"
              ariaLabel="Source in-point (seconds)"
              value={clip.trimIn}
              min={0}
              max={maxTrimIn}
              onChange={(v) => updateClip(clip.id, { trimIn: v, duration: Math.min(clip.duration, clip.sourceDuration != null ? clip.sourceDuration - v : clip.duration) })}
            />
            {clip.sourceDuration != null && (
              <NumField label="Source length" ariaLabel="Full source media length (seconds)" value={clip.sourceDuration} min={0.2} onChange={() => undefined} />
            )}
          </div>
        </Section>
      )}

      {clip.kind !== 'text' && clip.kind !== 'image' && (
        <Section title="Volume">
          <div className="field video-props__volume">
            <input id="clip-volume" type="range" min={0} max={1} step={0.05} value={clip.volume} onChange={(e) => updateClip(clip.id, { volume: Number(e.target.value) })} aria-label="Volume" />
            <span className="video-props__volume-value">{Math.round(clip.volume * 100)}%</span>
          </div>
        </Section>
      )}
    </div>
  )
}
