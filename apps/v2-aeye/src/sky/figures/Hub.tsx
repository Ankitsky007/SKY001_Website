import { cylinderBack, cylinderBody, ellipse, hubParts, type Cyl } from '../lib/iso'

export type Tone = 'light' | 'dark'

const PALETTE = {
  light: {
    fill: '#FFFFFF',
    stroke: '#1A1A1A',
    ghost: '#ADADAD',
    soft: '#E0E0E0',
  },
  dark: {
    fill: '#1A1A1A',
    stroke: '#F5F5F5',
    ghost: '#5C5C5C',
    soft: '#3D3D3D',
  },
} as const

const BRAND = '#3E57DA'

/**
 * One cylinder in three layers the figures animate separately: a dashed ghost (planned), a blue
 * base sketch (the 2D profile) and the solid body (extruded).
 */
function Part({ c, tone, bore, layers }: { c: Cyl; tone: Tone; bore?: number; layers: { ghost?: boolean; sketch?: boolean } }) {
  const p = PALETTE[tone]
  const top = c.cy - c.h
  return (
    <g>
      {layers.ghost && (
        <g data-ghost fill="none" stroke={p.ghost} strokeDasharray="4 4" vectorEffect="non-scaling-stroke">
          <path d={cylinderBody(c.cx, c.cy, c.r, c.h)} />
          <path d={cylinderBack(c.cx, c.cy, c.r)} />
          <path d={ellipse(c.cx, top, c.r)} />
        </g>
      )}
      <g data-solid>
        <path data-body d={cylinderBody(c.cx, c.cy, c.r, c.h)} fill={p.fill} stroke={p.stroke} strokeLinejoin="round" />
        <path data-cap d={ellipse(c.cx, top, c.r)} fill={p.fill} stroke={p.stroke} />
        {bore ? <path d={ellipse(c.cx, top, bore)} fill={p.soft} stroke={p.stroke} /> : null}
      </g>
      {layers.sketch && <path data-sketch d={ellipse(c.cx, c.cy, c.r)} fill="none" stroke={BRAND} strokeWidth="2" />}
    </g>
  )
}

/**
 * The flanged hub as a part tree: flange (level 1), barrel (level 1) and six bolts (level 2).
 * Each level is a `[data-lvl]` group so a figure can explode or stack it by moving the group.
 */
export function Hub({ cx, base, scale = 1, tone = 'light', ghost = false, sketch = false }: { cx: number; base: number; scale?: number; tone?: Tone; ghost?: boolean; sketch?: boolean }) {
  const { flange, barrel, bore, bolts } = hubParts(cx, base, scale)
  const layers = { ghost, sketch }
  const boltGroup = (back: boolean) => (
    <g data-lvl="2" data-part={back ? 'bolts-back' : 'bolts-front'}>
      {bolts
        .filter((b) => b.back === back)
        .sort((a, b) => a.cyl.cy - b.cyl.cy)
        .map((b) => (
          <Part key={`${b.cyl.cx}`} c={b.cyl} tone={tone} layers={layers} />
        ))}
    </g>
  )
  return (
    <g data-hub>
      <g data-lvl="0" data-part="flange">
        <Part c={flange} tone={tone} layers={layers} />
      </g>
      {boltGroup(true)}
      <g data-lvl="1" data-part="barrel">
        <Part c={barrel} tone={tone} bore={bore.r} layers={layers} />
      </g>
      {boltGroup(false)}
    </g>
  )
}
