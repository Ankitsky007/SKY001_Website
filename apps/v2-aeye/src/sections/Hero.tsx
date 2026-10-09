import { backers, hero, SkyfallLogo } from '@skyfall/core'
import { gsap, prefersReducedMotion, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { HeroGrid } from '../components/HeroGrid'
import { PixelWord, PrimaryButton, UnderlineLink } from '../components/ui'
import { pad2, splitAccent, wordmarkClass } from '../lib/text'
import { useScrambleIn } from '../lib/useScrambleIn'

const ACCENT = 'Post-Monolithic'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const [before, accent, after] = splitAccent(hero.title, ACCENT)

  useScrambleIn(root, { immediate: true, delay: 0.55, duration: 1.2, selector: 'h1 [data-scramble-in]' })

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ defaults: { duration: 1.1, ease: 'expo.out' } })
      tl.from('[data-hero-chrome]', { autoAlpha: 0, y: 12, stagger: 0.08 }, 0.15)
        .from('[data-hero-rule]', { scaleX: 0, transformOrigin: 'left center', duration: 1.4 }, 0.5)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 20, stagger: 0.08 }, 0.6)
        .from('[data-backer]', { autoAlpha: 0, y: 16, stagger: 0.06 }, 0.8)
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} aria-label="Introduction">
      <HeroGrid>
        <div className="pointer-events-none absolute inset-0">
          <div className="wrap relative h-full">
            <div data-hero-chrome className="absolute top-[168px] left-10 hidden items-center gap-4 text-white md:flex">
              <SkyfallLogo width={226} />
              <span className="bg-night-mid px-2 py-[5px] font-mono text-[13px] font-medium tracking-[-0.02em] text-line uppercase">Research lab</span>
            </div>
            <a
              data-hero-chrome
              href={hero.secondaryCta.href}
              className="pointer-events-auto absolute bottom-0 left-6 flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-[-0.02em] text-faint uppercase transition-colors hover:text-white md:bottom-4 md:left-10 md:gap-2 md:text-[13px]"
            >
              Scroll for more <span aria-hidden="true">↓</span>
            </a>
            <p data-hero-chrome className="absolute right-10 bottom-7 hidden font-mono text-[11px] tracking-[0.02em] text-muted uppercase lg:block">
              Fig.01 · one decision ripples across six functions
            </p>
          </div>
        </div>
      </HeroGrid>

      <div className="wrap pt-12 md:pt-16 lg:pt-20">
        <SplitReveal as="h1" immediate className="text-[clamp(30px,10vw,40px)] leading-[1.1] font-normal tracking-[-0.06em] md:text-[64px] lg:text-[80px]">
          {before}
          <PixelWord caret>{accent}</PixelWord>
          {after}
        </SplitReveal>

        <div className="relative mt-6 flex flex-col gap-8 md:mt-12 md:pt-8 lg:mt-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <span data-hero-rule aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-px bg-line md:block" />
          <p data-hero-fade className="max-w-[520px] text-lg leading-[1.45] tracking-[-0.03em] text-body md:text-xl md:leading-[1.4]">
            {hero.lede}
          </p>
          <div data-hero-fade className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <PrimaryButton href={hero.primaryCta.href}>{hero.primaryCta.label}</PrimaryButton>
            <UnderlineLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</UnderlineLink>
          </div>
        </div>
      </div>

      {/* Backed-by strip */}
      <div className="wrap mt-12 lg:mt-14">
        <div className="flex h-11 items-center font-mono text-xs font-medium tracking-[-0.02em] text-muted uppercase lg:hidden">[ Backed by ]</div>
        <ul className="grid grid-cols-2 border-t border-l border-line md:grid-cols-4 lg:grid-cols-5">
          <li data-backer className="hidden h-32 flex-col justify-center gap-1.5 border-r border-b border-line px-6 font-mono text-[13px] font-medium tracking-[-0.02em] text-muted uppercase lg:flex">
            <span>[ Backed by ]</span>
            <span className="text-faint">
              I.01 — I.{pad2(backers.investors.length)}
            </span>
          </li>
          {backers.investors.map((name) => (
            <li
              data-backer
              key={name}
              className="flex h-24 items-center justify-center border-r border-b border-line px-3 text-center text-[17px] text-body transition-colors duration-300 hover:text-brand md:h-28 md:text-[19px] lg:h-32 lg:text-[22px]"
            >
              <span className={wordmarkClass(name)}>{name}</span>
            </li>
          ))}
        </ul>
        <div aria-hidden="true" className="dots h-10 border-x border-line [background-size:12px_12px] lg:h-12 lg:[background-size:14px_14px]" />
      </div>
    </section>
  )
}
