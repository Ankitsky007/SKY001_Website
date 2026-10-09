// The hero "decision sea" from the boards (Main.dc.html desktop, Hero-Mobile.dc.html phone).
// Coordinates are board pixels; the live WebGL scene reuses them as screen fractions.

type Fn = { id: string; x: number; y: number; label: string; dx: number; dy: number; anchor?: 'end' }

export type SeaLayout = {
  w: number
  h: number
  font: number
  nodeR: number
  dec: { x: number; y: number; size: number; reticle: string; label: { dx: number; dy: number } }
  fns: Fn[]
  faint: { id: string; x: number; y: number; r: number }[]
  faintLines: [string, string][]
}

export const SEA_DESKTOP: SeaLayout = {
  w: 1440,
  h: 340,
  font: 11,
  nodeR: 6,
  dec: { x: 720, y: 165, size: 16, reticle: 'M-20 -14v-6h6M14 -14v-6h-6M-20 14v6h6M14 14v6h-6', label: { dx: 24, dy: -17 } },
  fns: [
    { id: 'f0', x: 300, y: 96, label: 'DESIGN', dx: 14, dy: -4 },
    { id: 'f1', x: 520, y: 214, label: 'ENGINEERING', dx: 14, dy: -4 },
    { id: 'f2', x: 1000, y: 100, label: 'SALES', dx: 14, dy: -4 },
    { id: 'f3', x: 1190, y: 206, label: 'OPERATIONS', dx: 14, dy: -4 },
    { id: 'f4', x: 250, y: 268, label: 'FINANCE', dx: 14, dy: -4 },
    { id: 'f5', x: 930, y: 262, label: 'SUPPORT', dx: 14, dy: -4 },
  ],
  faint: [
    { id: 'g0', x: 110, y: 140, r: 4 },
    { id: 'g1', x: 640, y: 80, r: 3.5 },
    { id: 'g2', x: 840, y: 120, r: 4 },
    { id: 'g3', x: 1330, y: 130, r: 4 },
    { id: 'g4', x: 420, y: 150, r: 4 },
    { id: 'g5', x: 1100, y: 280, r: 5 },
    { id: 'g6', x: 1290, y: 300, r: 5 },
    { id: 'g7', x: 160, y: 310, r: 5 },
    { id: 'g8', x: 590, y: 300, r: 5 },
  ],
  faintLines: [
    ['g0', 'f0'],
    ['g1', 'g2'],
    ['g2', 'f2'],
    ['f3', 'g3'],
    ['g4', 'f1'],
    ['g7', 'f4'],
    ['f5', 'g5'],
    ['g5', 'g6'],
    ['f1', 'g8'],
  ],
}

export const SEA_MOBILE: SeaLayout = {
  w: 390,
  h: 300,
  font: 9,
  nodeR: 5,
  dec: { x: 195, y: 130, size: 12, reticle: 'M-14 -10v-5h5M14 -10v-5h-5M-14 10v5h5M14 10v5h-5', label: { dx: 19, dy: -8 } },
  fns: [
    { id: 'f0', x: 60, y: 78, label: 'DESIGN', dx: 10, dy: -4 },
    { id: 'f2', x: 300, y: 70, label: 'SALES', dx: 10, dy: -4 },
    { id: 'f1', x: 120, y: 182, label: 'ENGINEERING', dx: 10, dy: -4 },
    { id: 'f3', x: 310, y: 164, label: 'OPERATIONS', dx: -8, dy: 18, anchor: 'end' },
    { id: 'f4', x: 48, y: 226, label: 'FINANCE', dx: 10, dy: -4 },
    { id: 'f5', x: 246, y: 214, label: 'SUPPORT', dx: 10, dy: -4 },
  ],
  faint: [],
  faintLines: [],
}

/** All the points a layout places, in board pixels. */
export function seaPoints(l: SeaLayout) {
  const pts: Record<string, { x: number; y: number }> = { d: { x: l.dec.x, y: l.dec.y } }
  for (const f of l.fns) pts[f.id] = { x: f.x, y: f.y }
  for (const g of l.faint) pts[g.id] = { x: g.x, y: g.y }
  return pts
}
