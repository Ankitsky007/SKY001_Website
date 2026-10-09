import { useEffect, useState, type RefObject } from 'react'

/**
 * Flips to true once the element comes within `rootMargin` of the viewport and stays true.
 * Used to defer lazy chunks (three.js) until they are about to be seen.
 */
export function useNearView(ref: RefObject<Element | null>, rootMargin = '600px') {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, near])

  return near
}
