// Local copies of two tiny helpers from @skyfall/core/webgl. Importing them from that entry in the
// main bundle would pull three.js in with it; here three.js stays in the lazy WebGL chunk.
import { useEffect, useState, type RefObject } from 'react'

/** True while the element is on screen (with a margin), so media and GPU work can pause off screen. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '200px') {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  return inView
}

let webgl2: boolean | undefined

export function hasWebGL2(): boolean {
  if (webgl2 !== undefined) return webgl2
  try {
    webgl2 = !!document.createElement('canvas').getContext('webgl2')
  } catch {
    webgl2 = false
  }
  return webgl2
}
