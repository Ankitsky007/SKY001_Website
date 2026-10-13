import { gsap, prefersReducedMotion, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef, useState, type ReactNode } from 'react'
import { PixelIcon, type PixelIconName } from '../components/PixelIcon'
import { scrambleOnHover } from './scramble'
import { useMedia } from './useMedia'

type Tone = 'light' | 'dark'

/** Side gutters: 24px phone, 40px tablet and up, inside a 1288px column. */
export const GUTTER = 'px-6 md:px-10'
export const WRAP = 'mx-auto w-full max-w-[1208px]'
/** Geist Mono uppercase label. */
export const LABEL = 'font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px]'

export const H1 = 'text-[46px] leading-[0.92] font-medium capitalize tracking-[-0.045em] text-balance sm:text-[84px] lg:text-[128px] lg:leading-[0.86]'
export const H3 = 'text-[22px] leading-[1.15] font-medium tracking-[-0.05em] md:text-[26px]'
export const BODY = 'text-base leading-[1.5] tracking-[-0.02em] text-body md:text-[17px]'
export const LEAD = 'text-xl leading-[1.25] font-medium tracking-[-0.045em] md:text-[26px] md:leading-[1.2]'

/* TypeSafe sets headings very large, medium weight, capitalised, with lines almost touching. */
export const DISPLAY = 'font-medium capitalize tracking-[-0.045em] text-balance'

type Ground = 'paper' | 'studio' | 'night' | 'ink' | 'blue'

const GROUNDS: Record<Ground, string> = {
  paper: 'bg-paper text-ink',
  studio: 'bg-studio text-ink',
  night: 'grid-dark text-white',
  // The same dark without the grid, for sections where text must read cleanly.
  ink: 'bg-night text-white',
  blue: 'bg-brand text-white',
}

/** Page section on one of the grounds. Sections that hold showcase renders use `studio`. */
export function Section({ id, ground = 'paper', className = '', field, children }: { id?: string; ground?: Ground; className?: string; field?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className={`relative ${GROUNDS[ground]} ${GUTTER} py-16 md:py-24 lg:py-28 ${className}`}>
      {field}
      <div className={`relative ${WRAP}`}>{children}</div>
    </section>
  )
}

/** Four corner ticks around a block, as TypeSafe frames its headings. */
export function Ticks({ children, tone = 'light', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  const c = `absolute block size-2 ${tone === 'dark' ? 'border-white/60' : 'border-ink/50'}`
  return (
    <div className={`relative py-6 md:py-10 ${className}`}>
      <span aria-hidden="true" className={`${c} top-0 left-0 border-t border-l`} />
      <span aria-hidden="true" className={`${c} top-0 right-0 border-t border-r`} />
      <span aria-hidden="true" className={`${c} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden="true" className={`${c} right-0 bottom-0 border-r border-b`} />
      {children}
    </div>
  )
}

/** Section heading in the TypeSafe manner: huge, centred (or left), inside corner ticks, with a masked line reveal. */
export function Display({ children, tone = 'light', align = 'center', size = 'lg', id, note, className = '' }: { children: ReactNode; tone?: Tone; align?: 'center' | 'left'; size?: 'lg' | 'md'; id?: string; note?: ReactNode; className?: string }) {
  const sizes = size === 'lg' ? 'text-[40px] leading-[0.95] sm:text-[64px] lg:text-[96px] lg:leading-[0.9]' : 'text-[34px] leading-[0.98] sm:text-[48px] lg:text-[64px] lg:leading-[0.94]'
  return (
    <Ticks tone={tone} className={className}>
      <div id={id}>
        <SplitReveal as="h2" className={`${DISPLAY} ${sizes} ${align === 'center' ? 'mx-auto max-w-[15ch] text-center' : 'max-w-[16ch]'}`}>
          {children}
        </SplitReveal>
      </div>
      {note && <p className={`mt-4 font-mono text-[10px] tracking-[0.05em] capitalize md:text-xs ${align === 'center' ? 'text-center' : ''} ${tone === 'dark' ? 'text-white/80' : 'text-body'}`}>{note}</p>}
    </Ticks>
  )
}

/** TypeSafe text column: a 1px rule down the left, a small mono label on top, then the copy. */
export function RuleCol({ label, children, tone = 'light', className = '' }: { label?: ReactNode; children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <div className={`flex flex-col justify-between gap-8 border-l pl-2.5 md:gap-12 ${tone === 'dark' ? 'border-white/70' : 'border-ink'} ${className}`}>
      {label && <div className={`font-mono text-[10px] font-medium tracking-[0.05em] capitalize md:text-[11px] ${tone === 'dark' ? 'text-white/80' : 'text-body'}`}>{label}</div>}
      <div>{children}</div>
    </div>
  )
}

/** Terminal window: black (or blue) title bar in mono, white body, hard 1px frame. */
export function Window({ title, accent = false, children, className = '', bodyClassName = 'bg-paper' }: { title: ReactNode; accent?: boolean; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <div className={`border border-ink bg-paper text-ink shadow-[3px_3px_0_0_rgba(26,26,26,0.18)] ${className}`}>
      <div className={`flex min-h-6 items-center px-1.5 font-mono text-xs font-medium tracking-[0.02em] text-white md:text-[13px] ${accent ? 'bg-brand' : 'bg-ink'}`}>{title}</div>
      <div className={`border-t border-ink ${bodyClassName}`}>{children}</div>
    </div>
  )
}

/** Dotted blue panel that holds a window, with a black tag in the corner and a ruled caption below. */
export function Panel({ tag, children, title, caption, className = '', padded = true }: { tag: ReactNode; children: ReactNode; title?: ReactNode; caption?: ReactNode; className?: string; padded?: boolean }) {
  return (
    <figure className={`flex flex-col border-l border-ink ${className}`}>
      <div className={`dots-blue relative flex-1 ${padded ? 'px-4 pt-12 pb-8 md:px-8 md:pt-14 md:pb-10' : ''}`}>
        <span className="absolute top-0 left-0 z-10 bg-ink px-1.5 py-0.5 font-mono text-xs font-medium tracking-[0.02em] text-white md:text-[13px]">{tag}</span>
        {children}
      </div>
      {(title || caption) && (
        <figcaption className="pt-4 pl-2.5">
          {title && <span className="block text-[15px] font-medium tracking-[-0.03em] md:text-base">{title}</span>}
          {caption && <span className="mt-1 block text-sm leading-snug tracking-[-0.02em] text-muted md:text-[15px]">{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/** TypeSafe's hero call to action: a very large underlined text link. */
export function BigLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      {...external(href)}
      className={`inline-flex min-h-11 items-center border-b-[3px] border-current pb-0.5 text-[32px] leading-none font-medium tracking-[-0.045em] capitalize transition-colors duration-300 hover:text-brand sm:text-[44px] ${className}`}
    >
      {children}
    </a>
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
