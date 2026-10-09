import { gsap } from '@skyfall/core/motion'

/**
 * Elements matching `selector` inside `root` whose SVG is actually displayed. Figures ship a phone
 * and a desktop variant side by side (CSS picks one), and only the visible one should animate.
 * Any tweens still running on them are killed and their inline styles reset, so a replay
 * (e.g. after a toggle) always starts from the finished drawing.
 */
export function visible(root: HTMLElement, selector: string) {
  const els = gsap.utils.toArray<SVGElement>(selector, root).filter((el) => {
    const svg = el.ownerSVGElement ?? el
    return svg.getClientRects().length > 0
  })
  gsap.killTweensOf(els)
  gsap.set(els, { clearProps: 'all' })
  return els
}
