import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { Toggle } from '../components/ui'
import { visible } from './visible'

// FIG.04: conceptual cost/quality chart. Today's trade-off (people and language models on one
// dashed curve) vs. the new frontier with world models. The toggle draws or removes the frontier.

const MONO = 'Geist Mono, monospace'

function Desktop() {
  return (
    <svg
      viewBox="0 0 700 440"
      className="hidden h-auto w-full border border-line bg-white md:block"
      role="img"
      aria-label="Conceptual chart: world models shift the cost and quality frontier up and to the left"
    >
      <defs>
        <marker id="fig4-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#3E57DA" />
        </marker>
      </defs>
      <g data-d-grid stroke="#E0E0E0" strokeDasharray="3 4">
        <line x1="70" y1="100" x2="670" y2="100" />
        <line x1="70" y1="180" x2="670" y2="180" />
        <line x1="70" y1="260" x2="670" y2="260" />
        <line x1="220" y1="30" x2="220" y2="370" />
        <line x1="370" y1="30" x2="370" y2="370" />
        <line x1="520" y1="30" x2="520" y2="370" />
      </g>
      <path data-d-axis d="M70 30 V370 H670" fill="none" stroke="#ADADAD" />
      <g data-d-fade fontFamily={MONO} fontSize="10" fill="#7A7A7A" letterSpacing="0.6">
        <text x="70" y="20">
          QUALITY ↑
        </text>
        <text x="670" y="396" textAnchor="end">
          COST PER DECISION →
        </text>
        <text x="670" y="426" textAnchor="end" fill="#ADADAD">
          CONCEPTUAL · NOT TO SCALE
        </text>
      </g>
      <path data-d-today d="M300 340 C 390 220, 470 150, 650 96" fill="none" stroke="#ADADAD" strokeDasharray="5 5" />
      <g fill="#ADADAD">
        <circle data-d-dot cx="560" cy="120" r="6" />
        <circle data-d-dot cx="600" cy="104" r="6" />
        <circle data-d-dot cx="535" cy="140" r="6" />
        <circle data-d-dot cx="620" cy="132" r="6" />
      </g>
      <g fill="none" stroke="#7A7A7A">
        <circle data-d-dot cx="360" cy="248" r="6" />
        <circle data-d-dot cx="398" cy="214" r="6" />
        <circle data-d-dot cx="332" cy="282" r="6" />
        <circle data-d-dot cx="432" cy="192" r="6" />
        <circle data-d-dot cx="388" cy="262" r="6" />
      </g>
      <g data-d-fade fontFamily={MONO} fontSize="10" fill="#474747" letterSpacing="0.6">
        <text x="520" y="174">
          HUMAN TEAMS
        </text>
        <text x="300" y="316">
          LANGUAGE MODELS
        </text>
        <text x="472" y="84" fill="#7A7A7A">
          TODAY&apos;S TRADE-OFF
        </text>
      </g>
      <g data-d-world>
        <path data-d-frontier d="M100 280 C 140 150, 220 82, 420 52" fill="none" stroke="#3E57DA" strokeWidth="2" />
        <g fill="#3E57DA">
          <rect data-d-wsq x="134" y="160" width="8" height="8" />
          <rect data-d-wsq x="200" y="100" width="8" height="8" />
          <rect data-d-wsq x="290" y="68" width="8" height="8" />
        </g>
        <path data-d-shift d="M420 200 L262 128" fill="none" stroke="#3E57DA" strokeDasharray="4 4" markerEnd="url(#fig4-ar)" />
        <text data-d-wlabel x="118" y="44" fontFamily={MONO} fontSize="10" fill="#3E57DA" letterSpacing="0.6">
          WORLD MODELS · NEW FRONTIER
        </text>
      </g>
    </svg>
  )
}

function Mobile() {
  return (
    <svg viewBox="0 0 350 290" className="block h-auto w-full border border-line bg-white md:hidden" role="img" aria-label="Conceptual chart: world models shift the frontier">
      <defs>
        <marker id="fig4-ar-m" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#3E57DA" />
        </marker>
      </defs>
      <path data-d-axis d="M36 24 V240 H336" fill="none" stroke="#ADADAD" />
      <path data-d-today d="M150 232 C200 150, 250 105, 332 74" fill="none" stroke="#ADADAD" strokeDasharray="5 5" />
      <g fill="#ADADAD">
        <circle data-d-dot cx="290" cy="92" r="5" />
        <circle data-d-dot cx="312" cy="82" r="5" />
        <circle data-d-dot cx="280" cy="106" r="5" />
        <circle data-d-dot cx="318" cy="100" r="5" />
      </g>
      <g fill="none" stroke="#7A7A7A">
        <circle data-d-dot cx="190" cy="170" r="5" />
        <circle data-d-dot cx="210" cy="150" r="5" />
        <circle data-d-dot cx="176" cy="190" r="5" />
        <circle data-d-dot cx="230" cy="136" r="5" />
      </g>
      <g data-d-world>
        <path data-d-frontier d="M50 200 C70 110, 120 60, 232 42" fill="none" stroke="#3E57DA" strokeWidth="2" />
        <g fill="#3E57DA">
          <rect data-d-wsq x="64" y="126" width="7" height="7" />
          <rect data-d-wsq x="96" y="82" width="7" height="7" />
          <rect data-d-wsq x="146" y="54" width="7" height="7" />
        </g>
        <path data-d-shift d="M222 162 L136 110" fill="none" stroke="#3E57DA" strokeDasharray="4 4" markerEnd="url(#fig4-ar-m)" />
        <text data-d-wlabel x="76" y="36" fontFamily={MONO} fontSize="9" fill="#3E57DA" letterSpacing="0.5">
          WORLD MODELS
        </text>
      </g>
      <g data-d-fade fontFamily={MONO} fontSize="9" letterSpacing="0.5">
        <text x="36" y="16" fill="#7A7A7A">
          QUALITY ↑
        </text>
        <text x="336" y="258" textAnchor="end" fill="#7A7A7A">
          COST PER DECISION →
        </text>
        <text x="336" y="278" textAnchor="end" fill="#ADADAD">
          CONCEPTUAL · NOT TO SCALE
        </text>
        <text x="248" y="130" fill="#474747">
          HUMAN TEAMS
        </text>
        <text x="120" y="214" fill="#474747">
          LANGUAGE MODELS
        </text>
      </g>
    </svg>
  )
}

/** Draw the world-model frontier: curve, then its points, then the shift arrow. */
function drawWorld(el: HTMLElement) {
  const q = (s: string) => visible(el, s)
  return gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .set(q('[data-d-world]'), { autoAlpha: 1 })
    .from(q('[data-d-frontier]'), { drawSVG: 0, duration: 1.2, ease: 'power2.inOut' }, 0)
    .from(q('[data-d-wsq]'), { scale: 0, transformOrigin: '50% 50%', stagger: 0.2, duration: 0.5 }, 0.3)
    .from(q('[data-d-shift]'), { autoAlpha: 0, x: 24, y: 12, duration: 0.8 }, 0.7)
    .from(q('[data-d-wlabel]'), { autoAlpha: 0, duration: 0.6 }, 0.9)
}

export function Fig04({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(true)
  const seen = useRef(false)

  useGSAP(
    () => {
      const el = root.current
      if (!el || prefersReducedMotion()) return
      const q = (s: string) => visible(el, s)
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out', duration: 0.7 } })
      tl.from(q('[data-d-grid]'), { autoAlpha: 0, duration: 1 }, 0)
        .from(q('[data-d-axis]'), { drawSVG: 0, duration: 1, ease: 'power2.inOut' }, 0)
        .from(q('[data-d-fade]'), { autoAlpha: 0, stagger: 0.1 }, 0.4)
        .from(q('[data-d-today]'), { autoAlpha: 0, duration: 0.8 }, 0.5)
        .from(q('[data-d-dot]'), { scale: 0, transformOrigin: '50% 50%', stagger: { each: 0.05, from: 'random' }, duration: 0.5 }, 0.6)
        .add(drawWorld(el), 1.3)
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

  const onToggle = (next: boolean) => {
    if (next === on) return
    setOn(next)
    const el = root.current
    if (!el) return
    const world = visible(el, '[data-d-world]')
    if (prefersReducedMotion() || !seen.current) {
      gsap.set(world, { autoAlpha: next ? 1 : 0 })
      return
    }
    if (next) drawWorld(el)
    else gsap.to(world, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
  }

  return (
    <div ref={root} className={`dots flex flex-col gap-2 border border-line p-4 [background-size:12px_12px] md:gap-4 md:p-6 md:[background-size:14px_14px] ${className}`}>
      <div className="flex items-center justify-between font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px]">
        <span className="text-muted">Fig.04</span>
        <Toggle on={on} onChange={onToggle} offLabel="Today" onLabel="With world models" label="Show the world-model frontier" />
      </div>
      <Mobile />
      <Desktop />
      <span className="hidden font-mono text-xs tracking-[0.02em] text-muted uppercase md:block">Fig.04 — Cost, speed and quality no longer traded against each other</span>
    </div>
  )
}
