import { functions } from '@skyfall/core'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { visible } from './visible'

// FIG.03: six observed functions feed one Engineering World Model that simulates alternatives,
// plans a trajectory to the goal state and acts, all inside the safety guardrails.
// Geometry from Research-Desktop.dc.html; the phone variant shows the model box only.

const MONO = 'Geist Mono, monospace'

const STEPS_D = [
  [420, 290],
  [500, 244],
  [580, 250],
  [660, 200],
  [740, 190],
  [820, 152],
] as const
const STEPS_M = [
  [24, 170],
  [70, 140],
  [110, 150],
  [160, 120],
  [210, 110],
  [260, 80],
] as const

const OUTPUTS = [
  { y: 110, text: 'PLAN · LONG HORIZON', on: true },
  { y: 180, text: 'EXECUTE · ACROSS FUNCTIONS', on: true },
  { y: 250, text: 'OBSERVE · UPDATE THE MODEL', on: false },
]

function Desktop() {
  return (
    <svg
      viewBox="0 0 1312 440"
      className="hidden h-auto w-full bg-white md:block"
      role="img"
      aria-label="Six enterprise functions feed one Engineering World Model that simulates and plans inside safety guardrails"
    >
      <defs>
        <pattern id="fig3-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="#E0E0E0" />
        </pattern>
        <marker id="fig3-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#3E57DA" />
        </marker>
        <marker id="fig3-arg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#ADADAD" />
        </marker>
      </defs>
      <rect data-c-guard x="20" y="20" width="1272" height="400" fill="none" stroke="#3E57DA" strokeOpacity="0.45" strokeDasharray="6 6" />
      <g fontFamily={MONO} letterSpacing="0.6">
        <text data-c-fade x="40" y="56" fontSize="10" fill="#7A7A7A">
          OBSERVED FUNCTIONS
        </text>
        {functions.map((fn, i) => (
          <g key={fn} data-c-in>
            <rect x="40" y={70 + i * 54} width="200" height="40" fill="#FFFFFF" stroke="#ADADAD" />
            <text x="54" y={94 + i * 54} fontSize="11" fill="#474747">
              {fn.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
      <g stroke="#ADADAD" fill="none">
        {functions.map((fn, i) => (
          <path key={fn} data-c-wire d={`M240 ${90 + i * 54} H300`} />
        ))}
        <path data-c-wire d="M300 90 V360" />
      </g>
      <path data-c-arrow d="M300 225 H356" stroke="#3E57DA" markerEnd="url(#fig3-ar)" />
      <rect data-c-box x="360" y="70" width="560" height="310" fill="#FFFFFF" stroke="#3E57DA" />
      <rect data-c-fade x="380" y="132" width="520" height="186" fill="url(#fig3-dots)" />
      <g fontFamily={MONO} letterSpacing="0.6">
        <text data-c-fade x="380" y="98" fontSize="12" fill="#3E57DA">
          ENGINEERING WORLD MODEL
        </text>
        <text data-c-fade x="380" y="116" fontSize="10" fill="#7A7A7A">
          LATENT SPACE OF THE ENTERPRISE
        </text>
        <text data-c-fade x="380" y="356" fontSize="10" fill="#7A7A7A">
          SIMULATE CAUSE → EFFECT · EXPLORE · PLAN
        </text>
      </g>
      <g fill="none" stroke="#ADADAD" strokeDasharray="3 4">
        <path data-c-alt d="M580 250 L650 290 L720 284" />
        <path data-c-alt d="M660 200 L720 244 L790 236" />
        <path data-c-alt d="M740 190 L800 230" />
      </g>
      <path data-c-path d={`M${STEPS_D.map(([x, y]) => `${x} ${y}`).join(' L')} L880 160`} fill="none" stroke="#3E57DA" strokeWidth="1.5" />
      <g fill="#3E57DA">
        {STEPS_D.map(([x, y]) => (
          <rect key={x} data-c-step x={x - 3} y={y - 3} width="6" height="6" />
        ))}
      </g>
      <rect data-c-goal x="874" y="154" width="12" height="12" fill="none" stroke="#1A1A1A" />
      <g fontFamily={MONO} fontSize="10" letterSpacing="0.6">
        <text data-c-fade x="404" y="312" fill="#7A7A7A">
          NOW
        </text>
        <text data-c-goal x="806" y="140" fill="#1A1A1A">
          GOAL STATE
        </text>
        <text data-c-alt x="690" y="306" fill="#7A7A7A">
          SIMULATED ALTERNATIVES
        </text>
      </g>
      <path data-c-arrow2 d="M920 225 H996" stroke="#3E57DA" markerEnd="url(#fig3-ar)" />
      <g fontFamily={MONO} letterSpacing="0.6">
        {OUTPUTS.map((o) => (
          <g key={o.y} data-c-out>
            <rect x="1000" y={o.y} width="260" height="50" fill="#FFFFFF" stroke={o.on ? '#3E57DA' : '#ADADAD'} />
            <text x="1016" y={o.y + 30} fontSize="11" fill={o.on ? '#3E57DA' : '#474747'}>
              {o.text}
            </text>
          </g>
        ))}
      </g>
      <path data-c-feedback d="M1130 300 V346 H640 V384" fill="none" stroke="#ADADAD" markerEnd="url(#fig3-arg)" />
      <text data-c-feedback-label x="960" y="338" fontFamily={MONO} fontSize="10" fill="#7A7A7A" letterSpacing="0.6">
        FEEDBACK
      </text>
      <text data-c-guard x="40" y="408" fontFamily={MONO} fontSize="10" fill="#3E57DA" letterSpacing="0.6">
        - - - SAFETY GUARDRAILS
      </text>
    </svg>
  )
}

function Mobile() {
  return (
    <svg viewBox="0 0 316 220" className="block h-auto w-full md:hidden" role="img" aria-label="World model latent space with a planned trajectory">
      <defs>
        <pattern id="fig3-dots-m" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#E0E0E0" />
        </pattern>
      </defs>
      <rect data-c-box x="0.5" y="0.5" width="315" height="219" fill="#FFFFFF" stroke="#3E57DA" />
      <rect data-c-fade x="12" y="44" width="292" height="140" fill="url(#fig3-dots-m)" />
      <g fontFamily={MONO} letterSpacing="0.5">
        <text data-c-fade x="12" y="20" fontSize="10" fill="#3E57DA">
          ENGINEERING WORLD MODEL
        </text>
        <text data-c-fade x="12" y="34" fontSize="9" fill="#7A7A7A">
          LATENT SPACE OF THE ENTERPRISE
        </text>
        <text data-c-fade x="12" y="206" fontSize="9" fill="#7A7A7A">
          SIMULATE CAUSE → EFFECT · PLAN
        </text>
      </g>
      <g fill="none" stroke="#ADADAD" strokeDasharray="3 4">
        <path data-c-alt d="M110 150 L150 176 L190 170" />
        <path data-c-alt d="M160 120 L200 146" />
      </g>
      <path data-c-path d={`M${STEPS_M.map(([x, y]) => `${x} ${y}`).join(' L')} L292 86`} fill="none" stroke="#3E57DA" strokeWidth="1.5" />
      <g fill="#3E57DA">
        {STEPS_M.map(([x, y]) => (
          <rect key={x} data-c-step x={x - 3} y={y - 3} width="6" height="6" />
        ))}
      </g>
      <rect data-c-goal x="286" y="80" width="12" height="12" fill="none" stroke="#1A1A1A" />
      <text data-c-goal x="236" y="68" fontFamily={MONO} fontSize="9" fill="#1A1A1A" letterSpacing="0.5">
        GOAL STATE
      </text>
    </svg>
  )
}

/** Figure 03 builds left to right once on first view: inputs, model, planned path, actions, feedback. */
export function Fig03({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el || prefersReducedMotion()) return
      const q = (s: string) => visible(el, s)
      const steps = q('[data-c-step]')
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out', duration: 0.7 } })
      tl.from(q('[data-c-guard]'), { autoAlpha: 0, duration: 1 }, 0)
        .from(q('[data-c-in]'), { autoAlpha: 0, x: -14, stagger: 0.06 }, 0.1)
        .from(q('[data-c-wire]'), { drawSVG: 0, stagger: 0.04, duration: 0.5, ease: 'power2.inOut' }, 0.4)
        .from(q('[data-c-arrow]'), { autoAlpha: 0, x: -8, duration: 0.4 }, 0.8)
        .from(q('[data-c-box]'), { drawSVG: 0, duration: 1.1, ease: 'power2.inOut' }, 0.8)
        .from(q('[data-c-fade]'), { autoAlpha: 0, stagger: 0.05 }, 1.0)
        .from(q('[data-c-path]'), { drawSVG: 0, duration: 1.4, ease: 'power1.inOut' }, 1.3)
        .from(steps, { scale: 0, transformOrigin: '50% 50%', stagger: 1.4 / Math.max(steps.length, 1), duration: 0.4 }, 1.3)
        .from(q('[data-c-alt]'), { autoAlpha: 0, stagger: 0.15, duration: 0.6 }, 1.7)
        .from(q('[data-c-goal]'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.6 }, 2.5)
        .from(q('[data-c-arrow2]'), { autoAlpha: 0, x: -8, duration: 0.4 }, 2.6)
        .from(q('[data-c-out]'), { autoAlpha: 0, x: 14, stagger: 0.1 }, 2.7)
        .from(q('[data-c-feedback]'), { drawSVG: 0, duration: 1, ease: 'power2.inOut' }, 3.0)
        .from(q('[data-c-feedback-label]'), { autoAlpha: 0 }, 3.4)
      const st = ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => tl.play() })
      return () => st.kill()
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`dots border border-line p-4 [background-size:12px_12px] md:p-6 md:[background-size:14px_14px] ${className}`}>
      <Mobile />
      <Desktop />
    </div>
  )
}
