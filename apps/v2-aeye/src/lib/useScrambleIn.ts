import { prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import type { RefObject } from 'react'
import { scramble } from './motion'

type Options = {
  /** Elements inside the scope to scramble. Queried when the trigger fires, so SplitText clones are found. */
  selector?: string
  start?: string
  delay?: number
  /** Play on mount (after fonts load) instead of on scroll into view. */
  immediate?: boolean
  duration?: number
}

/** aeye-style scramble-in: accent words and mono labels resolve from random glyphs on first view. */
export function useScrambleIn(scope: RefObject<HTMLElement | null>, { selector = '[data-scramble-in]', start = 'top 85%', delay = 0, immediate = false, duration = 1 }: Options = {}) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root || prefersReducedMotion()) return
      const run = () => root.querySelectorAll<HTMLElement>(selector).forEach((el, i) => scramble(el, { delay: delay + i * 0.12, duration }))
      if (immediate) {
        let cancelled = false
        document.fonts.ready.then(() => !cancelled && run())
        return () => {
          cancelled = true
        }
      }
      const st = ScrollTrigger.create({ trigger: root, start, once: true, onEnter: run })
      return () => st.kill()
    },
    { scope },
  )
}
