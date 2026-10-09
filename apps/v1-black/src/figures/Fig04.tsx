import { useRef } from 'react'
import { useFigureDraw } from '../lib/useFigureDraw'

const GREY = '#55555C'
const BRAND = '#3E57DA'
const LIFT = '#6F83F0'

/** FIG.04 (tablet/desktop, 700×440): world models move the cost/quality frontier up and left. */
export function Fig04Wide({ grid = true }: { grid?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const frontier = 'M100 280 C 140 150, 220 82, 420 52'
  return (
    <svg
      ref={ref}
      viewBox="0 0 700 440"
      className="fig h-auto w-full border border-rule"
      role="img"
      aria-label="Conceptual chart: world models shift the cost and quality frontier up and to the left"
    >
      <defs>
        <marker id="ar4" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={BRAND} />
        </marker>
      </defs>
      {grid && (
        <g data-f="grid" stroke="#17171B">
          <line x1="70" y1="100" x2="670" y2="100" />
          <line x1="70" y1="180" x2="670" y2="180" />
          <line x1="70" y1="260" x2="670" y2="260" />
          <line x1="220" y1="30" x2="220" y2="370" />
          <line x1="370" y1="30" x2="370" y2="370" />
          <line x1="520" y1="30" x2="520" y2="370" />
        </g>
      )}
      <path data-f="draw" d="M70 30 V370 H670" fill="none" stroke={GREY} />
      <g data-f="fade" fontSize="10" fill="#808080">
        <text x="70" y="20">QUALITY ↑</text>
        <text x="670" y="396" textAnchor="end">
          COST PER DECISION →
        </text>
        <text x="670" y="426" textAnchor="end" fill={GREY}>
          CONCEPTUAL · NOT TO SCALE
        </text>
      </g>
      <path data-f="fade" d="M300 340 C 390 220, 470 150, 650 96" fill="none" stroke={GREY} strokeDasharray="5 5" />
      <g fill="#3A3A42">
        <circle data-f="dot" cx="560" cy="120" r="6" />
        <circle data-f="dot" cx="600" cy="104" r="6" />
        <circle data-f="dot" cx="535" cy="140" r="6" />
        <circle data-f="dot" cx="620" cy="132" r="6" />
      </g>
      <g fill="none" stroke="#808080">
        <circle data-f="dot" cx="360" cy="248" r="6" />
        <circle data-f="dot" cx="398" cy="214" r="6" />
        <circle data-f="dot" cx="332" cy="282" r="6" />
        <circle data-f="dot" cx="432" cy="192" r="6" />
        {grid && <circle data-f="dot" cx="388" cy="262" r="6" />}
      </g>
      <g data-f="fade" fontSize="10" fill="#CFCFD4">
        <text x="520" y="174">HUMAN TEAMS</text>
        <text x="300" y="316">LANGUAGE MODELS</text>
        {grid && (
          <text x="472" y="84" fill="#808080">
            TODAY&apos;S TRADE-OFF
          </text>
        )}
      </g>
      <path data-f="active" d={frontier} fill="none" stroke={BRAND} strokeWidth="2" />
      <path data-f="pulse" d={frontier} fill="none" stroke={LIFT} strokeWidth="3" opacity="0" />
      <g fill={BRAND}>
        <rect data-f="dot" x="134" y="160" width="8" height="8" />
        <rect data-f="dot" x="200" y="100" width="8" height="8" />
        <rect data-f="dot" x="290" y="68" width="8" height="8" />
      </g>
      <path data-f="late" d="M420 200 L262 128" fill="none" stroke={BRAND} strokeDasharray="4 4" markerEnd="url(#ar4)" />
      <text data-f="late" x="118" y="44" fontSize="10" fill={LIFT}>
        WORLD MODELS · NEW FRONTIER
      </text>
    </svg>
  )
}

export function Fig04Mobile() {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const frontier = 'M50 200 C70 110, 120 60, 232 42'
  return (
    <svg ref={ref} viewBox="0 0 350 290" className="fig h-auto w-full border border-rule" role="img" aria-label="Conceptual chart: world models shift the frontier">
      <defs>
        <marker id="mar4" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={BRAND} />
        </marker>
      </defs>
      <path data-f="draw" d="M36 24 V240 H336" fill="none" stroke={GREY} />
      <path data-f="fade" d="M150 232 C200 150, 250 105, 332 74" fill="none" stroke={GREY} strokeDasharray="5 5" />
      <g fill="#3A3A42">
        <circle data-f="dot" cx="290" cy="92" r="5" />
        <circle data-f="dot" cx="312" cy="82" r="5" />
        <circle data-f="dot" cx="280" cy="106" r="5" />
        <circle data-f="dot" cx="318" cy="100" r="5" />
      </g>
      <g fill="none" stroke="#808080">
        <circle data-f="dot" cx="190" cy="170" r="5" />
        <circle data-f="dot" cx="210" cy="150" r="5" />
        <circle data-f="dot" cx="176" cy="190" r="5" />
        <circle data-f="dot" cx="230" cy="136" r="5" />
      </g>
      <path data-f="active" d={frontier} fill="none" stroke={BRAND} strokeWidth="2" />
      <path data-f="pulse" d={frontier} fill="none" stroke={LIFT} strokeWidth="3" opacity="0" />
      <g fill={BRAND}>
        <rect data-f="dot" x="64" y="126" width="7" height="7" />
        <rect data-f="dot" x="96" y="82" width="7" height="7" />
        <rect data-f="dot" x="146" y="54" width="7" height="7" />
      </g>
      <path data-f="late" d="M222 162 L136 110" fill="none" stroke={BRAND} strokeDasharray="4 4" markerEnd="url(#mar4)" />
      <g fontSize="9" style={{ letterSpacing: '0.5px' }}>
        <g data-f="fade">
          <text x="36" y="16" fill="#808080">
            QUALITY ↑
          </text>
          <text x="336" y="258" textAnchor="end" fill="#808080">
            COST PER DECISION →
          </text>
          <text x="336" y="278" textAnchor="end" fill={GREY}>
            CONCEPTUAL · NOT TO SCALE
          </text>
          <text x="248" y="130" fill="#CFCFD4">
            HUMAN TEAMS
          </text>
          <text x="120" y="214" fill="#CFCFD4">
            LANGUAGE MODELS
          </text>
        </g>
        <text data-f="late" x="76" y="36" fill={LIFT}>
          WORLD MODELS
        </text>
      </g>
    </svg>
  )
}
