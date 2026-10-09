import { hero, site, SkyfallLogo } from '@skyfall/core'
import { ScrollTrigger, useGSAP, useLenis } from '@skyfall/core/motion'
import { useEffect, useRef, useState } from 'react'
import { scrambleOnHover } from '../lib/motion'
import { PrimaryButton } from '../components/ui'

// Sections that light a nav tab while they fill the middle of the viewport. Backers has no tab.
const SPY = ['top', 'research', 'team', 'backers', 'sky-001', 'contact'] as const

/** `<Label>` wrapping for the current tab, as in aeye. */
const current = (label: string) => `<${label}>`

/**
 * aeye boxed nav: on md+ a row of white tabs hangs from the top edge (the current section is the
 * tall blue tab) with the CTA on the right; on phones a white header with a menu sheet.
 */
export function Nav() {
  const [active, setActive] = useState<string>('top')
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const menuBtn = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const triggers = SPY.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => self.isActive && setActive(id),
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  })

  // Lock the page behind the open menu; Escape closes it.
  useEffect(() => {
    if (!open) return
    const btn = menuBtn.current
    lenis?.stop()
    const root = document.documentElement
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      btn?.focus()
    }
  }, [open, lenis])

  const tabs = [{ id: 'top', label: 'Home', href: '#top' }, ...site.nav.map((n) => ({ id: n.href.slice(1), label: n.label, href: n.href }))]

  return (
    <>
      {/* md+: boxed tabs */}
      <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden md:block">
        <div className="wrap flex items-start justify-between">
          <ul className="pointer-events-auto flex items-start font-mono text-[13px] font-medium tracking-[-0.02em] uppercase lg:text-sm">
            {tabs.map((tab, i) => {
              const isActive = tab.id === active
              return (
                <li key={tab.id}>
                  <a
                    href={tab.href}
                    aria-current={isActive ? 'location' : undefined}
                    onPointerEnter={scrambleOnHover}
                    className={`flex items-center px-2.5 transition-[height,background-color,color] duration-300 ease-out-expo lg:px-3.5 ${
                      isActive
                        ? 'h-[52px] bg-brand font-semibold text-white'
                        : `h-11 border-r border-b border-night-mid bg-white text-ink hover:bg-line ${i === 0 ? 'border-l' : ''}`
                    }`}
                  >
                    <span data-scramble>{isActive ? current(tab.label) : tab.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
          <a
            href={hero.primaryCta.href}
            onPointerEnter={scrambleOnHover}
            className="group pointer-events-auto flex h-[52px] items-center gap-3 border border-t-0 border-night-mid bg-white px-4 font-mono text-[14px] font-semibold tracking-[-0.02em] text-ink uppercase transition-colors duration-300 hover:text-brand lg:px-5 lg:text-[15px]"
          >
            <span aria-hidden="true" className="relative block size-3.5 overflow-hidden">
              <svg viewBox="0 0 14 14" className="absolute inset-0 size-3.5 transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full">
                <path d="M3 11 L11 3 M5 3 H11 V9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <svg viewBox="0 0 14 14" className="absolute inset-0 size-3.5 -translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-0">
                <path d="M3 11 L11 3 M5 3 H11 V9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <span data-scramble>{hero.primaryCta.label}</span>
          </a>
        </div>
      </nav>

      {/* Phones: white header + menu sheet */}
      <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between bg-white pr-4 pl-6 md:hidden">
        <a href="#top" className="flex min-h-11 items-center gap-2.5 text-ink" aria-label={site.name}>
          <SkyfallLogo width={161} />
          <span className="bg-chip px-1.5 py-[3px] font-mono text-[11px] font-medium tracking-[-0.02em] text-body uppercase">Lab</span>
        </a>
        <button
          ref={menuBtn}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          className="relative grid size-11 cursor-pointer place-items-center"
        >
          <span className={`absolute block h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-2'}`} />
          <span className={`absolute block h-0.5 w-6 bg-ink transition-[scale] duration-300 ${open ? 'scale-x-0' : ''}`} />
          <span className={`absolute block h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-2'}`} />
        </button>
      </header>

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 top-[72px] bottom-0 z-40 flex flex-col justify-between bg-white px-6 pt-4 pb-8 transition-[clip-path] duration-500 ease-out-expo md:hidden ${
          open ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)]'
        }`}
      >
        <ul className="border-t border-line">
          {site.nav.map((item, i) => (
            <li key={item.href} className="border-b border-line">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex min-h-16 items-center justify-between font-mono text-2xl font-medium tracking-[-0.04em] text-ink uppercase transition-[translate,opacity] duration-500 ease-out-expo ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
              >
                {item.label}
                <span aria-hidden="true" className="text-sm text-faint">
                  0{i + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div onClick={() => setOpen(false)}>
          <PrimaryButton href={hero.primaryCta.href} className="w-full">
            {hero.primaryCta.label}
          </PrimaryButton>
        </div>
      </div>
    </>
  )
}
