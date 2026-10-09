import { research } from '@skyfall/core'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { PixelIcon, type PixelIconName } from '../../components/PixelIcon'

const ICONS: PixelIconName[] = ['learn', 'simulate', 'plan', 'guardrails']
const num = (i: number) => `// ${String(i + 1).padStart(3, '0')}`

/**
 * aeye "how it works" step cards. Progress bars fill in sequence as the cards scroll through the
 * viewport (never un-filling), each card turns blue as its bar starts, and clicking a card jumps
 * the progress to it. Reduced motion shows every step complete.
 */
export function StepCards() {
  const steps = research.build.steps
  const n = steps.length
  const root = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(() => (prefersReducedMotion() ? n : 0))
  const progress = useRef({ p: prefersReducedMotion() ? n : 0, max: 0 })

  const render = () => {
    const el = root.current
    if (!el) return
    const p = progress.current.p
    el.querySelectorAll<HTMLElement>('[data-bar]').forEach((bar, i) => {
      const fill = gsap.utils.clamp(0, 1, p - i)
      bar.style.width = `${fill * 100}%`
      const tip = bar.nextElementSibling as HTMLElement | null
      if (tip) tip.style.display = fill > 0 && fill < 0.98 ? 'block' : 'none'
    })
    const next = Math.min(n, Math.ceil(p - 0.02))
    setReached((r) => (r === next ? r : next))
  }

  const goTo = (target: number, duration = 0.6) =>
    gsap.to(progress.current, { p: target, duration, ease: 'power2.out', overwrite: true, onUpdate: render })

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      render()
      if (prefersReducedMotion()) return
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 45%',
        onUpdate: (self) => {
          const target = self.progress * n
          if (target <= progress.current.max) return
          progress.current.max = target
          goTo(target, 0.5)
        },
      })
      return () => st.kill()
    },
    { scope: root },
  )

  const select = (i: number) => {
    progress.current.max = Math.max(progress.current.max, i + 1)
    if (prefersReducedMotion()) {
      progress.current.p = i + 1
      render()
    } else goTo(i + 1)
  }

  return (
    <ol ref={root} className="grid gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-4">
      {steps.map((step, i) => {
        const on = i < reached
        return (
          <li key={step.key} className="relative flex flex-col border border-line transition-colors duration-300 hover:border-faint lg:h-[520px]">
            <button
              type="button"
              aria-pressed={on}
              aria-label={`Step ${i + 1}: ${step.title}`}
              onClick={() => select(i)}
              className="absolute inset-0 z-10 cursor-pointer"
            />
            {/* Phone: icon beside text. md+: number + body on top, title + icon below the bar. */}
            <div className="flex gap-4 p-5 md:flex-1 md:flex-col md:justify-between md:gap-10 md:p-6">
              <PixelIcon name={ICONS[i]} active={on} className="size-[50px] md:hidden" />
              <div className="flex flex-col gap-1.5 md:h-full md:justify-between md:gap-10">
                <span className={`text-base tracking-[-0.04em] transition-colors duration-300 md:text-[22px] ${on ? 'text-brand' : 'text-faint'}`}>{num(i)}</span>
                <h3 className={`text-[22px] leading-[1.15] font-medium tracking-[-0.05em] transition-colors duration-300 md:hidden ${on ? 'text-brand' : 'text-muted'}`}>{step.title}</h3>
                <p className={`text-[15px] leading-[1.4] tracking-[-0.02em] transition-[color,opacity] duration-300 md:text-base ${on ? 'text-ink' : 'text-muted md:text-ink md:opacity-30'}`}>
                  {step.body}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="dots-sm flex h-6 items-center gap-[3px] md:h-8 md:gap-1">
              <span data-bar className="block h-1.5 bg-brand md:h-2" style={{ width: 0 }} />
              <span className="hidden size-1.5 shrink-0 bg-brand md:size-2" />
            </div>
            <div className="hidden flex-col justify-between gap-6 p-6 md:flex lg:h-[210px]">
              <h3 className={`text-[28px] leading-[1.15] font-medium tracking-[-0.05em] transition-colors duration-300 ${on ? 'text-brand' : 'text-faint'}`}>{step.title}</h3>
              <PixelIcon name={ICONS[i]} active={on} className="size-20 self-end" />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
