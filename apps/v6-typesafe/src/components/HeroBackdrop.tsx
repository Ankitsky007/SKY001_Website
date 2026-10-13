import { useFx } from '../lib/fx'
import { HalftoneField } from './HalftoneField'
import { GridPulse } from './ui/grid-pulse'
import { WarpBackground } from './ui/warp-background'

/**
 * Background of both heroes. The review picker (or `?fx=`) chooses between the WebGL field and
 * the hero-only experiments; everything sits under the hero content and ignores the pointer.
 */
export function HeroBackdrop() {
  const fx = useFx()
  if (fx.id === 'warp') {
    return <WarpBackground aria-hidden="true" perspective={120} beamsPerSide={4} beamSize={5} beamDuration={4} className="pointer-events-none absolute! inset-0 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]" />
  }
  if (fx.id === 'pulse') return <GridPulse />
  return <HalftoneField tone="light" fade="down" className="h-[300px] md:h-[400px]" />
}
