import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'

/** Geist Mono 500 uppercase label, +0.04em (10px phone, 12px desktop). */
export const LABEL = 'font-mono text-[10px] font-medium uppercase tracking-[0.04em] sm:text-[11px] lg:text-xs'
/** Side gutters: 24px phone, 48px tablet, 116px at the 1440 board. */
export const GUTTER = 'px-6 md:px-12 xl:px-[116px]'
export const WRAP = 'mx-auto w-full max-w-[1440px]'

/** The 3px square captain puts inside bracket labels. */
export function Sq() {
  return <span aria-hidden="true" className="block size-[3px] shrink-0 bg-current" />
}

/** "[ 01 ▪ Research & vision ]" bracket label. Parts are joined by the 3px square. */
export function Bracket({ parts, className = '' }: { parts: ReactNode[]; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-[5px] lg:gap-1.5 ${LABEL} ${className}`}>
      <span aria-hidden="true">[</span>
      {parts.map((p, i) => (
        <span key={i} className="contents">
          {i > 0 && <Sq />}
          {i === parts.length - 1 ? (
            // Keep the closing bracket with the last word so it never wraps onto its own line.
            <span className="whitespace-nowrap">
              {p}
              <span aria-hidden="true" className="ml-[5px] lg:ml-1.5">
                ]
              </span>
            </span>
          ) : (
            <span>{p}</span>
          )}
        </span>
      ))}
    </span>
  )
}

/** Section header row: blue bracket label on the left, "[ 0n / 03 ]" counter on the right. */
export function SectionHead({ num, label, of }: { num: string; label: string; of: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Bracket parts={[num, label]} className="text-brand" />
      <span className={`${LABEL} text-muted`}>[ {of} ]</span>
    </div>
  )
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  )
}

/** Captain's icon slide: the blue square slides up on hover/focus to reveal a bare arrow. */
export function ArrowChip() {
  return (
    <span aria-hidden="true" className="relative block size-8 shrink-0 overflow-hidden">
      <span className="flex size-8 items-center justify-center bg-brand text-white transition-transform duration-400 ease-out-expo group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        <Arrow />
      </span>
      <span className="absolute inset-0 flex translate-y-full items-center justify-center text-brand transition-transform duration-400 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0">
        <Arrow className="translate-x-0.5" />
      </span>
    </span>
  )
}

type Variant = 'white' | 'pale' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  white: 'bg-white text-ink hover:bg-pale focus-visible:outline-white',
  pale: 'bg-pale text-ink hover:bg-pale-2',
  ghost: 'text-white hover:bg-white/10 focus-visible:outline-white',
}

/** 48px button link. `arrow` adds the sliding arrow chip on the right. */
export function ButtonLink({
  href,
  children,
  variant = 'white',
  arrow = false,
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: Variant
  arrow?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      className={`group flex min-h-12 items-center justify-between gap-6 whitespace-nowrap text-[15px] font-medium transition-colors duration-300 active:translate-y-px lg:text-sm ${
        arrow ? 'pr-2 pl-4' : 'px-4'
      } ${VARIANTS[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowChip />}
    </a>
  )
}

/** Captain tab grid: shared 1px borders, roving focus, arrow-key navigation. */
export function TabGrid<T extends string>({
  label,
  idBase,
  items,
  value,
  onChange,
  className = '',
  tabClassName = '',
}: {
  label: string
  idBase: string
  items: readonly { id: T; label: ReactNode; className?: string }[]
  value: T
  onChange: (id: T) => void
  className?: string
  tabClassName?: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = items.length - 1
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (next < 0) return
    e.preventDefault()
    onChange(items[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div role="tablist" aria-label={label} className={`grid border-t border-l border-line ${className}`}>
      {items.map((item, i) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-11 cursor-pointer border-r border-b border-line text-left transition-colors duration-150 focus-visible:-outline-offset-2 ${
              selected ? 'bg-pale text-brand' : 'bg-white text-muted hover:bg-pale hover:text-ink'
            } ${tabClassName} ${item.className ?? ''}`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

/** Big number that counts up the first time it scrolls into view ("30+" counts 0 → 30, keeps "+"). */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      const m = /^(\d+)(.*)$/.exec(value)
      if (!el || !m || prefersReducedMotion()) return
      const target = Number(m[1])
      const suffix = m[2]
      const state = { n: 0 }
      el.textContent = `0${suffix}`
      gsap.to(state, {
        n: target,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(state.n)}${suffix}`
        },
      })
      gsap.from(el, { yPercent: 30, autoAlpha: 0, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}

/** Huge word that rises out of a mask when it scrolls into view. */
export function BigWord({ children, delay = 0, className = '' }: { children: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const inner = el.firstElementChild
      gsap.from(inner, {
        yPercent: 105,
        duration: 1.3,
        delay,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={`block overflow-clip pb-[0.06em] ${className}`}>
      <span className="block">{children}</span>
    </span>
  )
}
