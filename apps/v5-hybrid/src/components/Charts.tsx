import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { LABEL, SquareLabel } from '../lib/ui'

export type BarRow = { model: string; ours: boolean; value: number | null; display: string; sub?: string }

/**
 * Horizontal bars on a linear scale from zero, drawn on a dotted track. Our row is blue on a
 * tint; the rest are grey. Bars grow in once on scroll. Values are printed exactly as given.
 */
export function BarPanel({ title, hint, rows, max, ticks, className = '' }: { title: string; hint: string; rows: readonly BarRow[]; max: number; ticks: readonly string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      gsap.from(ref.current.querySelectorAll('[data-bar]'), {
        scaleX: 0,
        duration: 1.1,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} role="group" aria-label={`${title}, ${hint}`} className={`border-r border-b border-line bg-paper ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
        <h4>
          <SquareLabel className="text-ink">{title}</SquareLabel>
        </h4>
        <span className={`${LABEL} text-faint`}>{hint}</span>
      </div>
      <div className="px-4 pt-3 pb-4 md:px-5">
        <div className="ml-[40%] flex justify-between pb-1 font-mono text-[10px] text-faint" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.model} className={`-mx-2 grid grid-cols-[40%_1fr_auto] items-center gap-2 px-2 py-1.5 ${r.ours ? 'bg-tint' : ''}`}>
              <span className="min-w-0">
                <span className={`block text-[13px] leading-tight tracking-[-0.02em] md:text-sm ${r.ours ? 'font-medium text-brand' : ''}`}>{r.model}</span>
                {r.sub && <span className="block font-mono text-[10px] text-faint">{r.sub}</span>}
              </span>
              <span className={`block h-4 ${r.ours ? '' : 'dots'}`} aria-hidden="true">
                {r.value !== null && <span data-bar className={`block h-full min-w-[3px] origin-left ${r.ours ? 'bg-brand' : 'bg-bar'}`} style={{ width: `${(r.value / max) * 100}%` }} />}
              </span>
              <span className={`w-[4.5em] text-right font-mono text-[12px] tabular-nums md:text-[13px] ${r.ours ? 'font-semibold text-brand' : 'text-ink'}`}>{r.display}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
