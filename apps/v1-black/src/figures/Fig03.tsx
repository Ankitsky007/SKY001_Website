import { useRef } from 'react'
import { useFigureDraw } from '../lib/useFigureDraw'

/**
 * FIG.03: six observed functions feed one Engineering World Model, which simulates alternatives,
 * plans a path to the goal state, executes and observes, all inside the safety guardrails.
 * Groups carry data-step so the step legend below the figure can spotlight one part.
 */

const WIRE = '#3A3A42'
const GREY = '#55555C'
const BRAND = '#3E57DA'
const LIFT = '#6F83F0'
const FUNCS_DESKTOP = ['SALES', 'DESIGN', 'ENGINEERING', 'CUSTOMER SUPPORT', 'FINANCE', 'OPERATIONS']
const FUNCS_SHORT = ['SALES', 'DESIGN', 'ENGINEERING', 'SUPPORT', 'FINANCE', 'OPERATIONS']

export function Fig03Desktop() {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const traj = 'M420 290 L500 244 L580 250 L660 200 L740 190 L820 152 L880 160'
  return (
    <svg
      ref={ref}
      viewBox="0 0 1312 440"
      className="fig h-auto w-full border border-rule"
      role="img"
      aria-label="Six enterprise functions feed one Engineering World Model that simulates and plans inside safety guardrails"
    >
      <defs>
        <pattern id="dots3" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="#2A2A33" />
        </pattern>
        <marker id="ar3" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={BRAND} />
        </marker>
        <marker id="ar3g" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={GREY} />
        </marker>
      </defs>

      <g data-step="guardrails">
        <rect data-f="march" x="20" y="20" width="1272" height="400" fill="none" stroke={BRAND} strokeOpacity="0.45" strokeDasharray="6 6" />
        <text data-f="late" x="40" y="408" fontSize="10" fill={LIFT}>
          - - -  SAFETY GUARDRAILS
        </text>
      </g>

      <g data-step="learn">
        <text data-f="fade" x="40" y="56" fontSize="10" fill="#808080">
          OBSERVED FUNCTIONS
        </text>
        {FUNCS_DESKTOP.map((f, i) => (
          <g key={f} data-f="node">
            <rect x="40" y={70 + i * 54} width="200" height="40" fill="#08080A" stroke={WIRE} />
            <text x="54" y={94 + i * 54} fontSize="11" fill="#CFCFD4">
              {f}
            </text>
          </g>
        ))}
        <g stroke={WIRE} fill="none">
          {FUNCS_DESKTOP.map((f, i) => (
            <path key={f} data-f="draw" d={`M240 ${90 + i * 54} H300`} />
          ))}
          <path data-f="draw" d="M300 90 V360" />
        </g>
        <path data-f="fade" d="M300 225 H356" stroke={BRAND} markerEnd="url(#ar3)" />
      </g>

      <g data-step="learn simulate plan">
        <rect data-f="node" x="360" y="70" width="560" height="310" fill="#06060C" stroke={BRAND} />
        <rect data-f="grid" x="380" y="132" width="520" height="186" fill="url(#dots3)" />
        <g data-f="fade">
          <text x="380" y="98" fontSize="12" fill={LIFT}>
            ENGINEERING WORLD MODEL
          </text>
          <text x="380" y="116" fontSize="10" fill="#808080">
            LATENT SPACE OF THE ENTERPRISE
          </text>
          <text x="380" y="356" fontSize="10" fill="#808080">
            SIMULATE CAUSE → EFFECT · EXPLORE · PLAN
          </text>
        </g>
      </g>

      <g data-step="simulate">
        <g fill="none" stroke={GREY} strokeDasharray="3 4">
          <path data-f="fade" d="M580 250 L650 290 L720 284" />
          <path data-f="fade" d="M660 200 L720 244 L790 236" />
          <path data-f="fade" d="M740 190 L800 230" />
        </g>
        <text data-f="fade" x="690" y="306" fontSize="10" fill="#808080">
          SIMULATED ALTERNATIVES
        </text>
      </g>

      <g data-step="simulate plan">
        <path data-f="active" d={traj} fill="none" stroke={BRAND} strokeWidth="1.5" />
        <path data-f="pulse" d={traj} fill="none" stroke={LIFT} strokeWidth="2.5" opacity="0" />
        <g fill={BRAND}>
          {[
            [417, 287],
            [497, 241],
            [577, 247],
            [657, 197],
            [737, 187],
            [817, 149],
          ].map(([x, y]) => (
            <rect key={x} data-f="dot" x={x} y={y} width="6" height="6" />
          ))}
        </g>
        <g data-f="late">
          <rect x="874" y="154" width="12" height="12" fill="none" stroke="#F5F5F5" />
          <text x="806" y="140" fontSize="10" fill="#F5F5F5">
            GOAL STATE
          </text>
        </g>
        <text data-f="fade" x="404" y="312" fontSize="10" fill="#808080">
          NOW
        </text>
      </g>

      <g data-step="plan">
        <path data-f="fade" d="M920 225 H996" stroke={BRAND} markerEnd="url(#ar3)" />
        <g data-f="node">
          <rect x="1000" y="110" width="260" height="50" fill="#08080A" stroke={BRAND} />
          <text x="1016" y="140" fontSize="11" fill={LIFT}>
            PLAN · LONG HORIZON
          </text>
        </g>
        <g data-f="node">
          <rect x="1000" y="180" width="260" height="50" fill="#08080A" stroke={BRAND} />
          <text x="1016" y="210" fontSize="11" fill={LIFT}>
            EXECUTE · ACROSS FUNCTIONS
          </text>
        </g>
        <g data-f="node">
          <rect x="1000" y="250" width="260" height="50" fill="#08080A" stroke={WIRE} />
          <text x="1016" y="280" fontSize="11" fill="#CFCFD4">
            OBSERVE · UPDATE THE MODEL
          </text>
        </g>
        <path data-f="draw" d="M1130 300 V346 H640 V380" fill="none" stroke={GREY} />
        <path data-f="late" d="M640 378 V384" fill="none" stroke={GREY} markerEnd="url(#ar3g)" />
        <text data-f="fade" x="960" y="338" fontSize="10" fill="#808080">
          FEEDBACK
        </text>
      </g>
    </svg>
  )
}

export function Fig03Tablet() {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const traj = 'M200 260 L240 230 L280 236 L320 200 L360 186 L390 150'
  return (
    <svg
      ref={ref}
      viewBox="0 14 421 462"
      className="fig h-auto w-full max-w-[548px]"
      role="img"
      aria-label="Six functions feed one world model that plans inside guardrails"
    >
      <defs>
        <pattern id="tsA" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#2A2A33" />
        </pattern>
        <marker id="tsar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={BRAND} />
        </marker>
      </defs>
      <g style={{ letterSpacing: '0.5px' }} fontSize="10">
        <g data-step="guardrails">
          <rect data-f="march" x="6" y="24" width="409" height="440" fill="none" stroke={BRAND} strokeOpacity="0.45" strokeDasharray="6 6" />
          <text data-f="late" x="18" y="452" fill={LIFT}>
            - - - SAFETY GUARDRAILS
          </text>
        </g>
        <g data-step="learn">
          <text data-f="fade" x="18" y="50" fill="#808080">
            OBSERVED
          </text>
          {FUNCS_SHORT.map((f, i) => (
            <g key={f} data-f="node">
              <rect x="18" y={60 + i * 40} width="118" height="30" fill="#08080A" stroke={WIRE} />
              <text x="26" y={79 + i * 40} fill="#CFCFD4">
                {f}
              </text>
            </g>
          ))}
          <g stroke={WIRE} fill="none">
            {FUNCS_SHORT.map((f, i) => (
              <path key={f} data-f="draw" d={`M136 ${75 + i * 40} H152`} />
            ))}
            <path data-f="draw" d="M152 75 V275" />
          </g>
          <path data-f="fade" d="M152 175 H176" stroke={BRAND} markerEnd="url(#tsar)" />
        </g>
        <g data-step="learn simulate plan">
          <rect data-f="node" x="180" y="60" width="225" height="230" fill="#06060C" stroke={BRAND} />
          <rect data-f="grid" x="190" y="104" width="205" height="172" fill="url(#tsA)" />
          <g data-f="fade">
            <text x="190" y="80" fill={LIFT}>
              WORLD MODEL
            </text>
            <text x="190" y="94" fontSize="9" fill="#808080">
              LATENT SPACE
            </text>
          </g>
        </g>
        <g data-step="simulate" fill="none" stroke={GREY} strokeDasharray="3 4">
          <path data-f="fade" d="M280 236 L320 262 L356 256" />
          <path data-f="fade" d="M320 200 L352 222" />
        </g>
        <g data-step="simulate plan">
          <path data-f="active" d={traj} fill="none" stroke={BRAND} strokeWidth="1.5" />
          <path data-f="pulse" d={traj} fill="none" stroke={LIFT} strokeWidth="2.5" opacity="0" />
          <g fill={BRAND}>
            {[
              [197, 257],
              [237, 227],
              [277, 233],
              [317, 197],
              [357, 183],
            ].map(([x, y]) => (
              <rect key={x} data-f="dot" x={x} y={y} width="6" height="6" />
            ))}
          </g>
          <rect data-f="late" x="384" y="144" width="12" height="12" fill="none" stroke="#F5F5F5" />
        </g>
        <g data-step="plan">
          <path data-f="fade" d="M292 290 V344" stroke={BRAND} markerEnd="url(#tsar)" />
          <g data-f="node">
            <rect x="180" y="350" width="108" height="40" fill="#08080A" stroke={BRAND} />
            <text x="192" y="374" fill={LIFT}>
              PLAN
            </text>
          </g>
          <g data-f="node">
            <rect x="297" y="350" width="108" height="40" fill="#08080A" stroke={BRAND} />
            <text x="309" y="374" fill={LIFT}>
              EXECUTE
            </text>
          </g>
          <path data-f="draw" d="M351 390 V420 H77 V294" fill="none" stroke={GREY} />
          <text data-f="fade" x="160" y="414" fill="#808080">
            FEEDBACK
          </text>
        </g>
      </g>
    </svg>
  )
}

/** Phone: the board stacks HTML function chips, a latent-space drawing and the plan steps. */
export function Fig03Mobile() {
  const ref = useRef<HTMLDivElement>(null)
  useFigureDraw(ref, { start: 'top 82%' })
  const traj = 'M24 170 L70 140 L110 150 L160 120 L210 110 L260 80 L292 86'
  const chip = 'border border-wire bg-node px-2 py-[9px]'
  return (
    <div ref={ref} className="flex flex-col gap-3 border border-dashed border-[#2E3A80] p-4">
      <div data-step="learn" className="flex flex-col gap-3">
        <span data-f="fade" className="font-mono text-[10px] tracking-[0.06em] text-meta">
          OBSERVED FUNCTIONS
        </span>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] tracking-[0.05em] text-soft">
          {FUNCS_DESKTOP.map((f) => (
            <span key={f} data-f="node" className={chip}>
              {f}
            </span>
          ))}
        </div>
        <div data-f="node" aria-hidden className="h-5 w-px self-center bg-brand" />
      </div>
      <svg data-step="learn simulate plan" viewBox="0 0 316 220" className="fig h-auto w-full" role="img" aria-label="World model latent space with a planned trajectory">
        <defs>
          <pattern id="md3" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#2A2A33" />
          </pattern>
        </defs>
        <g style={{ letterSpacing: '0.5px' }}>
          <rect data-f="node" x="0.5" y="0.5" width="315" height="219" fill="#06060C" stroke={BRAND} />
          <rect data-f="grid" x="12" y="44" width="292" height="140" fill="url(#md3)" />
          <g data-f="fade">
            <text x="12" y="20" fontSize="10" fill={LIFT}>
              ENGINEERING WORLD MODEL
            </text>
            <text x="12" y="34" fontSize="9" fill="#808080">
              LATENT SPACE OF THE ENTERPRISE
            </text>
            <text x="12" y="206" fontSize="9" fill="#808080">
              SIMULATE CAUSE → EFFECT · PLAN
            </text>
          </g>
          <g fill="none" stroke={GREY} strokeDasharray="3 4">
            <path data-f="fade" d="M110 150 L150 176 L190 170" />
            <path data-f="fade" d="M160 120 L200 146" />
          </g>
          <path data-f="active" d={traj} fill="none" stroke={BRAND} strokeWidth="1.5" />
          <path data-f="pulse" d={traj} fill="none" stroke={LIFT} strokeWidth="2.5" opacity="0" />
          <g fill={BRAND}>
            {[
              [21, 167],
              [67, 137],
              [107, 147],
              [157, 117],
              [207, 107],
              [257, 77],
            ].map(([x, y]) => (
              <rect key={x} data-f="dot" x={x} y={y} width="6" height="6" />
            ))}
          </g>
          <g data-f="late">
            <rect x="286" y="80" width="12" height="12" fill="none" stroke="#F5F5F5" />
            <text x="236" y="68" fontSize="9" fill="#F5F5F5">
              GOAL STATE
            </text>
          </g>
        </g>
      </svg>
      <div data-step="plan" className="flex flex-col gap-3">
        <div data-f="node" aria-hidden className="h-5 w-px self-center bg-brand" />
        <div className="flex flex-col gap-1.5 font-mono text-[10px] tracking-[0.05em]">
          <span data-f="node" className="border border-brand bg-node px-2 py-2.5 text-brand-lift">
            PLAN · LONG HORIZON
          </span>
          <span data-f="node" className="border border-brand bg-node px-2 py-2.5 text-brand-lift">
            EXECUTE · ACROSS FUNCTIONS
          </span>
          <span data-f="node" className="border border-wire bg-node px-2 py-2.5 text-soft">
            OBSERVE · UPDATE THE MODEL ↺
          </span>
        </div>
      </div>
      <span data-step="guardrails" className="font-mono text-[10px] tracking-[0.06em] text-brand-lift">
        - - - SAFETY GUARDRAILS
      </span>
    </div>
  )
}
