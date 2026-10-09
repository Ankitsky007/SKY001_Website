import { forwardRef, type CSSProperties } from 'react'
import { seaPoints, SEA_DESKTOP, SEA_MOBILE, type SeaLayout } from './seaData'

/**
 * Nodes, links and labels of the sea. Static (with viewBox) it is the board SVG; live (no viewBox)
 * it is an overlay whose marks the WebGL scene moves every frame via data-at / data-from.
 */
export const SeaGraph = forwardRef<SVGSVGElement, { layout: SeaLayout; live?: boolean; className?: string }>(function SeaGraph(
  { layout: l, live = false, className },
  ref,
) {
  const pts = seaPoints(l)
  const at = (id: string) => pts[id]
  return (
    <svg
      ref={ref}
      viewBox={live ? undefined : `0 0 ${l.w} ${l.h}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      className={className}
      data-overlay={live ? '' : undefined}
      style={{ overflow: 'visible' }}
    >
      <g stroke="#fff" strokeOpacity="0.18">
        {l.faintLines.map(([a, b]) => (
          <line key={a + b} data-from={a} data-to={b} x1={at(a).x} y1={at(a).y} x2={at(b).x} y2={at(b).y} />
        ))}
      </g>
      <g className="flow" stroke="#fff" strokeOpacity="0.75" strokeDasharray="6 6" fill="none">
        {l.fns.map((f) => (
          <line key={f.id} data-from="d" data-to={f.id} x1={l.dec.x} y1={l.dec.y} x2={f.x} y2={f.y} />
        ))}
      </g>
      <g fill="none" stroke="#fff" strokeOpacity="0.45">
        {l.faint.map((g) => (
          <circle key={g.id} data-at={g.id} cx={g.x} cy={g.y} r={g.r} />
        ))}
      </g>
      <g stroke="#fff" strokeWidth="1.4">
        {l.fns.map((f, i) => (
          <circle
            key={f.id}
            data-at={f.id}
            className="node-lit"
            style={{ animationDelay: `${i * 0.5}s` } as CSSProperties}
            cx={f.x}
            cy={f.y}
            r={l.nodeR}
            fill="#3E57DA"
          />
        ))}
      </g>
      <g fontFamily="Geist Mono, monospace" fontSize={l.font} fill="#fff" letterSpacing="0.6" stroke="#3E57DA" strokeWidth="3" strokeOpacity="0.85" paintOrder="stroke">
        {l.fns.map((f) => (
          <text key={f.id} data-at={f.id} data-dx={f.dx} data-dy={f.dy} x={f.x + f.dx} y={f.y + f.dy} textAnchor={f.anchor}>
            {f.label}
          </text>
        ))}
      </g>
      <g data-at="d" transform={`translate(${l.dec.x} ${l.dec.y})`}>
        <rect x={-l.dec.size / 2} y={-l.dec.size / 2} width={l.dec.size} height={l.dec.size} fill="#fff" />
        <path className="reticle" d={l.dec.reticle} fill="none" stroke="#fff" strokeWidth="1.4" />
        <text
          x={l.dec.label.dx}
          y={l.dec.label.dy}
          fontFamily="Geist Mono, monospace"
          fontSize={l.font}
          fontWeight="600"
          fill="#fff"
          letterSpacing="0.6"
          stroke="#3E57DA"
          strokeWidth="3"
          strokeOpacity="0.85"
          paintOrder="stroke"
        >
          Δ ONE DECISION
        </text>
      </g>
    </svg>
  )
})

type Row = [top: number, height: number, w: number, t: number, image: string, size: string]

const dot = (rx: number, ry: number, a: number) => `radial-gradient(ellipse ${rx}px ${ry}px at 50% 50%, rgba(255,255,255,${a}) 98%, transparent 100%)`
const speck = (r: number, a: number) => `radial-gradient(circle at 25% 25%, rgba(255,255,255,${a}) ${r}px, transparent ${r + 0.5}px)`

const ROWS_DESKTOP: Row[] = [
  [40, 12, 260, 26, dot(0.5, 1.4, 0.24), '4px 6px'],
  [52, 15, 320, 24, dot(0.6, 1.8, 0.3), '5px 7.5px'],
  [67, 19, 390, 22, dot(0.7, 2.2, 0.36), '6px 9.5px'],
  [86, 24, 480, 20, dot(0.9, 2.8, 0.42), '8px 12px'],
  [110, 31, 590, 18, dot(1.1, 3.6, 0.48), '10px 15.5px'],
  [141, 40, 720, 16, dot(1.3, 4.6, 0.52), '12px 20px'],
  [181, 52, 880, 14, `${dot(1.6, 6, 0.54)}, ${speck(1, 0.3)}`, '15px 26px'],
  [233, 67, 1080, 12, `${dot(2, 7.6, 0.52)}, ${speck(1.2, 0.3)}`, '19px 33.5px'],
  [300, 40, 1320, 10, `${dot(2.4, 8, 0.46)}, ${speck(1.4, 0.26)}`, '24px 40px'],
]

const ROWS_MOBILE: Row[] = [
  [30, 10, 120, 26, dot(0.4, 1.2, 0.24), '3px 5px'],
  [40, 12, 150, 24, dot(0.5, 1.4, 0.3), '4px 6px'],
  [52, 15, 180, 22, dot(0.6, 1.8, 0.36), '5px 7.5px'],
  [67, 19, 220, 20, dot(0.7, 2.2, 0.42), '6px 9.5px'],
  [86, 24, 270, 18, dot(0.9, 2.8, 0.48), '8px 12px'],
  [110, 31, 330, 16, dot(1.1, 3.6, 0.52), '10px 15.5px'],
  [141, 40, 400, 14, dot(1.3, 4.6, 0.54), '12px 20px'],
  [181, 52, 480, 12, `${dot(1.6, 6, 0.52)}, ${speck(1, 0.3)}`, '15px 26px'],
  [233, 67, 580, 10, `${dot(2, 7.6, 0.46)}, ${speck(1.2, 0.26)}`, '19px 33.5px'],
]

function Rows({ rows, scale }: { rows: Row[]; scale: number }) {
  return (
    <>
      {rows.map(([top, height, w, t, image, size]) => (
        <div
          key={top}
          className="sea-row"
          style={
            {
              top: `${(top / scale) * 100}%`,
              height: `${(height / scale) * 100}%`,
              '--w': `${w}px`,
              '--t': `${t}s`,
              backgroundImage: image,
              backgroundSize: size.includes(',') ? size : `${size}, ${size}`,
            } as CSSProperties
          }
        />
      ))}
    </>
  )
}

/** Static sea: the boards' CSS rows (masks drifting) plus the SVG graph. First paint and fallback. */
export function SeaFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 sm:hidden">
        <Rows rows={ROWS_MOBILE} scale={300} />
        <SeaGraph layout={SEA_MOBILE} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="absolute inset-0 hidden sm:block">
        <Rows rows={ROWS_DESKTOP} scale={340} />
        <SeaGraph layout={SEA_DESKTOP} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  )
}
