import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoProjectApi } from '@/services/api/videoProjectApi'
import { errorMessage, toast } from '@/stores/toastStore'
import { CreateVideoStrip } from '@/components/dashboard/CreateVideoStrip'
import { NewVideoModal } from '@/components/dashboard/NewVideoModal'
import '@/activities/dashboard/dashboard.css'

export default function NewVideoActivity() {
  const navigate = useNavigate()
  const [creatingVideo, setCreatingVideo] = useState(false)
  const [customVideo, setCustomVideo] = useState(false)

  const createVideo = useCallback(
    async (data: { title: string; width: number; height: number }) => {
      setCreatingVideo(true)
      try {
        const p = await videoProjectApi.create(data)
        navigate(`/video/${p.id}`)
      } catch (e) {
        toast.error(errorMessage(e))
        setCreatingVideo(false)
      }
    },
    [navigate],
  )

  return (
    <div className="page__inner">
      <section className="stage">
        <div className="stage__copy">
          <span className="stage__eyebrow">Your creative studio</span>
          <h1>Start a video</h1>
          <p>Pick a format to start fresh, sized for the platform you're posting to.</p>
        </div>
        <CreateVideoStrip onPick={(p) => void createVideo(p)} onCustom={() => setCustomVideo(true)} disabled={creatingVideo} />
      </section>
      {customVideo && (
        <NewVideoModal
          busy={creatingVideo}
          onClose={() => setCustomVideo(false)}
          onCreate={(d) => {
            setCustomVideo(false)
            void createVideo(d)
          }}
        />
      )}
    </div>
  )
}
