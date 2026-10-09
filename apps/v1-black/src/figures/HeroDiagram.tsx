import { useRef } from 'react'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/motion'

// Board colours (canvas.json notes.tokens).
const BRAND = '#3E57DA'
const LIFT = '#6F83F0'
const WIRE = '#3A3A42'
const INK = '#F5F5F5'

const LOOP = 8
/** canvas.json notes.motion is written in % of the 8s loop; this keeps the numbers readable. */
const at = (pct: number) => (pct / 100) * LOOP

type Variant = 'mobile' | 'tablet' | 'desktop'

const QUERY: Record<Variant, string> = {
  mobile: '(max-width: 767.98px)',
  tablet: '(min-width: 768px) and (max-width: 1023.98px)',
  desktop: '(min-width: 1024px)',
}
const RIPPLE: Record<Variant, number> = { mobile: 72, tablet: 100, desktop: 170 }

/**
 * Hero A motion, 8s loop (canvas.json notes.motion):
 * 0.0s decision flashes white and ripples expand · 0.4s blue path draws to DESIGN (T+1) ·
 * 1.8s on to ENGINEERING (T+2) · 3.2s forks to OPERATIONS and SUPPORT (T+3) while a time cursor
 * sweeps (desktop) · hold to 6.5s · fade back and repeat. SALES and FINANCE never light up.
 * Reduced motion: the markup is the final, fully lit state and nothing runs.
 */
function useHeroLoop(variant: Variant) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const svg = ref.current
      if (!svg) return
      const mm = gsap.matchMedia()
      mm.add(`${QUERY[variant]} and ${MOTION_OK}`, () => {
        const q = gsap.utils.selector(svg)
        const R = RIPPLE[variant]

        // Entrance: boxes rise in once, then the loop takes over.
        gsap.from(q('[data-in]'), { autoAlpha: 0, y: 10, duration: 0.9, stagger: 0.05, delay: 0.35, ease: 'expo.out' })

        const tl = gsap.timeline({ repeat: -1, delay: 0.9, defaults: { ease: 'none' } })

        // T0: the decision flashes white, then settles to blue.
        tl.fromTo(q('.dq'), { fill: '#FFFFFF' }, { fill: BRAND, duration: 0.3, ease: 'power2.in' }, at(1))

        // Ripples: each ring starts invisible, flicks on at its delay, then expands and fades.
        q('.rip').forEach((c, i) => {
          const d = i * 0.25
          tl.fromTo(c, { attr: { r: 8 }, strokeOpacity: 0 }, { strokeOpacity: 0.9, duration: 0.04 }, d)
          tl.to(c, { attr: { r: R }, strokeOpacity: 0, duration: at(32), ease: 'power2.out' }, d + 0.04)
        })

        // Time cursor (desktop board only): sweeps T0 → T+3 with the path, holds, fades.
        const cur = q('.cur')
        if (cur.length) {
          tl.fromTo(cur, { attr: { x1: 260, x2: 260 }, opacity: 0 }, { opacity: 1, duration: at(4) }, 0)
          tl.to(cur, { attr: { x1: 1188, x2: 1188 }, duration: at(52.5), ease: 'power2.inOut' }, 0)
          tl.to(cur, { opacity: 0, duration: at(12) }, at(80))
        }

        // The blue path: three hops, drawn one after another.
        const hops: [string, number, number][] = [
          ['.p1', 5, 17.5],
          ['.p2', 22.5, 35],
          ['.p3', 40, 52.5],
        ]
        for (const [sel, a, b] of hops) {
          tl.fromTo(q(sel), { drawSVG: '0%' }, { drawSVG: '100%', duration: at(b - a), ease: 'power2.inOut' }, at(a))
        }
        tl.to(q('.p'), { opacity: 0, duration: at(12) }, at(82))

        // Exits off the right edge after the fork lands (desktop).
        const exits = q('.x')
        if (exits.length) {
          tl.fromTo(exits, { opacity: 0 }, { opacity: 1, duration: at(7.5) }, at(52.5))
          tl.to(exits, { opacity: 0, duration: at(12) }, at(82))
        }

        // Junction ticks blink on as the path turns each corner.
        ;(['.j1', '.j2', '.j3'] as const).forEach((sel, i) => {
          const j = q(sel)
          if (!j.length) return
          tl.fromTo(j, { opacity: 0 }, { opacity: 1, duration: 0.05 }, at([9, 27, 45][i]))
          tl.to(j, { opacity: 0, duration: 0.05 }, at(92))
        })

        // Function boxes light up when the path reaches them, and go grey again on reset.
        ;(['.n1', '.n2', '.n3'] as const).forEach((sel, i) => {
          const t = at([16.5, 34, 51.5][i])
          const rect = q(`${sel} rect`)
          const lb = q(`${sel} .lb`)
          const st = q(`${sel} .st`)
          tl.fromTo(rect, { stroke: WIRE }, { stroke: BRAND, duration: at(2) }, t)
          tl.fromTo(lb, { fill: INK }, { fill: LIFT, duration: at(2) }, t)
          tl.fromTo(st, { opacity: 0.35 }, { opacity: 1, duration: at(2) }, t)
          tl.to(rect, { stroke: WIRE, duration: at(10) }, at(84))
          tl.to(lb, { fill: INK, duration: at(10) }, at(84))
          tl.to(st, { opacity: 0.35, duration: at(10) }, at(84))
        })

        // Pad the timeline to exactly one 8s loop.
        tl.set({}, {}, LOOP)

        // No GPU or CPU work while the hero is scrolled away.
        ScrollTrigger.create({
          trigger: svg,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? tl.resume() : tl.pause()),
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return ref
}

export function HeroDiagramDesktop({ className }: { className?: string }) {
  const ref = useHeroLoop('desktop')
  return (
    <svg ref={ref} viewBox="0 0 1440 400" className={`fig ${className ?? ''}`} role="img" aria-label="One decision rippling through six enterprise functions">
      <defs>
        <pattern id="dotsA" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="#26262C" />
        </pattern>
      </defs>
      <rect width="1440" height="400" fill="url(#dotsA)" />
      <g stroke="#17171B" strokeDasharray="2 4">
        <line x1="260" y1="34" x2="260" y2="380" />
        <line x1="648" y1="34" x2="648" y2="380" />
        <line x1="908" y1="34" x2="908" y2="380" />
        <line x1="1188" y1="34" x2="1188" y2="380" />
      </g>
      <line className="cur" x1="260" y1="34" x2="260" y2="380" stroke={BRAND} strokeOpacity="0.45" />
      <g fontSize="10" fill="#6B6B72">
        <text x="260" y="24" textAnchor="middle">T0</text>
        <text x="648" y="24" textAnchor="middle">T+1</text>
        <text x="908" y="24" textAnchor="middle">T+2</text>
        <text x="1188" y="24" textAnchor="middle">T+3</text>
      </g>
      <g fill="none" stroke={BRAND}>
        <circle className="rip" cx="260" cy="200" r="30" strokeOpacity="0.7" />
        <circle className="rip" cx="260" cy="200" r="62" strokeOpacity="0.4" />
        <circle className="rip" cx="260" cy="200" r="104" strokeOpacity="0.22" />
        <circle className="rip" cx="260" cy="200" r="156" strokeOpacity="0.1" />
      </g>
      <g fill="none" stroke={WIRE} strokeDasharray="4 4">
        <path d="M266 200 H400 V86 H520" />
        <path d="M696 86 H908 V150" />
        <path d="M736 276 H778 V336 H840" />
        <path d="M1016 336 H1208 V302" />
      </g>
      <g fill="none" stroke={BRAND} strokeWidth="1.5">
        <path className="p p1" d="M266 200 H400 V276 H560" />
        <path className="p p2" d="M736 276 H778 V176 H820" />
        <path className="p p3" d="M996 176 H1038 V96 H1080" />
        <path className="p p3" d="M996 176 H1038 V276 H1120" />
        <path className="x" d="M1256 96 H1440" strokeOpacity="0.5" strokeDasharray="2 6" />
        <path className="x" d="M1296 276 H1440" strokeOpacity="0.5" strokeDasharray="2 6" />
      </g>
      <g fill={BRAND}>
        <rect className="j1" x="398" y="274" width="4" height="4" />
        <rect className="j2" x="776" y="174" width="4" height="4" />
        <rect className="j3" x="1036" y="94" width="4" height="4" />
        <rect className="j3" x="1036" y="274" width="4" height="4" />
        <rect className="dq" x="253" y="193" width="14" height="14" />
      </g>
      <g data-in>
        <text x="260" y="330" textAnchor="middle" fontSize="11" fill={INK}>
          Δ DECISION
        </text>
        <text x="260" y="346" textAnchor="middle" fontSize="10" fill="#808080">
          ONE CHANGE AT T0
        </text>
      </g>
      <g data-in>
        <rect x="520" y="60" width="176" height="52" fill="#08080A" stroke={WIRE} />
        <text x="534" y="82" fontSize="11" fill={INK}>SALES</text>
        <text x="534" y="100" fontSize="10" fill="#6B6B72">STATE · UNCHANGED</text>
      </g>
      <g data-in className="n n1">
        <rect x="560" y="250" width="176" height="52" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="574" y="272" fontSize="11" fill={LIFT}>DESIGN</text>
        <text className="st" x="574" y="290" fontSize="10" fill="#808080">STATE · Δ</text>
      </g>
      <g data-in className="n n2">
        <rect x="820" y="150" width="176" height="52" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="834" y="172" fontSize="11" fill={LIFT}>ENGINEERING</text>
        <text className="st" x="834" y="190" fontSize="10" fill="#808080">STATE · Δ</text>
      </g>
      <g data-in>
        <rect x="840" y="310" width="176" height="52" fill="#08080A" stroke={WIRE} />
        <text x="854" y="332" fontSize="11" fill={INK}>FINANCE</text>
        <text x="854" y="350" fontSize="10" fill="#6B6B72">STATE · PENDING</text>
      </g>
      <g data-in className="n n3">
        <rect x="1080" y="70" width="176" height="52" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="1094" y="92" fontSize="11" fill={LIFT}>OPERATIONS</text>
        <text className="st" x="1094" y="110" fontSize="10" fill="#808080">STATE · Δ</text>
      </g>
      <g data-in className="n n3">
        <rect x="1120" y="250" width="176" height="52" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="1134" y="272" fontSize="11" fill={LIFT}>CUSTOMER SUPPORT</text>
        <text className="st" x="1134" y="290" fontSize="10" fill="#808080">STATE · Δ</text>
      </g>
      <text x="64" y="392" fontSize="10" fill="#808080">
        FIG.01 — ONE DECISION RIPPLES ACROSS SIX FUNCTIONS
      </text>
    </svg>
  )
}

export function HeroDiagramTablet({ className }: { className?: string }) {
  const ref = useHeroLoop('tablet')
  return (
    <svg ref={ref} viewBox="0 0 754 380" className={`fig ${className ?? ''}`} role="img" aria-label="One decision rippling through six enterprise functions">
      <defs>
        <pattern id="tdA" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="#26262C" />
        </pattern>
      </defs>
      <rect width="754" height="380" fill="url(#tdA)" />
      <g fontSize="10" fill="#6B6B72">
        <text x="60" y="16" textAnchor="middle">T0</text>
        <text x="295" y="16" textAnchor="middle">T+1</text>
        <text x="495" y="16" textAnchor="middle">T+2</text>
        <text x="675" y="16" textAnchor="middle">T+3</text>
      </g>
      <g fill="none" stroke={BRAND}>
        <circle className="rip" cx="60" cy="190" r="28" strokeOpacity="0.6" />
        <circle className="rip" cx="60" cy="190" r="56" strokeOpacity="0.3" />
        <circle className="rip" cx="60" cy="190" r="92" strokeOpacity="0.12" />
      </g>
      <g fill="none" stroke={WIRE} strokeDasharray="4 4">
        <path d="M66 190 H140 V63 H200" />
        <path d="M350 63 H495 V120" />
        <path d="M370 223 H395 V313 H420" />
        <path d="M570 313 H675 V246" />
      </g>
      <g fill="none" stroke={BRAND} strokeWidth="1.5">
        <path className="p p1" d="M66 190 H140 V223 H220" />
        <path className="p p2" d="M370 223 H395 V143 H420" />
        <path className="p p3" d="M570 143 H585 V63 H600" />
        <path className="p p3" d="M570 143 H585 V223 H600" />
      </g>
      <rect className="dq" x="53" y="183" width="14" height="14" fill={BRAND} />
      <g data-in>
        <rect x="200" y="40" width="150" height="46" fill="#08080A" stroke={WIRE} />
        <text x="212" y="60" fontSize="11" fill={INK}>SALES</text>
        <text x="212" y="76" fontSize="9" fill="#6B6B72">UNCHANGED</text>
      </g>
      <g data-in className="n n1">
        <rect x="220" y="200" width="150" height="46" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="232" y="220" fontSize="11" fill={LIFT}>DESIGN</text>
        <text className="st" x="232" y="236" fontSize="9" fill="#808080">STATE · Δ</text>
      </g>
      <g data-in className="n n2">
        <rect x="420" y="120" width="150" height="46" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="432" y="140" fontSize="11" fill={LIFT}>ENGINEERING</text>
        <text className="st" x="432" y="156" fontSize="9" fill="#808080">STATE · Δ</text>
      </g>
      <g data-in>
        <rect x="420" y="290" width="150" height="46" fill="#08080A" stroke={WIRE} />
        <text x="432" y="310" fontSize="11" fill={INK}>FINANCE</text>
        <text x="432" y="326" fontSize="9" fill="#6B6B72">PENDING</text>
      </g>
      <g data-in className="n n3">
        <rect x="600" y="40" width="150" height="46" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="612" y="60" fontSize="11" fill={LIFT}>OPERATIONS</text>
        <text className="st" x="612" y="76" fontSize="9" fill="#808080">STATE · Δ</text>
      </g>
      <g data-in className="n n3">
        <rect x="600" y="200" width="150" height="46" fill="#08080A" stroke={BRAND} />
        <text className="lb" x="612" y="220" fontSize="11" fill={LIFT}>SUPPORT</text>
        <text className="st" x="612" y="236" fontSize="9" fill="#808080">STATE · Δ</text>
      </g>
      <text x="60" y="262" textAnchor="middle" fontSize="10" fill={INK}>
        Δ DECISION
      </text>
      <text x="0" y="372" fontSize="10" fill="#808080">
        FIG.01 — ONE DECISION RIPPLES ACROSS SIX FUNCTIONS
      </text>
    </svg>
  )
}

export function HeroDiagramMobile({ className }: { className?: string }) {
  const ref = useHeroLoop('mobile')
  return (
    <svg ref={ref} viewBox="0 0 390 280" className={`fig ${className ?? ''}`} role="img" aria-label="One decision rippling through six functions">
      <defs>
        <pattern id="mdA" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#26262C" />
        </pattern>
      </defs>
      <rect width="390" height="280" fill="url(#mdA)" />
      <g fill="none" stroke={BRAND}>
        <circle className="rip" cx="40" cy="125" r="18" strokeOpacity="0.6" />
        <circle className="rip" cx="40" cy="125" r="36" strokeOpacity="0.3" />
        <circle className="rip" cx="40" cy="125" r="58" strokeOpacity="0.12" />
      </g>
      <g fill="none" stroke={WIRE} strokeDasharray="4 4">
        <path d="M46 125 H70 V40 H96" />
        <path d="M70 125 V210 H96" />
        <path d="M218 40 H246" />
        <path d="M218 210 H246" />
      </g>
      <g fill="none" stroke={BRAND} strokeWidth="1.5">
        <path className="p p1" d="M46 125 H96" />
        <path className="p p2" d="M218 125 H246" />
        <path className="p p3" d="M307 105 V60" />
        <path className="p p3" d="M307 145 V190" />
      </g>
      <rect className="dq" x="34" y="119" width="12" height="12" fill={BRAND} />
      <g style={{ letterSpacing: '0.5px' }}>
        <g data-in>
          <rect x="96" y="20" width="122" height="40" fill="#08080A" stroke={WIRE} />
          <text x="104" y="37" fontSize="10" fill={INK}>SALES</text>
          <text x="104" y="51" fontSize="9" fill="#6B6B72">UNCHANGED</text>
        </g>
        <g data-in className="n n1">
          <rect x="96" y="105" width="122" height="40" fill="#08080A" stroke={BRAND} />
          <text className="lb" x="104" y="122" fontSize="10" fill={LIFT}>DESIGN</text>
          <text className="st" x="104" y="136" fontSize="9" fill="#808080">STATE · Δ</text>
        </g>
        <g data-in>
          <rect x="96" y="190" width="122" height="40" fill="#08080A" stroke={WIRE} />
          <text x="104" y="207" fontSize="10" fill={INK}>FINANCE</text>
          <text x="104" y="221" fontSize="9" fill="#6B6B72">PENDING</text>
        </g>
        <g data-in className="n n3">
          <rect x="246" y="20" width="122" height="40" fill="#08080A" stroke={BRAND} />
          <text className="lb" x="254" y="37" fontSize="10" fill={LIFT}>OPERATIONS</text>
          <text className="st" x="254" y="51" fontSize="9" fill="#808080">STATE · Δ</text>
        </g>
        <g data-in className="n n2">
          <rect x="246" y="105" width="122" height="40" fill="#08080A" stroke={BRAND} />
          <text className="lb" x="254" y="122" fontSize="10" fill={LIFT}>ENGINEERING</text>
          <text className="st" x="254" y="136" fontSize="9" fill="#808080">STATE · Δ</text>
        </g>
        <g data-in className="n n3">
          <rect x="246" y="190" width="122" height="40" fill="#08080A" stroke={BRAND} />
          <text className="lb" x="254" y="207" fontSize="10" fill={LIFT}>SUPPORT</text>
          <text className="st" x="254" y="221" fontSize="9" fill="#808080">STATE · Δ</text>
        </g>
        <text x="20" y="266" fontSize="9" fill="#808080">
          FIG.01 — ONE DECISION, SIX FUNCTIONS
        </text>
      </g>
    </svg>
  )
}
