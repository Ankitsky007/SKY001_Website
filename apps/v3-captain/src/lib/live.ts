import { useEffect, useState, type RefObject } from 'react'

let webgl2: boolean | undefined

/**
 * Tiny WebGL2 probe kept out of @skyfall/core/webgl, whose index pulls in three.js. Lets the page
 * decide whether to fetch the lazy scene chunk at all.
 */
export function canWebGL2() {
  if (webgl2 !== undefined) return webgl2
  try {
    webgl2 = typeof document !== 'undefined' && !!document.createElement('canvas').getContext('webgl2')
  } catch {
    webgl2 = false
  }
  return webgl2
}

/** True once the element has come within `margin` of the viewport (stays true). */
export function useNear(ref: RefObject<Element | null>, margin = '600px') {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return near
}

/** Whether a live WebGL scene should load for this element: supported and near the viewport. */
export function useLiveScene(ref: RefObject<Element | null>) {
  const near = useNear(ref)
  return near && canWebGL2()
}

export type ScreenPoint = { x: number; y: number }

/**
 * Moves an SVG overlay's marks to projected scene points. Marks declare what they follow:
 * data-at="id" (circle cx/cy, text x/y with data-dx/dy, g translate) or data-from/data-to (line).
 */
export function placeOverlay(svg: SVGSVGElement, pts: Record<string, ScreenPoint>) {
  svg.querySelectorAll<SVGElement>('[data-at]').forEach((el) => {
    const p = pts[el.dataset.at!]
    if (!p) return
    const dx = Number(el.dataset.dx ?? 0)
    const dy = Number(el.dataset.dy ?? 0)
    const tag = el.tagName.toLowerCase()
    if (tag === 'circle') {
      el.setAttribute('cx', (p.x + dx).toFixed(1))
      el.setAttribute('cy', (p.y + dy).toFixed(1))
    } else if (tag === 'text') {
      el.setAttribute('x', (p.x + dx).toFixed(1))
      el.setAttribute('y', (p.y + dy).toFixed(1))
    } else {
      el.setAttribute('transform', `translate(${(p.x + dx).toFixed(1)} ${(p.y + dy).toFixed(1)})`)
    }
  })
  svg.querySelectorAll<SVGLineElement>('line[data-from]').forEach((el) => {
    const a = pts[el.dataset.from!]
    const b = pts[el.dataset.to!]
    if (!a || !b) return
    el.setAttribute('x1', a.x.toFixed(1))
    el.setAttribute('y1', a.y.toFixed(1))
    el.setAttribute('x2', b.x.toFixed(1))
    el.setAttribute('y2', b.y.toFixed(1))
  })
  if (!svg.hasAttribute('data-ready')) svg.setAttribute('data-ready', '')
}
