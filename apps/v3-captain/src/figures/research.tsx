// Research figures, converted from the boards (Research-*.dc.html) and ../figs.txt.
// Class hooks for motion: .fd = stroke draws in, .ff = fades in, .fp = pops in.

const MONO = 'Geist Mono, monospace'

/** Fig.02 A · Language (desktop): a chain of tokens inside a context window. */
export function Fig2A() {
  return (
    <svg viewBox="0 0 608 280" className="block h-auto w-full" role="img" aria-label="A linear chain of tokens inside a context window">
      <defs>
        <marker id="ar1" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#B9BFCB" />
        </marker>
      </defs>
      <g fontFamily={MONO} fontSize="11" letterSpacing="0.6">
        {['T1', 'T2', 'T3', 'T4', '…', 'TN'].map((t, i) => (
          <g key={t} className="fp">
            <rect x={12 + i * 84} y="110" width="60" height="40" fill="#fff" stroke="#B9BFCB" />
            <text x={42 + i * 84} y="134" textAnchor="middle" fill="#3B4256">
              {t}
            </text>
          </g>
        ))}
        <g className="fp">
          <rect x="516" y="110" width="76" height="40" fill="none" stroke="#3E57DA" strokeDasharray="4 3" />
          <text x="554" y="134" textAnchor="middle" fill="#3E57DA">
            NEXT?
          </text>
        </g>
      </g>
      <g stroke="#B9BFCB" markerEnd="url(#ar1)">
        {[72, 156, 240, 324, 408, 492].map((x) => (
          <line key={x} className="fd" x1={x} y1="130" x2={x + 22} y2="130" />
        ))}
      </g>
      <path className="fd" d="M12 166 V174 H492 V166" fill="none" stroke="#B9BFCB" />
      <g className="ff" fontFamily={MONO} fontSize="10" fill="#6B7180" letterSpacing="0.6">
        <text x="12" y="60">
          ONE DIRECTION · FULLY OBSERVED · WRITTEN DOWN
        </text>
        <text x="12" y="196">
          CONTEXT WINDOW · ONLY WHAT WAS WRITTEN DOWN
        </text>
        <text x="12" y="246">
          TOKENS SPENT PER DECISION
        </text>
      </g>
      <g fill="#B9BFCB">
        <rect className="fp" x="210" y="238" width="20" height="10" />
        <rect className="fp" x="234" y="232" width="20" height="16" />
        <rect className="fp" x="258" y="224" width="20" height="24" />
        <rect className="fp" x="282" y="212" width="20" height="36" />
        <rect className="fp" x="306" y="196" width="20" height="52" />
      </g>
    </svg>
  )
}

/** Fig.02 B · Enterprise (desktop): functions with hidden, undocumented links. */
export function Fig2B() {
  return (
    <svg viewBox="0 0 608 280" className="block h-auto w-full" role="img" aria-label="A graph of enterprise functions with hidden, undocumented links">
      <g stroke="#B9BFCB">
        {[
          [80, 70, 250, 50],
          [250, 50, 420, 80],
          [420, 80, 330, 190],
          [330, 190, 130, 200],
          [130, 200, 80, 70],
          [330, 190, 510, 210],
          [510, 210, 420, 80],
          [250, 50, 330, 190],
        ].map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}${x2}${y2}`} className="fd" x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g className="ff flow-slow" stroke="#3E57DA" strokeDasharray="4 4" strokeOpacity="0.8">
        <line x1="80" y1="70" x2="210" y2="130" />
        <line x1="210" y1="130" x2="330" y2="190" />
        <line x1="420" y1="80" x2="470" y2="150" />
        <line x1="470" y1="150" x2="510" y2="210" />
        <line x1="420" y1="80" x2="560" y2="110" />
        <line x1="560" y1="110" x2="510" y2="210" />
      </g>
      <g fill="#0B1338">
        {[
          [75, 65],
          [245, 45],
          [415, 75],
          [125, 195],
          [325, 185],
          [505, 205],
        ].map(([x, y]) => (
          <rect key={`${x}${y}`} className="fp" x={x} y={y} width="10" height="10" />
        ))}
      </g>
      <g fill="#fff" stroke="#3E57DA" strokeDasharray="3 2">
        <circle className="fp" cx="210" cy="130" r="8" />
        <circle className="fp" cx="470" cy="150" r="8" />
        <circle className="fp" cx="560" cy="110" r="8" />
      </g>
      <g className="ff" fontFamily={MONO} fontSize="10" fill="#3B4256" letterSpacing="0.6">
        <text x="56" y="56">SALES</text>
        <text x="232" y="34">DESIGN</text>
        <text x="402" y="64">ENGINEERING</text>
        <text x="96" y="226">FINANCE</text>
        <text x="302" y="216">OPERATIONS</text>
        <text x="456" y="236">SUPPORT</text>
      </g>
      <g className="ff" fontFamily={MONO} fontSize="10" fill="#3E57DA" letterSpacing="0.6">
        <text x="222" y="128">?</text>
        <text x="482" y="148">?</text>
        <text x="572" y="106">?</text>
        <text x="140" y="268">
          - - - NEVER WRITTEN DOWN · PARTLY OBSERVABLE
        </text>
      </g>
      <text className="ff" x="448" y="268" fontFamily={MONO} fontSize="10" fill="#6B7180" letterSpacing="0.6">
        ALWAYS CHANGING ↻
      </text>
    </svg>
  )
}

/** Fig.02 A, phone variant. */
export function Fig2AMobile() {
  return (
    <svg viewBox="0 0 330 170" className="block h-auto w-full" role="img" aria-label="A linear chain of tokens">
      <defs>
        <marker id="mar1" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#B9BFCB" />
        </marker>
      </defs>
      <g fontFamily={MONO} fontSize="10" letterSpacing="0.5">
        {['T1', 'T2', '…', 'TN'].map((t, i) => (
          <g key={t} className="fp">
            <rect x={i * 58} y="40" width="44" height="32" fill="#fff" stroke="#B9BFCB" />
            <text x={22 + i * 58} y="60" textAnchor="middle" fill="#3B4256">
              {t}
            </text>
          </g>
        ))}
        <g className="fp">
          <rect x="232" y="40" width="64" height="32" fill="none" stroke="#3E57DA" strokeDasharray="4 3" />
          <text x="264" y="60" textAnchor="middle" fill="#3E57DA">
            NEXT?
          </text>
        </g>
      </g>
      <g stroke="#B9BFCB" markerEnd="url(#mar1)">
        {[44, 102, 160, 218].map((x) => (
          <line key={x} className="fd" x1={x} y1="56" x2={x + 12} y2="56" />
        ))}
      </g>
      <path className="fd" d="M0 84 V90 H218 V84" fill="none" stroke="#B9BFCB" />
      <g className="ff" fontFamily={MONO} fontSize="9" fill="#6B7180" letterSpacing="0.5">
        <text x="0" y="16">
          ONE DIRECTION · FULLY OBSERVED
        </text>
        <text x="0" y="108">
          CONTEXT WINDOW · WRITTEN DOWN ONLY
        </text>
        <text x="0" y="160">
          TOKENS PER DECISION
        </text>
      </g>
      <g fill="#B9BFCB">
        <rect className="fp" x="130" y="150" width="14" height="10" />
        <rect className="fp" x="148" y="144" width="14" height="16" />
        <rect className="fp" x="166" y="136" width="14" height="24" />
        <rect className="fp" x="184" y="126" width="14" height="34" />
        <rect className="fp" x="202" y="114" width="14" height="46" />
      </g>
    </svg>
  )
}

/** Fig.02 B, phone variant. */
export function Fig2BMobile() {
  return (
    <svg viewBox="0 0 330 210" className="block h-auto w-full" role="img" aria-label="A graph of functions with hidden links">
      <g stroke="#B9BFCB">
        {[
          [40, 50, 160, 30],
          [160, 30, 270, 60],
          [270, 60, 190, 140],
          [190, 140, 60, 160],
          [60, 160, 40, 50],
          [190, 140, 290, 170],
          [160, 30, 190, 140],
        ].map(([x1, y1, x2, y2]) => (
          <line key={`${x1}${y1}${x2}${y2}`} className="fd" x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g className="ff flow-slow" stroke="#3E57DA" strokeDasharray="4 4">
        <line x1="40" y1="50" x2="110" y2="100" />
        <line x1="110" y1="100" x2="190" y2="140" />
        <line x1="270" y1="60" x2="250" y2="112" />
        <line x1="250" y1="112" x2="290" y2="170" />
        <line x1="270" y1="60" x2="314" y2="112" />
        <line x1="314" y1="112" x2="290" y2="170" />
      </g>
      <g fill="#0B1338">
        {[
          [36, 46],
          [156, 26],
          [266, 56],
          [56, 156],
          [186, 136],
          [286, 166],
        ].map(([x, y]) => (
          <rect key={`${x}${y}`} className="fp" x={x} y={y} width="8" height="8" />
        ))}
      </g>
      <g fill="#fff" stroke="#3E57DA" strokeDasharray="3 2">
        <circle className="fp" cx="110" cy="100" r="7" />
        <circle className="fp" cx="250" cy="112" r="7" />
        <circle className="fp" cx="314" cy="112" r="7" />
      </g>
      <g className="ff" fontFamily={MONO} fontSize="9" fill="#3B4256" letterSpacing="0.5">
        <text x="18" y="38">SALES</text>
        <text x="140" y="18">DESIGN</text>
        <text x="236" y="48">ENGINEERING</text>
        <text x="30" y="182">FINANCE</text>
        <text x="160" y="160">OPERATIONS</text>
        <text x="262" y="190">SUPPORT</text>
      </g>
      <text className="ff" x="0" y="206" fontFamily={MONO} fontSize="9" fill="#3E57DA" letterSpacing="0.5">
        - - - NEVER WRITTEN DOWN · ALWAYS CHANGING
      </text>
    </svg>
  )
}

/** Fig.04 (desktop): world models shift the frontier. `.wm` marks the "With world models" layer. */
export function Fig4() {
  return (
    <svg viewBox="0 0 700 440" className="block h-auto w-full border border-line" role="img" aria-label="Conceptual chart: world models shift the cost and quality frontier up and to the left">
      <defs>
        <marker id="ar4" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#3E57DA" />
        </marker>
      </defs>
      <g stroke="#ECEEF3">
        {[100, 180, 260].map((y) => (
          <line key={y} className="fd" x1="70" y1={y} x2="670" y2={y} />
        ))}
        {[220, 370, 520].map((x) => (
          <line key={x} className="fd" x1={x} y1="30" x2={x} y2="370" />
        ))}
      </g>
      <path className="fd" d="M70 30 V370 H670" fill="none" stroke="#B9BFCB" />
      <g className="ff" fontFamily={MONO} fontSize="11" fill="#6B7180" letterSpacing="0.6">
        <text x="70" y="20">
          QUALITY ↑
        </text>
        <text x="670" y="396" textAnchor="end">
          COST PER DECISION →
        </text>
        <text x="670" y="426" textAnchor="end" fill="#B9BFCB">
          CONCEPTUAL · NOT TO SCALE
        </text>
      </g>
      <path className="ff" d="M300 340 C 390 220, 470 150, 650 96" fill="none" stroke="#B9BFCB" strokeDasharray="5 5" />
      <g fill="#B9BFCB">
        <circle className="fp" cx="560" cy="120" r="6" />
        <circle className="fp" cx="600" cy="104" r="6" />
        <circle className="fp" cx="535" cy="140" r="6" />
        <circle className="fp" cx="620" cy="132" r="6" />
      </g>
      <g fill="none" stroke="#6B7180">
        <circle className="fp" cx="360" cy="248" r="6" />
        <circle className="fp" cx="398" cy="214" r="6" />
        <circle className="fp" cx="332" cy="282" r="6" />
        <circle className="fp" cx="432" cy="192" r="6" />
        <circle className="fp" cx="388" cy="262" r="6" />
      </g>
      <g className="ff" fontFamily={MONO} fontSize="11" fill="#3B4256" letterSpacing="0.6">
        <text x="520" y="174">
          HUMAN TEAMS
        </text>
        <text x="300" y="316">
          LANGUAGE MODELS
        </text>
        <text x="472" y="84" fill="#6B7180">
          TODAY&apos;S TRADE-OFF
        </text>
      </g>
      <g className="wm">
        <path className="wm-draw" d="M100 280 C 140 150, 220 82, 420 52" fill="none" stroke="#3E57DA" strokeWidth="2" />
        <g fill="#3E57DA">
          <rect className="wm-pop" x="134" y="160" width="8" height="8" />
          <rect className="wm-pop" x="200" y="100" width="8" height="8" />
          <rect className="wm-pop" x="290" y="68" width="8" height="8" />
        </g>
        <path className="wm-fade flow-slow" d="M420 200 L262 128" fill="none" stroke="#3E57DA" strokeDasharray="4 4" markerEnd="url(#ar4)" />
        <text className="wm-fade" x="118" y="44" fontFamily={MONO} fontSize="11" fill="#3E57DA" letterSpacing="0.6">
          WORLD MODELS · NEW FRONTIER
        </text>
      </g>
    </svg>
  )
}

/** Fig.04, phone variant. */
export function Fig4Mobile() {
  return (
    <svg viewBox="0 0 350 290" className="block h-auto w-full border border-line" role="img" aria-label="Conceptual chart: world models shift the frontier">
      <defs>
        <marker id="mar4" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#3E57DA" />
        </marker>
      </defs>
      <path className="fd" d="M36 24 V240 H336" fill="none" stroke="#B9BFCB" />
      <path className="ff" d="M150 232 C200 150, 250 105, 332 74" fill="none" stroke="#B9BFCB" strokeDasharray="5 5" />
      <g fill="#B9BFCB">
        <circle className="fp" cx="290" cy="92" r="5" />
        <circle className="fp" cx="312" cy="82" r="5" />
        <circle className="fp" cx="280" cy="106" r="5" />
        <circle className="fp" cx="318" cy="100" r="5" />
      </g>
      <g fill="none" stroke="#6B7180">
        <circle className="fp" cx="190" cy="170" r="5" />
        <circle className="fp" cx="210" cy="150" r="5" />
        <circle className="fp" cx="176" cy="190" r="5" />
        <circle className="fp" cx="230" cy="136" r="5" />
      </g>
      <g className="ff" fontFamily={MONO} fontSize="9" letterSpacing="0.5">
        <text x="36" y="16" fill="#6B7180">
          QUALITY ↑
        </text>
        <text x="336" y="258" textAnchor="end" fill="#6B7180">
          COST PER DECISION →
        </text>
        <text x="336" y="278" textAnchor="end" fill="#B9BFCB">
          CONCEPTUAL · NOT TO SCALE
        </text>
        <text x="248" y="130" fill="#3B4256">
          HUMAN TEAMS
        </text>
        <text x="120" y="214" fill="#3B4256">
          LANGUAGE MODELS
        </text>
      </g>
      <g className="wm">
        <path className="wm-draw" d="M50 200 C70 110, 120 60, 232 42" fill="none" stroke="#3E57DA" strokeWidth="2" />
        <g fill="#3E57DA">
          <rect className="wm-pop" x="64" y="126" width="7" height="7" />
          <rect className="wm-pop" x="96" y="82" width="7" height="7" />
          <rect className="wm-pop" x="146" y="54" width="7" height="7" />
        </g>
        <path className="wm-fade flow-slow" d="M222 162 L136 110" fill="none" stroke="#3E57DA" strokeDasharray="4 4" markerEnd="url(#mar4)" />
        <text className="wm-fade" x="76" y="36" fontFamily={MONO} fontSize="9" fill="#3E57DA" letterSpacing="0.5">
          WORLD MODELS
        </text>
      </g>
    </svg>
  )
}
