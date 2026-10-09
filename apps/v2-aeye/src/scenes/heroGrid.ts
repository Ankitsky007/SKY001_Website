// Shared geometry for the hero pixel grid ("one decision ripples through six functions").
// Both the static SVG fallback and the WebGL shader read from here, so they light the same cells.
// Cells are counted from the RIGHT edge (rc) and the top edge (r), so the decision cell keeps its
// place beside the right margin at every width while the grid simply extends to the left.

export type GridMode = 'mobile' | 'tablet' | 'desktop'

export type GridLayout = {
  /** Cell size in CSS px. */
  cell: number
  /** Number of rows (band height = rows * cell). */
  rows: number
  /** The decision cell (Δ). */
  origin: readonly [rc: number, r: number]
  /** One target cell per entry of `functions` (Sales, Design, Engineering, Customer support, Finance, Operations). */
  targets: readonly (readonly [rc: number, r: number])[]
}

// Offsets from the storyboard boards (Main.dc.html and Hero-Mobile.dc.html).
export const GRID_LAYOUTS: Record<GridMode, GridLayout> = {
  desktop: {
    cell: 48,
    rows: 8,
    origin: [7, 3],
    targets: [
      [10, 3],
      [9, 1],
      [5, 1],
      [5, 5],
      [9, 5],
      [4, 4],
    ],
  },
  // No tablet board: desktop arrangement, pulled closer to the right edge so it clears the logo.
  tablet: {
    cell: 48,
    rows: 8,
    origin: [4, 3],
    targets: [
      [7, 3],
      [6, 1],
      [2, 1],
      [2, 5],
      [6, 5],
      [1, 4],
    ],
  },
  mobile: {
    cell: 44,
    rows: 7,
    origin: [2, 3],
    targets: [
      [5, 2],
      [4, 1],
      [1, 0],
      [1, 6],
      [4, 5],
      [3, 6],
    ],
  },
}

/** Ripple cycle length in seconds (the storyboard's 6s pulse). */
export const CYCLE = 6
/** When label i starts receiving the decision, in seconds into the cycle. */
export const labelStart = (i: number) => 1.2 + i * 0.65
/** How long the route from Δ to a label takes to travel. */
export const ROUTE_TIME = 0.35
/** How long a label stays lit after the route arrives. */
export const LABEL_HOLD = 1.25

/** Shared clock so pointer events (DOM) and the shader agree on time. */
export const T0 = typeof performance !== 'undefined' ? performance.now() : 0
export const now = () => (performance.now() - T0) / 1000

/** Integer hash that gives identical results in JS doubles and GLSL floats (all values stay < 2^24). */
export function cellHash(rc: number, r: number) {
  const n = rc * 37 + r * 113 + rc * rc * 7 + r * r * 13
  return ((n * 97) % 101) / 101
}

/** Resting brightness of a cell (0 = dark), matching the storyboard rings k0..k4. */
export function cellLevel(rc: number, r: number, layout: GridLayout) {
  const d = Math.hypot(rc - layout.origin[0], r - layout.origin[1])
  if (layout.targets.some(([trc, tr]) => trc === rc && tr === r)) return 0.34
  if (d < 0.5) return 1
  if (d < 1.5) return 0.6
  const h = cellHash(rc, r)
  if (d < 3.4) return h < 0.5 ? 0.34 : 0
  if (d < 5) return h < 0.32 ? 0.18 : 0
  if (d < 7.6) return h < 0.22 ? 0.09 : 0
  return 0
}

export function gridModeFor(width: number): GridMode {
  return width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
}

/** Cheap WebGL2 probe kept out of the three.js chunk. */
export function canUseWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

/** Pointer trail handed from the DOM to the shader: last 8 cells visited, with timestamps. */
export type PointerState = {
  trail: Float32Array
  head: number
  last: string
  click: [number, number, number]
}

export function createPointerState(): PointerState {
  const trail = new Float32Array(24)
  for (let i = 0; i < 8; i++) trail[i * 3 + 2] = -100
  return { trail, head: 0, last: '', click: [0, 0, -100] }
}
