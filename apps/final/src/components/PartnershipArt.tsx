// Header illustration for the partnership form, on the brand-blue ground. Three versions while the
// team chooses, picked with ?art= in the URL: 'handshake' (default, dithered hands meeting),
// 'cubes' (two dithered half-cubes locking into one) and 'bridge' (two isometric blocks joined by a
// bridge, in the campus hero's line language). Decorative only.
import { useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef } from 'react'
import { startDither, type DitherScene } from '../scenes/dither'

const ISO = 0.866

/** Top, left and right faces of an isometric box standing on (x, y), `w` wide and `h` tall. */
function box(x: number, y: number, w: number, h: number) {
  const dx = w * ISO
  const dy = w / 2
  const top = `M${x},${y - h} L${x + dx},${y - h - dy} L${x},${y - h - 2 * dy} L${x - dx},${y - h - dy} Z`
  const left = `M${x - dx},${y - h - dy} L${x},${y - h} L${x},${y} L${x - dx},${y - dy} Z`
  const right = `M${x},${y - h} L${x + dx},${y - h - dy} L${x + dx},${y - dy} L${x},${y} Z`
  return { top, left, right }
}

function Box({ x, y, w, h, solid = false }: { x: number; y: number; w: number; h: number; solid?: boolean }) {
  const b = box(x, y, w, h)
  return (
    <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round">
      <path d={b.left} fill={solid ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)'} />
      <path d={b.right} fill={solid ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)'} />
      <path d={b.top} fill={solid ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)'} />
    </g>
  )
}

function BridgeArt() {
  // a 3 x 3 stack of small blocks on the left, one solid block on the right
  const cells: [number, number, number][] = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push([r, c, [26, 18, 34, 22, 40, 26, 30, 20, 16][r * 3 + c]])
  const lx = 150
  const ly = 132
  const s = 22
  return (
    <div aria-hidden="true" className="relative h-40 overflow-hidden bg-brand sm:h-44">
      <svg viewBox="0 0 560 176" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs>
          <pattern id="partner-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.28)" />
          </pattern>
          <radialGradient id="partner-glow" cx="50%" cy="55%" r="50%">
            <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect width="560" height="176" fill="url(#partner-dots)" />
        <ellipse cx="280" cy="100" rx="190" ry="70" fill="url(#partner-glow)" />

        {/* the ground both blocks stand on */}
        <path d={`M${lx - 70},${ly + 6} L${280},${ly + 6 + 46} L${420 + 70},${ly + 6} `} fill="none" stroke="rgba(255,255,255,0.35)" strokeDasharray="2 5" />

        {/* left: a block made of parts */}
        {cells
          .slice()
          .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
          .map(([r, c, h]) => {
            const x = lx + (c - r) * s * ISO
            const y = ly - 18 + (c + r) * (s / 2)
            return <Box key={`${r}-${c}`} x={x} y={y} w={s * 0.92} h={h} />
          })}

        {/* right: the partner, one solid block */}
        <Box x={420} y={ly + 2} w={44} h={46} solid />

        {/* the bridge: work flows both ways between them */}
        <path d="M200,62 Q280,0 372,52" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
        <path d="M200,62 Q280,0 372,52" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 18" className="flow" />
        <circle cx="200" cy="62" r="3.5" fill="#FFFFFF" />
        <circle cx="372" cy="52" r="3.5" fill="#FFFFFF" />
        {/* the join at the top of the bridge */}
        <g transform="translate(284 31) rotate(45)">
          <rect x="-7" y="-7" width="14" height="14" fill="#FFFFFF" />
          <rect x="-3" y="-3" width="6" height="6" fill="#3E57DA" />
        </g>
      </svg>
    </div>
  )
}

function DitherArt({ scene, active }: { scene: DitherScene; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const cv = ref.current
    if (!cv || !active) return
    return startDither(cv, scene, reduced)
  }, [scene, active, reduced])
  return (
    <div aria-hidden="true" className="relative h-40 overflow-hidden bg-brand sm:h-44">
      <canvas ref={ref} className="absolute inset-0 size-full" />
    </div>
  )
}

type Art = DitherScene | 'bridge'
const pick = (): Art => {
  const q = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('art')
  return q === 'cubes' || q === 'bridge' ? q : 'handshake'
}

/** The header illustration; `active` restarts its animation each time the form opens. */
export function PartnershipArt({ active }: { active: boolean }) {
  const art = pick()
  return art === 'bridge' ? <BridgeArt /> : <DitherArt scene={art} active={active} />
}
