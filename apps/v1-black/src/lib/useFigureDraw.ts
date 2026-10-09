import type { RefObject } from 'react'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from './motion'

/**
 * Scroll-triggered "the schematic draws itself" sequence for the line figures.
 * Mark SVG children with data-f:
 *   grid   dot fields / guide lines, fade in first
 *   node   boxes and markers, rise in
 *   draw   solid grey structure lines, drawn with DrawSVG
 *   fade   labels, dashed lines, arrows, fade in
 *   active the blue active path, drawn after the structure
 *   dot    blue waypoints on the active path, pop in along it
 *   bar    bars that grow up from their baseline
 *   late   anything that should land last (goal state, captions inside the figure)
 *   pulse  a copy of an active path; a short highlight travels along it on a loop
 *   march  dashed hidden links whose dashes crawl slowly ("always changing")
 * Without motion (or before JS) the SVG markup is the final state, so nothing is hidden.
 */
export function useFigureDraw(ref: RefObject<HTMLElement | SVGSVGElement | null>, opts: { start?: string } = {}) {
  const { start = 'top 78%' } = opts

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(el)
        const pick = (k: string) => q(`[data-f="${k}"]`)

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: { trigger: el, start, once: true },
        })

        const grid = pick('grid')
        const node = pick('node')
        const draw = pick('draw')
        const fade = pick('fade')
        const active = pick('active')
        const dot = pick('dot')
        const bar = pick('bar')
        const late = pick('late')
        const pulses = pick('pulse')
        const march = pick('march')

        if (grid.length) tl.from(grid, { autoAlpha: 0, duration: 0.9 }, 0)
        if (node.length) tl.from(node, { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.045 }, 0.1)
        if (draw.length) tl.from(draw, { drawSVG: 0, duration: 0.9, stagger: 0.035, ease: 'power2.inOut' }, 0.2)
        if (fade.length) tl.from(fade, { autoAlpha: 0, duration: 0.6, stagger: 0.03 }, 0.45)
        if (active.length) tl.from(active, { drawSVG: 0, duration: 1.4, stagger: 0.18, ease: 'power2.inOut' }, '>-0.5')
        if (dot.length)
          tl.from(dot, { scale: 0, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.14, ease: 'back.out(3)' }, '<0.1')
        if (bar.length)
          tl.from(bar, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.6, stagger: 0.08, ease: 'power3.out' }, '<')
        if (late.length) tl.from(late, { autoAlpha: 0, duration: 0.6 }, '>-0.2')

        // Loops: a highlight travels the active path, hidden links' dashes crawl. Paused off screen.
        const loops: gsap.core.Animation[] = []
        if (pulses.length) {
          gsap.set(pulses, { autoAlpha: 1, drawSVG: '0% 0%' })
          const pulse = gsap.timeline({ repeat: -1, repeatDelay: 1.4, paused: true, defaults: { ease: 'none' } })
          pulse
            .fromTo(pulses, { drawSVG: '0% 0%' }, { drawSVG: '0% 14%', duration: 0.35 })
            .to(pulses, { drawSVG: '86% 100%', duration: 1.5, ease: 'power1.inOut' })
            .to(pulses, { drawSVG: '100% 100%', duration: 0.35 })
          loops.push(pulse)
        }
        if (march.length) {
          loops.push(gsap.to(march, { strokeDashoffset: -16, duration: 1.6, ease: 'none', repeat: -1, paused: true }))
        }
        if (loops.length) {
          let inView = false
          const sync = () => loops.forEach((l) => (inView && tl.progress() === 1 ? l.play() : l.pause()))
          tl.eventCallback('onComplete', sync)
          ScrollTrigger.create({
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => {
              inView = self.isActive
              sync()
            },
          })
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
}
