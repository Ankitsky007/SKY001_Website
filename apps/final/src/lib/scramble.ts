// App-level GSAP extra: ScrambleText for aeye's "resolve from glyphs" labels (same helper as v2).
import { gsap, prefersReducedMotion } from '@skyfall/core/motion'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

/** Glyphs the scramble cycles through: aeye's set, all present in Geist Mono. */
export const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#'

const canHover = () => typeof window !== 'undefined' && !!window.matchMedia?.('(hover: hover)').matches

/**
 * Re-resolve an element's own text from random glyphs. Locks the element's width first so the
 * surrounding line never reflows while glyphs of a different width pass through.
 */
export function scramble(el: HTMLElement | null, { duration = 0.8, delay = 0 }: { duration?: number; delay?: number } = {}) {
  if (!el || prefersReducedMotion()) return
  const text = el.dataset.text ?? el.textContent ?? ''
  el.dataset.text = text
  if (gsap.isTweening(el)) return
  const lock = el.style.display !== 'inline-block'
  if (lock) {
    el.style.display = 'inline-block'
    el.style.width = `${el.getBoundingClientRect().width}px`
    el.style.whiteSpace = 'nowrap'
  }
  return gsap.to(el, {
    duration,
    delay,
    ease: 'none',
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: duration * 0.25 },
    onComplete: () => {
      if (!lock) return
      el.style.display = ''
      el.style.width = ''
      el.style.whiteSpace = ''
    },
  })
}

/** Pointer-enter handler that scrambles the `[data-scramble]` label inside the target (desktop only). */
export function scrambleOnHover(e: { currentTarget: HTMLElement }) {
  if (!canHover()) return
  const label = e.currentTarget.querySelector<HTMLElement>('[data-scramble]')
  scramble(label, { duration: 0.6 })
}

export { gsap }
