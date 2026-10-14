import { showcase } from '@skyfall/core'
import { useLenis } from '@skyfall/core/motion'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { EXPLORER_EXTERNAL, media, type ModelId } from '../lib/media'
import { Corners, H3, LABEL } from '../lib/ui'

/** One model card: a button that opens the explorer in a dialog, or a plain link out where other sites cannot be embedded. */
function Card({ id, label, onOpen, children }: { id: ModelId; label: string; onOpen: (id: ModelId) => void; children: ReactNode }) {
  const cls = 'group relative block w-full cursor-pointer bg-studio text-left'
  if (EXPLORER_EXTERNAL) {
    return (
      <a href={media.explorer(id)} target="_blank" rel="noreferrer" aria-label={label} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={() => onOpen(id)} aria-label={label} className={cls}>
      {children}
    </button>
  )
}

/** A 44px square icon button for the pop-up's top bar. */
function BarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid size-11 shrink-0 cursor-pointer place-items-center text-ink transition-colors hover:text-brand">
      {children}
    </button>
  )
}

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-5 ${flip ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.75">
    <path d="M12.5 4.5L7 10l5.5 5.5" />
  </svg>
)

/**
 * Four model cards. Each opens the research team's interactive 3D explorer (orbit, pull apart,
 * part tree, sketch-to-part replay) in a pop-up: a centred box over the dimmed page on tablet and
 * desktop, a full-height sheet rising from the bottom on phones, where the explorer's own controls
 * need the whole screen. The model's still shows until the explorer has loaded; arrows step
 * through the models without closing; on phones the top bar can be swiped down to close (only the
 * bar, since dragging the model itself turns it). The explorer loads only on demand.
 */
export function ExplorerGrid() {
  const { models, explore } = showcase
  const [open, setOpen] = useState<ModelId | null>(null)
  const [loaded, setLoaded] = useState<ModelId | null>(null)
  const [drag, setDrag] = useState(0)
  const dragFrom = useRef<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  const index = models.findIndex((m) => m.id === open)
  const model = index >= 0 ? models[index] : undefined

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal?.()
    if (!open && d.open) d.close()
  }, [open])

  // the page behind stays put while the pop-up is open
  const isOpen = open !== null
  useEffect(() => {
    if (!isOpen) return
    lenis?.stop()
    const root = document.documentElement
    const before = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = before
      lenis?.start()
    }
  }, [isOpen, lenis])

  const step = (by: number) => setOpen(models[(index + by + models.length) % models.length].id)

  const onBarDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'touch' || (e.target as Element).closest('button')) return
    dragFrom.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onBarMove = (e: PointerEvent<HTMLElement>) => {
    if (dragFrom.current !== null) setDrag(Math.max(0, e.clientY - dragFrom.current))
  }
  const onBarUp = () => {
    if (dragFrom.current === null) return
    dragFrom.current = null
    if (drag > 90) setOpen(null)
    setDrag(0)
  }

  return (
    <>
      <ul className="grid border-t border-l border-line sm:grid-cols-2">
        {models.map((m, i) => (
          <li key={m.id} className="border-r border-b border-line">
            <Card id={m.id} label={`${explore.cta}: ${m.title}`} onOpen={setOpen}>
              <Corners />
              <span className={`${LABEL} absolute top-5 left-5 text-faint transition-colors group-hover:text-brand`}>// 00{i + 1}</span>
              <img src={media.final(m.id)} alt={`${m.title}, refined parts`} loading="lazy" className="aspect-[8/5] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="relative flex items-end justify-between gap-4 border-t border-line bg-paper p-5">
                <span>
                  <span className={`${H3} block transition-colors group-hover:text-brand`}>{m.title}</span>
                  <span className={`${LABEL} mt-1.5 block text-muted`}>
                    {m.kind} <span className="text-faint">/</span> {m.leaves} parts <span className="text-faint">/</span> depth {m.depth}
                  </span>
                </span>
                <span className={`${LABEL} inline-flex h-9 shrink-0 items-center gap-1.5 border border-ink px-3 text-ink transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white`}>
                  3D <span aria-hidden="true">↗</span>
                </span>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-1 w-0 bg-brand transition-[width] duration-300 group-hover:w-full" />
              </span>
            </Card>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        aria-label={model ? `${model.title} in 3D` : '3D explorer'}
        data-lenis-prevent
        style={drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
        className="explorer-pop m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-studio p-0 transition-transform duration-300 backdrop:bg-ink/50 backdrop:backdrop-blur-[3px] sm:m-auto sm:h-[min(88dvh,880px)] sm:w-[min(calc(100vw-3rem),1280px)] sm:border sm:border-ink"
      >
        {model && (
          <div className="flex h-full flex-col">
            <header onPointerDown={onBarDown} onPointerMove={onBarMove} onPointerUp={onBarUp} onPointerCancel={onBarUp} className="relative flex shrink-0 touch-none items-center gap-2 border-b border-line bg-paper pt-2 pr-1 pl-4 sm:touch-auto sm:pt-0 sm:pr-2 sm:pl-6">
              {/* the handle that says the sheet can be pulled down, phones only */}
              <span aria-hidden="true" className="absolute top-1.5 left-1/2 block h-1 w-10 -translate-x-1/2 bg-line sm:hidden" />
              <p className={`${LABEL} flex min-w-0 flex-1 items-center gap-2.5 text-ink`}>
                <span aria-hidden="true" className="block size-2 shrink-0 bg-brand" />
                <span className="truncate">{model.title}</span>
                <span className="hidden shrink-0 text-muted sm:inline">
                  <span className="text-faint">/</span> {model.leaves} parts
                </span>
              </p>
              <span className={`${LABEL} hidden text-faint sm:inline`}>
                0{index + 1} <span className="text-line">/</span> 0{models.length}
              </span>
              <BarButton label={explore.viewer.previous} onClick={() => step(-1)}>
                <Arrow />
              </BarButton>
              <BarButton label={explore.viewer.next} onClick={() => step(1)}>
                <Arrow flip />
              </BarButton>
              <span aria-hidden="true" className="mx-1 h-6 w-px bg-line" />
              <BarButton label={explore.viewer.close} onClick={() => setOpen(null)}>
                <span aria-hidden="true" className="relative block size-5">
                  <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current" />
                  <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current" />
                </span>
              </BarButton>
            </header>
            <div className="relative min-h-0 flex-1">
              {loaded !== model.id && (
                <div className="absolute inset-0 grid place-items-center p-8">
                  <img src={media.final(model.id)} alt="" className="max-h-[60%] w-full max-w-[640px] object-contain opacity-60" />
                  <p className={`${LABEL} absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2.5 text-muted`}>
                    <span aria-hidden="true" className="block size-2 animate-pulse bg-brand" />
                    {explore.viewer.loading}
                  </p>
                </div>
              )}
              <iframe
                key={model.id}
                src={media.explorer(model.id)}
                title={`${model.title} interactive 3D explorer`}
                allow="fullscreen"
                onLoad={() => setLoaded(model.id)}
                className={`absolute inset-0 size-full border-0 transition-opacity duration-500 ${loaded === model.id ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
