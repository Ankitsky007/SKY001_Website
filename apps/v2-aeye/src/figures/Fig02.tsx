import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { Toggle } from '../components/ui'
import { visible } from './visible'

// FIG.02: "a sequence of tokens vs. a living system". Geometry from the storyboard boards
// (Research-Desktop / Research-Mobile); the toggle picks which side is in focus and replays it.

const MONO = 'Geist Mono, monospace'

type ChainSpec = {
  view: [number, number]
  tokens: { x: number; label: string }[]
  tokenY: number
  tokenW: number
  tokenH: number
  next: { x: number; w: number }
  bracket: string
  notes: { x: number; y: number; text: string }[]
  bars: { x: number; y: number; h: number }[]
  barW: number
  font: number
  small: number
  marker: string
}

const CHAIN: Record<'desk' | 'mob', ChainSpec> = {
  desk: {
    view: [608, 280],
    tokens: ['T1', 'T2', 'T3', 'T4', '…', 'TN'].map((label, i) => ({ x: 12 + i * 84, label })),
    tokenY: 110,
    tokenW: 60,
    tokenH: 40,
    next: { x: 516, w: 76 },
    bracket: 'M12 166 V174 H492 V166',
    notes: [
      { x: 12, y: 60, text: 'ONE DIRECTION · FULLY OBSERVED · WRITTEN DOWN' },
      { x: 12, y: 196, text: 'CONTEXT WINDOW · ONLY WHAT WAS WRITTEN DOWN' },
      { x: 12, y: 246, text: 'TOKENS SPENT PER DECISION' },
    ],
    bars: [
      { x: 210, y: 238, h: 10 },
      { x: 234, y: 232, h: 16 },
      { x: 258, y: 224, h: 24 },
      { x: 282, y: 212, h: 36 },
      { x: 306, y: 196, h: 52 },
    ],
    barW: 20,
    font: 11,
    small: 10,
    marker: 'fig2-ar-d',
  },
  mob: {
    view: [330, 170],
    tokens: ['T1', 'T2', '…', 'TN'].map((label, i) => ({ x: i * 58, label })),
    tokenY: 40,
    tokenW: 44,
    tokenH: 32,
    next: { x: 232, w: 64 },
    bracket: 'M0 84 V90 H218 V84',
    notes: [
      { x: 0, y: 16, text: 'ONE DIRECTION · FULLY OBSERVED' },
      { x: 0, y: 108, text: 'CONTEXT WINDOW · WRITTEN DOWN ONLY' },
      { x: 0, y: 160, text: 'TOKENS PER DECISION' },
    ],
    bars: [
      { x: 130, y: 150, h: 10 },
      { x: 148, y: 144, h: 16 },
      { x: 166, y: 136, h: 24 },
      { x: 184, y: 126, h: 34 },
      { x: 202, y: 114, h: 46 },
    ],
    barW: 14,
    font: 10,
    small: 9,
    marker: 'fig2-ar-m',
  },
}

function Chain({ spec, className }: { spec: ChainSpec; className: string }) {
  const { tokens, tokenY: y, tokenW: w, tokenH: h, next } = spec
  const mid = y + h / 2
  return (
    <svg viewBox={`0 0 ${spec.view[0]} ${spec.view[1]}`} className={className} role="img" aria-label="A linear chain of tokens inside a context window">
      <defs>
        <marker id={spec.marker} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#ADADAD" />
        </marker>
      </defs>
      <g fontFamily={MONO} fontSize={spec.font} letterSpacing="0.6">
        {tokens.map((t) => (
          <g key={t.x} data-a-token>
            <rect x={t.x} y={y} width={w} height={h} fill="#FFFFFF" stroke="#ADADAD" />
            <text x={t.x + w / 2} y={mid + 4} textAnchor="middle" fill="#474747">
              {t.label}
            </text>
          </g>
        ))}
        <g data-a-token className="ghost-pulse">
          <rect x={next.x} y={y} width={next.w} height={h} fill="none" stroke="#3E57DA" strokeDasharray="4 3" />
          <text x={next.x + next.w / 2} y={mid + 4} textAnchor="middle" fill="#3E57DA">
            NEXT?
          </text>
        </g>
      </g>
      <g stroke="#ADADAD" markerEnd={`url(#${spec.marker})`}>
        {tokens.map((t) => (
          <line key={t.x} data-a-arrow x1={t.x + w} y1={mid} x2={t.x + w + (tokens[1].x - tokens[0].x - w) - 2} y2={mid} />
        ))}
      </g>
      <path data-a-draw d={spec.bracket} fill="none" stroke="#ADADAD" />
      <g fontFamily={MONO} fontSize={spec.small} fill="#7A7A7A" letterSpacing="0.6">
        {spec.notes.map((n) => (
          <text key={n.y} data-a-note x={n.x} y={n.y}>
            {n.text}
          </text>
        ))}
      </g>
      <g fill="#ADADAD">
        {spec.bars.map((b) => (
          <rect key={b.x} data-a-bar x={b.x} y={b.y} width={spec.barW} height={b.h} />
        ))}
      </g>
    </svg>
  )
}

type P = readonly [number, number]
type GraphSpec = {
  view: [number, number]
  nodes: P[]
  node: number
  edges: [number, number][]
  hidden: [P, P, P][]
  ghostR: number
  labels: { x: number; y: number; text: string }[]
  marks: P[]
  legend: { x: number; y: number; text: string; grey?: boolean }[]
  small: number
}

// Node order: Sales, Design, Engineering, Finance, Operations, Support.
const GRAPH: Record<'desk' | 'mob', GraphSpec> = {
  desk: {
    view: [608, 280],
    nodes: [
      [80, 70],
      [250, 50],
      [420, 80],
      [130, 200],
      [330, 190],
      [510, 210],
    ],
    node: 10,
    edges: [
      [0, 1],
      [1, 2],
      [2, 4],
      [4, 3],
      [3, 0],
      [4, 5],
      [5, 2],
      [1, 4],
    ],
    hidden: [
      [
        [80, 70],
        [210, 130],
        [330, 190],
      ],
      [
        [420, 80],
        [470, 150],
        [510, 210],
      ],
      [
        [420, 80],
        [560, 110],
        [510, 210],
      ],
    ],
    ghostR: 8,
    labels: [
      { x: 56, y: 56, text: 'SALES' },
      { x: 232, y: 34, text: 'DESIGN' },
      { x: 402, y: 64, text: 'ENGINEERING' },
      { x: 96, y: 226, text: 'FINANCE' },
      { x: 302, y: 216, text: 'OPERATIONS' },
      { x: 456, y: 236, text: 'SUPPORT' },
    ],
    marks: [
      [222, 128],
      [482, 148],
      [572, 106],
    ],
    legend: [
      { x: 40, y: 268, text: '- - -  NEVER WRITTEN DOWN · PARTLY OBSERVABLE' },
      { x: 420, y: 268, text: 'ALWAYS CHANGING ↻', grey: true },
    ],
    small: 10,
  },
  mob: {
    view: [330, 210],
    nodes: [
      [40, 50],
      [160, 30],
      [270, 60],
      [60, 160],
      [190, 140],
      [290, 170],
    ],
    node: 8,
    edges: [
      [0, 1],
      [1, 2],
      [2, 4],
      [4, 3],
      [3, 0],
      [4, 5],
      [1, 4],
    ],
    hidden: [
      [
        [40, 50],
        [110, 100],
        [190, 140],
      ],
      [
        [270, 60],
        [250, 112],
        [290, 170],
      ],
      [
        [270, 60],
        [314, 112],
        [290, 170],
      ],
    ],
    ghostR: 7,
    labels: [
      { x: 18, y: 38, text: 'SALES' },
      { x: 140, y: 18, text: 'DESIGN' },
      { x: 236, y: 48, text: 'ENGINEERING' },
      { x: 30, y: 182, text: 'FINANCE' },
      { x: 160, y: 160, text: 'OPERATIONS' },
      { x: 262, y: 190, text: 'SUPPORT' },
    ],
    marks: [],
    legend: [{ x: 0, y: 206, text: '- - - NEVER WRITTEN DOWN · ALWAYS CHANGING' }],
    small: 9,
  },
}

function Graph({ spec, className }: { spec: GraphSpec; className: string }) {
  const { nodes, node } = spec
  return (
    <svg viewBox={`0 0 ${spec.view[0]} ${spec.view[1]}`} className={className} role="img" aria-label="A graph of enterprise functions with hidden, undocumented links">
      <g stroke="#ADADAD">
        {spec.edges.map(([a, b]) => (
          <line key={`${a}-${b}`} data-b-edge x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      <g stroke="#3E57DA" strokeDasharray="4 4" strokeOpacity="0.8" fill="none">
        {spec.hidden.map(([a, m, b]) => (
          <path key={`${m[0]}-${m[1]}`} data-b-hidden d={`M${a[0]} ${a[1]} L${m[0]} ${m[1]} L${b[0]} ${b[1]}`} />
        ))}
      </g>
      <g fill="#1A1A1A">
        {nodes.map(([x, y]) => (
          <rect key={`${x}-${y}`} data-b-node x={x - node / 2} y={y - node / 2} width={node} height={node} />
        ))}
      </g>
      <g fill="#FFFFFF" stroke="#3E57DA" strokeDasharray="3 2" className="ghost-pulse">
        {spec.hidden.map(([, m]) => (
          <circle key={`${m[0]}-${m[1]}`} data-b-ghost cx={m[0]} cy={m[1]} r={spec.ghostR} />
        ))}
      </g>
      <g fontFamily={MONO} fontSize={spec.small} fill="#474747" letterSpacing="0.6">
        {spec.labels.map((l) => (
          <text key={l.text} data-b-label x={l.x} y={l.y}>
            {l.text}
          </text>
        ))}
      </g>
      <g fontFamily={MONO} fontSize={spec.small} letterSpacing="0.6">
        {spec.marks.map(([x, y]) => (
          <text key={`${x}-${y}`} data-b-ghost x={x} y={y} fill="#3E57DA">
            ?
          </text>
        ))}
        {spec.legend.map((l) => (
          <text key={l.text} data-b-label x={l.x} y={l.y} fill={l.grey ? '#7A7A7A' : '#3E57DA'}>
            {l.text}
          </text>
        ))}
      </g>
    </svg>
  )
}

type Mode = 'language' | 'enterprise'

function buildA(root: HTMLElement) {
  const q = (s: string) => visible(root, s)
  return gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from(q('[data-a-note]'), { autoAlpha: 0, x: -8, stagger: 0.08, duration: 0.6 }, 0)
    .from(q('[data-a-token]'), { autoAlpha: 0, y: 10, stagger: 0.09, duration: 0.6 }, 0.1)
    .from(q('[data-a-arrow]'), { drawSVG: 0, stagger: 0.09, duration: 0.4 }, 0.25)
    .from(q('[data-a-draw]'), { drawSVG: 0, duration: 0.9, ease: 'power2.inOut' }, 0.6)
    .from(q('[data-a-bar]'), { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.08, duration: 0.7 }, 0.8)
}

function buildB(root: HTMLElement) {
  const q = (s: string) => visible(root, s)
  return gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from(q('[data-b-node]'), { scale: 0, transformOrigin: '50% 50%', stagger: 0.07, duration: 0.6 }, 0)
    .from(q('[data-b-label]'), { autoAlpha: 0, stagger: 0.05, duration: 0.5 }, 0.1)
    .from(q('[data-b-edge]'), { drawSVG: '50% 50%', stagger: 0.06, duration: 0.7, ease: 'power2.inOut' }, 0.2)
    .from(q('[data-b-hidden]'), { autoAlpha: 0, stagger: 0.12, duration: 0.6 }, 0.8)
    .from(q('[data-b-ghost]'), { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.5 }, 0.9)
}

const panelCls = (on: boolean) => `border bg-white px-3 pt-2.5 pb-1 transition-[border-color,opacity] duration-500 md:px-4 md:pt-3 md:pb-0 ${on ? 'border-brand' : 'border-line'}`
const tagCls = (on: boolean) => `font-mono text-[10px] font-medium uppercase transition-colors duration-500 md:text-xs ${on ? 'text-brand' : 'text-faint'}`

export function Fig02({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('enterprise')
  const seen = useRef(false)

  // First view: build both panels in reading order.
  useGSAP(
    () => {
      const el = root.current
      if (!el || prefersReducedMotion()) return
      const tl = gsap.timeline({ paused: true })
      tl.add(buildA(el)).add(buildB(el), 0.9)
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          seen.current = true
          tl.play()
        },
      })
      return () => st.kill()
    },
    { scope: root },
  )

  // Switching replays the panel that comes into focus.
  const onToggle = (on: boolean) => {
    const next: Mode = on ? 'enterprise' : 'language'
    if (next === mode) return
    setMode(next)
    const el = root.current
    if (!el || !seen.current || prefersReducedMotion()) return
    if (next === 'language') buildA(el)
    else buildB(el)
  }

  const lang = mode === 'language'
  return (
    <div ref={root} className={`dots flex flex-col gap-3 border border-line p-4 [background-size:12px_12px] md:px-10 md:pt-6 md:pb-8 md:[background-size:14px_14px] ${className}`}>
      <div className="flex items-center justify-between font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px]">
        <span className="text-muted">Fig.02</span>
        <Toggle on={!lang} onChange={onToggle} offLabel="Language" onLabel="Enterprise" label="Show an enterprise instead of a language sequence" />
      </div>
      <div className={`${panelCls(lang)} ${lang ? '' : 'opacity-70'}`}>
        <span className={tagCls(lang)}>A · Language: one sequence</span>
        <Chain spec={CHAIN.mob} className="mt-1.5 block h-auto w-full md:hidden" />
        <Chain spec={CHAIN.desk} className="hidden h-auto w-full md:block" />
      </div>
      <div className={`${panelCls(!lang)} ${lang ? 'opacity-70' : ''}`}>
        <span className={tagCls(!lang)}>B · An enterprise: a living system</span>
        <Graph spec={GRAPH.mob} className="mt-1.5 block h-auto w-full md:hidden" />
        <Graph spec={GRAPH.desk} className="hidden h-auto w-full md:block" />
      </div>
    </div>
  )
}
