import { research, sky001Cta } from '@skyfall/core'
import { Reveal, SplitReveal } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { PixelIcon, type PixelIconName } from '../components/PixelIcon'
import { Eyebrow, FigCaption, PixelWord, PrimaryButton, Slash, SlashHeading, SubLabel } from '../components/ui'
import { Fig02 } from '../figures/Fig02'
import { Fig03 } from '../figures/Fig03'
import { Fig04 } from '../figures/Fig04'
import { useScrambleIn } from '../lib/useScrambleIn'
import { StepCards } from './research/StepCards'

const SECTOR_ICONS: PixelIconName[] = ['industrial', 'healthcare', 'chemical', 'enterprise', 'beyond']

/** N.01 Research & vision: mission, the problem (FIG.02), what we build (steps, FIG.03), Pareto (FIG.04), where it matters. */
export function Research() {
  return (
    <section id="research" aria-labelledby="research-mission" className="wrap pt-16 pb-20 md:pt-24 lg:pt-[120px] lg:pb-[120px]">
      <Eyebrow index={1} label="Research & vision" />
      <Mission />
      <Problem />
      <Build />
      <Pareto />
      <Matters />
    </section>
  )
}

function Mission() {
  const { before, emphasis } = research.mission
  return (
    <div id="research-mission" className="mt-8 max-w-[1080px] md:mt-12">
      <SlashHeading>
        {before}
        <span className="text-brand">{emphasis}</span>
      </SlashHeading>
    </div>
  )
}

function Problem() {
  const { title, paragraphs } = research.problem
  return (
    <div className="mt-16 lg:mt-24">
      <div className="lg:grid lg:grid-cols-2 lg:border-t lg:border-l lg:border-line">
        <Reveal stagger={0.08} className="flex flex-col gap-4 lg:gap-5 lg:border-r lg:border-b lg:border-line lg:p-10">
          <SubLabel>{'// 1.1'}</SubLabel>
          <h3 className="mb-0 text-[26px] leading-[1.15] font-medium tracking-[-0.05em] lg:mb-2 lg:text-[32px]">{title}</h3>
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="text-base leading-[1.5] tracking-[-0.02em] text-body lg:text-[17px]">
              {p}
            </p>
          ))}
        </Reveal>
        <Fig02 className="mt-6 lg:mt-0 lg:border-t-0 lg:border-l-0" />
      </div>
      <FigCaption>Fig.02 — A sequence of tokens vs. a living system of parts, processes and decisions</FigCaption>
    </div>
  )
}

function Build() {
  const { title, lead, rest } = research.build
  return (
    <div className="mt-20 lg:mt-[120px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex flex-col gap-4 lg:gap-6">
          <SubLabel>{'// 1.2 What we build'}</SubLabel>
          <SlashHeading>{title}</SlashHeading>
        </div>
        <PrimaryButton href={sky001Cta.primary.href} className="order-last mt-0 w-full md:w-auto md:self-start lg:order-none lg:shrink-0">
          {sky001Cta.primary.label}
        </PrimaryButton>
        <Reveal as="p" className="max-w-[820px] text-[17px] leading-[1.5] tracking-[-0.02em] text-body lg:hidden">
          {lead} {rest}
        </Reveal>
      </div>
      <Reveal as="p" className="mt-8 hidden max-w-[820px] text-xl leading-[1.45] tracking-[-0.03em] text-body lg:block">
        {lead} {rest}
      </Reveal>

      <div className="mt-8 lg:mt-16">
        <StepCards />
      </div>

      <Fig03 className="mt-6 lg:mt-12" />
      <FigCaption>Fig.03 — One model learns the latent space across functions, simulates cause and effect, and plans inside guardrails</FigCaption>
    </div>
  )
}

function Pareto() {
  const { title, body, axes } = research.pareto
  return (
    <div className="mt-20 grid items-start gap-6 lg:mt-[120px] lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col gap-4 lg:gap-6">
        <SubLabel>{'// 1.3'}</SubLabel>
        <SlashHeading>{title}</SlashHeading>
        <Reveal as="p" className="text-[17px] leading-[1.5] tracking-[-0.02em] text-body lg:text-lg">
          {body}
        </Reveal>
        <Reveal as="ul" stagger={0.1} className="grid grid-cols-3 border-t border-l border-line lg:mt-4">
          {axes.map((axis, i) => (
            <li key={axis} className="group flex h-[88px] flex-col justify-between border-r border-b border-line p-3 transition-colors duration-300 hover:bg-panel lg:h-32 lg:p-5">
              <span className="font-mono text-[11px] font-medium text-faint lg:text-xs">0{i + 1}</span>
              <span className="text-[22px] tracking-[-0.05em] transition-colors duration-300 group-hover:text-brand lg:text-[32px]">{axis}</span>
            </li>
          ))}
        </Reveal>
        <span className="font-mono text-xs font-medium tracking-[-0.02em] text-brand uppercase lg:text-[13px]">■ No longer traded against each other</span>
      </div>
      <Fig04 className="mt-2 lg:mt-0" />
    </div>
  )
}

function Matters() {
  const { statement, infrastructure, body, sectors } = research.matters
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  useScrambleIn(ref, { selector: 'h2 [data-scramble-in]', delay: 0.4, duration: 1.1 })

  return (
    <div ref={ref} className="mt-20 lg:mt-[120px]">
      <div className="flex flex-col gap-4 lg:gap-6">
        <SubLabel>{'// 1.4 Where it matters'}</SubLabel>
        <SplitReveal as="h2" className="max-w-[1060px] text-[34px] leading-[1.12] font-normal tracking-[-0.06em] md:text-[48px] md:leading-[1.1] lg:text-[56px]">
          <Slash side="start" />
          {statement.before}
          <PixelWord>{statement.emphasis}</PixelWord>
          {statement.after}
          <Slash side="end" />
        </SplitReveal>
        <Reveal stagger={0.1} className="grid gap-4 md:mt-4 md:grid-cols-2 md:gap-12">
          <p className="text-[17px] leading-[1.5] tracking-[-0.02em] text-body lg:text-lg">{infrastructure}</p>
          <p className="text-[17px] leading-[1.5] tracking-[-0.02em] text-body lg:text-lg">{body}</p>
        </Reveal>
      </div>

      <Reveal as="ul" stagger={0.07} className="mt-8 grid grid-cols-2 border-t border-l border-line md:grid-cols-5 lg:mt-14">
        {sectors.map((sector, i) => {
          const on = i === active
          const last = i === sectors.length - 1
          return (
            <li key={sector} className={`relative border-r border-b border-line ${last ? 'col-span-2 md:col-span-1' : ''}`}>
              <button
                type="button"
                aria-pressed={on}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`flex w-full cursor-pointer text-left transition-colors duration-300 ${
                  last ? 'h-[110px] flex-row items-center justify-between md:h-[220px] md:flex-col md:items-stretch lg:h-[300px]' : 'h-[150px] flex-col justify-between md:h-[220px] lg:h-[300px]'
                } p-4 md:p-5 lg:p-7 ${on ? 'text-brand' : 'text-ink'}`}
              >
                <span className={`flex items-start justify-between ${last ? 'gap-4 max-md:items-center' : ''}`}>
                  <PixelIcon name={SECTOR_ICONS[i]} active={on} className="size-[50px] lg:size-20" />
                  <span className={`text-sm tracking-[-0.04em] lg:text-lg ${on ? 'text-brand' : 'text-muted'} ${last ? 'max-md:hidden' : ''}`}>{`//S.0${i + 1}`}</span>
                  {last && <span className="text-xl font-medium tracking-[-0.05em] md:hidden">{sector}</span>}
                </span>
                <span className={`text-xl font-medium tracking-[-0.05em] lg:text-[26px] ${last ? 'max-md:hidden' : ''}`}>{sector}</span>
                {last && <span className={`text-sm tracking-[-0.04em] md:hidden ${on ? 'text-brand' : 'text-muted'}`}>{`//S.0${i + 1}`}</span>}
              </button>
              <span aria-hidden="true" className={`absolute inset-x-0 -bottom-px block h-1 origin-left bg-brand transition-transform duration-500 ease-out-expo ${on ? 'scale-x-100' : 'scale-x-0'}`} />
            </li>
          )
        })}
      </Reveal>
    </div>
  )
}
