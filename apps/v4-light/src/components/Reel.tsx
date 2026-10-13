import { showcase } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { useInView } from '@skyfall/core/webgl'
import { useEffect, useRef, useState } from 'react'
import { media, type ModelId } from '../lib/media'
import { LABEL } from '../lib/ui'

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
      <div className="relative -mx-5 min-h-0 flex-1 overflow-hidden md:mx-0">
        {/* Phones crop the empty sides a little so the model reads larger. */}
        <ReelVideo model={current} className="absolute inset-0 size-full scale-[1.22] md:scale-100" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-3">
        <p className={`${LABEL} text-muted`}>
          <span className="text-ink">{info.title}</span> · {info.leaves} parts · depth {info.depth}
        </p>
        {models.length > 1 && (
          <div role="group" aria-label="Choose a model" className="-mx-1 flex">
            {models.map((id) => {
              const m = showcase.models.find((x) => x.id === id)!
              const on = id === current
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  aria-label={m.title}
                  onClick={() => setCurrent(id)}
                  className="group inline-flex size-11 cursor-pointer items-center justify-center"
                >
                  <img
                    src={media.input(id)}
                    alt=""
                    loading="lazy"
                    className={`size-9 rounded-lg border object-cover transition-all ${on ? 'border-brand ring-2 ring-brand/25' : 'border-line opacity-70 group-hover:opacity-100'}`}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
