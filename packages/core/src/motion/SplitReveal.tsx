import { createElement, useRef, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP } from './gsap'
import type { RevealTag } from './types'
import { prefersReducedMotion } from './useReducedMotion'

type SplitRevealProps = {
  children: ReactNode
  as?: RevealTag
  className?: string
  /** 'lines' for headlines and paragraphs, 'words' or 'chars' for short display type. */
  by?: 'lines' | 'words' | 'chars'
  delay?: number
  /** Play immediately (hero) instead of waiting for the element to scroll into view. */
  immediate?: boolean
}

/**
 * Masked line-by-line (or word/char) reveal using GSAP SplitText. Waits for webfonts so lines
 * split where the real Geist metrics break them, and re-splits on resize.
 */
export function SplitReveal({ children, as: Tag = 'div', className, by = 'lines', delay = 0, immediate = false }: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      let split: SplitText | undefined
      let cancelled = false
      document.fonts.ready.then(() => {
        if (cancelled) return
        split = SplitText.create(el, {
          type: by === 'lines' ? 'lines' : `lines,${by}`,
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self[by], {
              yPercent: 110,
              duration: 1.2,
              stagger: by === 'chars' ? 0.015 : by === 'words' ? 0.04 : 0.09,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 85%', once: true },
            }),
        })
      })
      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { scope: ref },
  )

  // Passing the ref object (not reading .current) is fine; the lint rule misreads createElement.
  // oxlint-disable-next-line react/refs
  return createElement(Tag, { ref, className }, children)
}
