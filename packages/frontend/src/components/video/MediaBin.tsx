import { useEffect, useRef, useState } from 'react'
import type { AssetFile } from '@/models/api'
import { contentApi } from '@/services/api/contentApi'
import { useVideoEditorStore } from '@/stores/videoEditorStore'
import { useVideoEditorUiStore } from '@/stores/videoEditorUiStore'
import { errorMessage, toast } from '@/stores/toastStore'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Skeleton } from '@/components/ui/Feedback'

/** Uploads panel for the video editor: upload/list video, image and audio assets, add them to the timeline. */
export function MediaBin() {
  const [assets, setAssets] = useState<AssetFile[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [query, setQuery] = useState('')
  const [filterKind, setFilterKind] = useState<'all' | 'video' | 'image' | 'audio'>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const tracks = useVideoEditorStore((s) => s.tracks)
  const addTrack = useVideoEditorStore((s) => s.addTrack)
  const addClip = useVideoEditorStore((s) => s.addClip)
  const select = useVideoEditorStore((s) => s.select)
  const setPlayhead = useVideoEditorStore((s) => s.setPlayhead)
  const playhead = useVideoEditorStore((s) => s.playhead)
  const activeTrackId = useVideoEditorUiStore((s) => s.activeTrackId)
  const setActiveTrack = useVideoEditorUiStore((s) => s.setActiveTrack)

  const refresh = () => {
    void Promise.all([contentApi.uploads('video'), contentApi.uploads('image'), contentApi.uploads('audio')])
      .then(([v, i, a]) => setAssets([...v, ...i, ...a].sort((x, y) => y.createdAt.localeCompare(x.createdAt))))
      .catch((e) => toast.error(errorMessage(e)))
  }
  useEffect(refresh, [])

  async function onFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (!/^(video|image|audio)\//.test(file.type)) {
          toast.error(`${file.name}: choose a video, image or audio file.`)
          continue
        }
        await contentApi.upload(file, file.name)
      }
      refresh()
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function probeDuration(asset: AssetFile): Promise<number> {
    if (asset.kind === 'image') return Promise.resolve(5)
    return new Promise((resolve) => {
      const el = document.createElement(asset.kind === 'audio' ? 'audio' : 'video')
      el.preload = 'metadata'
      el.src = asset.url
      el.onloadedmetadata = () => resolve(Number.isFinite(el.duration) ? el.duration : 5)
      el.onerror = () => resolve(5)
    })
  }

  async function addToTimeline(asset: AssetFile) {
    const kind = asset.kind === 'audio' ? 'audio' : asset.kind === 'video' ? 'video' : 'image'
    const targetKind = kind === 'image' ? 'video' : kind
    // Prefer the track the user explicitly selected (by clicking its label), if it's a compatible kind.
    const active = activeTrackId ? tracks.find((t) => t.id === activeTrackId && t.kind === targetKind) : undefined
    const track = active ?? tracks.find((t) => t.kind === targetKind)
    let trackId = track?.id
    if (!trackId) {
      trackId = addTrack(targetKind)
      setActiveTrack(trackId)
    }
    // Never silently stack a new clip exactly on top of the last one: start after it (or at the playhead, whichever is later).
    const trackEnd = track ? track.clips.reduce((max, c) => Math.max(max, c.start + c.duration), 0) : 0
    const duration = await probeDuration(asset)
    const start = Math.max(playhead, trackEnd)
    const id = addClip(trackId, {
      kind: kind === 'image' ? 'image' : kind === 'audio' ? 'audio' : 'video',
      start, duration, trimIn: 0,
      sourceDuration: kind === 'image' ? undefined : duration,
      assetUrl: asset.url, volume: 1,
    })
    select([id])
    setPlayhead(start)
  }

  const filtered = assets
    ?.filter((a) => filterKind === 'all' || a.kind === filterKind)
    .filter((a) => a.fileName.toLowerCase().includes(query.trim().toLowerCase())) ?? null

  return (
    <div className="video-panel">
      <input ref={inputRef} type="file" accept="video/*,image/*,audio/*" multiple className="sr-only" onChange={(e) => void onFiles(e.target.files)} />
      <Button variant="primary" icon="upload" loading={uploading} onClick={() => inputRef.current?.click()} style={{ width: '100%' }}>
        Upload media
      </Button>
      <p className="video-panel__heading">Media library</p>
      {assets && assets.length > 0 && (
        <>
          <input
            className="video-media-search"
            type="search"
            placeholder="Search media"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search media library"
          />
          <div className="video-media-filters" role="tablist" aria-label="Filter media by type">
            {(['all', 'video', 'image', 'audio'] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={filterKind === k}
                className={`video-media-filter ${filterKind === k ? 'is-active' : ''}`}
                onClick={() => setFilterKind(k)}
              >
                {k === 'all' ? 'All' : k === 'video' ? 'Video' : k === 'image' ? 'Images' : 'Audio'}
              </button>
            ))}
          </div>
        </>
      )}
      <p className="field__hint">Video, image and audio files. Click an item below to add it at the playhead.</p>
      {!filtered ? (
        <Skeleton height={200} />
      ) : filtered.length === 0 ? (
        <p className="field__hint">{assets?.length ? 'No media matches your search.' : 'Nothing uploaded yet.'}</p>
      ) : (
        <div className="video-media-grid">
          {filtered.map((a) => (
            <button key={a.id} className="video-media-item" onClick={() => void addToTimeline(a)} title={`Add ${a.fileName}`}>
              {a.kind === 'image' ? (
                <img src={a.url} alt="" />
              ) : a.kind === 'video' ? (
                <video src={a.url} muted preload="metadata" />
              ) : (
                <span className="video-media-item__audio">
                  <Icon name="audio" size={20} />
                </span>
              )}
              <span className="video-media-item__name">{a.fileName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
