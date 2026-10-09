import { forwardRef } from 'react'
import { DECISION, GLOBE_LABEL, GLOBE_NODES } from './globeData'

const MONO = 'Geist Mono, monospace'
// Mobile board bumps type because the figure renders at 342px; desktop renders at 440px.
const LABEL_CLS = 'text-[12px] lg:text-[10px]'
const META_CLS = 'text-[13px] lg:text-[11px]'

/** Compass rings, bearings, the navy disk and the readout: everything that does not spin. */
export function GlobeFrame({ disk = true }: { disk?: boolean }) {
  return (
    <>
      <ellipse cx="220" cy="244" rx="205" ry="178" fill="none" stroke="#fff" strokeOpacity="0.35" />
      <ellipse cx="220" cy="232" rx="205" ry="178" fill="none" stroke="#fff" strokeOpacity="0.9" />
      <ellipse cx="220" cy="232" rx="194" ry="168" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="7" strokeDasharray="1.2 13" />
      <g fontFamily={MONO} className={META_CLS} fill="#fff" fillOpacity="0.8" letterSpacing="0.6" textAnchor="middle">
        <text x="220" y="48">000</text>
        <text x="424" y="236" textAnchor="end">
          090
        </text>
        <text x="220" y="434">180</text>
        <text x="16" y="236" textAnchor="start">
          270
        </text>
      </g>
      {disk && <circle cx="220" cy="232" r="130" fill="#0B1338" stroke="#fff" strokeWidth="1.2" />}
      <text x="150" y="88" fontFamily={MONO} className={META_CLS} fill="#fff" letterSpacing="0.6">
        SKY-001 <tspan fill="#8D9DF0">Δ LATENT</tspan>
      </text>
    </>
  )
}

/** Nodes, labels and the tracked decision. Live, the WebGL scene moves them via data-at. */
export function GlobeMarks() {
  return (
    <>
      <g fill="#0B1338" stroke="#fff" strokeWidth="1.5">
        {GLOBE_NODES.map((n) => (
          <circle key={n.id} data-at={n.id} data-node={n.id} cx={n.x} cy={n.y} r="5.5" />
        ))}
      </g>
      <g fontFamily={MONO} className={LABEL_CLS} fill="#fff" letterSpacing="0.6">
        {GLOBE_NODES.map((n) => (
          <text key={n.id} data-at={n.id} data-dx={n.lx - n.x} data-dy={n.ly - n.y} x={n.lx} y={n.ly}>
            {n.label}
          </text>
        ))}
      </g>
      <g data-at="d" transform={`translate(${DECISION.x} ${DECISION.y})`}>
        <rect x="-6" y="-6" width="12" height="12" fill="#8D9DF0" />
        <path className="reticle" d="M-14 -8v-6h6M14 -8v-6h-6M-14 8v6h6M14 8v6h-6" fill="none" stroke="#fff" strokeWidth="1.5" />
      </g>
    </>
  )
}


/** The board's SVG globe (grid spins in CSS). First paint, reduced motion and no-WebGL fallback. */
export function GlobeFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 460" className={className} role="img" aria-label={GLOBE_LABEL}>
      <GlobeFrame disk={false} />
      <g className="globe-spin">
        <circle cx="220" cy="232" r="130" fill="#0B1338" stroke="#fff" strokeWidth="1.2" />
        <g fill="none" stroke="#fff" strokeOpacity="0.55" transform="rotate(-18 220 232)">
          <line x1="220" y1="102" x2="220" y2="362" />
          {[33.6, 65, 91.9, 112.6, 125.6].map((rx) => (
            <ellipse key={rx} cx="220" cy="232" rx={rx} ry="130" />
          ))}
          <ellipse cx="220" cy="232" rx="130" ry="39" />
          <ellipse cx="220" cy="190" rx="122" ry="36.6" />
          <ellipse cx="220" cy="274" rx="122" ry="36.6" />
          <ellipse cx="220" cy="153" rx="99.6" ry="29.9" />
          <ellipse cx="220" cy="311" rx="99.6" ry="29.9" />
          <ellipse cx="220" cy="125" rx="65" ry="19.5" />
          <ellipse cx="220" cy="339" rx="65" ry="19.5" />
        </g>
      </g>
      <g className="flow" stroke="#8D9DF0" strokeWidth="1.5" strokeDasharray="6 6" fill="none">
        {GLOBE_NODES.map((n) => (
          <line key={n.id} x1={DECISION.x} y1={DECISION.y} x2={n.x} y2={n.y} />
        ))}
      </g>
      <GlobeMarks />
    </svg>
  )
}

/** Live overlay (same viewBox as the canvas' orthographic camera). */
export const GlobeOverlay = forwardRef<SVGSVGElement, { className?: string }>(function GlobeOverlay({ className }, ref) {
  return (
    <svg ref={ref} viewBox="0 0 440 460" className={className} aria-hidden="true" data-overlay="">
      <GlobeMarks />
    </svg>
  )
})

