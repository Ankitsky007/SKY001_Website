import { gsap, prefersReducedMotion, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef, type ReactNode } from 'react'
import { scrambleOnHover } from '../lib/motion'
import { useScrambleIn } from '../lib/useScrambleIn'

type Tone = 'light' | 'dark'

/** aeye numbered eyebrow: `[N.01/03] —— > LABEL ————`. The label scrambles in and the rule draws. */
export function Eyebrow({ index, total = 3, label, tone = 'light' }: { index: number; total?: number; label: string; tone?: Tone }) {
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
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div
      ref={ref}
      className={`flex items-center gap-2.5 font-mono text-xs font-medium tracking-[-0.02em] uppercase md:gap-4 md:text-sm ${dark ? 'text-night-text' : 'text-body'}`}
    >
      <span className="shrink-0">
        [N.<span className={dark ? 'text-white' : 'text-ink'}>{pad(index)}</span>/<span className={dark ? 'text-muted' : 'text-faint'}>{pad(total)}</span>]
      </span>
      <span data-rule className={`h-px w-4 shrink-0 md:w-6 ${dark ? 'bg-night-mid' : 'bg-slash'}`} />
      <span className="shrink-0" data-scramble-in>
        &gt; {label}
      </span>
      <span data-rule className={`h-px min-w-4 flex-1 ${dark ? 'bg-night-line' : 'bg-line'}`} />
    </div>
  )
}

/** Pixel-font slash that frames aeye headings. */
export function Slash({ side, tone = 'light' }: { side: 'start' | 'end'; tone?: Tone }) {
  return (
    <span
      aria-hidden="true"
      className={`font-pixel tracking-normal ${tone === 'dark' ? 'text-night-mid' : 'text-slash'} ${side === 'start' ? 'mr-2 md:mr-3' : 'ml-2 md:ml-3'}`}
    >
      /
    </span>
  )
}

/** `/ Heading /` with a masked line reveal (aeye's headings are Geist 400, -0.06em). */
export function SlashHeading({ children, tone = 'light', className = '', as = 'h2' }: { children: ReactNode; tone?: Tone; className?: string; as?: 'h2' | 'h3' }) {
  return (
    <SplitReveal
      as={as}
      className={`text-[34px] leading-[1.12] font-normal tracking-[-0.06em] md:text-[48px] md:leading-[1.1] lg:text-[56px] ${className}`}
    >
      <Slash side="start" tone={tone} />
      {children}
      <Slash side="end" tone={tone} />
    </SplitReveal>
  )
}

/** `// 1.2 What we build` sub-eyebrow in mono blue. */
export function SubLabel({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[13px] font-medium text-brand md:text-sm">{children}</span>
}

/** Small `■ LABEL` marker used above grids. */
export function SquareLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-xs font-medium text-muted uppercase md:text-[13px] ${className}`}>
      <span aria-hidden="true" className="block size-2 bg-brand" />
      {children}
    </div>
  )
}

/**
 * aeye primary button: ■ + mono label. On hover a blue panel slides in from the left, the square
 * turns and the label scrambles; pressed scales down a touch. Hover styles only on hover devices.
 */
export function PrimaryButton({ href, children, tone = 'dark', className = '' }: { href: string; children: ReactNode; tone?: Tone; className?: string }) {
  const dark = tone === 'dark'
  return (
    <a
      href={href}
      onPointerEnter={scrambleOnHover}
      className={`group relative inline-flex h-[52px] min-w-[240px] items-center justify-between gap-10 overflow-hidden px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] uppercase transition-[color,scale] duration-300 active:scale-[0.98] ${
        dark ? 'bg-ink text-white' : 'bg-white text-ink hover:text-white'
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

/** Secondary link: arrow left, mono label right, 1px underline that turns blue. */
export function UnderlineLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      onPointerEnter={scrambleOnHover}
      className={`group inline-flex h-[52px] min-w-[260px] items-center justify-between gap-10 border-b border-ink px-1 font-mono text-[15px] font-semibold tracking-[-0.02em] text-ink uppercase transition-colors duration-300 hover:border-brand hover:text-brand ${className}`}
    >
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">
        ↓
      </span>
      <span data-scramble>{children}</span>
    </a>
  )
}

/**
 * Accent word in Geist Pixel with brackets and an optional blinking block caret:
 * `[Post-Monolithic█]`. The word scrambles in on first view (see useScrambleIn on the parent).
 */
export function PixelWord({ children, caret = false, className = '' }: { children: string; caret?: boolean; className?: string }) {
  return (
    <span className={`font-pixel tracking-[-0.02em] whitespace-nowrap text-brand ${className}`}>
      [<span data-scramble-in>{children}</span>
      {caret && <span aria-hidden="true" className="caret" />}]
    </span>
  )
}

/** Square aeye toggle switch with clickable labels either side (44px tap targets). */
export function Toggle({ on, onChange, offLabel, onLabel, label }: { on: boolean; onChange: (on: boolean) => void; offLabel: string; onLabel: string; label: string }) {
  const labelCls = 'min-h-11 cursor-pointer uppercase transition-colors duration-300 hover:text-ink'
  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:gap-2 md:text-[13px]">
      <button type="button" onClick={() => onChange(false)} className={`${labelCls} ${on ? 'text-faint' : 'text-brand'}`} aria-hidden="true" tabIndex={-1}>
        {offLabel}
      </button>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className="grid size-11 cursor-pointer place-items-center">
        <span className={`relative block h-6 w-10 transition-colors duration-300 ${on ? 'bg-brand' : 'bg-line'}`}>
          <span className={`absolute top-1 left-1 block size-4 bg-white transition-transform duration-300 ease-out-expo ${on ? 'translate-x-4' : ''}`} />
        </span>
      </button>
      <button type="button" onClick={() => onChange(true)} className={`${labelCls} ${on ? 'text-brand' : 'text-faint'}`} aria-hidden="true" tabIndex={-1}>
        {onLabel}
      </button>
    </div>
  )
}

/** Mono figure caption under a panel. */
export function FigCaption({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`mt-3 font-mono text-[11px] leading-[1.4] tracking-[0.02em] text-muted uppercase md:mt-4 md:text-xs ${className}`}>{children}</p>
}
