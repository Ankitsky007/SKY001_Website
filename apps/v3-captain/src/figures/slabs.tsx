import { useId, type CSSProperties, type ReactNode } from 'react'

// Four stacked isometric slabs (Research boards, steps panel). One slab per step; the active one
// lifts and turns blue with captain's glyph texture. Colours transition in CSS so the sequence is
// a pure function of the active index (reversible when scrolling back).

const TOP = ['#C7CCD7', '#3E57DA']
const LEFT = ['#B9BFCB', '#2C3FA6']
const RIGHT = ['#ADB3C0', '#24358F']
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const T: CSSProperties = { transition: `fill .6s ${EASE}, stroke .6s ${EASE}, opacity .6s ${EASE}, transform .8s ${EASE}` }

const LABELS = ['01 LATENT SPACE', '02 CAUSE → EFFECT', '03 LONG HORIZON', '04 GUARDRAILS']

function Slab({ i, on, glyph, children }: { i: number; on: boolean; glyph: string; children: (on: boolean) => ReactNode }) {
  const y = 70 + i * 220
  const k = on ? 1 : 0
  const top = `M270 ${y} L460 ${y + 95} L270 ${y + 190} L80 ${y + 95} Z`
  return (
    <g style={{ ...T, transform: `translateY(${on ? -22 : 0}px)` }}>
      <path d={top} style={{ ...T, fill: TOP[k] }} />
      <path d={top} fill={`url(#${glyph})`} style={{ ...T, opacity: k }} />
      <path d={`M80 ${y + 95} L270 ${y + 190} L270 ${y + 224} L80 ${y + 129} Z`} style={{ ...T, fill: LEFT[k] }} />
      <path d={`M460 ${y + 95} L270 ${y + 190} L270 ${y + 224} L460 ${y + 129} Z`} style={{ ...T, fill: RIGHT[k] }} />
      {children(on)}
      <polyline points={`80,${y + 95} 270,${y + 190} 460,${y + 95}`} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="2" />
      <line x1="270" y1={y + 190} x2="270" y2={y + 224} stroke="#fff" strokeOpacity="0.85" strokeWidth="2" />
    </g>
  )
}

export function Slabs({ active, className }: { active: number; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const glyph = `gl-${uid}`
  const clip = `ct-${uid}`
  const ink = (on: boolean) => (on ? '#FFFFFF' : '#6B7180')

  return (
    <svg viewBox="0 20 540 960" className={className} role="img" aria-label={`Four stacked slabs, one per step; slab ${active + 1} is active`}>
      <defs>
        <pattern id={glyph} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="1.6" height="4" fill="#fff" fillOpacity="0.5" />
          <rect x="7" y="6" width="1.6" height="1.6" fill="#fff" fillOpacity="0.3" />
        </pattern>
        <clipPath id={clip}>
          <path d="M270 70 L460 165 L270 260 L80 165 Z" />
        </clipPath>
      </defs>

      {/* Bottom to top so upper slabs overlap lower ones. */}
      <Slab i={3} on={active === 3} glyph={glyph}>
        {(on) => (
          <path
            className={on ? 'flow' : undefined}
            d="M270 755 L410 825 L270 895 L130 825 Z"
            fill="none"
            strokeDasharray="6 6"
            strokeWidth={on ? 1.6 : 1}
            style={{ ...T, stroke: ink(on) }}
          />
        )}
      </Slab>
      <Slab i={2} on={active === 2} glyph={glyph}>
        {(on) => (
          <>
            <path
              className={on ? 'flow' : undefined}
              d="M150 605 C 210 560, 300 650, 390 600"
              fill="none"
              strokeWidth="1.6"
              strokeDasharray="6 6"
              style={{ ...T, stroke: ink(on) }}
            />
            <rect x="386" y="596" width="8" height="8" style={{ ...T, fill: ink(on) }} />
            <circle cx="150" cy="605" r="4" style={{ ...T, fill: on ? '#3E57DA' : '#FFFFFF', stroke: ink(on) }} />
          </>
        )}
      </Slab>
      <Slab i={1} on={active === 1} glyph={glyph}>
        {(on) => (
          <>
            <g style={{ ...T, stroke: on ? '#FFFFFF' : '#8E95A5' }}>
              <line x1="200" y1="370" x2="270" y2="340" />
              <line x1="270" y1="340" x2="340" y2="375" />
              <line x1="340" y1="375" x2="300" y2="420" />
              <line x1="300" y1="420" x2="220" y2="410" />
              <line x1="220" y1="410" x2="200" y2="370" />
              <line x1="270" y1="385" x2="270" y2="340" />
              <line x1="270" y1="385" x2="300" y2="420" />
              <line x1="270" y1="385" x2="200" y2="370" />
            </g>
            <g style={{ ...T, fill: on ? '#3E57DA' : '#FFFFFF', stroke: ink(on) }}>
              <circle cx="200" cy="370" r="4.5" />
              <circle cx="270" cy="340" r="4.5" />
              <circle cx="340" cy="375" r="4.5" />
              <circle cx="300" cy="420" r="4.5" />
              <circle cx="220" cy="410" r="4.5" />
              <circle cx="270" cy="385" r="5.5" />
            </g>
          </>
        )}
      </Slab>
      <Slab i={0} on={active === 0} glyph={glyph}>
        {(on) => (
          <g clipPath={`url(#${clip})`} fill="none" strokeWidth="1.5" style={{ ...T, stroke: ink(on), strokeOpacity: 0.75 }}>
            <path className={on ? 'slab-wave' : undefined} d="M60 150 C 140 120, 200 190, 280 150 S 400 120, 480 160" />
            <path className={on ? 'slab-wave' : undefined} d="M60 180 C 150 150, 210 220, 290 180 S 410 150, 480 190" />
          </g>
        )}
      </Slab>

      <g fontFamily="Geist Mono, monospace" letterSpacing="0.6" className="text-[17px] lg:text-[14px]">
        {LABELS.map((l, i) => (
          <text key={l} x="16" y={62 + i * 220} style={{ ...T, fill: i === active ? '#3E57DA' : '#6B7180' }}>
            {l}
          </text>
        ))}
      </g>
    </svg>
  )
}
