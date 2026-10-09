import { research } from '@skyfall/core'
import { prefersReducedMotion, Reveal, ScrollTrigger, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { Fig2A, Fig2AMobile, Fig2B, Fig2BMobile } from '../figures/research'
import { drawFigure } from '../lib/draw'
import { Bracket, LABEL, TabGrid } from '../lib/ui'

type View = 'a' | 'b'
// Tab labels and the caption are storyboard copy (figure labels), not in content.ts.
const TABS = [
  { id: 'a', label: '[ A · Language ]' },
  { id: 'b', label: '[ B · Enterprise ]' },
] as const

export function Problem() {
  const [view, setView] = useState<View>('b')
  const panel = useRef<HTMLDivElement>(null)
  const entered = useRef(false)

  useGSAP(
    () => {
      const el = panel.current
      if (!el || prefersReducedMotion()) return
      if (entered.current) {
        drawFigure(el)
        return
      }
      const tl = drawFigure(el).pause()
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          entered.current = true
          tl.play()
        },
      })
    },
    { scope: panel, dependencies: [view] },
  )

  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
        <div className="flex flex-col gap-5 px-6 pt-14 md:px-12 md:pt-20 lg:gap-6 lg:border-r lg:border-line lg:py-20 lg:pr-16 xl:pl-[116px]">
          <Bracket parts={['1.1', 'The problem']} className="text-brand" />
          <SplitReveal as="h3" className="text-[28px] leading-[1.14] font-normal tracking-[-0.03em] lg:text-[40px] lg:leading-[1.12]">
            {research.problem.title}
          </SplitReveal>
          <Reveal stagger={0.1} className="flex flex-col gap-5 lg:gap-6">
            {research.problem.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-base leading-normal text-body lg:text-lg">
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="flex flex-col gap-4 px-6 pt-8 pb-14 md:px-12 md:pb-20 lg:py-20 lg:pl-16 xl:pr-[116px]">
          <TabGrid
            label="Fig.02 view"
            idBase="fig2"
            items={TABS}
            value={view}
            onChange={setView}
            className="grid-cols-2"
            tabClassName={`px-3 lg:px-4 ${LABEL}`}
          />
          <div
            ref={panel}
            id="fig2-panel"
            role="tabpanel"
            aria-labelledby={`fig2-tab-${view}`}
            className="dot-grid flex h-[270px] items-center justify-center px-3 sm:h-[360px] lg:h-[420px]"
          >
            <div className="w-full max-w-[322px] border border-line bg-white p-2.5 sm:max-w-[540px] lg:p-5">
              <div className="sm:hidden">{view === 'a' ? <Fig2AMobile /> : <Fig2BMobile />}</div>
              <div className="hidden sm:block">{view === 'a' ? <Fig2A /> : <Fig2B />}</div>
            </div>
          </div>
          <span className={`${LABEL} text-muted`}>
            [ Fig.02 ] A sequence of tokens vs. a living system<span className="hidden sm:inline"> of parts, processes and decisions</span>
          </span>
        </div>
      </div>
    </section>
  )
}
