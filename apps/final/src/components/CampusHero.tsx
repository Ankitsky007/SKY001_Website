import { campus, hero, site } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef, useState } from 'react'
import { useCampusTone } from '../lib/fx'
import { ButtonLink, LABEL, TextLink } from '../lib/ui'
import { CAMPUS_DARK, CAMPUS_LIGHT, startCampus } from '../scenes/campus'

/**
 * Front-page hero: the hero copy on the left and, filling the rest, the enterprise campus, an
 * animated isometric drawing of a business running itself. Hover a department for its status;
 * click one to fly in. On phones the copy stacks above the campus. Reduced motion shows one
 * finished frame. `?campus=dark` (or the review picker) switches to the dark version.
 */
export function CampusHero({ launchHref }: { launchHref: string }) {
  const reduced = useReducedMotion()
  const tone = useCampusTone()
  const dark = tone === 'dark'
  const canvas = useRef<HTMLCanvasElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const [state, setState] = useState(0)

  useEffect(() => {
    const cv = canvas.current
    if (!cv || !cv.getContext) return
    return startCampus(cv, {
      palette: dark ? CAMPUS_DARK : CAMPUS_LIGHT,
      still: reduced,
      onState: setState,
      textRight: () => {
        const c = copy.current
        if (!c || window.innerWidth < 760) return 0
        return c.getBoundingClientRect().right - cv.getBoundingClientRect().left
      },
    })
  }, [dark, reduced])

  const now = campus.states[state]
  return (
    <section id="top" className={`relative flex flex-col overflow-hidden md:block md:h-[min(100svh,940px)] md:min-h-[720px] ${dark ? 'bg-[#07080A] text-[#ECEDEF]' : 'bg-paper text-ink'}`}>
      <canvas ref={canvas} role="img" aria-label={campus.alt} className="relative order-2 block h-[680px] w-full md:absolute md:inset-0 md:h-full" />
      <div ref={copy} className="pointer-events-none relative z-10 order-1 px-6 pt-8 md:absolute md:top-1/2 md:left-[clamp(24px,4.4vw,64px)] md:w-[min(35vw,520px)] md:-translate-y-1/2 md:p-0">
        <p className={`${LABEL} ${dark ? 'text-brand-lift' : 'text-brand'}`}>{site.tagline}</p>
        <h1 className="mt-3 text-[clamp(34px,9vw,44px)] leading-none font-medium tracking-[-0.035em] text-balance md:text-[clamp(36px,3.9vw,58px)]">{hero.title.replace('Post-Monolithic', 'Post‑Monolithic')}</h1>
        <p className={`mt-4 max-w-[40ch] text-[clamp(15px,1.25vw,17px)] leading-normal ${dark ? 'text-[#8B90A0]' : 'text-body'}`}>{hero.lede}</p>
        <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <ButtonLink href={launchHref} tone={dark ? 'light' : 'dark'}>
            {hero.primaryCta.label}
          </ButtonLink>
          <TextLink href={hero.secondaryCta.href} tone={dark ? 'dark' : 'light'}>
            {hero.secondaryCta.label}
          </TextLink>
        </div>
        <p aria-live="off" className={`${LABEL} mt-8 border-t pt-3.5 leading-[1.7] ${dark ? 'border-[#262A32] text-[#8B90A0]' : 'border-line text-muted'}`}>
          <b className={`font-medium ${dark ? 'text-[#ECEDEF]' : 'text-ink'}`}>{now.title}</b>
          <br />
          {now.line}
        </p>
      </div>
    </section>
  )
}
