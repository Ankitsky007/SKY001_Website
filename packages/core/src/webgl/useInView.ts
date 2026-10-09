import { useEffect, useState, type RefObject } from 'react'

/** True while the element is on screen (with a margin), so GPU work can pause off screen. */
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
