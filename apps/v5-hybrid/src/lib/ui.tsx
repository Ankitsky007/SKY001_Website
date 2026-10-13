import { gsap, prefersReducedMotion, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef, useState, type ReactNode } from 'react'
import { PixelIcon, type PixelIconName } from '../components/PixelIcon'
import { scrambleOnHover } from './scramble'
import { useMedia } from './useMedia'
import { useScrambleIn } from './useScrambleIn'

type Tone = 'light' | 'dark'

/** Side gutters: 24px phone, 40px tablet and up, inside a 1288px column. */
export const GUTTER = 'px-6 md:px-10'
export const WRAP = 'mx-auto w-full max-w-[1208px]'
/** Geist Mono uppercase label. */
export const LABEL = 'font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px]'

export const H1 = 'text-[38px] leading-[1.06] font-normal tracking-[-0.055em] text-balance sm:text-[52px] lg:text-[68px]'
export const H2 = 'text-[32px] leading-[1.1] font-normal tracking-[-0.055em] sm:text-[44px] lg:text-[52px]'
export const H3 = 'text-[22px] leading-[1.15] font-medium tracking-[-0.05em] md:text-[26px]'
export const BODY = 'text-base leading-[1.5] tracking-[-0.02em] text-body md:text-[17px]'
export const LEAD = 'text-xl leading-[1.25] font-medium tracking-[-0.045em] md:text-[26px] md:leading-[1.2]'

const pad2 = (n: number) => String(n).padStart(2, '0')

/** aeye numbered eyebrow: `[N.01/09] —— > LABEL ————`. The label scrambles in and the rules draw. */
export function Eyebrow({ index, total, label, tone = 'light' }: { index: number; total: number; label: string; tone?: Tone }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrambleIn(ref, { duration: 0.9 })
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-rule]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.4,
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    },
    { scope: ref },
  )
  const dark = tone === 'dark'
  return (
    <div ref={ref} className={`flex items-center gap-2.5 md:gap-4 ${LABEL} ${dark ? 'text-night-text' : 'text-body'}`}>
      <span className="shrink-0">
        [N.<span className={dark ? 'text-white' : 'text-ink'}>{pad2(index)}</span>/<span className={dark ? 'text-muted' : 'text-faint'}>{pad2(total)}</span>]
      </span>
      <span data-rule className={`h-px w-4 shrink-0 md:w-6 ${dark ? 'bg-night-mid' : 'bg-slash'}`} />
      <span className="shrink-0" data-scramble-in>
        &gt; {label}
      </span>
      <span data-rule className={`h-px min-w-4 flex-1 ${dark ? 'bg-night-mid' : 'bg-line'}`} />
    </div>
  )
}

type Ground = 'paper' | 'studio' | 'night'

const GROUNDS: Record<Ground, string> = {
  paper: 'bg-paper text-ink',
  studio: 'bg-studio text-ink',
  night: 'grid-dark text-white',
}

/**
 * Page section on one of the three grounds, opened by a numbered eyebrow. Sections that hold
 * showcase renders use `studio`; `night` is the dark grid band.
 */
export function Section({
  id,
  ground = 'paper',
  eyebrow,
  className = '',
  children,
}: {
  id?: string
  ground?: Ground
  eyebrow: { index: number; total: number; label: string }
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={`${GROUNDS[ground]} ${GUTTER} py-14 md:py-20 lg:py-24 ${className}`}>
      <div className={WRAP}>
        <Eyebrow {...eyebrow} tone={ground === 'night' ? 'dark' : 'light'} />
        <div className="mt-8 md:mt-12">{children}</div>
      </div>
    </section>
  )
}

/** Mono slash that frames aeye headings. */
function Slash({ side, tone }: { side: 'start' | 'end'; tone: Tone }) {
  return (
    <span aria-hidden="true" className={`font-mono font-light tracking-normal ${tone === 'dark' ? 'text-night-mid' : 'text-slash'} ${side === 'start' ? 'mr-2 md:mr-3' : 'ml-2 md:ml-3'}`}>
      /
    </span>
  )
}

/** `/ Heading /` with a masked line reveal. */
export function SlashHeading({ children, tone = 'light', className = '', as = 'h2', id }: { children: ReactNode; tone?: Tone; className?: string; as?: 'h2' | 'h3'; id?: string }) {
  return (
    <div id={id}>
      <SplitReveal as={as} className={`${H2} ${className}`}>
        <Slash side="start" tone={tone} />
        {children}
        <Slash side="end" tone={tone} />
      </SplitReveal>
    </div>
  )
}

/** Blue accent phrase in Geist Mono with brackets: `[Post-Monolithic]`. Stays on one line unless `wrap` is set. */
export function Accent({ children, wrap = false }: { children: ReactNode; wrap?: boolean }) {
  return (
    <span className={`font-mono text-[0.86em] tracking-[-0.06em] text-brand ${wrap ? '' : 'whitespace-nowrap'}`}>
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true">]</span>
    </span>
  )
}

/** Small `■ LABEL` marker. */
export function SquareLabel({ children, tone = 'light', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${LABEL} ${tone === 'dark' ? 'text-night-text' : 'text-muted'} ${className}`}>
      <span aria-hidden="true" className="block size-2 shrink-0 bg-brand" />
      {children}
    </span>
  )
}

/** Four small squares pinned to the corners of a framed card (aeye's registration marks). */
export function Corners({ tone = 'light' }: { tone?: Tone }) {
  const c = `absolute block size-1.5 ${tone === 'dark' ? 'bg-white' : 'bg-ink'}`
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={`${c} top-1.5 left-1.5`} />
      <span className={`${c} top-1.5 right-1.5`} />
      <span className={`${c} bottom-1.5 left-1.5`} />
      <span className={`${c} right-1.5 bottom-1.5`} />
    </span>
  )
}

const external = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

/**
 * aeye primary button: ■ + mono label. On hover a blue panel slides in from the left, the square
 * turns and the label scrambles. `tone="light"` is the white version for dark bands.
 */
export function ButtonLink({ href, children, tone = 'dark', className = '' }: { href: string; children: ReactNode; tone?: Tone; className?: string }) {
  const dark = tone === 'dark'
  return (
    <a
      href={href}
      {...external(href)}
      onPointerEnter={scrambleOnHover}
      className={`group relative inline-flex h-[52px] min-w-[220px] items-center justify-between gap-8 overflow-hidden px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap uppercase transition-[color,scale] duration-300 active:scale-[0.98] ${
        dark ? 'bg-ink text-white' : 'bg-white text-ink hover:text-white focus-visible:outline-white'
      } ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-active:translate-x-0" />
      <span aria-hidden="true" className={`relative block size-2 transition-[rotate,background-color] duration-300 group-hover:-rotate-180 ${dark ? 'bg-white' : 'bg-ink group-hover:bg-white'}`} />
      <span className="relative" data-scramble>
        {children}
      </span>
    </a>
  )
}

/** Secondary link: mono label with a 1px underline and an arrow that turn blue. */
export function TextLink({ href, children, tone = 'light', className = '' }: { href: string; children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <a
      href={href}
      {...external(href)}
      onPointerEnter={scrambleOnHover}
      className={`group inline-flex h-[52px] items-center justify-between gap-8 border-b px-1 font-mono text-[15px] font-semibold tracking-[-0.02em] whitespace-nowrap uppercase transition-colors duration-300 ${
        tone === 'dark' ? 'border-white text-white hover:border-brand-lift hover:text-brand-lift focus-visible:outline-white' : 'border-ink text-ink hover:border-brand hover:text-brand'
      } ${className}`}
    >
      <span data-scramble>{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </a>
  )
}

/** Mono caption under a figure or panel. */
export function FigCaption({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[11px] leading-[1.4] tracking-[0.02em] text-muted uppercase md:text-xs ${className}`}>{children}</p>
}

/**
 * Bordered cell with a pixel icon that turns blue on hover or keyboard focus. Touch screens have
 * no hover, so the icon is always shown in its blue state there.
 */
export function IconCell({ icon, children, className = '' }: { icon: PixelIconName; children: ReactNode; className?: string }) {
  const canHover = useMedia('(hover: hover)')
  const [over, setOver] = useState(false)
  return (
    <li onPointerEnter={() => setOver(true)} onPointerLeave={() => setOver(false)} className={`group flex flex-col justify-between gap-8 border-r border-b border-line p-5 transition-colors duration-300 hover:bg-studio md:p-6 ${className}`}>
      <PixelIcon name={icon} active={over || !canHover} className="size-[50px] md:size-16" />
      <div>{children}</div>
    </li>
  )
}

/** Number that counts up to its exact source value the first time it scrolls into view ("150×", "30+"). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      const m = /^(\d+)(.*)$/.exec(value)
      if (!el || !m || prefersReducedMotion()) return
      const state = { n: 0 }
      el.textContent = `0${m[2]}`
      gsap.to(state, {
        n: Number(m[1]),
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(state.n)}${m[2]}`
        },
      })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
