// 1.2 wireframe world model (Research boards). viewBox 440 × 460, sphere centre (220, 232), r 130.

export const GLOBE = { w: 440, h: 460, cx: 220, cy: 232, r: 130 }
export const DECISION = { x: 196, y: 186 }

export const GLOBE_NODES = [
  { id: 'n0', x: 146, y: 140, label: 'DESIGN', lx: 80, ly: 128 },
  { id: 'n1', x: 292, y: 160, label: 'ENGINEERING', lx: 300, ly: 152 },
  { id: 'n2', x: 124, y: 250, label: 'SALES', lx: 70, ly: 272 },
  { id: 'n3', x: 306, y: 276, label: 'OPERATIONS', lx: 316, ly: 284 },
  { id: 'n4', x: 196, y: 324, label: 'FINANCE', lx: 166, ly: 348 },
  { id: 'n5', x: 262, y: 222, label: 'SUPPORT', lx: 272, ly: 228 },
] as const

export const GLOBE_LABEL = 'A wireframe world model: six business functions as tracked points on one sphere, linked to a single decision'
