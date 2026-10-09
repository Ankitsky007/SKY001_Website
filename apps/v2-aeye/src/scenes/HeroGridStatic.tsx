import { useMemo } from 'react'
import { cellLevel, type GridLayout } from './heroGrid'

const COLS = 64
const RING_CLASS: Record<string, string> = { '1': 'k0', '0.6': 'k1', '0.34': 'k2', '0.18': 'k3', '0.09': 'k4' }

type Props = {
  layout: GridLayout
  /** True once the WebGL scene has taken over; stops the CSS pulse underneath it. */
  live: boolean
}

/**
 * Static SVG pixel grid: the WebGL scene's fallback (no WebGL2, reduced motion, first paint).
 * Right-anchored like the shader. Rings pulse outward with plain CSS, off under reduced motion.
 */
export function HeroGridStatic({ layout, live }: Props) {
  const { cell, rows } = layout
  const width = COLS * cell
  const height = rows * cell

  const cells = useMemo(() => {
    const out: { key: string; x: number; y: number; level: number }[] = []
    for (let rc = 0; rc < COLS; rc++) {
      for (let r = 0; r < rows; r++) {
        const level = cellLevel(rc, r, layout)
        if (level > 0) out.push({ key: `${rc}-${r}`, x: (COLS - 1 - rc) * cell + 1, y: r * cell + 1, level })
      }
    }
    return out
  }, [layout, rows, cell])

  const patternId = `hero-grid-${cell}`

  return (
    <svg
      aria-hidden="true"
      className="grid-static absolute top-0 right-0 block"
      data-live={live ? 'true' : 'false'}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
    >
      <defs>
        <pattern id={patternId} width={cell} height={cell} patternUnits="userSpaceOnUse">
          <rect width="1" height={cell} fill="#3D3D3D" />
          <rect width={cell} height="1" fill="#3D3D3D" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="#1A1A1A" />
      <g fill="#3E57DA">
        {cells.map((c) => (
          <rect key={c.key} className={`k ${RING_CLASS[String(c.level)] ?? 'k4'}`} x={c.x} y={c.y} width={cell - 1} height={cell - 1} fillOpacity={c.level} />
        ))}
      </g>
      <rect width={width} height={height} fill={`url(#${patternId})`} />
    </svg>
  )
}
