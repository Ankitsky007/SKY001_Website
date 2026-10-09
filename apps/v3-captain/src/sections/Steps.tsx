import { research } from '@skyfall/core'
import { gsap, ScrollTrigger, useGSAP, useLenis } from '@skyfall/core/motion'
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { Slabs } from '../figures/slabs'
import { Sq } from '../lib/ui'

const STEPS = research.build.steps
const STEP_LABEL = 'font-mono text-[10px] font-medium uppercase tracking-[0.04em] lg:text-xs'

/**
 * Learn → Simulate → Plan → Guardrails. Desktop: the panel pins and scroll progress picks the
 * active step (a pure function of scroll, so it reverses). Phone/tablet: no pin; the step follows
 * the figure as it passes, and the tabs or a swipe on the figure change it directly.
 */
export function Steps() {
  const [step, setStep] = useState(0)
  const root = useRef<HTMLElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const pinned = useRef<ScrollTrigger | null>(null)
  const touch = useRef<number | null>(null)
  const lenis = useLenis()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        let last = -1
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top+=64',
          end: () => `+=${Math.round(window.innerHeight * 2.4)}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            if (bar.current) bar.current.style.transform = `scaleX(${0.25 + 0.75 * p})`
            const s = Math.min(3, Math.floor(p * 4))
            if (s !== last) {
              last = s
              setStep(s)
            }
          },
        })
        pinned.current = st
        return () => {
          pinned.current = null
        }
      })
      mm.add('(max-width: 1023px)', () => {
        let last = -1
        ScrollTrigger.create({
          trigger: root.current?.querySelector('[data-steps-figure]'),
          start: 'top 70%',
          end: 'bottom 55%',
          onUpdate: (self) => {
            const s = Math.min(3, Math.floor(self.progress * 4))
            if (s !== last) {
              last = s
              setStep(s)
            }
          },
        })
      })
    },
    { scope: root },
  )

  // Off the pinned path the bar and counter follow the step (with a CSS transition).
  useEffect(() => {
    if (counter.current) counter.current.textContent = `SCROLL · 0${step + 1} / 04`
    if (!pinned.current && bar.current) bar.current.style.transform = `scaleX(${(step + 1) / 4})`
  }, [step])

  const go = (i: number) => {
    const st = pinned.current
    if (!st) {
      setStep(i)
      return
    }
    const y = st.start + ((i + 0.5) / 4) * (st.end - st.start)
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? Math.min(3, i + 1) : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? Math.max(0, i - 1) : -1
    if (next < 0) return
    e.preventDefault()
    go(next)
    tabs.current[next]?.focus()
  }

  const onTouchStart = (e: TouchEvent) => {
    touch.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    if (touch.current === null) return
    const dx = e.changedTouches[0].clientX - touch.current
    touch.current = null
    if (Math.abs(dx) < 40) return
    setStep((s) => Math.max(0, Math.min(3, s + (dx < 0 ? 1 : -1))))
  }

  return (
    <section ref={root} aria-label="How the world model works" className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-14 md:px-12 md:py-20 lg:h-[calc(100svh-64px)] lg:flex-row lg:items-center lg:gap-12 lg:py-8 xl:px-[116px]">
        <div className="flex flex-col gap-5 lg:w-[540px] lg:shrink-0 lg:flex-row lg:items-start lg:gap-10 xl:w-[600px] xl:gap-12">
          <div role="tablist" aria-label="Steps" aria-orientation="vertical" className="grid grid-cols-2 gap-x-3 lg:flex lg:w-[190px] lg:shrink-0 lg:flex-col lg:-mt-3">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`step-tab-${s.key}`}
                aria-selected={step === i}
                aria-controls="step-panel"
                tabIndex={step === i ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`flex min-h-11 cursor-pointer items-center gap-[5px] text-left transition-colors duration-300 lg:min-h-9 lg:gap-1.5 ${STEP_LABEL} ${
                  step === i ? 'text-brand' : 'text-muted hover:text-ink'
                }`}
              >
                [ 0{i + 1} <Sq /> {s.label} ]
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-5 lg:flex-1">
            <div id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${STEPS[step].key}`} aria-live="polite" className="grid">
              {STEPS.map((s, i) => (
                <div
                  key={s.key}
                  aria-hidden={step !== i}
                  className={`col-start-1 row-start-1 flex flex-col gap-4 transition-[opacity,translate] duration-500 ease-out-expo lg:gap-5 ${
                    step === i ? 'translate-y-0 opacity-100' : step > i ? 'pointer-events-none -translate-y-4 opacity-0' : 'pointer-events-none translate-y-4 opacity-0'
                  }`}
                >
                  <h3 className="mt-2 text-[28px] leading-[1.12] font-normal tracking-[-0.03em] lg:mt-0 lg:text-[40px] lg:leading-[1.1]">{s.title}</h3>
                  <p className="text-[17px] leading-[1.45] text-body lg:text-xl lg:tracking-[-0.01em]">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 lg:mt-6">
              <div className="h-0.5 bg-line">
                <div ref={bar} className="h-0.5 origin-left bg-brand transition-transform duration-300 ease-out" style={{ transform: 'scaleX(0.25)' }} />
              </div>
              <span ref={counter} className="font-mono text-[10px] font-medium tracking-[0.04em] text-muted lg:text-[11px]">
                SCROLL · 01 / 04
              </span>
            </div>
          </div>
        </div>

        <div
          data-steps-figure
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="dot-grid flex h-[560px] touch-pan-y items-center justify-center py-2 lg:h-full lg:flex-1"
        >
          <Slabs active={step} className="h-full w-auto max-w-full" />
        </div>
      </div>
    </section>
  )
}
