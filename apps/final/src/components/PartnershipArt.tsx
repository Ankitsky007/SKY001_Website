// Header illustration for the partnership form: two dithered half-cubes on the brand blue slide
// together and lock into one, with a flash at the seam (chosen by Ankit, 2026-10-14). Decorative only.
import { useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef } from 'react'
import { startDither, type DitherScene } from '../scenes/dither'

/** The header illustration; `active` restarts its animation each time the form opens. The waitlist uses the queue scene. */
export function PartnershipArt({ active, scene = 'cubes' }: { active: boolean; scene?: DitherScene }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const cv = ref.current
    if (!cv || !active) return
    return startDither(cv, reduced, scene)
  }, [active, reduced, scene])
  return (
    <div aria-hidden="true" className="relative h-48 overflow-hidden bg-brand sm:h-56">
      <canvas ref={ref} className="absolute inset-0 size-full" />
    </div>
  )
}
