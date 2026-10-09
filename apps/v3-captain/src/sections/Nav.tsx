import { hero, site, SkyfallLogo } from '@skyfall/core'
import { ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useEffect, useState } from 'react'

// Board header: logo, four page links, Contact (pale) + Meet SKY-001 (blue). Phone: 44px menu button.
const PAGES = site.nav.filter((n) => n.href !== '#contact')
const CONTACT = site.nav.find((n) => n.href === '#contact')!
const SPY = ['#research', '#team', '#sky-001']

export function Nav() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)

  // Scroll spy: the link for the section under the header gets captain's pale "selected" state.
  useGSAP(() => {
    const triggers = SPY.flatMap((href) => {
      const el = document.querySelector(href)
      if (!el) return []
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        // Refresh after the pinned steps panel so positions include its pin spacing.
        refreshPriority: -1,
        onToggle: (self) => setCurrent((c) => (self.isActive ? href : c === href ? null : c)),
      })
    })
    ScrollTrigger.sort()
    return () => triggers.forEach((t) => t.kill())
  })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const link = (href: string) =>
    `flex min-h-11 items-center px-3.5 transition-colors duration-150 ${current === href ? 'bg-pale text-brand' : 'text-ink hover:bg-pale hover:text-brand'}`

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto flex h-15 max-w-[1440px] items-center gap-10 pr-4 pl-6 md:px-12 lg:h-16 xl:px-[116px]">
        <a href="#top" aria-label={`${site.name} home`} className="flex min-h-11 items-center text-brand">
          <SkyfallLogo width={161} className="lg:hidden" />
          <SkyfallLogo width={194} className="hidden lg:block" />
        </a>
        <nav aria-label="Main" className="hidden gap-1 text-sm font-medium lg:flex">
          {PAGES.map((n) => (
            <a key={n.href} href={n.href} className={link(n.href)} aria-current={current === n.href ? 'location' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden gap-2 text-sm font-medium lg:flex">
          <a href={CONTACT.href} className="flex min-h-11 items-center bg-pale px-[18px] transition-colors duration-150 hover:bg-brand hover:text-white">
            {CONTACT.label}
          </a>
          <a
            href={hero.primaryCta.href}
            className="flex min-h-11 items-center bg-brand px-[18px] text-white transition-colors duration-150 hover:bg-brand-deep active:translate-y-px"
          >
            {hero.primaryCta.label}
          </a>
        </div>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto flex size-11 cursor-pointer items-center justify-center bg-pale transition-colors hover:bg-pale-2 lg:hidden"
        >
          <svg viewBox="0 0 18 12" width="18" height="12" fill="none" stroke="#0B1338" strokeWidth="1.6" aria-hidden="true">
            <path className="origin-center transition-transform duration-300" d={open ? 'M2 0l14 12' : 'M0 1h18'} />
            <path className={`transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} d="M0 6h18" />
            <path className="origin-center transition-transform duration-300" d={open ? 'M2 12L16 0' : 'M0 11h18'} />
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-white px-6 pt-2 pb-6 lg:hidden"
        onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}
      >
        <nav aria-label="Mobile" className="flex flex-col text-lg">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="flex min-h-12 items-center border-b border-line hover:text-brand">
              {n.label}
            </a>
          ))}
        </nav>
        <a href={hero.primaryCta.href} className="mt-4 flex min-h-12 items-center justify-center bg-brand font-medium text-white">
          {hero.primaryCta.label}
        </a>
      </div>
    </header>
  )
}
