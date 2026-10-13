import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { cylinderBody, ellipse } from '../lib/iso'
import { Hub } from './Hub'

// One code-drawn figure per pipeline stage, all built from the same flanged hub. Each loops its
// own timeline while it is the selected stage; reduced motion shows the finished state.

const MONO = 'Geist Mono, monospace'
const BRAND = '#3E57DA'

function useLoop(root: React.RefObject<SVGSVGElement | null>, build: (tl: gsap.core.Timeline, q: (s: string) => Element[]) => void, finish: (q: (s: string) => Element[]) => void) {
  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const q = (s: string) => gsap.utils.toArray<Element>(s, el)
      if (prefersReducedMotion()) return finish(q)
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.6,
        defaults: { ease: 'expo.out' },
      })
      build(tl, q)
      return () => tl.kill()
    },
    { scope: root },
  )
}

const Label = ({ x, y, children, fill = '#7A7A7A', anchor = 'start', data }: { x: number; y: number; children: string; fill?: string; anchor?: 'start' | 'middle' | 'end'; data?: string }) => (
  <text {...(data ? { [`data-${data}`]: '' } : {})} x={x} y={y} fontFamily={MONO} fontSize="11" letterSpacing="0.6" fill={fill} textAnchor={anchor} className="max-md:text-[14px]">
    {children}
  </text>
)

const VARIANTS = [
  { x: 300, y: 170, sx: 0.36, sy: 0.4, k: [1.25, 0.75] },
  { x: 460, y: 170, sx: 0.36, sy: 0.4, k: [1, 1] },
  { x: 300, y: 320, sx: 0.36, sy: 0.4, k: [0.8, 1.4] },
  { x: 460, y: 320, sx: 0.36, sy: 0.4, k: [1.1, 1.15] },
]

/** Stage 1: one 2D input becomes several rough 3D directions at once; the best one is picked. */
export function ExploreFigure() {
  const ref = useRef<SVGSVGElement>(null)
  useLoop(
    ref,
    (tl, q) => {
      tl.set(q('[data-v]'), { autoAlpha: 0 })
        .set(q('[data-pick]'), { autoAlpha: 0 })
        .fromTo(
          q('[data-in]'),
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            duration: 1.2,
            ease: 'power2.inOut',
            stagger: 0.15,
          },
        )
        .fromTo(
          q('[data-fan]'),
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            duration: 0.7,
            ease: 'power2.inOut',
            stagger: 0.08,
          },
          1,
        )
        .to(q('[data-v]'), { autoAlpha: 1, duration: 0.6, stagger: 0.12 }, 1.4)
        .fromTo(q('[data-pick]'), { autoAlpha: 0, scale: 1.15, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.6 }, 2.8)
        .to(q('[data-v]:not([data-best])'), { autoAlpha: 0.25, duration: 0.5 }, 3.1)
        .to({}, { duration: 2.4 })
    },
    (q) => gsap.set(q('[data-v]:not([data-best])'), { autoAlpha: 0.35 }),
  )
  return (
    <svg ref={ref} viewBox="0 0 560 380" className="block h-auto w-full" role="img" aria-label="A 2D sketch turns into four rough 3D directions; one is picked">
      <Label x={24} y={40}>
        INPUT · 2D SKETCH
      </Label>
      <rect x="24" y="56" width="176" height="236" fill="#FFFFFF" stroke="#E0E0E0" />
      <g fill="none" stroke={BRAND} strokeWidth="1.6">
        <path data-in d="M52 248 H172 V226 H52 Z" />
        <path data-in d="M86 226 V150 H138 V226" />
        <path data-in d="M100 150 V138 H124 V150" strokeDasharray="3 3" />
      </g>
      <g fill="none" stroke="#ADADAD" strokeDasharray="3 4">
        {VARIANTS.map((v) => (
          <path key={`${v.x}${v.y}`} data-fan d={`M206 174 C 240 174, 250 ${v.y - 50}, ${v.x - 52} ${v.y - 50}`} />
        ))}
      </g>
      <Label x={248} y={40}>
        PARALLEL ROLLOUTS · 4
      </Label>
      {VARIANTS.map((v, i) => (
        <g key={i} data-v {...(i === 1 ? { 'data-best': '' } : {})}>
          <g transform={`translate(${v.x} ${v.y}) scale(${v.sx * v.k[0]} ${v.sy * v.k[1]}) translate(-280 -330)`}>
            <Hub cx={280} base={330} tone="light" />
          </g>
          <Label x={v.x - 60} y={v.y + 40}>{`R.0${i + 1}`}</Label>
        </g>
      ))}
      <rect data-pick x="398" y="96" width="124" height="104" fill="none" stroke={BRAND} strokeWidth="1.5" />
      <g data-pick>
        <rect x="398" y="88" width="8" height="8" fill={BRAND} />
        <Label x={412} y={95} fill={BRAND}>
          PICKED
        </Label>
      </g>
    </svg>
  )
}

const TREE = {
  root: { x: 380, y: 70, label: 'HUB ASSEMBLY' },
  l1: [
    { x: 290, y: 170, label: 'FLANGE' },
    { x: 470, y: 170, label: 'BARREL' },
  ],
  l2: Array.from({ length: 6 }, (_, i) => ({ x: 215 + i * 30, y: 270 })),
}

/** Stage 2: the picked design splits level by level, from assemblies down to fasteners. */
export function DecomposeFigure() {
  const ref = useRef<SVGSVGElement>(null)
  useLoop(
    ref,
    (tl, q) => {
      const counter = q('[data-level]')[0] as SVGTextElement | undefined
      const setLevel = (n: number) => counter && (counter.textContent = `LEVEL 0${n} / 03`)
      tl.set(q('[data-n], [data-e]'), { autoAlpha: 0 })
        .set(q('[data-lvl]'), { y: 0 })
        .call(() => setLevel(1))
        .to(q('[data-n="0"]'), { autoAlpha: 1, duration: 0.5 }, 0.2)
        .call(() => setLevel(2), [], 1)
        .to(q('[data-lvl="1"]'), { y: -36, duration: 1 }, 1)
        .to(q('[data-e="1"]'), { autoAlpha: 1, duration: 0.3 }, 1.1)
        .fromTo(q('[data-e="1"]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, 1.1)
        .to(q('[data-n="1"]'), { autoAlpha: 1, duration: 0.5, stagger: 0.12 }, 1.5)
        .call(() => setLevel(3), [], 2.4)
        .to(q('[data-lvl="2"]'), { y: -112, duration: 1 }, 2.4)
        .to(q('[data-e="2"]'), { autoAlpha: 1, duration: 0.3 }, 2.5)
        .fromTo(
          q('[data-e="2"]'),
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            duration: 0.6,
            ease: 'power2.inOut',
            stagger: 0.04,
          },
          2.5,
        )
        .to(q('[data-n="2"]'), { autoAlpha: 1, duration: 0.4, stagger: 0.06 }, 2.9)
        .to({}, { duration: 2.4 })
    },
    (q) => {
      gsap.set(q('[data-lvl="1"]'), { y: -36 })
      gsap.set(q('[data-lvl="2"]'), { y: -112 })
    },
  )
  const { root, l1, l2 } = TREE
  return (
    <svg ref={ref} viewBox="0 0 560 380" className="block h-auto w-full" role="img" aria-label="The hub splits into a part tree: assembly, then flange and barrel, then six bolts">
      <Label x={24} y={40} data="level">
        LEVEL 03 / 03
      </Label>
      <g transform="translate(110 320) scale(0.62) translate(-280 -330)">
        <Hub cx={280} base={330} tone="light" />
      </g>
      <g fill="none" stroke="#ADADAD">
        <path data-e="1" d={`M${root.x} ${root.y + 12} V120 H${l1[0].x} V${l1[0].y - 12} M${root.x} 120 H${l1[1].x} V${l1[1].y - 12}`} />
        {l2.map((n) => (
          <path key={n.x} data-e="2" d={`M${l1[0].x} ${l1[0].y + 12} V226 H${n.x} V${n.y - 6}`} />
        ))}
      </g>
      <g data-n="0">
        <rect x={root.x - 72} y={root.y - 14} width="144" height="28" fill="#1A1A1A" />
        <Label x={root.x} y={root.y + 4} fill="#FFFFFF" anchor="middle">
          {root.label}
        </Label>
        <Label x={root.x + 84} y={root.y + 4}>
          L0
        </Label>
      </g>
      {l1.map((n) => (
        <g key={n.label} data-n="1">
          <rect x={n.x - 52} y={n.y - 14} width="104" height="28" fill="#FFFFFF" stroke="#1A1A1A" />
          <Label x={n.x} y={n.y + 4} fill="#1A1A1A" anchor="middle">
            {n.label}
          </Label>
        </g>
      ))}
      <Label x={540} y={174} anchor="end">
        L1
      </Label>
      {l2.map((n) => (
        <rect key={n.x} data-n="2" x={n.x - 6} y={n.y - 6} width="12" height="12" fill={BRAND} />
      ))}
      <g data-n="2">
        <Label x={l2[5].x + 22} y={l2[0].y + 4} fill={BRAND}>
          BOLT ×6
        </Label>
        <Label x={540} y={274} anchor="end">
          L2
        </Label>
      </g>
      <g data-n="2">
        <Label x={380} y={340} anchor="middle" fill="#474747">
          1 ASSEMBLY · 2 BODIES · 6 FASTENERS
        </Label>
      </g>
    </svg>
  )
}

/** Stage 3: State 3 → State 4. A circle is sketched stroke by stroke, extruded, then cut. */
export function SketchFigure() {
  const ref = useRef<SVGSVGElement>(null)
  const cx = 400
  const base = 270
  useLoop(
    ref,
    (tl, q) => {
      const op = q('[data-op]')[0] as SVGTextElement | undefined
      const say = (t: string) => op && (op.textContent = t)
      tl.set(q('[data-solid3], [data-cut], [data-arrow]'), { autoAlpha: 0 })
        .call(() => say('OP 01 · SKETCH CIRCLE'))
        .fromTo(q('[data-stroke]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'none', stagger: 0.45 }, 0.2)
        .fromTo(q('[data-dim]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2)
        .to(q('[data-arrow]'), { autoAlpha: 1, duration: 0.4 }, 2.4)
        .fromTo(q('[data-arrow-line]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, 2.4)
        .call(() => say('OP 02 · EXTRUDE 60'), [], 2.8)
        .to(q('[data-solid3]'), { autoAlpha: 1, duration: 0.3 }, 2.8)
        .fromTo(q('[data-grow]'), { scaleY: 0.05, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1.1, ease: 'power3.out' }, 2.8)
        .fromTo(q('[data-lift]'), { y: 60 }, { y: 0, duration: 1.1, ease: 'power3.out' }, 2.8)
        .call(() => say('OP 03 · CUT BORE'), [], 4.2)
        .fromTo(q('[data-cut]'), { autoAlpha: 0, scale: 0.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.7 }, 4.2)
        .to({}, { duration: 2.2 })
    },
    () => {},
  )
  const r = 70
  const h = 60
  // The circle is sketched as four arcs, like strokes.
  const ry = r * 0.42
  const arcs = [
    `M${160 - r} 250 A${r} ${ry} 0 0 1 160 ${250 - ry}`,
    `M160 ${250 - ry} A${r} ${ry} 0 0 1 ${160 + r} 250`,
    `M${160 + r} 250 A${r} ${ry} 0 0 1 160 ${250 + ry}`,
    `M160 ${250 + ry} A${r} ${ry} 0 0 1 ${160 - r} 250`,
  ]
  return (
    <svg ref={ref} viewBox="0 0 560 380" className="block h-auto w-full" role="img" aria-label="A 2D circle is sketched, extruded into a cylinder, then a bore is cut">
      <Label x={24} y={40}>
        STATE 03 · 2D SKETCH
      </Label>
      <Label x={330} y={40}>
        STATE 04 · 3D
      </Label>
      <path d="M30 304 L100 196 H290 L220 304 Z" fill="#FFFFFF" stroke="#E0E0E0" />
      <g fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        {arcs.map((d) => (
          <path key={d} data-stroke d={d} />
        ))}
      </g>
      <g data-dim>
        <line x1={160 - r} y1="318" x2={160 + r} y2="318" stroke="#7A7A7A" />
        <Label x={160} y={336} anchor="middle">
          Ø 140
        </Label>
      </g>
      <g data-arrow>
        <path data-arrow-line d="M246 250 H318" stroke={BRAND} strokeDasharray="4 4" fill="none" />
        <path d="M318 245 L326 250 L318 255 Z" fill={BRAND} />
      </g>
      <g data-solid3>
        <path data-grow d={cylinderBody(cx, base, r, h)} fill="#FFFFFF" stroke="#1A1A1A" />
        <g data-lift>
          <path d={ellipse(cx, base - h, r)} fill="#FFFFFF" stroke="#1A1A1A" />
          <path data-cut d={ellipse(cx, base - h, 26)} fill="#E0E0E0" stroke="#1A1A1A" />
        </g>
        <path d={ellipse(cx, base, r)} fill="none" stroke={BRAND} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      </g>
      <Label x={24} y={366} fill="#1A1A1A" data="op">
        OP 03 · CUT BORE
      </Label>
    </svg>
  )
}

/** Stage 4: the parts are stacked back layer by layer, in tree order, into the full assembly. */
export function ConstructFigure() {
  const ref = useRef<SVGSVGElement>(null)
  useLoop(
    ref,
    (tl, q) => {
      const counter = q('[data-layer]')[0] as SVGTextElement | undefined
      const say = (n: number) => counter && (counter.textContent = `LAYER 0${n} / 03`)
      const lv = (n: number) => q(`[data-lvl="${n}"]`)
      tl.set(q('[data-lvl]'), { autoAlpha: 0, y: -90 }).set(q('[data-check]'), {
        autoAlpha: 0,
      })
      ;[0, 1, 2].forEach((n) => {
        const t = 0.3 + n * 1.1
        tl.call(() => say(n + 1), [], t)
          .to(lv(n), { autoAlpha: 1, duration: 0.3 }, t)
          .to(lv(n), { y: 0, duration: 0.9, ease: 'bounce.out', stagger: 0.05 }, t)
      })
      tl.to(q('[data-check]'), { autoAlpha: 1, duration: 0.5 }, 3.8).to({}, { duration: 2.2 })
    },
    () => {},
  )
  return (
    <svg ref={ref} viewBox="0 0 560 380" className="block h-auto w-full" role="img" aria-label="Flange, barrel and bolts drop into place one layer at a time to form the assembly">
      <Label x={24} y={40} data="layer">
        LAYER 03 / 03
      </Label>
      <g transform="translate(280 300) scale(0.95) translate(-280 -330)">
        <Hub cx={280} base={330} tone="light" />
      </g>
      <g data-check>
        <rect x="24" y="352" width="8" height="8" fill={BRAND} />
        <Label x={40} y={360} fill={BRAND}>
          ASSEMBLY COMPLETE · 8 PARTS
        </Label>
      </g>
    </svg>
  )
}
