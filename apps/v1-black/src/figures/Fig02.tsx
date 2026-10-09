import { useRef } from 'react'
import { useFigureDraw } from '../lib/useFigureDraw'
import { FigCaption } from '../components/ui'

const WIRE = '#3A3A42'
const ARROW = '#55555C'

/** Panel A at tablet/desktop (608×280): tokens in one direction, a context window, tokens per decision. */
function SequenceWide() {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const tokens = ['T1', 'T2', 'T3', 'T4', '…', 'TN']
  return (
    <svg ref={ref} viewBox="0 0 608 280" className="fig h-auto w-full" role="img" aria-label="A linear chain of tokens inside a context window">
      <defs>
        <marker id="ar1" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={ARROW} />
        </marker>
      </defs>
      <g fontSize="11">
        {tokens.map((t, i) => (
          <g key={t} data-f="node">
            <rect x={12 + i * 84} y="110" width="60" height="40" fill="#08080A" stroke={WIRE} />
            <text x={42 + i * 84} y="134" textAnchor="middle" fill="#CFCFD4">
              {t}
            </text>
          </g>
        ))}
        <g data-f="late">
          <rect data-f="march" x="516" y="110" width="76" height="40" fill="none" stroke="#3E57DA" strokeDasharray="4 3" />
          <text x="554" y="134" textAnchor="middle" fill="#6F83F0">
            NEXT?
          </text>
        </g>
      </g>
      <g stroke={ARROW} markerEnd="url(#ar1)">
        {[72, 156, 240, 324, 408, 492].map((x) => (
          <line key={x} data-f="fade" x1={x} y1="130" x2={x + 22} y2="130" />
        ))}
      </g>
      <path data-f="draw" d="M12 166 V174 H492 V166" fill="none" stroke={ARROW} />
      <g fontSize="10" fill="#808080">
        <text data-f="fade" x="12" y="60">ONE DIRECTION · FULLY OBSERVED · WRITTEN DOWN</text>
        <text data-f="fade" x="12" y="196">CONTEXT WINDOW · ONLY WHAT WAS WRITTEN DOWN</text>
        <text data-f="fade" x="12" y="246">TOKENS SPENT PER DECISION</text>
      </g>
      <g fill={WIRE}>
        <rect data-f="bar" x="210" y="238" width="20" height="10" />
        <rect data-f="bar" x="234" y="232" width="20" height="16" />
        <rect data-f="bar" x="258" y="224" width="20" height="24" />
        <rect data-f="bar" x="282" y="212" width="20" height="36" />
        <rect data-f="bar" x="306" y="196" width="20" height="52" />
      </g>
    </svg>
  )
}

/** Panel B at tablet/desktop: a living graph of functions with hidden (blue dashed) links. */
function SystemWide({ tablet = false }: { tablet?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const solid: [number, number, number, number][] = [
    [80, 70, 250, 50],
    [250, 50, 420, 80],
    [420, 80, 330, 190],
    [330, 190, 130, 200],
    [130, 200, 80, 70],
    [330, 190, 510, 210],
    [510, 210, 420, 80],
    [250, 50, 330, 190],
  ]
  const hidden: [number, number, number, number][] = [
    [80, 70, 210, 130],
    [210, 130, 330, 190],
    [420, 80, 470, 150],
    [470, 150, 510, 210],
    [420, 80, 560, 110],
    [560, 110, 510, 210],
  ]
  const nodes: [number, number][] = [
    [75, 65],
    [245, 45],
    [415, 75],
    [125, 195],
    [325, 185],
    [505, 205],
  ]
  return (
    <svg ref={ref} viewBox="0 0 608 280" className="fig h-auto w-full" role="img" aria-label="A graph of enterprise functions with hidden, undocumented links">
      <g stroke={WIRE}>
        {solid.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}${x2}${y2}`} data-f="draw" x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g data-f="late" stroke="#3E57DA" strokeDasharray="4 4" strokeOpacity="0.8">
        {hidden.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}${x2}${y2}`} data-f="march" x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g fill="#F5F5F5">
        {nodes.map(([x, y]) => (
          <rect key={`${x}${y}`} data-f="dot" x={x} y={y} width="10" height="10" />
        ))}
      </g>
      <g fill="#000" stroke="#3E57DA" strokeDasharray="3 2">
        <circle data-f="dot" cx="210" cy="130" r="8" />
        <circle data-f="dot" cx="470" cy="150" r="8" />
        <circle data-f="dot" cx="560" cy="110" r="8" />
      </g>
      <g data-f="fade" fontSize="10" fill="#CFCFD4">
        <text x="56" y="56">SALES</text>
        <text x="232" y="34">DESIGN</text>
        <text x="402" y="64">ENGINEERING</text>
        <text x="96" y="226">FINANCE</text>
        <text x="302" y="216">OPERATIONS</text>
        <text x="456" y="236">SUPPORT</text>
      </g>
      <g data-f="late" fontSize="10" fill="#6F83F0">
        <text x="222" y="128">?</text>
        <text x="482" y="148">?</text>
        <text x="572" y="106">?</text>
        {tablet ? (
          <text x="12" y="268">- - -  NEVER WRITTEN DOWN · PARTLY OBSERVABLE · ALWAYS CHANGING</text>
        ) : (
          <>
            <text x="140" y="268">- - -  NEVER WRITTEN DOWN · PARTLY OBSERVABLE</text>
            <text x="468" y="268" fill="#808080">
              ALWAYS CHANGING ↻
            </text>
          </>
        )}
      </g>
    </svg>
  )
}

function SequenceMobile() {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const tokens = ['T1', 'T2', '…', 'TN']
  return (
    <svg ref={ref} viewBox="0 0 330 170" className="fig h-auto w-full" role="img" aria-label="A linear chain of tokens">
      <defs>
        <marker id="mar1" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={ARROW} />
        </marker>
      </defs>
      <g fontSize="10" style={{ letterSpacing: '0.5px' }}>
        {tokens.map((t, i) => (
          <g key={t} data-f="node">
            <rect x={0.5 + i * 58} y="40" width="44" height="32" fill="#08080A" stroke={WIRE} />
            <text x={22 + i * 58} y="60" textAnchor="middle" fill="#CFCFD4">
              {t}
            </text>
          </g>
        ))}
        <g data-f="late">
          <rect data-f="march" x="232" y="40" width="64" height="32" fill="none" stroke="#3E57DA" strokeDasharray="4 3" />
          <text x="264" y="60" textAnchor="middle" fill="#6F83F0">
            NEXT?
          </text>
        </g>
      </g>
      <g stroke={ARROW} markerEnd="url(#mar1)">
        {[44, 102, 160, 218].map((x) => (
          <line key={x} data-f="fade" x1={x} y1="56" x2={x + 12} y2="56" />
        ))}
      </g>
      <path data-f="draw" d="M0.5 84 V90 H218 V84" fill="none" stroke={ARROW} />
      <g fontSize="9" fill="#808080">
        <text data-f="fade" x="0" y="16">ONE DIRECTION · FULLY OBSERVED</text>
        <text data-f="fade" x="0" y="108">CONTEXT WINDOW · WRITTEN DOWN ONLY</text>
        <text data-f="fade" x="0" y="160">TOKENS PER DECISION</text>
      </g>
      <g fill={WIRE}>
        <rect data-f="bar" x="130" y="150" width="14" height="10" />
        <rect data-f="bar" x="148" y="144" width="14" height="16" />
        <rect data-f="bar" x="166" y="136" width="14" height="24" />
        <rect data-f="bar" x="184" y="126" width="14" height="34" />
        <rect data-f="bar" x="202" y="114" width="14" height="46" />
      </g>
    </svg>
  )
}

function SystemMobile() {
  const ref = useRef<SVGSVGElement>(null)
  useFigureDraw(ref)
  const solid: [number, number, number, number][] = [
    [40, 50, 160, 30],
    [160, 30, 270, 60],
    [270, 60, 190, 140],
    [190, 140, 60, 160],
    [60, 160, 40, 50],
    [190, 140, 290, 170],
    [160, 30, 190, 140],
  ]
  const hidden: [number, number, number, number][] = [
    [40, 50, 110, 100],
    [110, 100, 190, 140],
    [270, 60, 250, 112],
    [250, 112, 290, 170],
    [270, 60, 314, 112],
    [314, 112, 290, 170],
  ]
  const nodes: [number, number][] = [
    [36, 46],
    [156, 26],
    [266, 56],
    [56, 156],
    [186, 136],
    [286, 166],
  ]
  return (
    <svg ref={ref} viewBox="0 0 330 210" className="fig h-auto w-full" role="img" aria-label="A graph of functions with hidden links">
      <g stroke={WIRE}>
        {solid.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}${x2}${y2}`} data-f="draw" x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g data-f="late" stroke="#3E57DA" strokeDasharray="4 4">
        {hidden.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}${x2}${y2}`} data-f="march" x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g fill="#F5F5F5">
        {nodes.map(([x, y]) => (
          <rect key={`${x}${y}`} data-f="dot" x={x} y={y} width="8" height="8" />
        ))}
      </g>
      <g fill="#000" stroke="#3E57DA" strokeDasharray="3 2">
        <circle data-f="dot" cx="110" cy="100" r="7" />
        <circle data-f="dot" cx="250" cy="112" r="7" />
        <circle data-f="dot" cx="314" cy="112" r="7" />
      </g>
      <g data-f="fade" fontSize="9" fill="#CFCFD4" style={{ letterSpacing: '0.5px' }}>
        <text x="18" y="38">SALES</text>
        <text x="140" y="18">DESIGN</text>
        <text x="236" y="48">ENGINEERING</text>
        <text x="30" y="182">FINANCE</text>
        <text x="160" y="160">OPERATIONS</text>
        <text x="262" y="190">SUPPORT</text>
      </g>
      <text data-f="late" x="0" y="206" fontSize="9" fill="#6F83F0">
        - - - NEVER WRITTEN DOWN · ALWAYS CHANGING
      </text>
    </svg>
  )
}

const panelLabel = 'font-mono text-[11px] tracking-[0.04em] text-meta uppercase md:text-xs'

/** FIG.02: a sequence of tokens vs. a living system of parts, processes and decisions. */
export function Fig02() {
  return (
    <figure className="flex flex-col gap-3 md:gap-4">
      {/* Phone: two stacked cards with the narrow drawings */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex flex-col gap-2.5 border border-rule py-4 pr-2 pl-4">
          <span className={panelLabel}>A · Language: one sequence</span>
          <SequenceMobile />
        </div>
        <div className="flex flex-col gap-2.5 border border-rule py-4 pr-2 pl-4">
          <span className={panelLabel}>B · An enterprise: a living system</span>
          <SystemMobile />
        </div>
      </div>
      {/* Tablet: stacked in one frame · Desktop: side by side */}
      <div className="hidden border border-rule md:grid lg:grid-cols-2">
        <div className="flex flex-col gap-3 border-b border-rule p-6 lg:border-r lg:border-b-0">
          <span className={panelLabel}>A · Language: one sequence</span>
          <SequenceWide />
        </div>
        <div className="flex flex-col gap-3 p-6">
          <span className={panelLabel}>B · An enterprise: a living system</span>
          <div className="lg:hidden">
            <SystemWide tablet />
          </div>
          <div className="hidden lg:block">
            <SystemWide />
          </div>
        </div>
      </div>
      <FigCaption>
        <span className="md:hidden">Fig.02 — Tokens vs. a living system</span>
        <span className="hidden md:inline lg:hidden">Fig.02 — A sequence of tokens vs. a living system</span>
        <span className="hidden lg:inline">Fig.02 — A sequence of tokens vs. a living system of parts, processes and decisions</span>
      </FigCaption>
    </figure>
  )
}
