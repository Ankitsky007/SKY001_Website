import { createElement, useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from './gsap'
import type { RevealTag } from './types'
import { prefersReducedMotion } from './useReducedMotion'

type RevealProps = {
  children: ReactNode
  as?: RevealTag
  className?: string
  /** Seconds before the reveal starts once in view. */
  delay?: number
  /** Distance in px the content rises from. */
  y?: number
  /** Reveal direct children one after another instead of the block at once. */
  stagger?: number
}

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({ children, as: Tag = 'div', className, delay = 0, y = 24, stagger }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const targets = stagger ? Array.from(el.children) : el
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        delay,
        stagger,
        duration: 1.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )

  // Passing the ref object (not reading .current) is fine; the lint rule misreads createElement.
  // oxlint-disable-next-line react/refs
  return createElement(Tag, { ref, className }, children)
}
