import { showcase } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef, useState } from 'react'
import { media, type ModelId } from '../lib/media'
import { LABEL } from '../lib/ui'

// Each model appears this many times round the ring, so the row never runs out.
const SETS = 5
const MODELS = showcase.models
const N = MODELS.length * SETS
const STEP = 360 / N
const RATIO = 8 / 5 // the renders' own proportions

/**
 * A curved, endlessly turning row of the four models' finished renders: tiles sit on the inside
 * of a wide cylinder, so the row is flat in the middle, bends towards the viewer at the edges and
 * fades out there. It turns left to right and holds still while the pointer is over it. Hovering
 * a tile shows a play button; clicking it opens that model's film in a pop-up.
 * (An own build of the "tilted grid hero" idea Ankit pointed to, 2026-10-13.)
 */
export function TiltedModels({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [open, setOpen] = useState<ModelId | null>(null)
  const film = MODELS.find((m) => m.id === open)

  useEffect(() => {
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal?.()
    if (!open && d.open) d.close()
  }, [open])

  // Tile size from the space available; the ring's radius follows so tiles sit edge to edge.
  const th = Math.max(120, Math.min(size.h * 0.74, size.w * 0.2))
  const tw = th * RATIO
  const radius = (tw * 1.06) / (2 * Math.sin((STEP / 2) * (Math.PI / 180)))
  const ready = size.w > 0

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 transition-opacity duration-700 [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]"
        style={{ perspective: `${radius * 0.62}px`, perspectiveOrigin: '50% 50%', opacity: ready ? 1 : 0 }}
      >
        <ul
          className="group/ring absolute inset-0 [transform-style:preserve-3d] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
          style={
            {
              '--ring-r': `${radius}px`,
              // Negative turn: the row travels left to right.
              '--ring-turn': `${-STEP * MODELS.length}deg`,
              transform: `translateZ(${radius}px)`,
              // Longhands, not the shorthand: the shorthand would set play-state inline and stop hover from pausing it.
              animationName: reduced ? undefined : 'tilt-ring',
              animationDuration: '36s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationPlayState: open ? 'paused' : undefined,
            } as React.CSSProperties
          }
        >
          {Array.from({ length: N }, (_, i) => {
            const m = MODELS[i % MODELS.length]
            const copy = i >= MODELS.length
            return (
              <li
                key={i}
                className="absolute top-1/2 left-1/2 [backface-visibility:hidden]"
                style={{ width: tw, height: th, marginLeft: -tw / 2, marginTop: -th / 2, transform: `rotateY(${i * STEP}deg) translateZ(${-radius}px)` }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(m.id)}
                  aria-label={`Play the film: ${m.title}`}
                  aria-hidden={copy || undefined}
                  tabIndex={copy ? -1 : 0}
                  className="group relative block size-full cursor-pointer border border-line bg-studio text-left transition-colors duration-300 hover:border-ink focus-visible:border-brand"
                >
                  <img src={media.final(m.id)} alt="" loading="lazy" draggable={false} className="size-full object-contain" />
                  <span className={`${LABEL} absolute top-2 left-2.5 text-muted`}>
                    <span className="text-ink">{m.kind}</span> / {m.leaves} parts
                  </span>
                  <span className="absolute inset-0 grid place-items-center bg-studio/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className={`${LABEL} flex items-center gap-2.5 bg-ink px-4 py-3 text-white transition-colors group-hover:bg-brand`}>
                      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                        <path d="M2.5 1.2v9.6L10.5 6z" fill="currentColor" />
                      </svg>
                      Play
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <dialog ref={dialog} onClose={() => setOpen(null)} aria-label={film ? `${film.title} film` : 'Film'} data-lenis-prevent className="m-auto w-[min(1100px,calc(100vw-2rem))] max-w-none border border-ink bg-studio p-0 backdrop:bg-ink/70">
        {film && (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-ink bg-paper pl-4">
              <p className={`${LABEL} flex min-w-0 items-center gap-2.5 text-ink`}>
                <span aria-hidden="true" className="block size-2 shrink-0 bg-brand" />
                <span className="truncate">{film.title}</span> <span className="text-faint">/</span> <span className="shrink-0 text-muted">{film.leaves} parts</span>
              </p>
              <button type="button" onClick={() => setOpen(null)} className={`${LABEL} inline-flex h-12 shrink-0 cursor-pointer items-center bg-ink px-5 text-white hover:bg-brand`}>
                Close ×
              </button>
            </div>
            <video key={film.id} src={media.reel(film.id)} poster={media.poster(film.id)} aria-label={`${film.title}: from one image to ${film.leaves} parts`} autoPlay loop muted playsInline controls className="block aspect-[8/5] w-full bg-studio" />
          </div>
        )}
      </dialog>
    </div>
  )
}
