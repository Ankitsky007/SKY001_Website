import { showcase } from '@skyfall/core'
import { useEffect, useRef, useState } from 'react'
import { media, type ModelId } from '../lib/media'
import { H3, LABEL } from '../lib/ui'

/**
 * Four model cards. Each opens the research team's interactive 3D explorer (orbit, pull apart,
 * part tree, sketch-to-part replay) in a full-screen dialog. The explorer loads only on demand.
 */
export function ExplorerGrid() {
  const [open, setOpen] = useState<ModelId | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const model = showcase.models.find((m) => m.id === open)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) d.showModal?.()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:gap-5">
        {showcase.models.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setOpen(m.id)}
              aria-label={`${showcase.explore.cta}: ${m.title}`}
              className="group block w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-paper text-left transition-shadow duration-300 hover:shadow-[0_18px_50px_-24px_rgba(14,17,22,0.35)]"
            >
              <img src={media.final(m.id)} alt={`${m.title}, refined parts`} loading="lazy" className="aspect-[8/5] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="flex items-end justify-between gap-4 border-t border-line p-4 sm:p-5">
                <span>
                  <span className={`${H3} block`}>{m.title}</span>
                  <span className={`${LABEL} mt-1 block text-muted`}>
                    {m.kind} · {m.leaves} parts · depth {m.depth}
                  </span>
                </span>
                <span className="inline-flex min-h-9 shrink-0 items-center rounded-full bg-tint px-3 text-[13px] font-medium text-brand transition-colors group-hover:bg-brand group-hover:text-white">3D</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        aria-label={model ? `${model.title} in 3D` : '3D explorer'}
        data-lenis-prevent
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-studio p-0 backdrop:bg-ink/60"
      >
        {model && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-line bg-paper px-4 py-1.5 sm:px-6">
              <p className="text-[15px] font-medium">
                {model.title} <span className={`${LABEL} ml-2 text-muted`}>{model.leaves} parts</span>
              </p>
              <button type="button" onClick={() => setOpen(null)} className="inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-medium text-brand hover:bg-tint">
                Close
              </button>
            </div>
            <iframe src={media.explorer(model.id)} title={`${model.title} interactive 3D explorer`} allow="fullscreen" className="min-h-0 w-full flex-1 border-0" />
          </div>
        )}
      </dialog>
    </>
  )
}
