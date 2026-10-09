import { backers } from '@skyfall/core'
import { Reveal, SplitReveal } from '@skyfall/core/motion'
import { GUTTER, LABEL, SectionHead, WRAP } from '../lib/ui'

// Investor and advisor marks stay typeset placeholders until official logo files arrive.
const WEIGHT: Record<string, string> = {
  Fidelity: 'text-[22px] font-semibold tracking-[-0.04em] lg:text-[28px]',
  M13: 'text-[24px] font-semibold tracking-[-0.04em] lg:text-[30px]',
}

/** 03 Investors & advisors. */
export function Backers() {
  return (
    <section aria-label="Investors and advisors" className="border-t border-line">
      <div className={`${WRAP} ${GUTTER} flex flex-col gap-6 pt-16 pb-10 md:pt-24 md:pb-16 lg:gap-8 lg:pt-30`}>
        <SectionHead num="03" label="Investors & advisors" of="03 / 03" />
        <SplitReveal as="h2" className="max-w-[900px] text-[30px] leading-[1.18] font-normal tracking-[-0.03em] md:text-[40px] lg:text-[48px] lg:leading-[1.14]">
          {backers.title}
        </SplitReveal>
      </div>

      <div className={`${WRAP} ${GUTTER} flex flex-col gap-3.5 pb-12 lg:gap-4 lg:pb-16`}>
        {/* "[ Investors ]" / "[ Advisors ]" are storyboard labels. */}
        <span className={LABEL}>[ Investors ]</span>
        <Reveal stagger={0.06} className="grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
          {backers.investors.map((name, i) => (
            <a
              key={name}
              href="#"
              className="group flex h-28 flex-col border-r border-b border-line p-3 transition-colors duration-150 hover:bg-pale lg:h-40 lg:p-4"
            >
              <span className="flex justify-between font-mono text-[10px] font-medium tracking-[0.04em] text-muted transition-colors group-hover:text-brand lg:text-[11px]">
                [ I.0{i + 1} ]
                <span aria-hidden="true" className="translate-y-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              </span>
              <span
                className={`flex flex-1 items-center justify-center text-center text-body transition-colors group-hover:text-brand ${
                  WEIGHT[name] ?? 'text-[17px] font-medium tracking-[-0.03em] lg:text-2xl'
                }`}
              >
                {name}
              </span>
            </a>
          ))}
        </Reveal>
      </div>

      <div className={`${WRAP} ${GUTTER} flex flex-col gap-3.5 pb-16 lg:gap-4 lg:pb-30`}>
        <span className={LABEL}>[ Advisors ]</span>
        <Reveal stagger={0.08} className="border-t border-line">
          {backers.advisors.map((a, i) => (
            <div
              key={a.name}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3.5 border-b border-line px-4 py-5 transition-colors duration-150 hover:bg-pale lg:flex lg:h-28 lg:gap-8 lg:px-6 lg:py-0"
            >
              <div className="flex flex-col gap-1 lg:contents">
                <span className="font-mono text-[10px] font-medium tracking-[0.04em] text-muted transition-colors group-hover:text-brand lg:w-20 lg:text-xs">
                  [ A.0{i + 1} ]
                </span>
                <span className="text-[26px] tracking-[-0.035em] transition-colors group-hover:text-brand lg:w-[420px] lg:text-[34px]">{a.name}</span>
              </div>
              <a
                href={a.x}
                aria-label={`${a.name} on X`}
                className="col-start-2 row-start-1 flex size-11 items-center justify-center bg-pale font-mono text-[13px] font-semibold text-ink transition-colors group-hover:bg-brand group-hover:text-white lg:order-last"
              >
                X↗
              </a>
              <div className="col-span-2 flex flex-wrap gap-1.5 lg:flex-1 lg:gap-2">
                {a.affiliations.map((aff) => (
                  <span
                    key={aff}
                    className="flex h-9 items-center bg-chip px-2.5 text-sm font-medium text-body transition-colors group-hover:bg-white lg:h-10 lg:px-3 lg:text-[15px]"
                  >
                    {aff}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
