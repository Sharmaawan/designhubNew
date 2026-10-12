import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import type { TextData } from '@/models/design'
import { updateElements } from '@/editor/actions/elementActions'
import { useEditorStore } from '@/stores/editorStore'
import { useEditorUiStore } from '@/stores/editorUiStore'
import { Icon } from '@/components/ui/Icon'

/** A real textarea laid exactly over the canvas text, so typing, IME and spellcheck behave natively. */
export function TextEditOverlay() {
  const id = useEditorUiStore((s) => s.editingTextId)
  const zoom = useEditorUiStore((s) => s.zoom)
  const panX = useEditorUiStore((s) => s.panX)
  const panY = useEditorUiStore((s) => s.panY)
  const setEditingText = useEditorUiStore((s) => s.setEditingText)
  const el = useEditorStore((s) => (id ? s.elements[id] : undefined))
  const ref = useRef<HTMLTextAreaElement>(null)
  const dragRef = useRef<{ pointerId: number; clientX: number; clientY: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const ta = ref.current
    if (!ta) return
    ta.focus()
    ta.select()
  }, [id])

  useLayoutEffect(() => {
    const ta = ref.current
    if (!ta) return
    ta.style.height = '0px'
    ta.style.height = `${ta.scrollHeight}px`
  }, [el?.type === 'text' ? el.data.text : '', zoom, id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!id || !el || el.type !== 'text') return null
  const elementId = id
  const d = el.data as TextData
  const left = panX + (d.x + dragOffset.x) * zoom
  const top = panY + (d.y + dragOffset.y) * zoom
  const style: React.CSSProperties = {
    left,
    top,
    width: d.width * zoom,
    minHeight: d.fontSize * d.lineHeight * zoom,
    transform: `rotate(${d.rotation}deg)`,
    transformOrigin: `${(d.width * zoom) / 2}px ${(d.height * zoom) / 2}px`,
    fontFamily: `"${d.fontFamily}"`,
    fontSize: d.fontSize * zoom,
    fontWeight: d.fontWeight,
    fontStyle: d.italic ? 'italic' : 'normal',
    lineHeight: d.lineHeight,
    letterSpacing: d.letterSpacing * zoom,
    textAlign: d.align,
    color: d.fill,
    textTransform: d.uppercase ? 'uppercase' : 'none',
    textDecoration: [d.underline && 'underline', d.strike && 'line-through'].filter(Boolean).join(' ') || 'none',
  }

  function startMove(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    dragRef.current = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveText(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setDragOffset({ x: (event.clientX - drag.clientX) / zoom, y: (event.clientY - drag.clientY) / zoom })
  }

  function finishMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = (event.clientX - drag.clientX) / zoom
    const dy = (event.clientY - drag.clientY) / zoom
    dragRef.current = null
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      updateElements([elementId], { x: d.x + dx, y: d.y + dy })
    }
    setDragOffset({ x: 0, y: 0 })
    setEditingText(null)
  }

  function cancelMove(event: PointerEvent<HTMLButtonElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragOffset({ x: 0, y: 0 })
  }

  return (
    <>
      <button
        type="button"
        className="text-edit-move"
        style={{ left, top: top - 38 }}
        onPointerDown={startMove}
        onPointerMove={moveText}
        onPointerUp={finishMove}
        onPointerCancel={cancelMove}
        aria-label="Drag to move this text object"
        title="Drag to move"
      >
        <Icon name="drag" size={14} />
        Drag to move
      </button>
      <button
        type="button"
        className="text-edit-done"
        style={{ left: left + 112, top: top - 38 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setEditingText(null)}
        aria-label="Finish editing text so it can be moved"
      >
        Done · Esc
      </button>
      <textarea
        ref={ref}
        className="text-edit"
        style={style}
        value={d.text}
        spellCheck
        aria-label="Edit text"
        onChange={(e) => updateElements([id], { text: e.target.value }, { coalesceKey: `text-${id}` })}
        onBlur={() => setEditingText(null)}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === 'Escape') {
            e.preventDefault()
            setEditingText(null)
          }
        }}
      />
    </>
  )
}
