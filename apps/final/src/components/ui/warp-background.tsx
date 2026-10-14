// Warp background (after the Magic UI component Ankit supplied, 2026-10-13): four grid walls in
// perspective with beams of light running along them towards the viewer. Adapted for this site:
// beams are shades of logo blue instead of random hues, random values are fixed per beam so
// re-renders do not reshuffle them, the default frame (border, radius, padding) is left to the
// caller, and reduced motion gets the grid without the beams.
import { useReducedMotion } from '@skyfall/core/motion'
import { motion } from 'motion/react'
import { useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  perspective?: number
  beamsPerSide?: number
  beamSize?: number
  beamDelayMax?: number
  beamDelayMin?: number
  beamDuration?: number
  gridColor?: string
}

function Beam({ width, x, delay, duration }: { width: string; x: string; delay: number; duration: number }) {
  // Logo-blue family: hue stays near 231, lightness and length vary beam to beam.
  const [look] = useState(() => ({ hue: 224 + Math.floor(Math.random() * 14), light: 52 + Math.floor(Math.random() * 22), ratio: Math.floor(Math.random() * 10) + 1 }))
  return (
    <motion.div
      style={{ '--x': x, '--width': width, '--aspect-ratio': `${look.ratio}`, '--background': `linear-gradient(hsl(${look.hue} 68% ${look.light}%), transparent)` } as CSSProperties}
      className="absolute top-0 left-[var(--x)] [aspect-ratio:1/var(--aspect-ratio)] [width:var(--width)] [background:var(--background)]"
      initial={{ y: '100cqmax', x: '-50%' }}
      animate={{ y: '-100%', x: '-50%' }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  )
}

const WALL =
  'absolute [transform-style:preserve-3d] [container-type:inline-size] [height:100cqmax] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)]'

export function WarpBackground({ children, perspective = 100, className, beamsPerSide = 3, beamSize = 5, beamDelayMax = 3, beamDelayMin = 0, beamDuration = 3, gridColor = 'var(--color-line)', ...props }: WarpBackgroundProps) {
  const reduced = useReducedMotion()
  const sides = useMemo(() => {
    const side = () => {
      const cellsPerSide = Math.floor(100 / beamSize)
      const step = cellsPerSide / beamsPerSide
      return Array.from({ length: beamsPerSide }, (_, i) => ({ x: Math.floor(i * step), delay: Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin }))
    }
    return { top: side(), right: side(), bottom: side(), left: side() }
  }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin])

  const beams = (list: { x: number; delay: number }[], name: string) =>
    reduced ? null : list.map((beam, i) => <Beam key={`${name}-${i}`} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delay={beam.delay} duration={beamDuration} />)

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        style={{ '--perspective': `${perspective}px`, '--grid-color': gridColor, '--beam-size': `${beamSize}%` } as CSSProperties}
        className="pointer-events-none absolute top-0 left-0 size-full overflow-hidden [clip-path:inset(0)] [container-type:size] [perspective:var(--perspective)] [transform-style:preserve-3d]"
      >
        <div className={`${WALL} [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)]`}>{beams(sides.top, 'top')}</div>
        <div className={`${WALL} top-full [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)]`}>{beams(sides.bottom, 'bottom')}</div>
        <div className={`${WALL} top-0 left-0 [width:100cqh] [transform-origin:0%_0%] [transform:rotate(90deg)_rotateX(-90deg)]`}>{beams(sides.left, 'left')}</div>
        <div className={`${WALL} top-0 right-0 [width:100cqh] [transform-origin:100%_0%] [transform:rotate(-90deg)_rotateX(-90deg)]`}>{beams(sides.right, 'right')}</div>
      </div>
      {children !== undefined && <div className="relative">{children}</div>}
    </div>
  )
}
