import { useReducedMotion } from '@skyfall/core/motion'
import { useInView } from '@skyfall/core/webgl'
import { useEffect, useRef } from 'react'
import { LABEL } from '../lib/ui'

/** Dark-stage clip that loads and plays only while on screen. Reduced motion shows the poster. */
export function Clip({ src, poster, label, hud, className = '' }: { src: string; poster: string; label: string; hud?: string; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref)

  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    if (inView) v.play().catch(() => {})
    else if (!v.paused) v.pause()
  }, [inView, reduced])

  return (
    <figure className={`relative overflow-hidden rounded-2xl border border-stage-line bg-stage ${className}`}>
      <video ref={ref} src={inView && !reduced ? src : undefined} poster={poster} aria-label={label} muted loop playsInline preload="none" className="aspect-video size-full object-cover" />
      {hud && <figcaption className={`${LABEL} absolute top-3 left-3 rounded-md bg-black/50 px-2 py-1 text-white backdrop-blur`}>{hud}</figcaption>}
    </figure>
  )
}
