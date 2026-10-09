import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../motion/useReducedMotion'
import { hasWebGPU } from './capabilities'
import { useInView } from './useInView'

type ShaderStageProps = {
  /** Effect tree from `shaders/react` (needs WebGPU). Only mounted when supported and on screen. */
  children: ReactNode
  /** Static stand-in for Safari, older Android, reduced motion and first paint. */
  fallback: ReactNode
  className?: string
}

/**
 * Wrapper for effects from the `shaders` library (shader-effects-inc). They render with WebGPU,
 * so this checks support first and unmounts the effect while it is off screen.
 */
export function ShaderStage({ children, fallback, className }: ShaderStageProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap)
  const reduced = useReducedMotion()
  const [gpu, setGpu] = useState(false)

  useEffect(() => {
    let alive = true
    hasWebGPU().then((ok) => alive && setGpu(ok))
    return () => {
      alive = false
    }
  }, [])

  const live = gpu && inView && !reduced

  return (
    <div ref={wrap} className={className} style={{ position: 'relative' }}>
      {live ? children : fallback}
    </div>
  )
}
