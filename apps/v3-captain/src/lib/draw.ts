import { gsap } from '@skyfall/core/motion'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

// DrawSVG is the one extra plugin this version needs (figure strokes drawing in).
gsap.registerPlugin(DrawSVGPlugin)

/** Draw a figure in: solid strokes (.fd) draw, text/dashed groups (.ff) fade, marks (.fp) pop. */
export function drawFigure(scope: Element, delay = 0) {
  const tl = gsap.timeline({ delay, defaults: { ease: 'expo.out' } })
  const fd = scope.querySelectorAll('.fd')
  const fp = scope.querySelectorAll('.fp')
  const ff = scope.querySelectorAll('.ff')
  if (fd.length) tl.from(fd, { drawSVG: '0%', duration: 1.1, stagger: 0.04 }, 0)
  if (fp.length) tl.from(fp, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.035 }, 0.15)
  if (ff.length) tl.from(ff, { autoAlpha: 0, duration: 0.9, stagger: 0.05 }, 0.35)
  return tl
}
