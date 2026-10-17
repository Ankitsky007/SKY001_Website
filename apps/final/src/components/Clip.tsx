import { useReducedMotion } from '@skyfall/core/motion'
import { useInView } from '../lib/inView'
import { useEffect, useRef } from 'react'
import { Corners, LABEL } from '../lib/ui'

/** SKY-001 clip that loads and plays only while on screen, on its native dark ground or flipped to light grey. Reduced motion shows the poster.
 * `native-light` is for clips already rendered on light grey with their own corner labels: no flip, no corner ticks. `chip` is a centred label at the top. */
export function Clip({ src, poster, label, hud, chip, tone = 'dark', className = '' }: { src: string; poster: string; label: string; hud?: string; chip?: string; tone?: 'dark' | 'light' | 'native-light'; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref)
  const light = tone === 'light'
  const native = tone === 'native-light'

  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    if (inView) v.play().catch(() => {})
    else if (!v.paused) v.pause()
  }, [inView, reduced])

  return (
    <figure className={`relative overflow-hidden border ${light || native ? 'border-ink bg-studio' : 'border-night-mid bg-black'} ${className}`}>
      {/* The clips are rendered on near-black. `light` flips them to light grey: invert, then turn the hue back so colours keep their family. */}
      <video ref={ref} src={inView && !reduced ? src : undefined} poster={poster} aria-label={label} muted loop playsInline preload="none" className={`aspect-video size-full object-cover ${light ? 'brightness-[0.97] hue-rotate-180 invert' : ''}`} />
      {!native && <Corners tone={light ? 'light' : 'dark'} />}
      {chip && <span className={`${LABEL} absolute top-3 left-1/2 -translate-x-1/2 border px-2 py-1 whitespace-nowrap max-sm:hidden ${light || native ? 'border-ink bg-paper text-ink' : 'border-white/70 bg-white text-ink'}`}>{chip}</span>}
      {hud && <figcaption className={`${LABEL} absolute top-4 left-4 px-2 py-1 ${light ? 'bg-ink text-white' : 'bg-white text-ink'}`}>{hud}</figcaption>}
    </figure>
  )
}
