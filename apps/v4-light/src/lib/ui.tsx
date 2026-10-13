import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef, type ReactNode } from 'react'

/** Side gutters: 20px phone, 40px tablet, 64px desktop. */
export const GUTTER = 'px-5 md:px-10 xl:px-16'
export const WRAP = 'mx-auto w-full max-w-[1320px]'
/** Geist Mono uppercase label. */
export const LABEL = 'font-mono text-[11px] font-medium uppercase tracking-[0.08em] sm:text-xs'

export const H1 = 'text-[34px] leading-[1.04] font-medium tracking-[-0.035em] text-balance sm:text-5xl lg:text-[64px]'
export const H2 = 'text-[28px] leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-4xl lg:text-[44px]'
export const H3 = 'text-lg leading-snug font-medium tracking-[-0.01em] sm:text-xl'
export const BODY = 'text-base leading-relaxed text-muted sm:text-[17px]'
export const LEAD = 'text-lg leading-snug tracking-[-0.01em] sm:text-xl lg:text-2xl'

type Ground = 'paper' | 'studio' | 'stage'

const GROUNDS: Record<Ground, string> = {
  paper: 'bg-paper text-ink',
  studio: 'bg-studio text-ink',
  stage: 'bg-stage text-white',
}

/** Page section on one of the three grounds. Sections holding showcase renders use `studio`. */
export function Section({
  id,
  ground = 'paper',
  label,
  className = '',
  children,
}: {
  id?: string
  ground?: Ground
  label?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-label={label} className={`${GROUNDS[ground]} ${GUTTER} py-16 sm:py-20 lg:py-28 ${className}`}>
      <div className={WRAP}>{children}</div>
    </section>
  )
}

/** Blue mono eyebrow above a heading. */
export function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`${LABEL} block text-brand ${className}`}>{children}</span>
}

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
      <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  )
}

type Variant = 'primary' | 'outline' | 'onDark'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-deep',
  outline: 'border border-line bg-paper text-ink hover:border-ink',
  onDark: 'border border-white/25 text-white hover:border-white focus-visible:outline-white',
}

/** 44px pill button link. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  arrow = false,
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: Variant
  arrow?: boolean
  className?: string
}) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 active:translate-y-px ${VARIANTS[variant]} ${className}`}
    >
      {children}
      {arrow && <Arrow />}
    </a>
  )
}

/** Underlined text link with a 44px tap target. */
export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`group inline-flex min-h-11 items-center gap-2 text-[15px] font-medium underline decoration-current/30 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand ${className}`}
    >
      {children}
      <Arrow />
    </a>
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
