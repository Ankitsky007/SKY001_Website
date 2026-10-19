import { research } from '@skyfall/core/v8'
import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { PixelIcon, type PixelIconName } from './PixelIcon'

const ICONS: PixelIconName[] = ['learn', 'simulate', 'plan', 'guardrails']
const num = (i: number) => `// ${String(i + 1).padStart(3, '0')}`

/**
 * aeye "how it works" step cards. One progress bar runs across the four cards, tied directly to
 * scroll: it fills as the row scrolls by and empties again on the way back up. A card turns blue
 * once its stretch of the bar is full. On desktop the whole section pins for a moment, so the run
 * happens with the heading, intro and cards on screen together. Phones and reduced motion show every step complete.
 */
export function StepCards() {
  const steps = research.build.steps
  const n = steps.length
  const root = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(() => (prefersReducedMotion() ? n : 0))

  const render = (p: number) => {
    const el = root.current
    if (!el) return
    el.querySelectorAll<HTMLElement>('[data-bar]').forEach((bar, i) => {
      const fill = gsap.utils.clamp(0, 1, p - i)
      bar.style.transform = `scaleX(${fill})`
      const tip = bar.parentElement?.querySelector<HTMLElement>('[data-tip]')
      if (tip) {
        tip.style.left = `calc(${fill * 100}% - 4px)`
        tip.style.opacity = fill > 0.01 && fill < 0.99 ? '1' : '0'
      }
    })
    const next = Math.min(n, Math.floor(p + 0.02))
    setReached((r) => (r === next ? r : next))
  }

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      if (prefersReducedMotion()) {
        render(n)
        return
      }
      render(0)
      const state = { p: 0 }
      const mm = gsap.matchMedia()
      const run = (vars: ScrollTrigger.Vars) =>
        gsap.to(state, { p: n, ease: 'none', onUpdate: () => render(state.p), scrollTrigger: { trigger: el, scrub: 0.3, ...vars } })
      // desktop: the whole section (heading, intro and cards belong together) holds still once the
      // cards reach the bottom of the screen, while the bar crosses them
      const section = el.closest('section') ?? el
      mm.add('(min-width: 1024px)', () => {
        run({ trigger: el, start: 'bottom bottom-=32', end: '+=110%', pin: section, anticipatePin: 1 })
      })
      // tablets, cards stacked two by two: the bar fills as the cards pass the middle of the screen
      mm.add('(min-width: 768px) and (max-width: 1023.98px)', () => {
        run({ start: 'top 70%', end: 'bottom 55%' })
      })
      // phones, cards in a sideways row: no scroll run, every card shows complete and blue at once (Ankit, 2026-10-19)
      mm.add('(max-width: 767.98px)', () => {
        render(n)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    // phones: the four cards side by side in a row that swipes sideways, so they don't lengthen the page (Ankit, 2026-10-18)
    <ol ref={root} className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-2 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-0 [&::-webkit-scrollbar]:hidden">
      {steps.map((step, i) => {
        const on = i < reached
        return (
          <li key={step.key} className="relative flex w-[78%] shrink-0 snap-start flex-col border border-line bg-paper md:w-auto lg:-ml-px lg:first:ml-0">
            <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
              <span className={`text-base tracking-[-0.04em] transition-colors duration-300 md:text-[22px] ${on ? 'text-brand' : 'text-faint'}`}>{num(i)}</span>
              <h3 className={`mt-2 text-[24px] leading-[1.1] font-medium tracking-[-0.05em] transition-colors duration-300 md:mt-8 md:text-[28px] ${on ? 'text-brand' : 'text-ink/60'}`}>{step.title}</h3>
              <p className={`text-[15px] leading-[1.4] tracking-[-0.02em] transition-opacity duration-300 md:text-base ${on ? 'text-ink' : 'text-ink opacity-60'}`}>{step.body}</p>
            </div>
            <div aria-hidden="true" className="dots relative flex h-6 items-center md:h-8">
              <span data-bar className="block h-1.5 w-full origin-left bg-brand md:h-2" style={{ transform: 'scaleX(0)' }} />
              <span data-tip className="absolute top-1/2 size-2 -translate-y-1/2 bg-brand opacity-0 shadow-[0_0_0_3px_rgba(62,87,218,0.2)]" />
            </div>
            <div className="flex justify-end p-5 md:p-6">
              <PixelIcon name={ICONS[i]} active={on} className="size-14 md:size-20" />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
