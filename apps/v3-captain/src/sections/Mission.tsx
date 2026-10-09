import { research } from '@skyfall/core'
import { SplitReveal } from '@skyfall/core/motion'
import { GUTTER, SectionHead, WRAP } from '../lib/ui'

/** 01 Research & vision: section header and the mission statement. */
export function Mission() {
  return (
    <section className={`${WRAP} ${GUTTER} flex flex-col gap-6 pt-16 pb-12 md:pt-24 md:pb-20 lg:gap-8 lg:pt-30 lg:pb-24`}>
      <SectionHead num="01" label="Research & vision" of="01 / 03" />
      <SplitReveal as="h2" className="max-w-[1100px] text-[30px] leading-[1.18] font-normal tracking-[-0.03em] md:text-[40px] lg:text-[48px] lg:leading-[1.14]">
        {research.mission.before}
        <span className="text-brand">{research.mission.emphasis}</span>
      </SplitReveal>
    </section>
  )
}
