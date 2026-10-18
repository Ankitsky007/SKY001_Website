import { HalftoneField } from './HalftoneField'

/** v6's "Grid cells" look: blue squares drifting at the top of the hero and fading down. Both heroes use it (Ankit, 2026-10-18). */
export function HeroGrid({ className = 'h-[240px] md:h-[336px]', mask, opacity }: { className?: string; mask?: string; opacity?: number }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 ${className}`} style={{ maskImage: mask, WebkitMaskImage: mask, opacity }}>
      <HalftoneField tone="light" fade="down" mode={2} className="size-full" />
    </div>
  )
}
