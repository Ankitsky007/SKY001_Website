import { docCharts } from '@skyfall/core'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { visible } from '../../figures/visible'

// The content doc's charts (SKY PAGE images 03 and 04), redrawn with the same chart types, axes
// and numbers (docCharts in core). Each chart ships a phone and a desktop size; CSS picks one.

const MONO = 'Geist Mono, monospace'
const BRAND = '#3E57DA'
type Size = {
  w: number
  h: number
  m: [top: number, right: number, bottom: number, left: number]
  font: number
}
const DESKTOP: Size = { w: 560, h: 400, m: [32, 24, 56, 52], font: 11 }
const PHONE: Size = { w: 340, h: 300, m: [26, 14, 50, 40], font: 10 }

const log = Math.log10
function scales(size: Size, x: readonly [number, number], y: readonly [number, number]) {
  const [t, r, b, l] = size.m
  const sx = (v: number) => l + ((log(v) - log(x[0])) / (log(x[1]) - log(x[0]))) * (size.w - l - r)
  const sy = (v: number) => size.h - b - ((v - y[0]) / (y[1] - y[0])) * (size.h - t - b)
  return { sx, sy, left: l, right: size.w - r, top: t, bottom: size.h - b }
}

const usd = (v: number) => (v >= 0.1 ? `$${v.toFixed(2)}` : v >= 0.01 ? `$${v.toFixed(3).replace(/0$/, '')}` : `$${String(v)}`)
const sec = (v: number) => `${v} s`

/** Draw-in on first view: grid, axes, then points (ours last), then annotations. */
function useChartReveal(root: React.RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const el = root.current
      if (!el || prefersReducedMotion()) return
      const q = (s: string) => visible(el, s)
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'expo.out', duration: 0.7 },
      })
      tl.from(q('[data-c-grid]'), { autoAlpha: 0, duration: 1 }, 0)
        .from(q('[data-c-axis]'), { drawSVG: 0, duration: 1, ease: 'power2.inOut' }, 0)
        .from(q('[data-c-tick]'), { autoAlpha: 0, stagger: 0.03 }, 0.3)
        .from(
          q('[data-c-pt]'),
          {
            scale: 0,
            transformOrigin: '50% 50%',
            stagger: { each: 0.08, from: 'random' },
            duration: 0.5,
          },
          0.6,
        )
        .from(q('[data-c-line]'), { drawSVG: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.2 }, 0.9)
        .from(
          q('[data-c-ours]'),
          {
            scale: 0,
            transformOrigin: '50% 50%',
            duration: 0.6,
            stagger: 0.15,
          },
          1.3,
        )
        .from(
          q('[data-c-ring]'),
          {
            scale: 0.2,
            autoAlpha: 0,
            transformOrigin: '50% 50%',
            duration: 1.2,
          },
          1.5,
        )
        .from(q('[data-c-note]'), { autoAlpha: 0, stagger: 0.08 }, 1.4)
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 78%',
        once: true,
        onEnter: () => tl.play(),
      })
      return () => st.kill()
    },
    { scope: root },
  )
}

function Axes({
  s,
  xTicks,
  yTicks,
  xFmt,
  size,
  xLabel,
  yLabel,
}: {
  s: ReturnType<typeof scales>
  xTicks: readonly number[]
  yTicks: readonly number[]
  xFmt: (v: number) => string
  size: Size
  xLabel: string
  yLabel: string
}) {
  const f = size.font
  return (
    <>
      <g data-c-grid stroke="#E0E0E0" strokeDasharray="3 4">
        {yTicks.map((v) => (
          <line key={`y${v}`} x1={s.left} x2={s.right} y1={s.sy(v)} y2={s.sy(v)} />
        ))}
        {xTicks.map((v) => (
          <line key={`x${v}`} x1={s.sx(v)} x2={s.sx(v)} y1={s.top} y2={s.bottom} />
        ))}
      </g>
      <path data-c-axis d={`M${s.left} ${s.top} V${s.bottom} H${s.right}`} fill="none" stroke="#ADADAD" />
      <g fontFamily={MONO} fontSize={f} fill="#7A7A7A">
        {yTicks.map((v) => (
          <text data-c-tick key={`yl${v}`} x={s.left - 8} y={s.sy(v) + f * 0.35} textAnchor="end">
            {v}%
          </text>
        ))}
        {xTicks.map((v) => (
          <text data-c-tick key={`xl${v}`} x={s.sx(v)} y={s.bottom + f + 8} textAnchor="middle">
            {xFmt(v)}
          </text>
        ))}
        <text data-c-tick x={s.right} y={size.h - 8} textAnchor="end" letterSpacing="0.6">
          {xLabel.toUpperCase()} →
        </text>
        <text data-c-tick x={s.left} y={s.top - 14} letterSpacing="0.6">
          ↑ {yLabel.toUpperCase()}
        </text>
      </g>
    </>
  )
}

type Pt = { model: string; ours: boolean; cost: number; iou: number }
type Placement = Record<string, [dx: number, dy: number, anchor?: 'start' | 'end']>

function ScatterSvg({
  pts,
  yDomain,
  yTicks,
  size,
  place,
  active,
  onActive,
  className,
}: {
  pts: readonly Pt[]
  yDomain: readonly [number, number]
  yTicks: readonly number[]
  size: Size
  place: Placement
  active: string
  onActive: (m: string) => void
  className: string
}) {
  const { xLabel, yLabel } = docCharts.pareto
  const s = scales(size, [0.001, 1], yDomain)
  const f = size.font
  return (
    <svg viewBox={`0 0 ${size.w} ${size.h}`} className={`h-auto w-full ${className}`} role="img" aria-label={`Accuracy against cost per part: ${pts.map((p) => `${p.model} ${p.iou}% at ${usd(p.cost)}`).join('; ')}`}>
      <Axes s={s} xTicks={[0.001, 0.01, 0.1, 1]} yTicks={yTicks} xFmt={usd} size={size} xLabel={xLabel} yLabel={yLabel} />
      <g data-c-note fontFamily={MONO} fontSize={f} fill={BRAND} letterSpacing="0.6">
        <text x={s.left + 12} y={s.top + f + 6}>
          ↖ {docCharts.pareto.hint.toUpperCase()}
        </text>
      </g>
      {pts.map((p) => {
        const x = s.sx(p.cost)
        const y = s.sy(p.iou)
        const [dx, dy, anchor = dx < 0 ? 'end' : 'start'] = place[p.model] ?? [10, 4]
        const on = active === p.model
        return (
          <g
            key={p.model}
            tabIndex={0}
            role="button"
            aria-label={`${p.model}: ${p.iou}% IoU at ${usd(p.cost)} per part`}
            onPointerEnter={() => onActive(p.model)}
            onFocus={() => onActive(p.model)}
            className="cursor-pointer outline-none"
          >
            <circle cx={x} cy={y} r="14" fill="transparent" />
            {p.ours ? (
              <>
                <circle data-c-ring cx={x} cy={y} r="16" fill="none" stroke={BRAND} strokeOpacity="0.35" />
                <rect data-c-ours x={x - 6} y={y - 6} width="12" height="12" fill={BRAND} />
              </>
            ) : (
              <circle data-c-pt cx={x} cy={y} r={on ? 6.5 : 5} fill={on ? '#1A1A1A' : '#FFFFFF'} stroke={on ? '#1A1A1A' : '#7A7A7A'} strokeWidth="1.5" />
            )}
            <text data-c-note x={x + dx} y={y + dy} textAnchor={anchor} fontFamily={MONO} fontSize={f} fontWeight={p.ours ? 600 : 500} fill={p.ours ? BRAND : on ? '#1A1A1A' : '#474747'}>
              {p.model}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Image 03: one Pareto scatter (accuracy vs cost per part, log x). Hover or focus a point to read it. */
export function ParetoChart({ which, fig, place, phonePlace, footnote }: { which: 'cad' | 'bim'; fig: string; place: Placement; phonePlace: Placement; footnote?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const chart = docCharts.pareto[which]
  const [active, setActive] = useState('SKY-001')
  useChartReveal(root)
  const p = chart.points.find((pt) => pt.model === active) ?? chart.points[0]
  const props = {
    pts: chart.points,
    yDomain: chart.yDomain,
    yTicks: chart.yTicks,
    active,
    onActive: setActive,
  }
  return (
    <div ref={root} className="dots flex flex-col gap-3 border border-line p-3 [background-size:12px_12px] md:gap-4 md:p-5 md:[background-size:14px_14px]">
      <div className="flex items-center justify-between font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px]">
        <span className="text-muted">{fig}</span>
        <span className="text-ink">{chart.title}</span>
      </div>
      <div className="border border-line bg-white">
        <ScatterSvg {...props} size={PHONE} place={phonePlace} className="block md:hidden" />
        <ScatterSvg {...props} size={DESKTOP} place={place} className="hidden md:block" />
      </div>
      <div aria-live="polite" className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border border-line bg-white px-3 py-2.5 font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:px-4 md:text-[13px]">
        <span className={p.ours ? 'flex items-center gap-2 text-brand' : 'flex items-center gap-2 text-ink'}>
          <span aria-hidden="true" className={`block size-2 ${p.ours ? 'bg-brand' : 'rounded-full border border-ink'}`} />
          {p.model}
        </span>
        <span className="text-muted">{usd(p.cost)} / part</span>
        <span className={p.ours ? 'text-brand' : 'text-ink'}>{p.iou}% IoU</span>
      </div>
      {footnote && <p className="font-mono text-[10px] leading-[1.45] tracking-[0.02em] text-muted uppercase md:text-[11px]">■ {footnote}</p>}
    </div>
  )
}

type Series = {
  key: string
  label: string
  ours: { x: number; iou: number }
  other: { x: number; iou: number }
}

function VersusSvg({ kind, size, className }: { kind: 'cost' | 'time'; size: Size; className: string }) {
  const v = docCharts.versus
  const c = v[kind]
  const s = scales(size, c.xDomain, v.yDomain)
  const f = size.font
  const fmt = kind === 'cost' ? usd : sec
  const label = (se: Series) => {
    const x1 = s.sx(se.other.x)
    const x2 = s.sx(se.ours.x)
    const y = (s.sy(se.other.iou) + s.sy(se.ours.iou)) / 2
    return { x: (x1 + x2) / 2, y: y - 12 }
  }
  return (
    <svg
      viewBox={`0 0 ${size.w} ${size.h}`}
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label={`${c.title}: ${c.series.map((se) => `${v.legend[se.key]}, SKY-001 ${se.ours.iou}% at ${fmt(se.ours.x)} vs GPT-6 Astra ${se.other.iou}% at ${fmt(se.other.x)}, ${se.label}`).join('; ')}`}
    >
      <defs>
        <marker id={`vs-ar-${kind}-${size.w}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={BRAND} />
        </marker>
      </defs>
      <Axes s={s} xTicks={c.xTicks} yTicks={v.yTicks} xFmt={kind === 'cost' ? usd : (n) => `${n} s`} size={size} xLabel={c.xLabel} yLabel={v.yLabel} />
      {c.series.map((se) => {
        const dashed = se.key === 'bim'
        const ox = s.sx(se.other.x)
        const oy = s.sy(se.other.iou)
        const ux = s.sx(se.ours.x)
        const uy = s.sy(se.ours.iou)
        const l = label(se)
        return (
          <g key={se.key}>
            <path
              {...(dashed ? { 'data-c-note': '' } : { 'data-c-line': '' })}
              d={`M${ox - 8} ${oy} L${ux + 12} ${uy}`}
              fill="none"
              stroke={BRAND}
              strokeWidth="1.5"
              strokeDasharray={dashed ? '5 4' : undefined}
              markerEnd={`url(#vs-ar-${kind}-${size.w})`}
            />
            <circle data-c-pt cx={ox} cy={oy} r="5" fill="#FFFFFF" stroke="#7A7A7A" strokeWidth="1.5" />
            <rect data-c-ours x={ux - 6} y={uy - 6} width="12" height="12" fill={BRAND} />
            <g data-c-note fontFamily={MONO} fontSize={f}>
              <text x={l.x} y={l.y} textAnchor="middle" fill={BRAND} fontWeight="600">
                {se.label}
              </text>
              <text x={ux} y={uy + (dashed ? 22 : -14)} textAnchor="middle" fill={BRAND}>
                {fmt(se.ours.x)} · {se.ours.iou}%
              </text>
              <text x={ox} y={oy + (dashed ? 22 : -14)} textAnchor="middle" fill="#474747">
                {fmt(se.other.x)} · {se.other.iou}%
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}

/** Image 04: SKY-001 vs GPT-6 Astra, accuracy against cost and against time (both log x). */
export function VersusChart({ kind, fig }: { kind: 'cost' | 'time'; fig: string }) {
  const root = useRef<HTMLDivElement>(null)
  const v = docCharts.versus
  useChartReveal(root)
  return (
    <div ref={root} className="dots flex flex-col gap-3 border border-line p-3 [background-size:12px_12px] md:gap-4 md:p-5 md:[background-size:14px_14px]">
      <div className="flex items-center justify-between font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px]">
        <span className="text-muted">{fig}</span>
        <span className="text-ink">{v[kind].title}</span>
      </div>
      <div className="border border-line bg-white">
        <VersusSvg kind={kind} size={PHONE} className="block md:hidden" />
        <VersusSvg kind={kind} size={DESKTOP} className="hidden md:block" />
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] font-medium tracking-[0.02em] text-body uppercase md:text-[11px]">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="block size-2 bg-brand" />
          {v.legend.ours}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="block size-2 rounded-full border border-muted" />
          {v.legend.other}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="block h-px w-5 bg-brand" />
          {v.legend.cad}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="block h-px w-5 border-t border-dashed border-brand" />
          {v.legend.bim}
        </li>
      </ul>
    </div>
  )
}
