import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoProjectApi } from '@/services/api/videoProjectApi'
import { useVideoEditorStore } from '@/stores/videoEditorStore'
import { errorMessage, toast } from '@/stores/toastStore'
import { Button, IconButton } from '@/components/ui/Button'

export function VideoToolbar() {
  const navigate = useNavigate()
  const projectId = useVideoEditorStore((s) => s.projectId)
  const title = useVideoEditorStore((s) => s.title)
  const setTitle = useVideoEditorStore((s) => s.setTitle)
  const playing = useVideoEditorStore((s) => s.playing)
  const setPlaying = useVideoEditorStore((s) => s.setPlaying)
  const playhead = useVideoEditorStore((s) => s.playhead)
  const setPlayhead = useVideoEditorStore((s) => s.setPlayhead)
  const fps = useVideoEditorStore((s) => s.fps)
  const duration = useVideoEditorStore((s) => s.duration())
  const hasContent = duration > 0
  const saving = useVideoEditorStore((s) => s.saving)
  const dirty = useVideoEditorStore((s) => s.dirty)
  const save = useVideoEditorStore((s) => s.save)
  const undo = useVideoEditorStore((s) => s.undo)
  const redo = useVideoEditorStore((s) => s.redo)
  const canUndo = useVideoEditorStore((s) => s.undoStack.length > 0)
  const canRedo = useVideoEditorStore((s) => s.redoStack.length > 0)

  function stop() {
    setPlaying(false)
    setPlayhead(0)
  }
  function stepFrame(delta: number) {
    setPlaying(false)
    // Clips are active on [start, start+duration) — stay one frame short of the true end so the last frame stays visible.
    const maxPlayhead = Math.max(0, duration - 1 / fps)
    setPlayhead(Math.max(0, Math.min(maxPlayhead, playhead + delta / fps)))
  }
  function togglePlay() {
    if (!playing && duration > 0 && playhead >= duration - 1 / fps) setPlayhead(0)
    setPlaying(!playing)
  }
  function restart() {
    setPlayhead(0)
    setPlaying(true)
  }

  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (pollRef.current) clearTimeout(pollRef.current) }, [])

  async function startExport() {
    if (!projectId || exporting) return
    setExporting(true)
    setExportProgress(0)
    try {
      await save()
      const { jobId } = await videoProjectApi.startExport(projectId)
      const poll = async () => {
        const status = await videoProjectApi.exportStatus(projectId, jobId)
        setExportProgress(status.progress)
        if (status.status === 'error') {
          toast.error(status.error ?? 'Export failed.')
          setExporting(false)
          return
        }
        if (status.status === 'done') {
          const asset = await videoProjectApi.exportDownload(projectId, jobId)
          const link = document.createElement('a')
          link.href = asset.url
          link.download = asset.fileName
          link.click()
          toast.success('Video exported.')
          setExporting(false)
          return
        }
        pollRef.current = setTimeout(() => void poll(), 1200)
      }
      void poll()
    } catch (e) {
      toast.error(errorMessage(e))
      setExporting(false)
    }
  }

  return (
    <div className="video-toolbar">
      <div className="video-toolbar__group video-toolbar__group--left">
        <IconButton icon="chevronLeft" label="Back to dashboard" onClick={() => navigate('/')} />
        <input className="video-toolbar__title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Video title" />
        <span className="video-toolbar__status">{saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved'}</span>
      </div>
      <div className="video-toolbar__group video-toolbar__group--center">
        <IconButton icon="skipBack" label="Previous frame" onClick={() => stepFrame(-1)} disabled={!hasContent} />
        <IconButton icon={playing ? 'pause' : 'play'} label={playing ? 'Pause' : 'Play'} onClick={togglePlay} disabled={!hasContent} />
        <IconButton icon="stop" label="Stop" onClick={stop} disabled={!hasContent || (!playing && playhead === 0)} />
        <IconButton icon="skipForward" label="Next frame" onClick={() => stepFrame(1)} disabled={!hasContent} />
        <IconButton icon="restart" label="Restart from the beginning" onClick={restart} disabled={!hasContent} />
        <span className="video-toolbar__divider" />
        <IconButton icon="undo" label="Undo" onClick={undo} disabled={!canUndo} />
        <IconButton icon="redo" label="Redo" onClick={redo} disabled={!canRedo} />
      </div>
      <div className="video-toolbar__group video-toolbar__group--right">
        {exporting && <span className="video-toolbar__status">Exporting… {Math.round(exportProgress * 100)}%</span>}
        <Button variant="ghost" loading={saving} disabled={exporting} onClick={() => void save()}>
          Save
        </Button>
        <Button variant="primary" icon="download" loading={exporting} onClick={() => void startExport()}>
          Export
        </Button>
      </div>
    </div>
  )
}
