import { campusFlow, hero, site } from '@skyfall/core'
import { Reveal, useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef } from 'react'
import { useCampusTone } from '../lib/fx'
import { ButtonLink, LABEL, TextLink } from '../lib/ui'
import { CAMPUS_DARK, CAMPUS_LIGHT, startCampus } from '../scenes/campus'

/**
 * Front-page hero: the hero copy on the left and, filling the rest, the enterprise campus, an
 * animated isometric drawing of a business running itself: departments hand work to each
 * other and every hand-off adds to MRR on the floor at the front. Hover a department for its status;
 * click one to fly in. On phones the copy stacks above the campus. Reduced motion shows one
 * finished frame. `?campus=dark` (or the review picker) switches to the dark version.
 */
export function CampusHero({ launchHref, researchHref }: { launchHref: string; researchHref: string }) {
  const reduced = useReducedMotion()
  const tone = useCampusTone()
  const dark = tone === 'dark'
  const canvas = useRef<HTMLCanvasElement>(null)
  const copy = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cv = canvas.current
    if (!cv || !cv.getContext) return
    return startCampus(cv, {
      palette: dark ? CAMPUS_DARK : CAMPUS_LIGHT,
      still: reduced,
      textRight: () => {
        const c = copy.current
        if (!c || window.innerWidth < 1024) return 0
        return c.getBoundingClientRect().right - cv.getBoundingClientRect().left
      },
    })
  }, [dark, reduced])

  return (
    <section id="top" className={`relative flex flex-col overflow-hidden lg:block lg:h-[min(100svh,940px)] lg:min-h-[720px] ${dark ? 'bg-[#07080A] text-[#ECEDEF]' : 'bg-paper text-ink'}`}>
      <canvas ref={canvas} role="img" aria-label={campusFlow.alt} className="relative order-2 block h-[440px] w-full sm:h-[560px] lg:absolute lg:inset-0 lg:h-full" />
      <div ref={copy} className="pointer-events-none relative z-10 order-1 px-6 pt-8 sm:px-10 sm:pt-14 lg:absolute lg:top-1/2 lg:left-[clamp(24px,4.4vw,64px)] lg:w-[min(44vw,680px)] lg:-translate-y-1/2 lg:p-0">
        {/* the copy rises in line by line on load, like the reveals further down the page */}
        <Reveal stagger={0.12} delay={0.15}>
          <p className={`${LABEL} ${dark ? 'text-brand-lift' : 'text-brand'}`}>{site.tagline}</p>
          <h1 className="mt-3 text-[44px] leading-[0.92] font-medium tracking-[-0.045em] text-balance sm:text-[64px] lg:text-[clamp(48px,5vw,80px)]">{hero.title.replace('Post-Monolithic', 'Post‑Monolithic')}</h1>
          <p className={`mt-4 max-w-[40ch] text-[clamp(15px,1.25vw,17px)] leading-normal ${dark ? 'text-[#8B90A0]' : 'text-body'}`}>{hero.lede}</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
            <ButtonLink href={launchHref} tone={dark ? 'light' : 'dark'}>
              {hero.primaryCta.label}
            </ButtonLink>
            <TextLink href={researchHref} tone={dark ? 'dark' : 'light'}>
              {hero.secondaryCta.label}
            </TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
