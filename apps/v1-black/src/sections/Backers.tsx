import { backers } from '@skyfall/core'
import { Reveal, SplitReveal } from '@skyfall/core/motion'
import { Eyebrow, Frame } from '../components/ui'

const label = 'font-mono text-[11px] tracking-[0.04em] text-meta uppercase md:text-xs'

/** 03 · Investors & advisors. Logos stay typeset placeholders until the official SVGs are sourced. */
export function Backers() {
  return (
    <section id="backers" aria-label="Investors and advisors" className="border-t border-[#1A1A1E]">
      <Frame className="flex flex-col gap-12 pt-16 md:gap-16 md:pt-24 lg:gap-24 lg:pt-[120px]">
        <div className="flex flex-col gap-5 md:gap-6 lg:gap-8">
          <Eyebrow index={3} label="Investors & advisors" />
          <SplitReveal
            as="h2"
            className="m-0 text-[32px] leading-[1.12] font-normal tracking-[-0.04em] md:text-[44px] md:leading-[1.1] md:tracking-[-0.045em] lg:max-w-[940px] lg:text-[56px]"
          >
            {backers.title}
          </SplitReveal>
        </div>

        <div className="flex flex-col gap-3.5 md:gap-4 lg:gap-6">
          <span className={label}>Investors</span>
          <Reveal
            as="ul"
            stagger={0.07}
            y={14}
            className="m-0 grid list-none grid-cols-2 border-t border-l border-rule p-0 text-soft md:grid-cols-4"
          >
            {backers.investors.map((name, i) => (
              <li
                key={name}
                className="group relative flex h-[110px] items-center justify-center border-r border-b border-rule px-3 text-center transition-colors duration-300 hover:bg-surface hover:text-ink md:h-[140px] lg:h-[180px]"
              >
                <span className="absolute top-3.5 left-4 hidden font-mono text-[11px] tracking-[0.06em] text-dim transition-colors group-hover:text-brand-lift lg:block">
                  I.{String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={
                    name.length <= 8
                      ? 'text-[22px] font-semibold tracking-[-0.03em] md:text-2xl lg:text-[32px]'
                      : 'text-[17px] font-medium tracking-[-0.02em] md:text-lg lg:text-[26px]'
                  }
                >
                  {name}
                </span>
              </li>
            ))}
          </Reveal>
        </div>

        <div className="flex flex-col gap-3.5 md:gap-4 lg:gap-6">
          <span className={label}>Advisors</span>
          <Reveal as="ul" stagger={0.1} className="m-0 flex list-none flex-col border-b border-rule p-0">
            {backers.advisors.map((a) => (
              <li
                key={a.name}
                className="flex flex-col gap-4 border-t border-rule py-6 md:flex-row md:items-center md:justify-between md:gap-6 md:py-7 lg:gap-8 lg:py-8"
              >
                <a
                  href={a.x}
                  aria-label={`${a.name} on X`}
                  className="group flex min-h-11 items-baseline justify-between gap-3 text-ink md:justify-start lg:gap-4"
                >
                  <span className="text-[30px] leading-[1.1] tracking-[-0.04em] transition-colors duration-300 group-hover:text-brand-lift md:text-4xl lg:text-5xl">
                    {a.name}
                  </span>
                  <span className="font-mono text-xs text-brand-lift transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:text-sm">
                    ↗ X
                  </span>
                </a>
                <ul className="m-0 flex list-none gap-1.5 p-0 lg:gap-2" aria-label={`${a.name} affiliations`}>
                  {a.affiliations.map((org) => (
                    <li
                      key={org}
                      className="flex size-16 items-center justify-center border border-rule-2 px-1 text-center font-mono text-[9px] font-semibold tracking-[0.04em] text-soft uppercase transition-colors duration-300 hover:border-rule-3 hover:text-ink md:size-[68px] md:text-[10px] lg:size-[88px] lg:text-xs"
                    >
                      {org}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Reveal>
        </div>
      </Frame>
    </section>
  )
}
