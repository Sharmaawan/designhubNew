import { Button } from '@/components/ui/Button'
import { useApprovalStore } from '@/stores/approvalStore'
import { useCollabStore } from '@/stores/collabStore'
import { collabSession } from '@/services/realtime/collabSession'
import { errorMessage, toast } from '@/stores/toastStore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EditorDialog } from '../EditorToolbar'

/**
 * Team designs go through approval, so the usual Publish button turns into the step the person is actually on:
 * send for approval, wait, review, or publish. Personal designs keep a plain Publish button.
 */
export function ApprovalControls({ onDialog }: { onDialog: (d: EditorDialog) => void }) {
  const navigate = useNavigate()
  const a = useApprovalStore((s) => s.approval)
  const loading = useApprovalStore((s) => s.loading)
  const [savingDraft, setSavingDraft] = useState(false)

  async function saveDraft() {
    setSavingDraft(true)
    try {
      collabSession.flushNow()
      await new Promise((resolve) => setTimeout(resolve, 150))
      for (let attempt = 0; attempt < 50; attempt += 1) {
        const state = useCollabStore.getState().saveState
        if (state === 'saved') {
          toast.success('Draft saved')
          return
        }
        if (state === 'offline' || state === 'error') throw new Error('The draft could not be saved. Check your connection and try again.')
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      throw new Error('Saving is taking longer than expected. Check the save indicator before submitting.')
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSavingDraft(false)
    }
  }

  if (loading || !a) {
    return <Button disabled>{loading ? 'Checking approval…' : 'Approval status unavailable'}</Button>
  }
  if (a.status === 'NO_TEAM') {
    return (
      <>
        {a.canSetupTeam && (
          <Button icon="send" variant="primary" onClick={() => onDialog('approval')}>
            Send for Approval
          </Button>
        )}
        <Button icon="send" onClick={() => onDialog('publish')}>
          Publish
        </Button>
      </>
    )
  }
  if (a.status === 'NEEDS_TEAM') {
    return (
      <>
        <span className="badge badge--warn" title="Add this design to a team with an Editor before submitting it for approval">Add to a team for approval</span>
        {a.canSetupTeam && (
          <Button icon="send" variant="primary" onClick={() => onDialog('approval')}>
            Send for Approval
          </Button>
        )}
      </>
    )
  }
  if (a.canReview) {
    return (
      <Button variant="primary" icon="check" onClick={() => navigate('/social?tab=approvals')} title={`${a.requestedBy} is waiting for your decision`}>
        Review in Publishing
      </Button>
    )
  }
  if (a.canPublish) {
    return (
      <>
        <span className="badge badge--ok" title={`Approved by ${a.decidedBy}`}>
          Approved
        </span>
        <Button icon="send" variant="primary" onClick={() => onDialog('publish')}>
          Publish
        </Button>
      </>
    )
  }
  if (a.status === 'PENDING') {
    return (
      <>
        <span className="badge badge--warn" title={`Waiting for ${a.reviewers.join(', ')}`}>
          Waiting for Editor Approval
        </span>
        <Button size="sm" variant="ghost" onClick={() => onDialog('history')}>History</Button>
      </>
    )
  }
  return (
    <>
      {a.canSubmit && (
        <Button size="sm" variant="ghost" loading={savingDraft} onClick={() => void saveDraft()}>
          Save Draft
        </Button>
      )}
      {a.status === 'CHANGES_REQUESTED' && (
        <span className="badge badge--danger" title={a.feedback}>
          Changes requested
        </span>
      )}
      {a.status === 'EXPIRED' && (
        <span className="badge badge--warn" title="The design changed after it was approved">
          Edited after approval
        </span>
      )}
      {a.canSubmit ? (
        <>
          <Button icon="send" variant="primary" onClick={() => onDialog('approval')}>
            {a.status === 'CHANGES_REQUESTED' || a.status === 'EXPIRED' ? 'Send for Approval Again' : 'Send for Approval'}
          </Button>
          {a.history.length > 0 && <Button size="sm" variant="ghost" onClick={() => onDialog('history')}>History</Button>}
        </>
      ) : (
        <span className="badge" title="Only Makers and Editors can send designs for approval">
          View only
        </span>
      )}
    </>
  )
}
