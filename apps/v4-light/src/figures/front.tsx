import { functions, research } from '@skyfall/core'

const INK = '#0e1116'
const LINE = '#c9cfdb'
const BRAND = '#3e57da'
const MONO = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em' } as const

/** A straight chain of tokens above a branching system of the six enterprise functions. */
export function ProblemFigure() {
  const chain = Array.from({ length: 9 }, (_, i) => 30 + i * 50)
  const nodes = functions.map((f, i) => {
    const a = (i / functions.length) * Math.PI * 2 - Math.PI / 2
    return { f, x: 240 + Math.cos(a) * 150, y: 300 + Math.sin(a) * 92 }
  })
  return (
    <svg viewBox="0 0 480 440" role="img" aria-label="Next-token prediction is a linear chain of tokens; an enterprise is a connected system of sales, design, engineering, customer support, finance and operations." className="w-full">
      <text x="30" y="26" fill="#5c6474" style={MONO}>
        NEXT-TOKEN PREDICTION
      </text>
      <path d={`M${chain[0]} 60H${chain[chain.length - 1]}`} stroke={LINE} strokeWidth="1.5" strokeDasharray="4 4" className="flow" />
      {chain.map((x, i) => (
        <rect key={x} x={x - 9} y={51} width="18" height="18" rx="4" fill={i === chain.length - 1 ? '#fff' : LINE} stroke={i === chain.length - 1 ? INK : 'none'} strokeDasharray="3 3" />
      ))}
      <path d="M30 120H450" stroke="#e2e6ee" />
      <text x="30" y="160" fill={BRAND} style={MONO}>
        {research.mission.emphasis.replace('.', '').toUpperCase()}
      </text>
      {nodes.map((a, i) =>
        nodes.slice(i + 1).map((b) => <path key={`${a.f}-${b.f}`} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} stroke={BRAND} strokeOpacity="0.22" strokeWidth="1" />),
      )}
      {nodes.map((n) => (
        <path key={n.f} d={`M240 300L${n.x} ${n.y}`} stroke={BRAND} strokeWidth="1.5" strokeDasharray="4 4" className="flow" />
      ))}
      <circle cx="240" cy="300" r="22" fill={BRAND} />
      <circle cx="240" cy="300" r="34" fill="none" stroke={BRAND} strokeOpacity="0.3" />
      {nodes.map((n) => (
        <g key={n.f}>
          <circle cx={n.x} cy={n.y} r="7" fill="#fff" stroke={BRAND} strokeWidth="2" />
          <text x={n.x} y={n.y + (n.y < 300 ? -16 : 26)} textAnchor="middle" fill={INK} style={{ fontFamily: 'var(--font-sans)', fontSize: 13 }}>
            {n.f}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Small line glyph per build step: learn, simulate, plan, guardrails. */
export function StepGlyph({ step }: { step: string }) {
  const common = { fill: 'none', stroke: BRAND, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      {step === 'learn' && (
        <g {...common}>
          {[14, 32, 50].flatMap((x) => [14, 32, 50].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={x === 32 && y === 32 ? 6 : 2.5} fill={x === 32 && y === 32 ? BRAND : '#fff'} />))}
          <path d="M14 14 32 32 50 14M14 50 32 32 50 50" strokeOpacity="0.5" />
        </g>
      )}
      {step === 'simulate' && (
        <g {...common}>
          <circle cx="14" cy="32" r="6" fill={BRAND} />
          <path d="M22 32h10M32 32l14-14M32 32l14 14M32 32h14" />
          <circle cx="50" cy="16" r="3.5" />
          <circle cx="50" cy="32" r="3.5" />
          <circle cx="50" cy="48" r="3.5" />
        </g>
      )}
      {step === 'plan' && (
        <g {...common}>
          <path d="M8 48h12V36h12V24h12V12h12" />
          <circle cx="56" cy="12" r="4" fill={BRAND} />
          <path d="M8 56h48" strokeOpacity="0.3" />
        </g>
      )}
      {step === 'guardrails' && (
        <g {...common}>
          <path d="M10 12v40M54 12v40" />
          <path d="M32 54C24 44 40 34 32 24S32 12 32 10" strokeDasharray="4 4" className="flow" />
          <circle cx="32" cy="54" r="4" fill={BRAND} />
        </g>
      )}
    </svg>
  )
}

/** Cost, speed and quality as three axes, with the old trade-off triangle and the new frontier. No data. */
export function ParetoFigure() {
  const cx = 240
  const cy = 215
  const pt = (i: number, r: number) => {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const
  }
  const poly = (r: number) => [0, 1, 2].map((i) => pt(i, r).join(',')).join(' ')
  return (
    <svg viewBox="0 0 480 400" role="img" aria-label={`Three axes, ${research.pareto.axes.join(', ')}, with a frontier that extends on all three at once.`} className="w-full">
      {[60, 110, 160].map((r) => (
        <polygon key={r} points={poly(r)} fill="none" stroke="#e2e6ee" />
      ))}
      {[0, 1, 2].map((i) => {
        const [x, y] = pt(i, 160)
        return <path key={i} d={`M${cx} ${cy}L${x} ${y}`} stroke="#e2e6ee" />
      })}
      <polygon points={poly(80)} fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="5 5" />
      <polygon points={poly(160)} fill={BRAND} fillOpacity="0.08" stroke={BRAND} strokeWidth="2" />
      {research.pareto.axes.map((axis, i) => {
        const [x, y] = pt(i, 160)
        const [lx, ly] = pt(i, 188)
        return (
          <g key={axis}>
            <circle cx={x} cy={y} r="6" fill={BRAND} />
            <text x={lx} y={ly + 4} textAnchor="middle" fill={INK} style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500 }}>
              {axis}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
