import { sky001Cta } from '@skyfall/core'
import { gsap, prefersReducedMotion, SplitReveal, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Marquee } from '../components/Marquee'
import { PixelWord, PrimaryButton, UnderlineLink } from '../components/ui'
import { canUseWebGL2, createPointerState, now } from '../scenes/heroGrid'
import { splitAccent } from '../lib/text'
import { useScrambleIn } from '../lib/useScrambleIn'

// three.js only arrives with this chunk (shared with the hero grid).
const CtaGridScene = lazy(() => import('../scenes/CtaGridScene'))

const ACCENT = 'Engineered'
const MQ_MD = '(min-width: 768px)'

/** Cell size of the `grid-dark` band: 44px on phones, 48px from md. */
function useCell() {
  const [cell, setCell] = useState(() => (typeof window !== 'undefined' && window.matchMedia?.(MQ_MD).matches ? 48 : 44))
  useEffect(() => {
    const mq = window.matchMedia?.(MQ_MD)
    if (!mq) return
    const on = () => setCell(mq.matches ? 48 : 44)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return cell
}

/** Blue hashtag strip, then the SKY-001 CTA card with corner squares sitting on the dark grid. */
export function Sky001Cta() {
  const root = useRef<HTMLElement>(null)
  const [before, accent, after] = splitAccent(sky001Cta.title, ACCENT)
  const band = useRef<HTMLDivElement>(null)
  const cardEl = useRef<HTMLDivElement>(null)
  const card = useRef<[number, number, number, number]>([0, 0, 0, 0])
  const pointer = useRef(createPointerState())
  const cell = useCell()
  const reduced = useReducedMotion()
  const [webgl] = useState(() => typeof document !== 'undefined' && canUseWebGL2())
  const [live, setLive] = useState(false)
  const scene = webgl && !reduced

  // The shader needs to know where the card sits inside the band.
  useEffect(() => {
    if (!scene || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const b = band.current
      const c = cardEl.current
      if (!b || !c) return
      card.current = [c.offsetLeft, c.offsetTop, c.offsetLeft + c.offsetWidth, c.offsetTop + c.offsetHeight]
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(band.current!)
    ro.observe(cardEl.current!)
    return () => ro.disconnect()
  }, [scene])

  const cellAt = (e: PointerEvent) => {
    const rect = band.current!.getBoundingClientRect()
    return [Math.floor((e.clientX - rect.left) / cell), Math.floor((e.clientY - rect.top) / cell)] as const
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!scene || e.pointerType !== 'mouse') return
    const [cx, cy] = cellAt(e)
    const key = `${cx}-${cy}`
    const ptr = pointer.current
    if (key === ptr.last) return
    ptr.last = key
    ptr.trail.set([cx, cy, now()], ptr.head * 3)
    ptr.head = (ptr.head + 1) % 8
  }

  const onPointerDown = (e: PointerEvent) => {
    if (!scene) return
    const [cx, cy] = cellAt(e)
    pointer.current.click = [cx, cy, now()]
  }

  useScrambleIn(root, { selector: 'h2 [data-scramble-in]', start: 'top 70%', delay: 0.4, duration: 1.2 })

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-cta-card]', start: 'top 80%', once: true }, defaults: { ease: 'expo.out' } })
      tl.from('[data-cta-card]', { clipPath: 'inset(50% 0% 50% 0%)', duration: 1.2 })
        .from('[data-corner]', { scale: 0, duration: 0.6, stagger: 0.08 }, 0.5)
        .from('[data-cta-fade]', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.9 }, 0.6)
    },
    { scope: root },
  )

  return (
    <section id="sky-001" ref={root} aria-labelledby="sky-001-title" className="mt-16 md:mt-24 lg:mt-[120px]">
      <div aria-hidden="true" className="border-t border-line">
        <Marquee speed={60} copies={4} wrapWhenStill={false} className="h-14 md:h-[72px]" groupClassName="gap-12 pr-12 md:gap-[72px] md:pr-[72px]">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center gap-12 font-mono text-[13px] font-medium tracking-[-0.02em] whitespace-nowrap text-brand uppercase md:gap-[72px] md:text-[15px]">
              <span>[#Engineering] &amp; [#World Models]</span>
              <span>{'//'}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div ref={band} onPointerMove={onPointerMove} onPointerDown={onPointerDown} className="grid-dark relative overflow-hidden px-4 py-11 md:px-10 md:py-24">
        {/* Live grid: SKY-001's card sends rollouts out across the band. The CSS grid underneath is the fallback. */}
        {scene && (
          <Suspense fallback={null}>
            <CtaGridScene
              className={`absolute! inset-0 transition-opacity duration-700 ${live ? 'opacity-100' : 'opacity-0'}`}
              fallback={null}
              cell={cell}
              card={card}
              pointer={pointer}
              onReady={() => setLive(true)}
            />
          </Suspense>
        )}
        <div ref={cardEl} data-cta-card className="relative mx-auto flex max-w-[1208px] flex-col items-center gap-7 bg-white px-5 py-16 text-center md:gap-9 md:py-24 lg:min-h-[488px] lg:justify-center">
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
            <span key={pos} data-corner aria-hidden="true" className={`absolute block size-4 bg-ink md:size-6 ${pos}`} />
          ))}
          <span data-cta-fade className="bg-chip px-2 py-1 font-mono text-xs font-medium tracking-[-0.02em] text-muted uppercase md:text-[13px]">
            {sky001Cta.eyebrow}
          </span>
          <SplitReveal as="h2" className="max-w-[760px] text-[38px] leading-[1.1] font-normal tracking-[-0.06em] text-ink md:text-[56px] lg:text-[72px]">
            <span id="sky-001-title">
              {before}
              <PixelWord caret>{accent}</PixelWord>
              {after}
            </span>
          </SplitReveal>
          <div data-cta-fade className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row md:gap-6">
            <PrimaryButton href={sky001Cta.primary.href} className="w-full md:w-auto">
              {sky001Cta.primary.label}
            </PrimaryButton>
            <UnderlineLink href={sky001Cta.secondary.href} className="w-full md:w-auto md:min-w-[200px]">
              {sky001Cta.secondary.label}
            </UnderlineLink>
          </div>
        </div>
      </div>
    </section>
  )
}
