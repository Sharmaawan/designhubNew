import { useEffect, useState } from 'react'
import { dragProps } from '@/editor/actions/dropActions'
import { insertAsset } from '@/editor/actions/assetActions'
import { GRAPHIC_PROVIDERS, type StockItem } from '@/services/assets/providers'
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/Feedback'
import { errorMessage } from '@/stores/toastStore'

/** Shows library illustrations and vectors matching the Elements search. Click or drag to place. */
export function LibraryGraphics({ query }: { query: string }) {
  return (
    <section className="drawer__section">
      <h3>From the library</h3>
      {GRAPHIC_PROVIDERS.map((provider) => (
        <LibrarySection key={provider.id} label={provider.label} query={query} search={provider.search} />
      ))}
    </section>
  )
}

function LibrarySection({ label, query, search }: { label: string; query: string; search: (q: string, page: number, signal?: AbortSignal) => Promise<{ items: StockItem[] }> }) {
  const [items, setItems] = useState<StockItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      setItems(null)
      setError(null)
      search(query, 1, controller.signal)
        .then((page) => setItems(page.items))
        .catch((e) => {
          if (!controller.signal.aborted) setError(errorMessage(e))
        })
    }, 350)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, search])

  return (
    <div style={{ marginBottom: 12 }}>
      <p className="field__hint" style={{ margin: '4px 0 6px' }}>{label}</p>
      {error ? <ErrorState message={error} /> : items === null ? <Skeleton /> : items.length === 0 ? <EmptyState icon="search" title="No matches" message="Try a broader word." /> : (
        <div className="tile-grid tile-grid--2">
          {items.map((it) => (
            <button
              key={it.id}
              className="tile"
              aria-label={`Add ${it.title}`}
              title={it.title}
              onClick={() => void insertAsset({ kind: 'image', url: it.url, name: it.title })}
              {...dragProps({ kind: 'image', url: it.url, name: it.title })}
            >
              <img src={it.thumbnail} alt="" style={{ width: '100%', height: 96, objectFit: 'contain', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
