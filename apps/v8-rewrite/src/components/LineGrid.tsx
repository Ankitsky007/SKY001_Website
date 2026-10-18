/**
 * A straight drafting grid behind a section (Ankit prefers it to the curved contour field):
 * one colour and strength for every line (the site-wide grid tokens), fading out by `mask`.
 * Decorative only. Whole-pixel cells keep the spacing even.
 */
export function LineGrid({ tone = 'light', cell = 32, mask = 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)', className = '' }: { tone?: 'light' | 'blue'; cell?: number; mask?: string; className?: string }) {
  const line = tone === 'blue' ? 'var(--color-grid-on-dark)' : 'var(--color-grid)'
  const c = Math.round(cell)
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: `${c}px ${c}px`,
        backgroundPosition: '-1px -1px',
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  )
}
