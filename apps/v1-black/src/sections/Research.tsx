import { useState } from 'react'
import { research } from '@skyfall/core'
import { Reveal, SplitReveal } from '@skyfall/core/motion'
import { Eyebrow, FigCaption, Frame, SectionMark } from '../components/ui'
import { Fig02 } from '../figures/Fig02'
import { Fig03Desktop, Fig03Mobile, Fig03Tablet } from '../figures/Fig03'
import { Fig04Mobile, Fig04Wide } from '../figures/Fig04'

type StepKey = (typeof research.build.steps)[number]['key']

const lead = 'm-0 text-lg leading-[1.5] tracking-[-0.01em] text-ink md:text-xl'
const body = 'm-0 text-base leading-[1.6] text-body md:text-[17px]'
/** Desktop: label in columns 1–3, copy in 5–11. Tablet: copy pushed right at 640. Phone: stacked. */
const split = 'flex flex-col gap-5 md:ml-auto md:max-w-[640px] md:gap-[22px] lg:ml-0 lg:grid lg:max-w-none lg:grid-cols-12 lg:gap-x-6'

/** 01 · Research & vision: mission, the problem, what we build, the Pareto frontier, where it matters. */
export function Research() {
  const [show, setShow] = useState<StepKey | null>(null)
  const [pinned, setPinned] = useState<StepKey | null>(null)

  return (
    <section id="research" aria-label="Research and vision" className="scroll-mt-14 md:scroll-mt-16 lg:scroll-mt-[72px]">
      <Frame className="flex flex-col gap-14 py-16 md:gap-20 md:py-24 lg:gap-[120px] lg:py-[120px]">
        {/* Mission */}
        <div className="flex flex-col gap-5 md:gap-7 lg:gap-8">
          <Eyebrow index={1} label="Research & vision" />
          <SplitReveal
            as="h2"
            className="m-0 text-[32px] leading-[1.12] font-normal tracking-[-0.04em] md:text-[44px] md:leading-[1.1] md:tracking-[-0.045em] lg:max-w-[1120px] lg:text-[56px]"
          >
            {research.mission.before}
            <span className="text-brand-lift">{research.mission.emphasis}</span>
          </SplitReveal>
        </div>

        {/* § 1.1 The problem with next-token prediction */}
        <div className={split}>
          <SectionMark num="1.1" label={research.problem.title} className="lg:col-span-3" />
          <Reveal stagger={0.12} className="flex flex-col gap-5 md:gap-6 lg:col-span-7 lg:col-start-5">
            {research.problem.paragraphs.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 0 ? lead : body}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <Fig02 />

        {/* § 1.2 What we build */}
        <div className={split}>
          {/* "What we build" is the board's section label; content.ts has no field for it. */}
          <SectionMark num="1.2" label="What we build" className="lg:col-span-3" />
          <div className="flex flex-col gap-5 md:gap-6 lg:col-span-7 lg:col-start-5">
            <SplitReveal
              as="h3"
              className="m-0 text-[28px] leading-[1.15] font-normal tracking-[-0.035em] md:text-[34px] md:leading-[1.1] md:tracking-[-0.04em] lg:text-[40px]"
            >
              {research.build.title}
            </SplitReveal>
            <Reveal as="p" className={body}>
              {research.build.lead} {research.build.rest}
            </Reveal>
          </div>
        </div>

        {/* FIG.03 with a step legend that spotlights each part of the model */}
        <figure className="m-0 flex flex-col gap-3 md:gap-4" data-show={show ?? undefined}>
          <div className="md:hidden">
            <Fig03Mobile />
          </div>
          <div className="hidden flex-col items-center gap-3.5 border border-rule py-6 md:flex lg:hidden">
            <Fig03Tablet />
          </div>
          <div className="hidden lg:block">
            <Fig03Desktop />
          </div>
          <StepLegend
            show={show}
            pinned={pinned}
            onPreview={(k) => setShow(k ?? pinned)}
            onPin={(k) => {
              const next = pinned === k ? null : k
              setPinned(next)
              setShow(next)
            }}
          />
          <FigCaption>
            <span className="lg:hidden">Fig.03 — One model across functions, planning inside guardrails</span>
            <span className="hidden lg:inline">
              Fig.03 — One model learns the latent space across functions, simulates cause and effect, and plans inside guardrails
            </span>
          </FigCaption>
        </figure>

        {/* § 1.3 A new Pareto frontier */}
        <div className="flex flex-col gap-5 md:gap-7 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
          <div className="flex flex-col gap-5 md:max-w-[640px] md:gap-[22px] lg:col-span-4 lg:gap-6">
            <SectionMark num="1.3" label={research.pareto.title} className="lg:flex-row lg:gap-1.5" />
            <Reveal as="p" className={lead}>
              {research.pareto.body}
            </Reveal>
          </div>
          <figure className="m-0 flex flex-col gap-3 md:gap-4 lg:col-span-7 lg:col-start-6">
            <div className="md:hidden">
              <Fig04Mobile />
            </div>
            <div className="hidden md:block lg:hidden">
              <Fig04Wide grid={false} />
            </div>
            <div className="hidden lg:block">
              <Fig04Wide />
            </div>
            <FigCaption>
              <span className="md:hidden">Fig.04 — The trade-off moves</span>
              <span className="hidden md:inline">Fig.04 — Cost, speed and quality no longer traded against each other</span>
            </FigCaption>
          </figure>
        </div>

        {/* § 1.4 Where it matters */}
        <div className="flex flex-col gap-5 md:gap-7 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
          <div className={`${split} lg:col-span-12`}>
            {/* "Where it matters" is the board's section label; content.ts has no field for it. */}
            <SectionMark num="1.4" label="Where it matters" className="lg:col-span-3" />
            <Reveal stagger={0.12} className="flex flex-col gap-5 md:gap-6 lg:col-span-7 lg:col-start-5">
              <p className={lead}>
                {research.matters.infrastructure} {research.matters.statement.before}
                <span className="text-brand-lift">{research.matters.statement.emphasis}</span>
                {research.matters.statement.after}
              </p>
              <p className={body}>{research.matters.body}</p>
            </Reveal>
          </div>
          <Sectors />
        </div>
      </Frame>
    </section>
  )
}

function Sectors() {
  const sectors = research.matters.sectors
  return (
    <Reveal
      as="ul"
      stagger={0.06}
      y={16}
      className="m-0 list-none border-t border-rule p-0 md:grid md:grid-cols-3 md:border-l lg:col-span-12 lg:grid-cols-5"
    >
      {sectors.map((s, i) => {
        const last = i === sectors.length - 1
        return (
          <li
            key={s}
            className={`group flex min-h-14 items-center gap-4 border-b border-rule transition-colors duration-300 md:flex-col md:items-start md:gap-7 md:border-r md:p-5 lg:gap-10 lg:p-6 ${
              last ? 'md:bg-sector' : 'hover:bg-surface'
            }`}
          >
            <span className={`w-9 font-mono text-[10px] tracking-[0.06em] md:w-auto md:text-[11px] ${last ? 'text-brand-lift' : 'text-meta'}`}>
              S.{String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-xl font-medium tracking-[-0.02em] md:text-[22px] lg:text-2xl">
              {s}
              {last && (
                <span aria-hidden className="inline-block pl-1.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
                  →
                </span>
              )}
            </span>
          </li>
        )
      })}
      <li aria-hidden className="hidden border-r border-b border-rule md:block lg:hidden" />
    </Reveal>
  )
}

function StepLegend({
  show,
  pinned,
  onPreview,
  onPin,
}: {
  show: StepKey | null
  pinned: StepKey | null
  onPreview: (k: StepKey | null) => void
  onPin: (k: StepKey) => void
}) {
  return (
    <div className="grid grid-cols-2 border-t border-l border-rule lg:grid-cols-4" onMouseLeave={() => onPreview(null)}>
      {research.build.steps.map((step, i) => {
        const on = show === step.key
        return (
          <button
            key={step.key}
            type="button"
            aria-pressed={pinned === step.key}
            onMouseEnter={() => onPreview(step.key)}
            onFocus={() => onPreview(step.key)}
            onBlur={() => onPreview(null)}
            onClick={() => onPin(step.key)}
            className={`group relative flex min-h-11 cursor-pointer flex-col items-start gap-2 border-r border-b border-rule p-4 text-left transition-colors duration-300 md:p-5 ${
              on ? 'bg-sector' : 'hover:bg-surface'
            }`}
          >
            <span
              aria-hidden
              className={`absolute inset-x-0 -top-px h-px origin-left bg-brand transition-transform duration-500 ease-out-expo ${on ? 'scale-x-100' : 'scale-x-0'}`}
            />
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.06em] uppercase md:text-[11px]">
              <span className={on ? 'text-brand-lift' : 'text-meta'}>{String(i + 1).padStart(2, '0')}</span>
              <span className={on ? 'text-ink' : 'text-soft'}>{step.label}</span>
            </span>
            <span className="text-[15px] leading-[1.3] font-medium tracking-[-0.01em] text-ink md:text-base">{step.title}</span>
            <span className="text-[13px] leading-[1.5] text-body md:text-sm">{step.body}</span>
          </button>
        )
      })}
    </div>
  )
}
