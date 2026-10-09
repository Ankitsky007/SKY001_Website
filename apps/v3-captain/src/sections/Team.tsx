import { team } from '@skyfall/core'
import { Reveal, SplitReveal } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { ButtonLink, CountUp, GUTTER, LABEL, SectionHead, WRAP } from '../lib/ui'

function Avatar() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="block size-[200px] lg:size-[240px]">
      <g className="fill-grey transition-colors duration-300 group-hover:fill-brand">
        <circle cx="100" cy="80" r="36" />
        <path d="M24 200 C 24 136, 176 136, 176 200 Z" />
      </g>
    </svg>
  )
}

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={flip ? 'rotate-180' : ''}>
      <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  )
}

/** 02 Founding team: story, founder cards (swipe on phones), big stats, experience strip. */
export function Team() {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = team.founders.length

  const onScroll = () => {
    const el = track.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    setIndex(Math.min(count - 1, Math.round(el.scrollLeft / (card.offsetWidth + 12))))
  }
  const go = (i: number) => {
    const el = track.current
    const card = el?.children[i] as HTMLElement | undefined
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 24, behavior: 'smooth' })
  }

  return (
    <section id="team" className="scroll-mt-16 border-t border-line">
      <div className={`${WRAP} ${GUTTER} flex flex-col gap-6 pt-16 pb-10 md:pt-24 md:pb-16 lg:gap-8 lg:pt-30`}>
        <SectionHead num="02" label="Founding team" of="02 / 03" />
        <div className="flex items-end justify-between gap-12">
          <SplitReveal as="h2" className="text-[40px] leading-none font-normal tracking-[-0.035em] md:text-[52px] lg:text-[64px]">
            {team.title}
          </SplitReveal>
          <ButtonLink href={team.careersCta.href} variant="pale" arrow className="hidden min-w-[180px] md:flex">
            {team.careersCta.label}
          </ButtonLink>
        </div>
        <Reveal as="p" className="max-w-[940px] text-base leading-normal text-body lg:text-xl lg:tracking-[-0.01em]">
          {team.story}
        </Reveal>
        <ButtonLink href={team.careersCta.href} variant="pale" arrow className="md:hidden">
          {team.careersCta.label}
        </ButtonLink>
      </div>

      <div className={`${WRAP} flex flex-col gap-4 pb-14 md:px-12 md:pb-24 lg:pb-30 xl:px-[116px]`}>
        <div
          ref={track}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 [scrollbar-width:none] md:grid md:snap-none md:grid-cols-3 md:gap-0 md:overflow-visible md:border-t md:border-l md:border-line md:px-0"
        >
          {team.founders.map((f, i) => (
            <Reveal
              as="article"
              key={f.name}
              delay={i * 0.08}
              className="group flex w-[300px] shrink-0 snap-start flex-col border border-line transition-colors duration-300 hover:bg-pale md:w-auto md:border-t-0 md:border-l-0"
            >
              <div className="dot-grid relative flex h-[300px] items-end justify-center bg-soft transition-colors duration-300 group-hover:bg-pale-2 group-hover:dot-grid-blue lg:h-[380px]">
                <span className="absolute top-3 left-3 font-mono text-[10px] font-medium tracking-[0.04em] text-muted transition-colors group-hover:text-brand lg:top-4 lg:left-4 lg:text-[11px]">
                  [ F.0{i + 1} · DUMMY PHOTO ]
                </span>
                <Avatar />
              </div>
              <div className="flex flex-col gap-1.5 p-5 lg:gap-2 lg:p-6">
                <h3 className="text-[22px] font-normal tracking-[-0.03em] transition-colors group-hover:text-brand lg:text-[26px]">{f.name}</h3>
                <span className="text-[15px] text-muted lg:text-base">{f.role}</span>
                <span className={`mt-2.5 text-body transition-colors group-hover:text-brand lg:mt-3 ${LABEL}`}>[ {f.note} ]</span>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex items-center justify-between px-6 md:hidden">
          <span className="font-mono text-[10px] font-medium tracking-[0.04em] text-muted" aria-live="polite">
            [ 0{index + 1} / 0{count} ] SWIPE
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="Previous founder"
              disabled={index === 0}
              onClick={() => go(index - 1)}
              className="flex size-11 cursor-pointer items-center justify-center border border-line bg-white text-ink transition-colors hover:bg-pale disabled:cursor-default disabled:text-grey disabled:hover:bg-white"
            >
              <Arrow flip />
            </button>
            <button
              type="button"
              aria-label="Next founder"
              disabled={index === count - 1}
              onClick={() => go(index + 1)}
              className="flex size-11 cursor-pointer items-center justify-center bg-brand text-white transition-colors hover:bg-brand-deep active:translate-y-px disabled:cursor-default disabled:border disabled:border-line disabled:bg-white disabled:text-grey"
            >
              <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div id="careers" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-5 px-6 pt-14 md:px-12 md:pt-20 lg:gap-7 lg:border-r lg:border-line lg:py-24 lg:pr-16 xl:pl-[116px]">
            {/* Storyboard label, not in content.ts. */}
            <span className={LABEL}>[ One research team ]</span>
            <SplitReveal as="p" className="text-[22px] leading-[1.32] tracking-[-0.02em] lg:text-[28px] lg:leading-[1.3]">
              {team.experience}
            </SplitReveal>
            <Reveal as="p" className="text-[17px] leading-[1.45] text-muted lg:text-xl lg:tracking-[-0.01em]">
              {team.researchTeam}
            </Reveal>
          </div>
          <dl className="mx-6 mt-8 mb-0 flex flex-col border-t border-line md:mx-12 lg:m-0 lg:border-t-0">
            {team.stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse justify-center gap-2.5 py-7 lg:h-[260px] lg:gap-3.5 lg:py-0 lg:pr-12 lg:pl-16 xl:pr-[116px] ${
                  i < team.stats.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <dt className={`${LABEL} text-brand`}>[ {s.label} ]</dt>
                <dd className="overflow-clip">
                  <CountUp value={s.value} className="block text-[88px] leading-[0.9] tracking-[-0.05em] text-brand tabular-nums md:text-[120px] lg:text-[140px]" />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-line">
        <div className={`${WRAP} ${GUTTER} flex flex-col gap-5 py-10 lg:items-center lg:gap-7 lg:py-14`}>
          {/* Storyboard labels, not in content.ts. */}
          <span className={LABEL}>[ Our teams bring experience from ]</span>
          <Reveal stagger={0.05} className="flex flex-wrap gap-x-7 gap-y-3.5 text-lg font-medium tracking-[-0.02em] text-body lg:justify-center lg:gap-x-14 lg:text-[21px]">
            {team.experienceFrom.map((name) => (
              <span key={name} className="transition-colors hover:text-brand">
                {name}
              </span>
            ))}
          </Reveal>
          <span className="font-mono text-[10px] tracking-[0.04em] text-muted lg:text-[11px]">LOGOS ARE PLACEHOLDERS · RENDERED MONO</span>
        </div>
      </div>
    </section>
  )
}
