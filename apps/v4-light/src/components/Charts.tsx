import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { LABEL } from '../lib/ui'

export type BarRow = { model: string; ours: boolean; value: number | null; display: string; sub?: string }

/**
 * Horizontal bars on a linear scale from zero. Our row is blue on a tint; the rest are grey.
 * Bars grow in once on scroll. Values are printed exactly as given by the caller.
 */
export function BarPanel({ title, hint, rows, max, ticks }: { title: string; hint: string; rows: readonly BarRow[]; max: number; ticks: readonly string[] }) {
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
    <div ref={ref} role="group" aria-label={`${title}, ${hint}`} className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-[15px] font-medium">{title}</h4>
        <span className={`${LABEL} text-faint`}>{hint}</span>
      </div>
      <div className="mt-3 ml-[40%] flex justify-between border-b border-line pb-1 font-mono text-[10px] text-faint sm:ml-[38%]" aria-hidden="true">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <ul className="mt-1">
        {rows.map((r) => (
          <li key={r.model} className={`-mx-2 grid grid-cols-[40%_1fr_auto] items-center gap-2 rounded-lg px-2 py-2 sm:grid-cols-[38%_1fr_auto] ${r.ours ? 'bg-tint' : ''}`}>
            <span className="min-w-0">
              <span className={`block text-[13px] leading-tight sm:text-sm ${r.ours ? 'font-medium text-brand' : ''}`}>{r.model}</span>
              {r.sub && <span className="block font-mono text-[10px] text-faint">{r.sub}</span>}
            </span>
            <span className="block h-3.5" aria-hidden="true">
              {r.value !== null && (
                <span
                  data-bar
                  className={`block h-full min-w-[3px] origin-left rounded-sm ${r.ours ? 'bg-brand' : 'bg-bar'}`}
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              )}
            </span>
            <span className={`w-[4.5em] text-right font-mono text-[12px] tabular-nums sm:text-[13px] ${r.ours ? 'font-medium text-brand' : 'text-ink'}`}>{r.display}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
