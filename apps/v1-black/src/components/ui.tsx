import { useRef, type ReactNode } from 'react'
import { useAnchorScroll } from '../lib/useAnchorScroll'
import { gsap, MOTION_OK, useGSAP } from '../lib/motion'

type CtaProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'outline'
  /** The small white square the boards put in front of the main CTA. */
  dot?: boolean | 'lg'
  arrow?: boolean
  /** Full-width with the arrow pushed to the edge (phone layout). */
  block?: boolean
  size?: 'md' | 'lg'
  className?: string
  /** Runs before the in-page scroll (e.g. to close the menu). */
  onNavigate?: () => void
}

/** Square, mono, uppercase button from the v1 system. Hover slides a sheen and nudges the arrow. */
export function CtaLink({ href, children, variant = 'primary', dot, arrow = variant === 'primary', block, size = 'lg', className = '', onNavigate }: CtaProps) {
  const go = useAnchorScroll()
  const base =
    'group/cta relative isolate inline-flex shrink-0 items-center gap-3 overflow-hidden font-mono text-[13px] font-semibold tracking-[0.02em] uppercase transition-[color,border-color,transform] duration-300 ease-out-expo active:scale-[0.98]'
  const sizes = size === 'lg' ? 'min-h-12 px-[18px]' : 'min-h-11 px-4 text-xs md:text-[13px]'
  const look =
    variant === 'primary'
      ? 'bg-brand text-white'
      : 'border border-rule-3 text-ink hover:border-brand-lift hover:text-brand-lift'
  return (
    <a
      href={href}
      onClick={(e) => {
        onNavigate?.()
        go(e)
      }}
      className={`${base} ${sizes} ${look} ${block ? 'w-full justify-between' : ''} ${className}`}>
      {variant === 'primary' && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 origin-left scale-x-0 bg-white/12 transition-transform duration-500 ease-out-expo group-hover/cta:scale-x-100"
        />
      )}
      {dot && (
        <span
          aria-hidden
          className={`size-1.5 bg-white transition-transform duration-300 group-hover/cta:rotate-45 ${dot === 'lg' ? 'hidden lg:block' : 'block'}`}
        />
      )}
      <span>{children}</span>
      {arrow && (
        <span aria-hidden className="transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-1">
          →
        </span>
      )}
    </a>
  )
}

/** "[01/03] —— Research & vision ————" numbered eyebrow; the rule draws in on scroll. */
export function Eyebrow({ index, label, total = 3 }: { index: number; label: string; total?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-rule]', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        })
        gsap.from('[data-tag]', {
          autoAlpha: 0,
          x: -8,
          duration: 0.8,
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  const n = String(index).padStart(2, '0')
  const t = String(total).padStart(2, '0')
  return (
    <div
      ref={ref}
      className="flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.04em] text-meta uppercase md:gap-3 lg:text-[13px]"
    >
      <span data-tag>
        [<span className="text-brand-lift">{n}</span>/{t}]
      </span>
      <span data-rule aria-hidden className="hidden h-px w-6 bg-rule-3 md:block" />
      <span data-tag className="text-soft">
        {label}
      </span>
      <span data-rule aria-hidden className="h-px flex-1 bg-rule" />
    </div>
  )
}

/** "§ 1.1 · The problem with …" — stacked in the left column on desktop, inline below. */
export function SectionMark({ num, label, className = '' }: { num: string; label: string; className?: string }) {
  return (
    <div
      className={`flex flex-wrap gap-x-1.5 font-mono text-[11px] tracking-[0.04em] text-meta uppercase md:text-xs lg:flex-col lg:gap-2 ${className}`}
    >
      <span className="text-brand-lift">§ {num}</span>
      <span aria-hidden className="lg:hidden">
        ·
      </span>
      <span>{label}</span>
    </div>
  )
}

export function FigCaption({ children }: { children: ReactNode }) {
  return <figcaption className="font-mono text-[10px] tracking-[0.06em] text-meta uppercase md:text-[11px]">{children}</figcaption>
}

/** Section frame: board gutters 20 / 40 / 64 and the 1440 canvas. */
export function Frame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16 ${className}`}>{children}</div>
}
