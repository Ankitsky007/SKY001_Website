import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { Window } from '../lib/ui'

export type BarRow = { model: string; ours: boolean; value: number | null; display: string; sub?: string }

/**
 * TypeSafe-style bar chart in a terminal window: each row is a name tag (blue for ours, black for
 * the rest) over a full-width grey track with a solid fill, and the exact value on the right.
 * Linear scale from zero. Bars grow in once on scroll.
 */
export function BarWindow({ title, label, rows, max, ticks }: { title: string; label: string; rows: readonly BarRow[]; max: number; ticks: readonly string[] }) {
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
    <div ref={ref} role="group" aria-label={label}>
      <Window title={title}>
        <ul className="flex flex-col gap-2.5 px-2 pt-3 pb-1 font-mono">
          {rows.map((r) => (
            <li key={r.model}>
              <div className="flex items-center gap-2 text-xs md:text-[13px]">
                <span className={`px-1 py-px font-medium text-white ${r.ours ? 'bg-brand' : 'bg-ink'}`}>{r.model}</span>
                {r.sub && <span className="text-muted">{r.sub}</span>}
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="block h-3 flex-1 bg-line" aria-hidden="true">
                  {r.value !== null && <span data-bar className={`block h-full min-w-[2px] origin-left ${r.ours ? 'bg-brand' : 'bg-ink'}`} style={{ width: `${(r.value / max) * 100}%` }} />}
                </span>
                <span className={`w-[4.6em] text-right text-xs tabular-nums md:text-[13px] ${r.ours ? 'font-semibold text-brand' : ''}`}>{r.display}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between px-2 pt-1 pb-2 pr-[calc(4.6em+1rem)] font-mono text-[10px] text-muted" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </Window>
    </div>
  )
}

export type ScatterPoint = { model: string; ours: boolean; cost: number; iou: number }

const COST_TICKS = [0.001, 0.01, 0.1, 1]
const IOU_TICKS = [0, 25, 50, 75, 100]

/**
 * Accuracy against cost in a terminal window, cost on a log scale ($0.001 to $1). Every point is
 * placed from its exact source values; ours is the blue star. Up and to the left is better.
 */
export function ScatterWindow({ title, label, points }: { title: string; label: string; points: readonly ScatterPoint[] }) {
  const W = 520
  const H = 360
  const box = { l: 46, r: 16, t: 16, b: 40 }
  const x = (cost: number) => box.l + ((Math.log10(cost) + 3) / 3) * (W - box.l - box.r)
  const y = (iou: number) => H - box.b - (iou / 100) * (H - box.t - box.b)
  const ours = points.find((p) => p.ours)
  const star = (cx: number, cy: number, r: number) =>
    Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2
      const rr = i % 2 ? r * 0.45 : r
      return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`
    }).join(' ')
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 11 } as const

  return (
    <Window title={title}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block w-full">
        {IOU_TICKS.map((t) => (
          <g key={t}>
            <path d={`M${box.l} ${y(t)}H${W - box.r}`} stroke="#e0e0e0" />
            <text x={box.l - 8} y={y(t) + 4} textAnchor="end" fill="#474747" style={mono}>
              {t}%
            </text>
          </g>
        ))}
        {COST_TICKS.map((t) => (
          <g key={t}>
            <path d={`M${x(t)} ${box.t}V${H - box.b}`} stroke="#e0e0e0" />
            <text x={x(t)} y={H - box.b + 16} textAnchor="middle" fill="#474747" style={mono}>
              ${t < 0.01 ? t.toFixed(3) : t < 0.1 ? t.toFixed(2) : t.toFixed(t < 1 ? 1 : 0)}
            </text>
          </g>
        ))}
        <path d={`M${box.l} ${box.t}V${H - box.b}H${W - box.r}`} fill="none" stroke="#1a1a1a" />
        {ours && <path d={`M${x(ours.cost)} ${y(ours.iou)}H${W - box.r}`} stroke="#3e57da" strokeDasharray="3 4" className="flow" />}
        {points
          .filter((p) => !p.ours)
          .map((p) => (
            <g key={p.model}>
              <rect x={x(p.cost) - 4} y={y(p.iou) - 4} width="8" height="8" fill="#1a1a1a" transform={`rotate(45 ${x(p.cost)} ${y(p.iou)})`} />
              <text x={x(p.cost)} y={y(p.iou) + 18} textAnchor="middle" fill="#1a1a1a" style={mono}>
                {p.model}
              </text>
            </g>
          ))}
        {ours && (
          <g>
            <polygon points={star(x(ours.cost), y(ours.iou), 10)} fill="#3e57da" />
            <text x={x(ours.cost) + 14} y={y(ours.iou) - 10} fill="#3e57da" style={{ ...mono, fontWeight: 600 }}>
              {ours.model}
            </text>
          </g>
        )}
        <text x={(box.l + W - box.r) / 2} y={H - 6} textAnchor="middle" fill="#474747" style={mono}>
          cost per sample (usd, log scale)
        </text>
      </svg>
    </Window>
  )
}
