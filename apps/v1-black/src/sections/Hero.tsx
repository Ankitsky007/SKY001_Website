import { useRef } from 'react'
import { backers, hero } from '@skyfall/core'
import { SplitReveal } from '@skyfall/core/motion'
import { CtaLink } from '../components/ui'
import { HeroDiagramDesktop, HeroDiagramMobile, HeroDiagramTablet } from '../figures/HeroDiagram'
import { gsap, MOTION_OK, useGSAP } from '../lib/motion'

/** Hero A (chosen): headline, lede and CTAs over the animated "one decision ripples" line diagram. */
export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-hero-in]', { autoAlpha: 0, y: 16, duration: 1.1, stagger: 0.08, delay: 0.45, ease: 'expo.out' })
        gsap.from('[data-hero-chip]', { autoAlpha: 0, x: -10, duration: 0.9, delay: 0.1, ease: 'expo.out' })
        gsap.from('[data-hero-fig]', { autoAlpha: 0, duration: 1.4, delay: 0.2, ease: 'power2.out' })
        gsap.from('[data-hero-strip] > *', { autoAlpha: 0, y: 8, duration: 0.8, stagger: 0.06, delay: 0.9, ease: 'expo.out' })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[calc(100svh-56px)] flex-col md:min-h-[calc(100svh-64px)] lg:min-h-[calc(100svh-72px)]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-7 md:px-10 md:pt-14 lg:flex lg:items-start lg:justify-between lg:gap-16 lg:px-16 lg:pt-16">
        <div className="flex flex-col gap-[18px] md:gap-6 lg:max-w-[800px] lg:gap-7">
          {/* Decorative lab tag from the board (not in content.ts). */}
          <div
            data-hero-chip
            className="flex items-center gap-2 self-start border border-rule-2 bg-surface px-2 py-[5px] font-mono text-[11px] font-medium tracking-[0.04em] text-body uppercase md:px-2.5 md:py-1.5 md:text-xs"
          >
            [<span aria-hidden className="block size-[5px] bg-brand" />
            Skyfall AI · Research lab ]
          </div>
          <SplitReveal
            as="h1"
            immediate
            by="lines"
            delay={0.15}
            className="text-[44px] leading-[1.05] font-normal tracking-[-0.05em] text-balance md:max-w-[720px] md:text-[64px] lg:text-[clamp(56px,5.56vw,80px)]"
          >
            {hero.title}
          </SplitReveal>
        </div>

        <div className="mt-[18px] md:mt-6 lg:mt-0 lg:w-[360px] lg:flex-none lg:pt-[52px] xl:w-[400px]">
          <div className="flex flex-col gap-[18px] md:flex-row md:items-end md:justify-between md:gap-8 lg:flex-col lg:items-stretch lg:gap-7">
            <p data-hero-in className="text-[17px] leading-[1.45] text-body md:max-w-[380px] md:text-[19px] lg:text-xl lg:tracking-[-0.01em]">
              {hero.lede}
            </p>
            <div data-hero-in className="flex flex-col gap-2 md:flex-row md:gap-3">
              <CtaLink href={hero.primaryCta.href} block className="md:hidden lg:inline-flex lg:w-auto lg:justify-start">
                {hero.primaryCta.label}
              </CtaLink>
              <CtaLink href={hero.secondaryCta.href} variant="outline" className="w-full md:w-auto">
                {hero.secondaryCta.label}
              </CtaLink>
            </div>
          </div>
        </div>
      </div>

      {/* FIG.01: three drawings, one per board; each runs its loop only at its own breakpoint. */}
      <div data-hero-fig className="mt-auto w-full pt-6 md:pt-10 lg:pt-8">
        <HeroDiagramMobile className="block h-auto w-full md:hidden" />
        <div className="hidden px-10 pb-6 md:block lg:hidden">
          <HeroDiagramTablet className="mx-auto block h-auto w-full max-w-[754px]" />
        </div>
        <HeroDiagramDesktop className="mx-auto hidden h-auto w-full max-w-[1600px] lg:mb-3 lg:block" />
      </div>

      <div
        data-hero-strip
        className="hidden min-h-[52px] items-center justify-center gap-6 border-t border-[#1A1A1E] px-6 font-mono text-[11px] font-medium tracking-[0.04em] text-meta uppercase md:flex lg:gap-10 lg:text-xs"
      >
        <span>[ Backed by ]</span>
        {backers.investors.map((name) => (
          <span key={name} className="text-soft transition-colors duration-300 hover:text-ink">
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
