import { useEffect, useState } from 'react'
import type { SocialPost, User } from '@/models/api'
import { authApi } from '@/services/api/authApi'
import { contentApi } from '@/services/api/contentApi'
import { socialApi } from '@/services/api/socialApi'
import { useSocialStore } from '@/stores/socialStore'
import { errorMessage, toast } from '@/stores/toastStore'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TextAreaField, TextField, Avatar } from '@/components/ui/Fields'
import { Icon } from '@/components/ui/Icon'
import { PLATFORM_LABEL, CAPTION_LIMIT } from './platforms'

interface Props {
  projectId?: number
  /** Public URL of the design image; when absent the author uploads one. */
  mediaUrl?: string
  caption?: string
  onClose: () => void
  onCreated?: () => void
}

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function PostComposer({ projectId, mediaUrl: initialMedia, caption: initialCaption, onClose, onCreated }: Props) {
  const { platforms, accounts, load, loaded, replacePost } = useSocialStore()
  const [accountIds, setAccountIds] = useState<string[]>([])
  const [caption, setCaption] = useState(initialCaption ?? '')
  const [mediaUrl, setMediaUrl] = useState(initialMedia ?? '')
  const [when, setWhen] = useState('')
  const [reviewer, setReviewer] = useState<User | null>(null)
  const [reviewerQuery, setReviewerQuery] = useState('')
  const [matches, setMatches] = useState<User[]>([])
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded) void load()
  }, [loaded, load])
  useEffect(() => {
    if (!accountIds.length && accounts[0]) setAccountIds([String(accounts[0].id)])
  }, [accounts, accountIds])
  useEffect(() => {
    if (reviewerQuery.trim().length < 2) {
      setMatches([])
      return
    }
    const t = setTimeout(() => void authApi.searchUsers(reviewerQuery).then(setMatches).catch(() => setMatches([])), 250)
    return () => clearTimeout(t)
  }, [reviewerQuery])

  const selectedAccounts = accounts.filter((a) => accountIds.includes(String(a.id)))
  // The caption must fit every selected account, so the strictest limit applies.
  const limits = selectedAccounts.map((a) => CAPTION_LIMIT[a.platform]).filter((value): value is number => value !== undefined)
  const limit = limits.length ? Math.min(...limits) : undefined
  const overLimit = limit !== undefined && caption.length > limit

  function toggleAccount(id: string) {
    setAccountIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  async function upload(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      setMediaUrl((await contentApi.upload(file)).url)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setUploading(false)
    }
  }

  async function connect(platform: string) {
    setConnecting(platform)
    try {
      window.location.href = (await socialApi.connect(platform)).url
    } catch (e) {
      toast.error(errorMessage(e))
      setConnecting(null)
    }
  }

  // One post per selected account. A failure on one account does not stop the others.
  async function create(publishNow = false): Promise<void> {
    setBusy(true)
    const published: string[] = []
    const failed: string[] = []
    let created = 0
    const scheduledAt = !publishNow && when ? new Date(when).toISOString() : undefined
    for (const target of selectedAccounts) {
      const label = `${PLATFORM_LABEL[target.platform] ?? target.platform} · ${target.displayName}`
      let draft: SocialPost
      try {
        draft = await socialApi.createPost({
          accountId: target.id,
          projectId,
          caption,
          mediaUrl: mediaUrl || undefined,
          scheduledAt,
          reviewerId: reviewer?.id,
        })
      } catch (error) {
        failed.push(`${label}: ${errorMessage(error)}`)
        continue
      }
      created += 1
      replacePost(draft)
      if (!publishNow) continue
      try {
        const result = await socialApi.publish(draft.id)
        replacePost(result)
        if (result.status === 'PUBLISHED') published.push(label)
        else failed.push(`${label}: ${result.error || 'could not be published'}`)
      } catch (error) {
        failed.push(`${label}: ${errorMessage(error)}`)
      }
    }
    if (publishNow && published.length) toast.success(`Published to ${published.join(', ')}.`)
    if (failed.length) toast.error(`${failed.join(' ')} You can retry from Publishing.`)
    else if (!publishNow) toast.success(reviewer ? 'Post saved as a draft. Submit it for approval when you are ready.' : 'Post saved as a draft.')
    if (!created) {
      setBusy(false)
      return
    }
    onCreated?.()
    onClose()
  }

  if (loaded && accounts.length === 0) {
    return (
      <Modal
        title="New post"
        onClose={onClose}
        footer={<Button variant="ghost" onClick={onClose}>Close</Button>}
      >
        <p style={{ color: 'var(--ink-2)', marginTop: 0 }}>Connect a social account to continue. Choose a platform below:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {platforms.map((item) => (
            <section key={item.platform} style={{ display: 'grid', gap: 8, padding: 12, border: '1px solid var(--line)', borderRadius: 12 }}>
              <strong>{PLATFORM_LABEL[item.platform] ?? item.platform}</strong>
              <Button
                size="sm"
                variant={item.configured ? 'primary' : 'default'}
                disabled={!item.configured}
                loading={connecting === item.platform}
                onClick={() => void connect(item.platform)}
              >
                {item.configured ? 'Connect account' : 'Setup required'}
              </Button>
            </section>
          ))}
        </div>
        {platforms.some((item) => !item.configured) && (
          <p className="field__hint" style={{ marginBottom: 0 }}>Some connections need provider developer-app credentials configured by the server administrator.</p>
        )}
      </Modal>
    )
  }

  return (
    <Modal
      title="New post"
      onClose={onClose}
      locked={busy}
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button loading={busy} disabled={!selectedAccounts.length || uploading || overLimit} onClick={() => void create()}>
            Save draft
          </Button>
          <Button
            variant="primary"
            icon="send"
            loading={busy}
            disabled={!selectedAccounts.length || uploading || !!reviewer || overLimit}
            title={reviewer ? 'Posts requiring review cannot be published immediately.' : undefined}
            onClick={() => void create(true)}
          >
            Publish now
          </Button>
        </>
      }
    >
      <div className="field">
        <span className="field__label">Publish to</span>
        <div style={{ display: 'grid', gap: 8 }}>
          {accounts.map((a) => (
            <label
              key={a.id}
              style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 12, cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={accountIds.includes(String(a.id))}
                onChange={() => toggleAccount(String(a.id))}
                disabled={busy}
              />
              <span>{PLATFORM_LABEL[a.platform] ?? a.platform} · {a.displayName}</span>
              {a.loginName && <span className="field__hint">via {a.loginName}</span>}
            </label>
          ))}
        </div>
        {selectedAccounts.length > 1 && <span className="field__hint">Each selected account gets its own post.</span>}
      </div>
      <TextAreaField
        label="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={4}
        hint={limit ? `${caption.length} of ${limit} characters` : `${caption.length} characters`}
        error={limit !== undefined && caption.length > limit ? `This is ${caption.length - limit} characters over the limit` : undefined}
      />
      <p className="field__hint">Publish now sends this post directly to each selected social account. Save draft keeps it in Publishing without posting.</p>
      <div className="field">
        <span className="field__label">Image</span>
        {mediaUrl ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={mediaUrl} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
            {!initialMedia && (
              <Button size="sm" variant="ghost" onClick={() => setMediaUrl('')}>
                Remove image
              </Button>
            )}
          </div>
        ) : (
          <label className={`btn ${uploading ? 'is-disabled' : ''}`} style={{ justifySelf: 'start' }}>
            <Icon name="upload" size={16} />
            {uploading ? 'Uploading…' : 'Upload image'}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => void upload(e.target.files?.[0])} />
          </label>
        )}
      </div>
      <TextField
        label="Schedule"
        type="datetime-local"
        min={toLocalInput(new Date())}
        value={when}
        onChange={(e) => setWhen(e.target.value)}
        hint="Leave empty to publish manually after saving."
      />
      <div className="field">
        <span className="field__label">Reviewer (optional)</span>
        {reviewer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={reviewer.name} src={reviewer.avatarUrl} />
            <span>
              {reviewer.name} <span style={{ color: 'var(--ink-3)' }}>{reviewer.email}</span>
            </span>
            <Button size="sm" variant="ghost" onClick={() => setReviewer(null)}>
              Change
            </Button>
          </div>
        ) : (
          <>
            <input className="input" placeholder="Search by name or email" value={reviewerQuery} onChange={(e) => setReviewerQuery(e.target.value)} aria-label="Search for a reviewer" />
            {matches.map((u) => (
              <button
                key={u.id}
                className="menu-item"
                onClick={() => {
                  setReviewer(u)
                  setMatches([])
                }}
              >
                <Avatar name={u.name} src={u.avatarUrl} size={24} />
                {u.name}
                <span className="menu-item__hint">{u.email}</span>
              </button>
            ))}
            <span className="field__hint">A reviewer must approve the post before it can be published.</span>
          </>
        )}
      </div>
    </Modal>
  )
}
