import { HalftoneField } from './HalftoneField'

/** v6's "Grid cells" look: blue squares drifting at the top of the hero and fading down. Both heroes use it (Ankit, 2026-10-18). */
export function HeroGrid() {
  return <HalftoneField tone="light" fade="down" mode={2} className="h-[300px] md:h-[420px]" />
}
