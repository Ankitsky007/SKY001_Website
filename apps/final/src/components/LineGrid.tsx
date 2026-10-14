/**
 * A straight drafting grid behind a section (Ankit prefers it to the curved contour field):
 * fine lines with a heavier line every fourth cell, fading out by `mask`. Decorative only. Whole
 * pixel cell sizes and one shared origin keep the spacing even.
 */
export function LineGrid({ tone = 'light', cell = 32, mask = 'radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)', className = '' }: { tone?: 'light' | 'blue'; cell?: number; mask?: string; className?: string }) {
  const fine = tone === 'blue' ? 'rgba(255,255,255,0.12)' : 'rgba(62,87,218,0.06)'
  const bold = tone === 'blue' ? 'rgba(255,255,255,0.22)' : 'rgba(62,87,218,0.12)'
  const c = Math.round(cell)
  const big = c * 4
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(${bold} 1px, transparent 1px), linear-gradient(90deg, ${bold} 1px, transparent 1px), linear-gradient(${fine} 1px, transparent 1px), linear-gradient(90deg, ${fine} 1px, transparent 1px)`,
        backgroundSize: `${big}px ${big}px, ${big}px ${big}px, ${c}px ${c}px, ${c}px ${c}px`,
        // every layer starts at the same corner, so each heavy line lands exactly on a fine one
        backgroundPosition: '-1px -1px',
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  )
}
