import { lazy, Suspense, useRef, type PointerEvent } from 'react'
import { sky001Cta } from '@skyfall/core'
import { SplitReveal, useReducedMotion } from '@skyfall/core/motion'
import { CtaLink, Frame } from '../components/ui'
import { useNearView } from '../lib/useNearView'

// three.js only loads when the CTA is about to scroll into view (and never for reduced motion).
const CtaField = lazy(() => import('../scenes/CtaField'))

/** Static stand-in: the board's CSS dot grid plus faint ripple rings from the button. */
function FieldFallback() {
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="xMaxYMax slice" viewBox="0 0 1312 320">
      <g fill="none" stroke="#3E57DA">
        <circle cx="1170" cy="270" r="70" strokeOpacity="0.16" />
        <circle cx="1170" cy="270" r="150" strokeOpacity="0.09" />
        <circle cx="1170" cy="270" r="250" strokeOpacity="0.05" />
      </g>
    </svg>
  )
}

/** "Introducing SKY-001" call to action, closing out section 03 above the footer. */
export function Sky001Cta() {
  const box = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const near = useNearView(box)
  const reduced = useReducedMotion()

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  return (
    <section id="sky-001" aria-label={sky001Cta.eyebrow} className="scroll-mt-20 md:scroll-mt-24 lg:scroll-mt-28">
      <Frame className="pt-12 pb-16 md:pt-16 md:pb-24 lg:pt-24 lg:pb-[120px]">
        <div
          ref={box}
          onPointerMove={onMove}
          onPointerLeave={() => (pointer.current = null)}
          className="dot-grid-blue relative isolate overflow-hidden border border-rule"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {near && !reduced ? (
              <Suspense fallback={<FieldFallback />}>
                <CtaField pointer={pointer} fallback={<FieldFallback />} />
              </Suspense>
            ) : (
              <FieldFallback />
            )}
          </div>
          <div className="flex flex-col gap-5 px-5 py-7 md:gap-6 md:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:p-16">
            <div className="flex flex-col gap-5 lg:max-w-[760px]">
              <span className="font-mono text-[11px] tracking-[0.04em] text-brand-lift uppercase md:text-xs">[ {sky001Cta.eyebrow} ]</span>
              <SplitReveal
                as="h2"
                className="m-0 text-[30px] leading-[1.12] font-normal tracking-[-0.04em] md:max-w-[600px] md:text-[40px] md:leading-[1.1] md:tracking-[-0.045em] lg:max-w-none lg:text-[56px]"
              >
                {sky001Cta.title}
              </SplitReveal>
            </div>
            <CtaLink href={sky001Cta.primary.href} dot="lg" block className="md:w-auto md:self-start md:justify-start lg:min-h-[52px] lg:self-auto lg:px-5">
              {sky001Cta.primary.label}
            </CtaLink>
          </div>
        </div>
      </Frame>
    </section>
  )
}
