// App-level GSAP setup: core registers ScrollTrigger + SplitText; v1 adds DrawSVG for line figures.
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@skyfall/core/motion'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin)

/** Media query that gates every looping or scroll-drawn animation. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, useGSAP, prefersReducedMotion }
