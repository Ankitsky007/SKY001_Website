// Line-drawing helpers for the SKY-001 figures: upright cylinders seen from above at an angle
// (ellipse ry = rx * TILT), so every engineered part on the page is drawn from the same few shapes.

export const TILT = 0.42

/** Full ellipse as a path, starting at its left point (good for drawSVG). */
export function ellipse(cx: number, cy: number, rx: number, ry = rx * TILT) {
  return `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`
}

/** Visible outline of an upright cylinder's body (sides + front of the base), base centre at cy. */
export function cylinderBody(cx: number, cy: number, r: number, h: number, ry = r * TILT) {
  return `M${cx - r} ${cy - h}V${cy}A${r} ${ry} 0 0 0 ${cx + r} ${cy}V${cy - h}A${r} ${ry} 0 0 0 ${cx - r} ${cy - h}Z`
}

/** Hidden half of the base ellipse, for dashed construction lines. */
export function cylinderBack(cx: number, cy: number, r: number, ry = r * TILT) {
  return `M${cx - r} ${cy}A${r} ${ry} 0 0 1 ${cx + r} ${cy}`
}

/** A point on a ring of radius `r` at angle `a` (radians, 0 = right, positive = away from the viewer). */
export function onRing(cx: number, cy: number, r: number, a: number) {
  return [cx + r * Math.cos(a), cy - r * TILT * Math.sin(a)] as const
}

export type Cyl = { cx: number; cy: number; r: number; h: number }

/**
 * The page's demo part: a flanged hub with a six-bolt circle, drawn in code (not a SKY-001 output).
 * Parts are listed back to front so they paint correctly; `level` is its depth in the part tree.
 */
export function hubParts(cx: number, base: number, s = 1) {
  const flange: Cyl = { cx, cy: base, r: 112 * s, h: 22 * s }
  const barrelBase = base - flange.h
  const barrel: Cyl = { cx, cy: barrelBase, r: 54 * s, h: 74 * s }
  const bolts = Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 6 + (i * Math.PI) / 3
    const [x, y] = onRing(cx, barrelBase, 84 * s, a)
    return {
      cyl: { cx: x, cy: y, r: 9 * s, h: 13 * s } as Cyl,
      back: Math.sin(a) > 0,
    }
  })
  return {
    flange,
    barrel,
    bore: { cx, cy: barrelBase - barrel.h, r: 24 * s },
    bolts,
  }
}
