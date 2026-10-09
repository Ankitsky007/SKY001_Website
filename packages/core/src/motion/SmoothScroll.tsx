import Lenis from 'lenis'
import { useEffect, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from './gsap'
import { LenisContext } from './lenisContext'
import { useReducedMotion } from './useReducedMotion'

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock.
 * Turns itself off for reduced motion; native scrolling is kept on touch devices.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // Lenis is an external system; publish the instance so children can scrollTo().
    // oxlint-disable-next-line react/set-state-in-effect
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
