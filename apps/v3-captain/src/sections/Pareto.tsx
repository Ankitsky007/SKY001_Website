import { research } from '@skyfall/core'
import { gsap, prefersReducedMotion, Reveal, ScrollTrigger, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { Fig4, Fig4Mobile } from '../figures/research'
import { drawFigure } from '../lib/draw'
import { BigWord, Bracket, LABEL, TabGrid } from '../lib/ui'

type View = 'today' | 'wm'
// Tab labels, caption and the "no longer traded" tag are storyboard copy, not in content.ts.
const TABS = [
  { id: 'today', label: '[ Today ]' },
  {
    id: 'wm',
    label: (
      <>
        [ <span className="hidden sm:inline">With </span>
        <span className="sm:hidden">W</span>
        <span className="hidden sm:inline">w</span>orld models ]
      </>
    ),
  },
] as const

function showWorldModels(el: Element, on: boolean, animate: boolean) {
  const layer = el.querySelectorAll('.wm')
  if (!animate) {
    gsap.set(layer, { autoAlpha: on ? 1 : 0 })
    return
  }
  if (!on) {
    gsap.to(layer, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
    return
  }
  gsap.set(layer, { autoAlpha: 1 })
  const tl = gsap.timeline()
  tl.fromTo(el.querySelectorAll('.wm-draw'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'expo.inOut' })
    .from(el.querySelectorAll('.wm-pop'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.12, ease: 'back.out(2)' }, 0.5)
    .from(el.querySelectorAll('.wm-fade'), { autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0.8)
  return tl
}

/** 1.3 Trade-offs: Fig.04 with Today / With world models, and huge Cost / Speed / Quality. */
export function Pareto() {
  const [view, setView] = useState<View>('wm')
  const panel = useRef<HTMLDivElement>(null)
  const entered = useRef(false)

  useGSAP(
    () => {
      const el = panel.current
      if (!el) return
      const reduced = prefersReducedMotion()
      if (reduced || entered.current) {
        showWorldModels(el, view === 'wm', !reduced)
        return
      }
      const tl = drawFigure(el).pause()
      gsap.set(el.querySelectorAll('.wm'), { autoAlpha: 0 })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          entered.current = true
          tl.play()
          gsap.delayedCall(0.6, () => showWorldModels(el, view === 'wm', true))
        },
      })
    },
    { scope: panel, dependencies: [view] },
  )

  const words = research.pareto.axes

  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        <div className="flex flex-col gap-5 px-6 pt-14 md:px-12 md:pt-20 lg:gap-6 lg:border-r lg:border-line lg:py-24 lg:pr-16 xl:pl-[116px]">
          <Bracket parts={['1.3', 'Trade-offs']} className="text-brand" />
          <SplitReveal as="h3" className="text-[28px] leading-[1.14] font-normal tracking-[-0.03em] lg:text-[40px] lg:leading-[1.12]">
            {research.pareto.title}
          </SplitReveal>
          <Reveal as="p" className="text-base leading-normal text-body lg:text-lg">
            {research.pareto.body}
          </Reveal>
          <TabGrid
            label="Fig.04 view"
            idBase="fig4"
            items={TABS}
            value={view}
            onChange={setView}
            className="mt-2 grid-cols-2 lg:mt-4"
            tabClassName={`px-3 lg:px-4 ${LABEL}`}
          />
          <div ref={panel} id="fig4-panel" role="tabpanel" aria-labelledby={`fig4-tab-${view}`} className="w-full max-w-[540px]">
            <div className="sm:hidden">
              <Fig4Mobile />
            </div>
            <div className="hidden sm:block">
              <Fig4 />
            </div>
          </div>
          <span className={`${LABEL} text-muted`}>
            [ Fig.04 ] Cost, speed and quality no longer traded<span className="hidden sm:inline"> against each other</span>
          </span>
        </div>

        <div className="mx-6 mt-12 mb-14 flex flex-col border-t border-line md:mx-12 md:mb-20 lg:m-0 lg:border-t-0">
          {words.map((w, i) => (
            <div
              key={w}
              className={`flex flex-1 flex-col justify-center gap-2.5 py-7 lg:gap-3 lg:py-10 lg:pr-12 lg:pl-16 xl:pr-[116px] ${
                i < words.length - 1 ? 'border-b border-line' : 'border-b border-line lg:border-b-0'
              }`}
            >
              <BigWord delay={i * 0.12} className="text-[80px] leading-[0.9] tracking-[-0.05em] text-brand md:text-[120px] lg:text-[clamp(112px,11vw,160px)]">
                {w}
              </BigWord>
              <span className={`${LABEL} text-brand`}>[ 0{i + 1} ]</span>
              {i === words.length - 1 && <span className={`${LABEL} text-ink`}>No longer traded against each other</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
