import { benchmarkStory, type StoryRow } from '@skyfall/core/v8'
import { gsap, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useId, useRef, useState } from 'react'
import { axisMax, formatRate, RATE_METRICS, rateValue, type RateMetric } from '../lib/benchmarkRates'
import { Window } from '../lib/ui'

/** BIM for now: one horizontal bar chart of rates, best first. SKY-001's bar is blue, the rest grey; a failed run reads "Failed" with no bar. */
export function RateChart({ rows, metric, tag }: { rows: readonly StoryRow[]; metric: RateMetric; tag: string }) {
  const meta = benchmarkStory.charts[metric]
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const sorted = [...rows].sort((a, b) => (rateValue(b, metric) ?? -1) - (rateValue(a, metric) ?? -1))
  const max = metric === 'iou' ? 100 : axisMax(Math.max(...rows.map((r) => rateValue(r, metric) ?? 0)))
  const ticks = [0, max / 2, max]

  // Each chart builds itself from zero when it scrolls into view: bars grow out of the axis while their values count up (Ankit, 2026-10-17).
  useGSAP(
    () => {
      if (reduced || !box.current) return
      const bars = box.current.querySelectorAll<HTMLElement>('[data-bar]')
      const values = box.current.querySelectorAll<HTMLElement>('[data-value]')
      const failed = box.current.querySelectorAll<HTMLElement>('[data-failed]')
      const tl = gsap.timeline({ scrollTrigger: { trigger: box.current, start: 'top 75%', once: true } })
      tl.from(bars, { scaleX: 0, duration: 1.4, ease: 'power3.out', stagger: 0.08 }, 0)
      values.forEach((el, i) => {
        const end = Number(el.dataset.value)
        const state = { n: 0 }
        el.textContent = formatRateValue(0, metric)
        tl.to(state, { n: end, duration: 1.4, ease: 'power3.out', onUpdate: () => (el.textContent = formatRateValue(state.n, metric)), onComplete: () => (el.textContent = formatRateValue(end, metric)) }, i * 0.08)
      })
      tl.from(failed, { autoAlpha: 0, duration: 0.4 }, '-=0.4')
    },
    { scope: box, dependencies: [reduced, metric] },
  )

  return (
    <Window
      title={
        <span className="flex w-full justify-between gap-2">
          <span>{meta.title}</span>
          <span className="text-white/70">{tag}</span>
        </span>
      }
      className="h-full"
      bodyClassName="bg-paper px-3 pt-3 pb-3 md:px-4"
    >
      <div ref={box} role="img" aria-label={`${meta.title}, ${tag}: ${sorted.map((r) => `${r.model} ${rateText(r, metric)}`).join(', ')}`}>
        <ul aria-hidden="true">
          {sorted.map((r) => {
            const v = rateValue(r, metric)
            return (
              <li key={r.model} className={`grid min-h-8 grid-cols-[minmax(0,7.5rem)_1fr_3.5rem] items-center gap-2 border-b border-line text-[13px] tracking-[-0.02em] md:text-sm ${r.ours ? 'font-medium text-brand' : ''}`}>
                <span className="truncate">{r.model}</span>
                <span className="relative h-2.5">
                  {v === null ? (
                    <span data-failed className="absolute inset-y-[-3px] left-0 border border-line px-1 font-mono text-[10px] leading-none text-muted uppercase">{benchmarkStory.failed}</span>
                  ) : (
                    <span data-bar className={`absolute inset-y-0 left-0 origin-left ${r.ours ? 'bg-brand' : 'bg-bar'}`} style={{ width: `${Math.max((v / max) * 100, 0.6)}%` }} />
                  )}
                </span>
                <span data-value={v ?? undefined} className="text-right font-mono text-xs tabular-nums md:text-[13px]">{v === null ? '–' : rateText(r, metric)}</span>
              </li>
            )
          })}
        </ul>
        <div aria-hidden="true" className="grid grid-cols-[minmax(0,7.5rem)_1fr_3.5rem] gap-2 pt-1.5">
          <span />
          <span className="relative h-4 font-mono text-[10px] text-muted md:text-[11px]">
            {ticks.map((t, i) => (
              <span key={t} className={`absolute top-0 ${i === 0 ? 'left-0' : i === 1 ? 'left-1/2 -translate-x-1/2' : 'right-0'}`}>
                {metric === 'iou' ? `${t}%` : t.toLocaleString('en-US')}
              </span>
            ))}
          </span>
        </div>
        <p aria-hidden="true" className="mt-2 font-mono text-[10px] text-muted md:text-[11px]">{meta.note}</p>
      </div>
    </Window>
  )
}

function formatRateValue(v: number, metric: RateMetric) {
  if (v === 0) return metric === 'iou' ? '0%' : '0'
  return metric === 'iou' ? `${v.toFixed(1)}%` : formatRate(v)
}

function rateText(r: StoryRow, metric: RateMetric) {
  const v = rateValue(r, metric)
  return v === null ? benchmarkStory.failed : formatRateValue(v, metric)
}

export /** BIM on phones and tablets: one rate chart at a time behind Speed / Cost / IoU tabs. */
function RateTabs({ rows, tag }: { rows: readonly StoryRow[]; tag: string }) {
  const [metric, setMetric] = useState<RateMetric>('speed')
  const id = useId()
  return (
    <div className="lg:hidden">
      <div role="tablist" aria-label={`${tag} charts`} className="grid grid-cols-3 border-x border-t border-ink">
        {RATE_METRICS.map((m, i) => (
          <button
            key={m}
            role="tab"
            id={`${id}-${m}`}
            aria-selected={metric === m}
            aria-controls={`${id}-panel`}
            onClick={() => setMetric(m)}
            className={`min-h-11 text-[15px] tracking-[-0.02em] transition-colors ${i > 0 ? 'border-l border-ink' : ''} ${metric === m ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-studio'}`}
          >
            {benchmarkStory.charts[m].tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${metric}`}>
        <RateChart key={metric} rows={rows} metric={metric} tag={tag} />
      </div>
    </div>
  )
}
