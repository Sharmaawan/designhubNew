import { canEditAccess } from '@/models/access'
import type { Access } from '@/models/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { projectApi } from '@/services/api/projectApi'
import { approvalApi } from '@/services/api/approvalApi'
import { collabSession } from '@/services/realtime/collabSession'
import { collectPages } from '@/services/export/exportTypes'
import { renderThumbnail } from '@/services/render/pageRenderer'
import { stateToDoc } from '@/editor/model/wire'
import { onLocalChanges, useEditorStore } from '@/stores/editorStore'
import { useApprovalStore } from '@/stores/approvalStore'
import { useAuthStore } from '@/stores/authStore'
import { useCollabStore } from '@/stores/collabStore'
import { useEditorUiStore } from '@/stores/editorUiStore'
import { useBrandStore } from '@/stores/brandStore'
import { errorMessage } from '@/stores/toastStore'
import { useEditorShortcuts } from '@/hooks/useEditorShortcuts'
import { ErrorState, Spinner } from '@/components/ui/Feedback'
import { IconButton } from '@/components/ui/Button'
import { CanvasWorkspace } from '@/components/editor/canvas/CanvasWorkspace'
import { ContextBar } from '@/components/editor/ContextBar'
import { EditorToolbar, type EditorDialog } from '@/components/editor/EditorToolbar'
import { Inspector } from '@/components/editor/Inspector'
import { LeftPanelHost, LeftRail } from '@/components/editor/LeftRail'
import { PagesDock } from '@/components/editor/PagesDock'
import { PresentView } from '@/components/editor/PresentView'
import { ExportModal } from '@/components/editor/dialogs/ExportModal'
import { PublishModal, SaveTemplateModal, ShortcutsModal } from '@/components/editor/dialogs/MiscDialogs'
import { EraserModal } from '@/components/editor/dialogs/EraserModal'
import { ApprovalHistoryModal, ReviewModal, SendApprovalModal } from '@/components/editor/approval/ApprovalDialogs'
import { FindReplaceModal } from '@/components/editor/dialogs/FindReplaceModal'
import { ShareModal } from '@/components/editor/dialogs/ShareModal'
import './editor.css'
import './editorPanels.css'

const THUMB_IDLE_MS = 6000
const AUTO_VERSION_MS = 15 * 60 * 1000

export default function EditorActivity() {
  const { projectId } = useParams()
  const id = Number(projectId)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)!
  const loaded = useEditorStore((s) => s.loaded && s.projectId === id)
  const approvalCanEdit = useApprovalStore((s) => s.approval?.canEdit)
  const originalAccess = useRef<Access | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dialog, setDialog] = useState<EditorDialog>(null)
  const leftPanel = useEditorUiStore((s) => s.leftPanel)
  const rightOpen = useEditorUiStore((s) => s.rightOpen)
  const setRightOpen = useEditorUiStore((s) => s.setRightOpen)
  const presenting = useEditorUiStore((s) => s.presenting)
  const eraserId = useEditorUiStore((s) => s.eraserId)
  const setPresenting = useEditorUiStore((s) => s.setPresenting)

  const openHelp = useCallback(() => setDialog('shortcuts'), [])
  const openFind = useCallback(() => setDialog('find'), [])
  useEditorShortcuts(openHelp, openFind)

  useEffect(() => {
    if (!Number.isFinite(id)) {
      navigate('/', { replace: true })
      return
    }
    let cancelled = false
    const store = useEditorStore.getState()
    store.reset()
    originalAccess.current = null
    void useBrandStore.getState().load().catch(() => undefined)
    Promise.all([projectApi.get(id), projectApi.loadDesign(id), approvalApi.status(id)])
      .then(([meta, doc, approval]) => {
        if (cancelled) return
        originalAccess.current = meta.access
        useApprovalStore.getState().set(approval)
        useEditorStore.getState().load(doc, { title: meta.title, access: approval.canEdit ? meta.access : 'VIEWER' })
        useEditorUiStore.getState().setView({ autoFit: true })
        collabSession.start(id, user.id, canEditAccess(meta.access) && approval.canEdit)
      })
      .catch((e) => !cancelled && setError(errorMessage(e)))
    return () => {
      cancelled = true
      collabSession.stop()
      useCollabStore.getState().reset()
      useApprovalStore.getState().reset()
      useEditorStore.getState().reset()
    }
  }, [id, navigate, user.id])

  useEffect(() => {
    if (!loaded || approvalCanEdit === undefined || originalAccess.current === null) return
    const access = originalAccess.current
    useEditorStore.getState().setAccess(approvalCanEdit ? access : 'VIEWER')
    collabSession.setEditable(canEditAccess(access) && approvalCanEdit)
  }, [loaded, approvalCanEdit])

  // Warn before closing while changes are still on their way to the server.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (useCollabStore.getState().saveState !== 'saved') {
        collabSession.flushNow()
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [])

  // Dashboard thumbnail after the person pauses, and a safety-net version every 15 minutes of activity.
  useEffect(() => {
    if (!loaded) return
    let thumbTimer: ReturnType<typeof setTimeout> | undefined
    let dirtySinceVersion = false
    const editable = canEditAccess(useEditorStore.getState().access)
    if (!editable) return
    const off = onLocalChanges(() => {
      dirtySinceVersion = true
      clearTimeout(thumbTimer)
      thumbTimer = setTimeout(async () => {
        try {
          const { pages, width, height } = collectPages('current')
          const first = useEditorStore.getState().pageIds[0]!
          const page = useEditorStore.getState().currentPageId === first ? pages[0]! : collectPages('all').pages[0]!
          await projectApi.update(id, { thumbnail: await renderThumbnail(page, width, height, 360) })
        } catch {
          /* thumbnails are best effort */
        }
      }, THUMB_IDLE_MS)
    })
    const versionTimer = setInterval(() => {
      if (!dirtySinceVersion) return
      dirtySinceVersion = false
      void projectApi.saveVersion(id, 'Autosave', true).catch(() => undefined)
    }, AUTO_VERSION_MS)
    return () => {
      off()
      clearTimeout(thumbTimer)
      clearInterval(versionTimer)
    }
  }, [loaded, id])

  if (error) {
    return (
      <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
        <ErrorState message={error} onRetry={() => location.reload()} />
      </div>
    )
  }
  if (!loaded) {
    return (
      <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>
        <Spinner size={28} />
      </div>
    )
  }

  return (
    <div className="editor">
      <EditorToolbar onDialog={setDialog} />
      <div className="editor__body">
        <LeftRail />
        {leftPanel ? <LeftPanelHost /> : <span />}
        <div className="editor__center">
          <ContextBar />
          <CanvasWorkspace />
          <PagesDock />
        </div>
        {rightOpen ? (
          <Inspector />
        ) : (
          <div style={{ padding: 6, borderLeft: '1px solid var(--line)', background: 'var(--paper)' }}>
            <IconButton icon="panelRight" label="Show inspector" onClick={() => setRightOpen(true)} />
          </div>
        )}
      </div>

      {dialog === 'export' && <ExportModal onClose={() => setDialog(null)} />}
      {dialog === 'share' && <ShareModal onClose={() => setDialog(null)} />}
      {dialog === 'publish' && <PublishModal onClose={() => setDialog(null)} />}
      {dialog === 'template' && <SaveTemplateModal onClose={() => setDialog(null)} />}
      {eraserId && <EraserModal elementId={eraserId} onClose={() => useEditorUiStore.getState().setEraser(null)} />}
      {dialog === 'approval' && <SendApprovalModal onClose={() => setDialog(null)} />}
      {dialog === 'review' && <ReviewModal onClose={() => setDialog(null)} />}
      {dialog === 'history' && <ApprovalHistoryModal onClose={() => setDialog(null)} />}
      {dialog === 'find' && <FindReplaceModal onClose={() => setDialog(null)} />}
      {dialog === 'shortcuts' && <ShortcutsModal onClose={() => setDialog(null)} />}
      {presenting && <PresentView doc={stateToDoc(id, useEditorStore.getState())} startIndex={Math.max(0, useEditorStore.getState().pageIds.indexOf(useEditorStore.getState().currentPageId))} onExit={() => setPresenting(false)} />}
    </div>
  )
}
