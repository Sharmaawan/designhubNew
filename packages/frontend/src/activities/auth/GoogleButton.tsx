import { useEffect, useRef, useState } from 'react'
import { authApi } from '@/services/api/authApi'
import { useAuthStore } from '@/stores/authStore'
import { errorMessage } from '@/stores/toastStore'

interface GoogleId {
  accounts: {
    oauth2: {
      initTokenClient: (o: {
        client_id: string
        scope: string
        prompt: string
        callback: (r: { access_token?: string; error?: string; error_description?: string }) => void
      }) => { requestAccessToken: () => void }
    }
  }
}

declare global {
  interface Window {
    google?: GoogleId
  }
}

let loader: Promise<void> | null = null

function loadGoogleScript(): Promise<void> {
  loader ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Google sign-in could not be loaded. Check your connection.'))
    document.head.appendChild(s)
  })
  return loader
}

/** Google's own button, rendered only when the server has a client id. Sign-in then goes through our API. */
export function GoogleButton({ onSignedIn, onError }: { onSignedIn: () => void; onError: (message: string) => void }) {
  const tokenClient = useRef<{ requestAccessToken: () => void } | null>(null)
  const [clientId, setClientId] = useState<string | null | undefined>(undefined)
  const [ready, setReady] = useState(false)
  const finish = useAuthStore((s) => s.finishGoogle)

  useEffect(() => {
    authApi
      .config()
      .then((c) => setClientId(c.googleClientId || null))
      .catch(() => setClientId(null))
  }, [])

  useEffect(() => {
    if (!clientId) return
    let live = true
    loadGoogleScript()
      .then(() => {
        if (!live || !window.google) return
        tokenClient.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          prompt: 'select_account',
          callback: (response) => {
            if (response.error || !response.access_token) {
              onError(response.error_description ?? 'Google sign-in was not completed. Please choose an account and try again.')
              return
            }
            authApi
              .google(response.access_token)
              .then((res) => {
                finish(res)
                onSignedIn()
              })
              .catch((e) => onError(errorMessage(e)))
          },
        })
        setReady(true)
      })
      .catch((e) => onError(errorMessage(e)))
    return () => {
      live = false
      tokenClient.current = null
    }
  }, [clientId, finish, onSignedIn, onError])

  if (clientId === undefined) return null
  if (clientId === null) {
    return (
      <button type="button" className="btn btn--block btn--lg" disabled title="An administrator needs to add a Google client id to the server.">
        Continue with Google (not set up yet)
      </button>
    )
  }
  return (
    <>
      <div className="auth__divider">or</div>
      <button
        type="button"
        className="btn btn--block btn--lg"
        disabled={!ready}
        onClick={() => tokenClient.current?.requestAccessToken()}
      >
        <span aria-hidden="true" style={{ color: '#4285f4', fontSize: 20, fontWeight: 700 }}>G</span>
        Continue with Google
      </button>
    </>
  )
}
