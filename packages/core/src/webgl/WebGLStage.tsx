import { Canvas, type CanvasProps } from '@react-three/fiber'
import { useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../motion/useReducedMotion'
import { deviceTier, hasWebGL2 } from './capabilities'
import { useInView } from './useInView'

type WebGLStageProps = Omit<CanvasProps, 'children' | 'fallback'> & {
  /** The three.js scene (React Three Fiber children). */
  children: ReactNode
  /** Static stand-in (SVG or image) shown without WebGL, before mount, and for reduced motion. */
  fallback: ReactNode
  className?: string
  /** Render a still frame instead of a loop when the visitor prefers reduced motion. */
  stillOnReducedMotion?: boolean
}

/**
 * React Three Fiber canvas with the guard rails every scene needs: a static fallback, capped
 * pixel ratio, and a render loop that stops while the canvas is off screen.
 */
export function WebGLStage({ children, fallback, className, stillOnReducedMotion = true, ...canvasProps }: WebGLStageProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap)
  const reduced = useReducedMotion()
  const [supported] = useState(() => typeof document !== 'undefined' && hasWebGL2())

  const still = reduced && stillOnReducedMotion
  const dpr: [number, number] = typeof window !== 'undefined' && deviceTier() === 'low' ? [1, 1.5] : [1, 2]

  return (
    <div ref={wrap} className={className} style={{ position: 'relative' }}>
      {supported ? (
        <Canvas
          dpr={dpr}
          frameloop={still ? 'demand' : inView ? 'always' : 'never'}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
          {...canvasProps}
        >
          {children}
        </Canvas>
      ) : (
        fallback
      )}
    </div>
  )
}
