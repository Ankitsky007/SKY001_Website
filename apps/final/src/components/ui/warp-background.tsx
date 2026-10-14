// Warp background (after the Magic UI component Ankit supplied, 2026-10-13): four grid walls in
// perspective with beams of light running along them towards the viewer. Adapted for this site:
// beams are shades of logo blue instead of random hues, random values are fixed per beam so
// re-renders do not reshuffle them, the default frame (border, radius, padding) is left to the
// caller, and reduced motion gets the grid without the beams. The grid cell is one fixed size in
// pixels on all four walls (the original sized it as a percentage of each wall, so the side walls,
// which are as long as the hero is tall, got smaller cells than the top and bottom ones).
import { useReducedMotion } from '@skyfall/core/motion'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
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
      initial={{ y: '100cqmax', x: '0%' }}
      animate={{ y: '-100%', x: '0%' }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  )
}

const WALL =
  'absolute [transform-style:preserve-3d] [container-type:inline-size] [height:100cqmax] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--cell))_0_0_/var(--cell)_var(--cell),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--cell))_0_0_/var(--cell)_var(--cell)]'

export function WarpBackground({ children, perspective = 100, className, beamsPerSide = 3, beamSize = 5, beamDelayMax = 3, beamDelayMin = 0, beamDuration = 3, gridColor = 'var(--color-line)', ...props }: WarpBackgroundProps) {
  const reduced = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // one cell size for every wall: beamSize percent of the hero's width
  const cell = Math.max(28, (size.w * beamSize) / 100)
  const sides = useMemo(() => {
    const side = (length: number) => {
      const cells = Math.max(1, Math.floor(length / cell))
      const step = cells / beamsPerSide
      return Array.from({ length: beamsPerSide }, (_, i) => ({ x: Math.floor(i * step), delay: Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin }))
    }
    return { top: side(size.w), right: side(size.h), bottom: side(size.w), left: side(size.h) }
  }, [beamsPerSide, cell, size.w, size.h, beamDelayMax, beamDelayMin])

  const beams = (list: { x: number; delay: number }[], name: string) =>
    reduced || !size.w ? null : list.map((beam, i) => <Beam key={`${name}-${i}`} width={`${cell}px`} x={`${beam.x * cell}px`} delay={beam.delay} duration={beamDuration} />)

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        ref={box}
        style={{ '--perspective': `${perspective}px`, '--grid-color': gridColor, '--cell': `${cell}px` } as CSSProperties}
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
