import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'

/**
 * Accent word for the SKY-001 page: aeye's bracketed accent with the blinking block caret, set in
 * Geist Mono (the page keeps to Geist and Geist Mono only).
 */
export function AccentWord({ children, caret = false, className = '' }: { children: string; caret?: boolean; className?: string }) {
  return (
    <span className={`font-mono font-normal tracking-[-0.08em] whitespace-nowrap text-brand ${className}`}>
      [<span data-scramble-in>{children}</span>
      {caret && <span aria-hidden="true" className="caret" />}]
    </span>
  )
}

/** Counts a figure like "150×" or "79.7%" up from zero the first time it scrolls into view. */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      const m = value.match(/^([\d.]+)(.*)$/)
      if (!el || !m || prefersReducedMotion()) return
      const target = Number(m[1])
      const decimals = (m[1].split('.')[1] ?? '').length
      const o = { v: 0 }
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () =>
          gsap.to(o, {
            v: target,
            duration: 1.6,
            ease: 'expo.out',
            onUpdate: () => (el.textContent = `${o.v.toFixed(decimals)}${m[2]}`),
          }),
      })
      el.textContent = `${(0).toFixed(decimals)}${m[2]}`
      return () => st.kill()
    },
    { scope: ref },
  )
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
