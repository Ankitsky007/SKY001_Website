import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'
import { scramble } from '../../lib/motion'
import { Hub } from './Hub'

const HERO_STAGES = ['Explore', 'Decompose', 'Sketch → 3D', 'Construct'] as const

// Exploded offsets per part-tree level (SVG px).
const EXPLODE = [0, -46, -172]
const TAGS = [
  { y: 290, text: 'L1 · Flange' },
  { y: 200, text: 'L1 · Barrel' },
  { y: 104, text: 'L2 · Fasteners ×6' },
]

/**
 * FIG.01, the hero loop on the dark grid: three rough directions are explored, one is picked and
 * split into a part tree, each part is sketched in 2D and extruded, then the parts are stacked back
 * into the assembly. The stage chips above light in step. Static assembled drawing for reduced motion.
 */
export function HeroFigure({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const q = (s: string) => gsap.utils.toArray<Element>(s, el)
      const chips = q('[data-stage]') as HTMLElement[]
      const light = (i: number) => chips.forEach((c, k) => (k === i ? c.setAttribute('data-lit', '') : c.removeAttribute('data-lit')))
      const status = el.querySelector<HTMLElement>('[data-status]')
      const say = (text: string) => {
        if (!status) return
        status.textContent = text
        status.dataset.text = text
        scramble(status, { duration: 0.5 })
      }

      if (prefersReducedMotion()) {
        gsap.set(q('[data-ghost], [data-sketch], [data-variant], [data-tag], [data-select]'), { autoAlpha: 0 })
        light(3)
        return
      }

      const lvl = (n: number) => q(`[data-main] [data-lvl="${n}"]`)
      const part = (name: string) => `[data-main] [data-part="${name}"]`
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'expo.out' },
        paused: true,
      })
      tl.set(q('[data-main]'), { autoAlpha: 1 }, 0)
        .set(q('[data-main] [data-solid]'), { autoAlpha: 0, y: 0 }, 0)
        .set(q('[data-main] [data-ghost]'), { autoAlpha: 1 }, 0)
        .set(q('[data-main] [data-sketch]'), { autoAlpha: 1, drawSVG: '0%' }, 0)
        .set(q('[data-main] [data-lvl]'), { y: 0 }, 0)
        .set(q('[data-tag], [data-done]'), { autoAlpha: 0 }, 0)
        .set(q('[data-variant]'), { autoAlpha: 0, x: 0 }, 0)
        .call(() => (light(0), say('Prompt · flanged hub, six bolts')), [], 0)
        // Explore: rough directions side by side, the middle one is picked.
        .fromTo(q('[data-variant]'), { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, stagger: 0.15, duration: 0.7 }, 0.1)
        .fromTo(q('[data-select]'), { autoAlpha: 0, scale: 1.12, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.6 }, 0.9)
        .to(q('[data-variant="l"]'), { autoAlpha: 0, x: 60, duration: 0.6, ease: 'power2.in' }, 1.9)
        .to(q('[data-variant="r"]'), { autoAlpha: 0, x: -60, duration: 0.6, ease: 'power2.in' }, 1.9)
        .to(q('[data-select]'), { autoAlpha: 0, duration: 0.4 }, 2.1)
        // Decompose: the picked design splits into its part tree.
        .call(() => (light(1), say('Part tree · 3 levels, 8 parts')), [], 2.4)
        .to(lvl(1), { y: EXPLODE[1], duration: 1.1 }, 2.4)
        .to(lvl(2), { y: EXPLODE[2], duration: 1.1 }, 2.5)
        .to(q('[data-tag]'), { autoAlpha: 1, stagger: 0.12, duration: 0.5 }, 2.9)
        // Sketch → 3D: each part's profile is drawn, then extruded.
        .call(() => (light(2), say('Sketch · extrude · per part')), [], 3.9)
      ;[part('flange'), part('barrel'), `${part('bolts-back')}, ${part('bolts-front')}`].forEach((sel, i) => {
        const t = 3.9 + i * 1.1
        tl.to(
          q(
            `${sel
              .split(', ')
              .map((s) => `${s} [data-sketch]`)
              .join(', ')}`,
          ),
          {
            drawSVG: '100%',
            duration: 0.55,
            ease: 'power2.inOut',
            stagger: 0.04,
          },
          t,
        )
          .to(
            q(
              `${sel
                .split(', ')
                .map((s) => `${s} [data-solid]`)
                .join(', ')}`,
            ),
            { autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
            t + 0.5,
          )
          .fromTo(
            q(
              `${sel
                .split(', ')
                .map((s) => `${s} [data-body]`)
                .join(', ')}`,
            ),
            { scaleY: 0.2, transformOrigin: '50% 100%' },
            { scaleY: 1, duration: 0.6 },
            t + 0.5,
          )
          .to(
            q(
              `${sel
                .split(', ')
                .map((s) => `${s} [data-ghost], ${s} [data-sketch]`)
                .join(', ')}`,
            ),
            { autoAlpha: 0, duration: 0.4 },
            t + 0.9,
          )
      })
      // Construct: parts stack back down, bolts last.
      tl.call(() => (light(3), say('Assembly · stacked in tree order')), [], 7.4)
        .to(q('[data-tag]'), { autoAlpha: 0, duration: 0.4 }, 7.4)
        .to(lvl(1), { y: 0, duration: 1, ease: 'power3.inOut' }, 7.5)
        .to(lvl(2), { y: 0, duration: 1.1, ease: 'power3.inOut' }, 7.9)
        .to(q('[data-done]'), { autoAlpha: 1, duration: 0.5 }, 9)
        .to(q('[data-main], [data-done]'), { autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 11.2)
        .set({}, {}, 11.9)

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      })
      return () => {
        st.kill()
        tl.kill()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`flex flex-col border border-night-line bg-night ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-night-line px-3 py-2.5 font-mono text-[10px] font-medium tracking-[0.02em] text-night-text uppercase md:px-4 md:text-[11px]">
        <span>Fig.01 · prompt → parts → assembly</span>
        <span className="hidden text-white sm:inline">
          <span data-status>Assembly · stacked in tree order</span>
        </span>
      </div>
      <ol className="grid grid-cols-4 border-b border-night-line font-mono text-[9px] font-medium tracking-[0.02em] uppercase md:text-[11px]">
        {HERO_STAGES.map((s, i) => (
          <li key={s} data-stage className="fn-label border-r border-night-line px-2 py-2 text-[#F5F5F5] transition-colors duration-300 last:border-r-0 md:px-3">
            <span className="text-night-text">0{i + 1} </span>
            {s}
          </li>
        ))}
      </ol>
      <svg viewBox="0 0 560 372" className="block h-auto w-full" role="img" aria-label="A flanged hub is explored, split into a tree of parts, each part sketched and extruded, then stacked back into the assembly">
        <g data-variant="l">
          <g transform="translate(-170 0)">
            <g transform="translate(280 300) scale(0.58 0.52) translate(-280 -300)">
              <g transform="translate(280 300) scale(1.3 0.75) translate(-280 -300)">
                <Hub cx={280} base={300} tone="dark" ghost />
              </g>
            </g>
          </g>
        </g>
        <g data-variant="r">
          <g transform="translate(170 0)">
            <g transform="translate(280 300) scale(0.5 0.6) translate(-280 -300)">
              <g transform="translate(280 300) scale(0.8 1.35) translate(-280 -300)">
                <Hub cx={280} base={300} tone="dark" ghost />
              </g>
            </g>
          </g>
        </g>
        <g data-main>
          <g transform="translate(280 300) scale(1) translate(-280 -300)">
            <Hub cx={280} base={300} tone="dark" ghost sketch />
          </g>
        </g>
        <rect data-select x="156" y="166" width="248" height="190" fill="none" stroke="#3E57DA" strokeWidth="1.5" strokeDasharray="6 5" />
        <g fontFamily="Geist Mono, monospace" fontSize="10" letterSpacing="0.6" fill="#A3A3A3">
          {TAGS.map((t) => (
            <g key={t.text} data-tag className="max-sm:hidden">
              <line x1="404" y1={t.y} x2="432" y2={t.y} stroke="#474747" strokeDasharray="2 3" />
              <rect x="432" y={t.y - 4} width="8" height="8" fill="#3E57DA" />
              <text x="448" y={t.y + 3.5}>
                {t.text.toUpperCase()}
              </text>
            </g>
          ))}
          <g data-done fontSize="13">
            <rect x="24" y="24" width="8" height="8" fill="#3E57DA" />
            <text x="40" y="31.5" fill="#F5F5F5">
              ASSEMBLY · 8 PARTS · 3 LEVELS
            </text>
          </g>
        </g>
      </svg>
    </div>
  )
}
