import { benchmarkStory, type StoryRow } from '@skyfall/core'
import { axisMax, formatRate, METRICS, metricValue, type Metric } from '../lib/benchmarkRates'
import { gsap, Reveal, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useId, useRef, useState } from 'react'
import { LineGrid } from './LineGrid'
import { Clip } from './Clip'
import { CountUp, DISPLAY, H3, LABEL, RuleCol, Window } from '../lib/ui'

/** One horizontal bar chart, best first. SKY-001's bar is blue, the rest grey; a failed run reads "Failed" with no bar. */
export function BarChart({ rows, metric, tag }: { rows: readonly StoryRow[]; metric: Metric; tag: string }) {
  const meta = benchmarkStory.charts[metric]
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const sorted = [...rows].sort((a, b) => (metricValue(b, metric) ?? -1) - (metricValue(a, metric) ?? -1))
  const max = metric === 'iou' ? 100 : axisMax(Math.max(...rows.map((r) => metricValue(r, metric) ?? 0)))
  const ticks = [0, max / 2, max]

  useGSAP(
    () => {
      if (reduced || !box.current) return
      gsap.from(box.current.querySelectorAll('[data-bar]'), {
        scaleX: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: { trigger: box.current, start: 'top 85%', once: true },
      })
    },
    { scope: box, dependencies: [reduced] },
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
      <div ref={box} role="img" aria-label={`${meta.title}, ${tag}: ${sorted.map((r) => `${r.model} ${valueText(r, metric)}`).join(', ')}`}>
        <ul aria-hidden="true">
          {sorted.map((r) => {
            const v = metricValue(r, metric)
            return (
              <li key={r.model} className={`grid min-h-8 grid-cols-[minmax(0,7.5rem)_1fr_3.5rem] items-center gap-2 border-b border-line text-[13px] tracking-[-0.02em] md:text-sm ${r.ours ? 'font-medium text-brand' : ''}`}>
                <span className="truncate">{r.model}</span>
                <span className="relative h-2.5">
                  {v === null ? (
                    <span className="absolute inset-y-[-3px] left-0 border border-line px-1 font-mono text-[10px] leading-none text-muted uppercase">{benchmarkStory.failed}</span>
                  ) : (
                    <span data-bar className={`absolute inset-y-0 left-0 origin-left ${r.ours ? 'bg-brand' : 'bg-bar'}`} style={{ width: `${Math.max((v / max) * 100, 0.6)}%` }} />
                  )}
                </span>
                <span className="text-right font-mono text-xs tabular-nums md:text-[13px]">{v === null ? '–' : valueText(r, metric)}</span>
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

function valueText(r: StoryRow, metric: Metric) {
  const v = metricValue(r, metric)
  if (v === null) return benchmarkStory.failed
  return metric === 'iou' ? `${v.toFixed(1)}%` : formatRate(v)
}

/** Phones and tablets: one chart at a time behind Speed / Cost / IoU tabs. */
function ChartTabs({ rows, tag }: { rows: readonly StoryRow[]; tag: string }) {
  const [metric, setMetric] = useState<Metric>('speed')
  const id = useId()
  return (
    <div className="lg:hidden">
      <div role="tablist" aria-label={`${tag} charts`} className="grid grid-cols-3 border-x border-t border-ink">
        {METRICS.map((m, i) => (
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
        <BarChart key={metric} rows={rows} metric={metric} tag={tag} />
      </div>
    </div>
  )
}

type Story = (typeof benchmarkStory.models)[number]

/** One model: the blue claim, the video right under it, then the three charts that back the claim. */
export function BenchmarkBlock({ story, clip }: { story: Story; clip: { src: string; poster: string; tone: 'dark' | 'native-light' } }) {
  return (
    <article aria-label={story.title}>
      <div className="relative overflow-hidden bg-brand px-4 pt-5 pb-6 text-white md:px-6 md:pt-6 md:pb-8">
        <LineGrid tone="blue" mask="linear-gradient(to bottom, #000, transparent)" />
        <h3 className={`${LABEL} relative inline-block border border-white/70 px-2 py-1`}>{story.title}</h3>
        <dl className="relative mt-5 grid grid-cols-3 gap-3 md:gap-6">
          {story.claims.map((c) => (
            <RuleCol key={c.label} tone="dark" label={<dt className="hidden normal-case md:block">{c.detail}</dt>} className="gap-3!">
              <dd>
                <span className={`${DISPLAY} block text-[34px] leading-[0.9] sm:text-[64px] lg:text-[104px] lg:leading-[0.85]`}>
                  <CountUp value={c.value} />
                </span>
                <span className={`${H3} mt-1 block text-[15px]! sm:text-[22px]! md:mt-2`}>{c.label}</span>
              </dd>
            </RuleCol>
          ))}
        </dl>
      </div>
      <Clip src={clip.src} poster={clip.poster} label={story.clipLabel} tone={clip.tone} chip={story.clip} className="border-t-0" />
      <Reveal as="div" stagger={0.08} className="mt-3 hidden gap-3 lg:grid lg:grid-cols-3">
        {METRICS.map((m) => (
          <BarChart key={m} rows={story.rows} metric={m} tag={story.tag} />
        ))}
      </Reveal>
      <div className="mt-3">
        <ChartTabs rows={story.rows} tag={story.tag} />
      </div>
    </article>
  )
}
