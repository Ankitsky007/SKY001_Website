import { gsap, ScrollTrigger, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useRef, type ReactNode } from 'react'

type MarqueeProps = {
  children: ReactNode
  /** Pixels per second. */
  speed?: number
  reverse?: boolean
  /** Identical copies laid end to end; enough to cover twice the widest viewport. */
  copies?: number
  className?: string
  /** Classes for each copy (spacing between items goes here, plus the same value as right padding). */
  groupClassName?: string
  /** Under reduced motion the items wrap instead of scrolling, so nothing is hidden. */
  wrapWhenStill?: boolean
}

/**
 * Infinite GSAP marquee: every copy slides by its own width (xPercent), so it stays seamless at
 * any breakpoint. Eases to a stop on hover, pauses off screen, and is static for reduced motion.
 */
export function Marquee({ children, speed = 70, reverse = false, copies = 3, className = '', groupClassName = '', wrapWhenStill = true }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!el || reduced) return
      const groups = el.querySelectorAll<HTMLElement>('[data-marquee-group]')
      const width = groups[0]?.offsetWidth || 1000
      const tween = gsap.fromTo(groups, { xPercent: reverse ? -100 : 0 }, { xPercent: reverse ? 0 : -100, duration: width / speed, ease: 'none', repeat: -1 })
      const slow = () => gsap.to(tween, { timeScale: 0, duration: 0.6, ease: 'power2.out', overwrite: true })
      const go = () => gsap.to(tween, { timeScale: 1, duration: 0.6, ease: 'power2.in', overwrite: true })
      el.addEventListener('pointerenter', slow)
      el.addEventListener('pointerleave', go)
      const st = ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? tween.resume() : tween.pause()) })
      return () => {
        el.removeEventListener('pointerenter', slow)
        el.removeEventListener('pointerleave', go)
        st.kill()
      }
    },
    { scope: root, dependencies: [reduced, speed, reverse] },
  )

  if (reduced && wrapWhenStill) {
    return (
      <div ref={root} className={className}>
        <div className={`flex flex-wrap ${groupClassName}`}>{children}</div>
      </div>
    )
  }

  return (
    <div ref={root} className={`flex overflow-hidden ${className}`}>
      {Array.from({ length: copies }, (_, i) => (
        <div key={i} data-marquee-group aria-hidden={i > 0 ? true : undefined} className={`flex shrink-0 items-center will-change-transform ${groupClassName}`}>
          {children}
        </div>
      ))}
    </div>
  )
}
