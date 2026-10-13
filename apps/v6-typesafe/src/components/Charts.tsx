import { docCharts } from '@skyfall/core'
import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { Window } from '../lib/ui'

// The content doc's charts, redrawn with the doc's axes, ticks and labels inside terminal windows.
// Positions come straight from the values in content; nothing is placed by eye.

const INK = '#1a1a1a'
const BRAND = '#3e57da'
const GRID = '#e0e0e0'
const AXIS = '#474747'
const mono = { fontFamily: 'var(--font-mono)', fontSize: 11 } as const
const sans = { fontFamily: 'var(--font-sans)', fontSize: 12.5, letterSpacing: '-0.01em' } as const

const usd = (t: number) => (t < 0.01 ? '$0.001' : t < 0.1 ? '$0.01' : t < 1 ? '$0.10' : '$1.00')

/** Points fade and rise in once, lines draw. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      const st = { trigger: ref.current, start: 'top 85%', once: true }
      gsap.from(ref.current.querySelectorAll('[data-pt]'), { autoAlpha: 0, scale: 0, transformOrigin: 'center', duration: 0.6, stagger: 0.07, ease: 'back.out(2)', scrollTrigger: st })
      gsap.from(ref.current.querySelectorAll('[data-line]'), { strokeDashoffset: 1, duration: 1.2, ease: 'power2.out', delay: 0.3, scrollTrigger: st })
    },
    { scope: ref },
  )
  return ref
}

type ParetoKey = 'cad' | 'bim'

// Which side of its point each label sits on, following the doc's image so labels never collide.
const LABEL_SIDE: Record<ParetoKey, Record<string, 'left' | 'right' | 'above' | 'aboveRight' | 'below'>> = {
  cad: { 'GPT-6 Astra': 'left', 'Opus 5.5': 'left', 'Gemini 3.8 Flash': 'right', 'Qwen 3.8 Max': 'left', 'Kimi K3': 'right' },
  bim: { 'Gemini 3.8 Flash': 'aboveRight', 'GPT-6 Astra': 'below', 'Opus 5.5': 'above', 'Kimi K3': 'below', 'Qwen 3.8 Max': 'left', 'Grok 4.7': 'right' },
}

/**
 * Doc image 03: accuracy (IoU) against cost per part on a log scale from $0.001 to $1.00.
 * SKY-001 is the large blue point with its value; the other models are dark points with labels.
 */
export function ParetoScatter({ chart }: { chart: ParetoKey }) {
  const ref = useReveal()
  const { hint, xLabel, yLabel } = docCharts.pareto
  const data = docCharts.pareto[chart]
  const W = 560
  const H = 400
  const box = { l: 58, r: 30, t: 14, b: 50 }
  const [y0, y1] = data.yDomain
  const x = (cost: number) => box.l + ((Math.log10(cost) + 3) / 3) * (W - box.l - box.r)
  const y = (iou: number) => H - box.b - ((iou - y0) / (y1 - y0)) * (H - box.t - box.b)
  const summary = data.points.map((p) => `${p.model} ${p.iou}% at $${p.cost}`).join('; ')

  return (
    <div ref={ref}>
      <Window title={data.title}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${data.title}. ${yLabel} against ${xLabel}. ${hint}. ${summary}.`} className="block w-full">
          {data.yTicks.map((t) => (
            <g key={t}>
              <path d={`M${box.l} ${y(t)}H${W - box.r}`} stroke={GRID} />
              <text x={box.l - 8} y={y(t) + 4} textAnchor="end" fill={AXIS} style={mono}>
                {t}%
              </text>
            </g>
          ))}
          {[0.001, 0.01, 0.1, 1].map((t) => (
            <g key={t}>
              <path d={`M${x(t)} ${box.t}V${H - box.b}`} stroke={GRID} />
              <text x={x(t)} y={H - box.b + 17} textAnchor="middle" fill={AXIS} style={mono}>
                {usd(t)}
              </text>
            </g>
          ))}
          <rect x={box.l} y={box.t} width={W - box.l - box.r} height={H - box.t - box.b} fill="none" stroke={INK} />
          <text x={box.l + 10} y={box.t + 20} fill={BRAND} style={{ ...sans, fontWeight: 600 }}>
            {hint}
          </text>
          <text x={(box.l + W - box.r) / 2} y={H - 10} textAnchor="middle" fill={AXIS} style={mono}>
            {xLabel}
          </text>
          <text transform={`translate(14 ${(box.t + H - box.b) / 2}) rotate(-90)`} textAnchor="middle" fill={AXIS} style={mono}>
            {yLabel}
          </text>
          {data.points.map((p) => {
            const cx = x(p.cost)
            const cy = y(p.iou)
            if (p.ours) {
              return (
                <g key={p.model}>
                  <circle data-pt cx={cx} cy={cy} r="11" fill={BRAND} />
                  <text x={cx + 18} y={cy + 4.5} fill={BRAND} style={{ ...sans, fontSize: 14, fontWeight: 600 }}>
                    {p.model}
                    <tspan dx="8">{p.iou}%</tspan>
                  </text>
                </g>
              )
            }
            const side = LABEL_SIDE[chart][p.model] ?? 'right'
            const lx = side === 'right' ? cx + 13 : side === 'left' ? cx - 13 : side === 'aboveRight' ? cx - 8 : cx - 10
            const ly = side === 'above' || side === 'aboveRight' ? cy - 12 : side === 'below' ? cy + 20 : cy + 4
            return (
              <g key={p.model}>
                <circle data-pt cx={cx} cy={cy} r="6.5" fill={INK} />
                <text x={lx} y={ly} textAnchor={side === 'right' || side === 'aboveRight' ? 'start' : 'end'} fill={INK} style={sans}>
                  {p.model}
                </text>
              </g>
            )
          })}
        </svg>
      </Window>
    </div>
  )
}

type VersusKey = 'cost' | 'time'

/**
 * Doc image 04: SKY-001 (filled circle) joined to GPT-6 Astra (open square) for 3D CAD (solid) and
 * BIM (dashed), accuracy on a 30 to 90 axis against cost or time per part on a log scale.
 */
export function VersusLines({ chart }: { chart: VersusKey }) {
  const ref = useReveal()
  const v = docCharts.versus
  const data = v[chart]
  const W = 560
  const H = 400
  const box = { l: 58, r: 34, t: 16, b: 62 }
  const [y0, y1] = v.yDomain
  const [x0, x1] = data.xDomain.map(Math.log10)
  const x = (val: number) => box.l + ((Math.log10(val) - x0) / (x1 - x0)) * (W - box.l - box.r)
  const y = (iou: number) => H - box.b - ((iou - y0) / (y1 - y0)) * (H - box.t - box.b)
  const tick = (t: number) => (chart === 'cost' ? (t === 1 ? '$1' : usd(t)) : `${t >= 10 ? t : t.toFixed(1)} s`)
  const summary = data.series.map((s) => `${v.legend[s.key]}: ${v.legend.ours} ${s.ours.iou}% at ${s.ours.x}, ${v.legend.other} ${s.other.iou}% at ${s.other.x}, ${s.label}`).join('; ')

  return (
    <div ref={ref}>
      <Window title={data.title}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${data.title}. ${summary}.`} className="block w-full">
          {v.yTicks.map((t) => (
            <g key={t}>
              <path d={`M${box.l} ${y(t)}H${W - box.r}`} stroke={GRID} />
              <text x={box.l - 8} y={y(t) + 4} textAnchor="end" fill={AXIS} style={mono}>
                {t}
              </text>
            </g>
          ))}
          {data.xTicks.map((t) => (
            <g key={t}>
              <path d={`M${x(t)} ${box.t}V${H - box.b}`} stroke={GRID} />
              <text x={x(t)} y={H - box.b + 17} textAnchor="middle" fill={AXIS} style={mono}>
                {tick(t)}
              </text>
            </g>
          ))}
          <rect x={box.l} y={box.t} width={W - box.l - box.r} height={H - box.t - box.b} fill="none" stroke={INK} />
          <text x={(box.l + W - box.r) / 2} y={H - 24} textAnchor="middle" fill={AXIS} style={mono}>
            {data.xLabel}
          </text>
          <text transform={`translate(14 ${(box.t + H - box.b) / 2}) rotate(-90)`} textAnchor="middle" fill={AXIS} style={mono}>
            {v.yLabel}
          </text>
          {data.series.map((s) => {
            const color = s.key === 'cad' ? BRAND : INK
            const ax = x(s.ours.x)
            const ay = y(s.ours.iou)
            const bx = x(s.other.x)
            const by = y(s.other.iou)
            const below = s.key === 'bim'
            return (
              <g key={s.key}>
                {s.key === 'cad' ? (
                  <path data-line d={`M${ax} ${ay}L${bx} ${by}`} stroke={color} strokeWidth="2.5" pathLength="1" strokeDasharray="1" />
                ) : (
                  <path d={`M${ax} ${ay}L${bx} ${by}`} stroke={color} strokeWidth="2" strokeDasharray="6 5" className="flow" />
                )}
                <circle data-pt cx={ax} cy={ay} r="9" fill={color} />
                <rect data-pt x={bx - 6} y={by - 6} width="12" height="12" fill="#fff" stroke={color} strokeWidth="2" />
                <text x={ax - 14} y={ay + 4.5} textAnchor="end" fill={INK} style={sans}>
                  {v.legend.ours}
                </text>
                <text x={bx + 12} y={below ? by + 18 : by - 10} fill={INK} style={sans}>
                  Astra
                </text>
                <text x={(ax + bx) / 2} y={below ? (ay + by) / 2 + 26 : (ay + by) / 2 - 14} textAnchor="middle" fill={color} style={{ ...sans, fontSize: 15, fontWeight: 600 }}>
                  {s.label}
                </text>
              </g>
            )
          })}
        </svg>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t border-ink px-3 py-2 font-mono text-[11px] md:text-xs">
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="block h-0.5 w-5 bg-brand" />
            {v.legend.cad}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="block w-5 border-t-2 border-dashed border-ink" />
            {v.legend.bim}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="block size-2.5 rounded-full bg-ink" />
            {v.legend.ours}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="block size-2.5 border-2 border-ink" />
            {v.legend.other}
          </li>
        </ul>
      </Window>
    </div>
  )
}
