import { sky001Cta } from '@skyfall/core'
import { gsap, prefersReducedMotion, Reveal, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { ButtonLink, LABEL } from '../lib/ui'

/** SKY-001 CTA: blue band, masked dot grid drifting with scroll, scrim with two buttons. */
export function Sky001Cta() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '[data-dots]',
        { backgroundPosition: '0px 28px' },
        { backgroundPosition: '0px -28px', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="sky-001" className="relative scroll-mt-16 overflow-hidden bg-brand text-white">
      <div
        data-dots
        aria-hidden="true"
        className="dot-grid-white absolute inset-0 [mask-image:linear-gradient(180deg,transparent_20%,#000_100%)] lg:[mask-image:linear-gradient(90deg,transparent_30%,#000_100%)]"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-6 py-14 md:px-12 md:py-20 lg:min-h-[560px] lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-16 xl:px-[116px]">
        <div className="flex flex-col items-start gap-6 lg:gap-7">
          <span className={`bg-white/10 px-2 py-[5px] lg:px-2.5 lg:py-1.5 ${LABEL}`}>[ {sky001Cta.eyebrow} ]</span>
          <SplitReveal as="h2" className="max-w-[300px] text-4xl leading-[1.08] font-normal tracking-[-0.035em] sm:max-w-[560px] md:text-5xl lg:max-w-[820px] lg:text-[64px] lg:leading-[1.05]">
            {sky001Cta.title}
          </SplitReveal>
        </div>
        <Reveal delay={0.2} className="flex w-full flex-col gap-1.5 bg-black/12 p-1.5 backdrop-blur-sm sm:w-[420px] sm:flex-row-reverse lg:w-[380px] lg:shrink-0">
          <ButtonLink href={sky001Cta.primary.href} arrow className="flex-1">
            {sky001Cta.primary.label}
          </ButtonLink>
          <ButtonLink href={sky001Cta.secondary.href} variant="ghost" className="flex-1">
            {sky001Cta.secondary.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
