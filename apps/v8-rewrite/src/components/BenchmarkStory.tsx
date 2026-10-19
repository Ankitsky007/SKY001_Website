import { benchmarkRaw, benchmarkStory, type StoryRow } from '@skyfall/core/v8'
import { formatLike, METRICS, metricValue, type Metric } from '../lib/benchmarkRates'
import { gsap, Reveal, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useId, useRef, useState } from 'react'
import { LineGrid } from './LineGrid'
import { Clip } from './Clip'
import { CountUp, DISPLAY, H3, LABEL, RuleCol, Window } from '../lib/ui'

/** One horizontal bar chart in the table's own units and row order, as Ankit's chart image (2026-10-18). SKY-001's row is blue on a tint; "–" has no bar. */
export function BarChart({ rows, labels, model, metric, tag }: { rows: readonly StoryRow[]; labels: readonly string[]; model: ModelKey; metric: Metric; tag: string }) {
  const meta = { ...benchmarkRaw.charts[metric], ...(model === 'bim' && metric !== 'iou' ? { title: benchmarkRaw.titles.bim[metric] } : {}) }
  const axis = benchmarkRaw.axes[model][metric]
  const tickLabels = benchmarkRaw.ticks[model][metric]
  const max = axis[axis.length - 1]
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)

  // Each chart builds itself from zero when it scrolls into view: bars grow out of the axis while their values count up (Ankit, 2026-10-17).
  useGSAP(
    () => {
      if (reduced || !box.current) return
      const bars = box.current.querySelectorAll<HTMLElement>('[data-bar]')
      const values = box.current.querySelectorAll<HTMLElement>('[data-value]')
      const tl = gsap.timeline({ scrollTrigger: { trigger: box.current, start: 'top 75%', once: true } })
      tl.from(bars, { scaleX: 0, duration: 1.4, ease: 'power3.out', stagger: 0.08 }, 0)
      values.forEach((el, i) => {
        const label = el.dataset.label ?? ''
        const end = Number(el.dataset.value)
        const state = { n: 0 }
        el.textContent = formatLike(label, 0)
        tl.to(state, { n: end, duration: 1.4, ease: 'power3.out', onUpdate: () => (el.textContent = formatLike(label, state.n)), onComplete: () => (el.textContent = label) }, i * 0.08)
      })
    },
    { scope: box, dependencies: [reduced, metric] },
  )

  return (
    <Window
      title={
        <span className="flex w-full justify-between gap-2">
          <span>
            {meta.title} {meta.arrow}
          </span>
          <span className="text-white/70">{tag}</span>
        </span>
      }
      className="h-full"
      bodyClassName="bg-paper px-3 pt-3 pb-3 md:px-4"
    >
      <div ref={box} role="img" aria-label={`${meta.title}, ${tag}, ${meta.note.toLowerCase()}: ${rows.map((r, i) => `${r.model} ${labels[i]}`).join(', ')}`}>
        <ul aria-hidden="true">
          {rows.map((r, i) => {
            const v = metricValue(r, metric)
            const label = labels[i]
            return (
              <li key={r.model} className={`grid min-h-8 grid-cols-[minmax(0,7.5rem)_1fr_4.5rem] items-center gap-2 border-b border-line text-[13px] tracking-[-0.02em] md:text-sm ${r.ours ? '-mx-3 bg-tint px-3 font-medium text-brand md:-mx-4 md:px-4' : ''}`}>
                <span className="truncate">{r.model}</span>
                <span className="relative h-2.5">{v !== null && <span data-bar className={`absolute inset-y-0 left-0 origin-left ${r.ours ? 'bg-brand' : 'bg-bar'}`} style={{ width: `${Math.max((v / max) * 100, 0.6)}%` }} />}</span>
                <span data-value={v ?? undefined} data-label={label} className="text-right font-mono text-xs tabular-nums md:text-[13px]">
                  {label}
                </span>
              </li>
            )
          })}
        </ul>
        <div aria-hidden="true" className="grid grid-cols-[minmax(0,7.5rem)_1fr_4.5rem] gap-2 pt-1.5">
          <span />
          <span className="relative h-4 font-mono text-[10px] text-muted md:text-[11px]">
            {axis.map((t, i) => (
              <span key={t} className={`absolute top-0 ${i === 0 ? 'left-0' : '-translate-x-1/2'}`} style={i === 0 ? undefined : { left: `${(t / max) * 100}%` }}>
                {tickLabels[i]}
              </span>
            ))}
          </span>
        </div>
        <p aria-hidden="true" className="mt-2 font-mono text-[10px] font-medium text-brand md:text-[11px]">{meta.note}</p>
      </div>
    </Window>
  )
}

/** Phones and tablets: one chart at a time behind IoU / Time / Cost tabs. */
function ChartTabs({ story }: { story: Story }) {
  const model = story.key
  const tag = story.tag
  const metrics = benchmarkRaw.metrics[model]
  const [metric, setMetric] = useState<Metric>(metrics[0])
  const id = useId()
  return (
    <div className="lg:hidden">
      <div role="tablist" aria-label={`${tag} charts`} className="grid grid-cols-3 border-x border-t border-ink">
        {metrics.map((m, i) => (
          <button
            key={m}
            role="tab"
            id={`${id}-${m}`}
            aria-selected={metric === m}
            aria-controls={`${id}-panel`}
            onClick={() => setMetric(m)}
            className={`min-h-11 text-[15px] tracking-[-0.02em] transition-colors ${i > 0 ? 'border-l border-ink' : ''} ${metric === m ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-studio'}`}
          >
            {benchmarkRaw.charts[m].tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${metric}`}>
        <BarChart key={metric} rows={story.rows} labels={labelsFor(story, metric)} model={model} metric={metric} tag={tag} />
      </div>
    </div>
  )
}

type ModelKey = keyof typeof benchmarkRaw.labels
type Story = (typeof benchmarkStory.models)[number]

/** The table text for each row of one chart. */
function labelsFor(story: Story, metric: Metric): readonly string[] {
  return benchmarkRaw.labels[story.key].map((row) => row[METRICS.indexOf(metric)])
}

type ClipTone = 'dark' | 'native-light'
type StoryClip = { src: string; poster: string; tone: ClipTone; second?: { src: string; poster: string } }
type ClipView = { readonly label: string; readonly clipLabel: string }

/** Two films for one model: side by side under black bars on desktop, one at a time behind tabs on phones and tablets (Ankit, 2026-10-19). */
function ClipViews({ title, views, clips, tone }: { title: string; views: readonly ClipView[]; clips: readonly { src: string; poster: string }[]; tone: ClipTone }) {
  const [active, setActive] = useState(0)
  const id = useId()
  return (
    <>
      <div className="mt-3 hidden grid-cols-2 gap-3 lg:grid">
        {views.map((v, i) => (
          <Window key={v.label} title={<h4>{v.label}</h4>} bodyClassName="">
            <Clip src={clips[i].src} poster={clips[i].poster} label={v.clipLabel} tone={tone} className="border-0" />
          </Window>
        ))}
      </div>
      <div className="lg:hidden">
        <div role="tablist" aria-label={`${title} films`} className="grid grid-cols-2 border-x border-ink">
          {views.map((v, i) => (
            <button
              key={v.label}
              type="button"
              role="tab"
              id={`${id}-${i}`}
              aria-selected={active === i}
              aria-controls={`${id}-panel`}
              onClick={() => setActive(i)}
              className={`min-h-11 text-[15px] tracking-[-0.02em] transition-colors ${i > 0 ? 'border-l border-ink' : ''} ${active === i ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-studio'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${active}`}>
          <Clip key={active} src={clips[active].src} poster={clips[active].poster} label={views[active].clipLabel} tone={tone} />
        </div>
      </div>
    </>
  )
}

/** One model: the blue claim, the video right under it, then the three charts that back the claim. */
export function BenchmarkBlock({ story, clip }: { story: Story; clip: StoryClip }) {
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
      {'views' in story && clip.second ? (
        <ClipViews title={story.title} views={story.views} clips={[clip, clip.second]} tone={clip.tone} />
      ) : (
        <Clip src={clip.src} poster={clip.poster} label={story.clipLabel} tone={clip.tone} chip={story.clip} className="border-t-0" />
      )}
      {/* Both models are drawn in their tables' own units (Ankit, 2026-10-18): IoU, time and cost. */}
      <Reveal as="div" stagger={0.08} className={`mt-3 hidden gap-3 lg:grid lg:grid-cols-3`}>
        {benchmarkRaw.metrics[story.key].map((m) => (
          <BarChart key={m} rows={story.rows} labels={labelsFor(story, m)} model={story.key} metric={m} tag={story.tag} />
        ))}
      </Reveal>
      <div className="mt-3">
        <ChartTabs story={story} />
      </div>
    </article>
  )
}
