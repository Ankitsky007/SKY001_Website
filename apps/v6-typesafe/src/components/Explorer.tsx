import { showcase } from '@skyfall/core'
import { useEffect, useRef, useState } from 'react'
import { media, type ModelId } from '../lib/media'
import { Corners, H3, LABEL } from '../lib/ui'

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
      <ul className="grid border-t border-l border-line sm:grid-cols-2">
        {showcase.models.map((m, i) => (
          <li key={m.id} className="border-r border-b border-line">
            <button type="button" onClick={() => setOpen(m.id)} aria-label={`${showcase.explore.cta}: ${m.title}`} className="group relative block w-full cursor-pointer bg-studio text-left">
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
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dialog} onClose={() => setOpen(null)} aria-label={model ? `${model.title} in 3D` : '3D explorer'} data-lenis-prevent className="m-0 h-dvh max-h-none w-screen max-w-none bg-studio p-0 backdrop:bg-ink/60">
        {model && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-line bg-paper pl-4 sm:pl-6">
              <p className={`${LABEL} flex items-center gap-2.5 text-ink`}>
                <span aria-hidden="true" className="block size-2 bg-brand" />
                {model.title} <span className="text-faint">/</span> <span className="text-muted">{model.leaves} parts</span>
              </p>
              <button type="button" onClick={() => setOpen(null)} className={`${LABEL} inline-flex h-12 cursor-pointer items-center bg-ink px-5 text-white hover:bg-brand`}>
                Close ×
              </button>
            </div>
            <iframe src={media.explorer(model.id)} title={`${model.title} interactive 3D explorer`} allow="fullscreen" className="min-h-0 w-full flex-1 border-0" />
          </div>
        )}
      </dialog>
    </>
  )
}
