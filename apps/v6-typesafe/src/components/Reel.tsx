import { showcase } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { useInView } from '../lib/inView'
import { useEffect, useRef, useState } from 'react'
import { media, type ModelId } from '../lib/media'
import { LABEL, SquareLabel } from '../lib/ui'

/** One reel film (or the finished render under reduced motion). Plays only while on screen. */
export function ReelVideo({ model, className = '' }: { model: ModelId; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref)
  const info = showcase.models.find((m) => m.id === model)!
  const alt = `${info.title}: SKY-001 output, ${info.leaves} parts in a ${info.depth}-level tree`

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView) v.play().catch(() => {})
    else if (!v.paused) v.pause()
  }, [inView, model])

  if (reduced) return <img src={media.final(model)} alt={alt} className={`object-contain ${className}`} />
  return <video ref={ref} key={model} src={media.reel(model)} poster={media.poster(model)} aria-label={alt} muted loop playsInline autoPlay preload="auto" className={`edge-fade object-contain ${className}`} />
}

/**
 * Showcase reel: a looping film of one model going from image to parts, rendered on studio grey.
 * With more than one model it shows a switcher. Reduced motion gets the finished render instead.
 */
export function Reel({ models, className = '' }: { models: readonly ModelId[]; className?: string }) {
  const [current, setCurrent] = useState<ModelId>(models[0])
  const info = showcase.models.find((m) => m.id === current)!

  return (
    <div className={`relative flex min-h-0 flex-col ${className}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <ReelVideo model={current} className="absolute inset-0 size-full" />
      </div>
      <div className="flex items-center gap-3 border-t border-line pt-3 md:gap-4">
        <SquareLabel className="shrink-0 text-ink">{info.title}</SquareLabel>
        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-line" />
        <span className={`${LABEL} shrink-0 text-muted`}>
          {info.leaves} parts <span className="text-faint">/</span> depth {info.depth}
        </span>
        {models.length > 1 && (
          <div role="group" aria-label="Choose a model" className="-my-1 flex shrink-0">
            {models.map((id) => {
              const m = showcase.models.find((x) => x.id === id)!
              const on = id === current
              return (
                <button key={id} type="button" aria-pressed={on} aria-label={m.title} onClick={() => setCurrent(id)} className="group inline-flex size-11 cursor-pointer items-center justify-center">
                  <img src={media.input(id)} alt="" loading="lazy" className={`size-9 border object-cover transition-all ${on ? 'border-brand outline-2 outline-offset-1 outline-brand' : 'border-line opacity-60 group-hover:opacity-100'}`} />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
