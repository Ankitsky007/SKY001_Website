import { backers, hero } from '@skyfall/core'
import { gsap, prefersReducedMotion, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { lazy, Suspense, useRef, useState } from 'react'
import { SeaFallback } from '../figures/sea'
import { useLiveScene } from '../lib/live'
import { Bracket, ButtonLink, LABEL } from '../lib/ui'

const HeroSea = lazy(() => import('../scenes/HeroSea'))

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const sea = useRef<HTMLDivElement>(null)
  const live = useLiveScene(sea)
  const [ready, setReady] = useState(false)

  // Intro: eyebrow, lede and CTA scrim rise after the headline starts; the sea fades up from below.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-intro]', { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.12, delay: 0.25 })
      gsap.from(sea.current, { autoAlpha: 0, yPercent: 8, duration: 1.8, delay: 0.1, ease: 'power3.out' })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative flex min-h-[calc(100svh-60px)] flex-col overflow-hidden bg-brand text-white lg:min-h-[max(760px,calc(100svh-64px))]">
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 pt-8 md:px-12 md:pt-12 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:pt-14 xl:px-[116px]">
        <div className="flex max-w-[780px] flex-col items-start gap-5 lg:gap-6">
          <span data-intro className="bg-white/10 px-2 py-[5px] lg:px-2.5 lg:py-1.5">
            {/* Eyebrow is not in content.ts (storyboard copy). */}
            <Bracket parts={['Research lab', 'Engineering World Models']} />
          </span>
          <SplitReveal
            as="h1"
            immediate
            className="text-[44px] leading-[1.04] font-normal tracking-[-0.035em] text-balance sm:text-[56px] lg:text-[76px]"
          >
            {hero.title}
          </SplitReveal>
        </div>
        <div className="flex w-full flex-col gap-5 md:max-w-[560px] lg:w-[380px] lg:shrink-0 lg:gap-8 lg:pt-[52px]">
          <p data-intro className="text-lg leading-[1.35] tracking-[-0.015em] lg:text-[22px] lg:leading-[1.32] lg:tracking-[-0.02em]">
            {hero.lede}
          </p>
          <div data-intro className="flex flex-col-reverse gap-1.5 bg-black/12 p-1.5 backdrop-blur-sm sm:flex-row">
            <ButtonLink href={hero.secondaryCta.href} variant="ghost" className="flex-1">
              {hero.secondaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.primaryCta.href} arrow className="flex-1">
              {hero.primaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div ref={sea} aria-hidden="true" className="relative mt-auto h-[300px] shrink-0 sm:h-[360px] md:h-[400px] lg:h-[340px]">
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : ''}`}>
          <SeaFallback />
        </div>
        {live && (
          <Suspense fallback={null}>
            <HeroSea onReady={() => setReady(true)} />
          </Suspense>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:bottom-6 xl:px-[116px]">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-center sm:gap-7">
          {/* "[ Backed by ]" is storyboard copy; names from backers.investors. */}
          <span className={LABEL}>[ Backed by ]</span>
          <span className="flex flex-wrap gap-x-4 gap-y-1 text-[15px] font-medium tracking-[-0.02em] sm:gap-x-7 lg:text-[17px]">
            {backers.investors.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}
