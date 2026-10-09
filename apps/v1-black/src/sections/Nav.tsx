import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { hero, site, SkyfallLogo } from '@skyfall/core'
import { useLenis } from '@skyfall/core/motion'
import { CtaLink } from '../components/ui'
import { gsap, MOTION_OK, useGSAP } from '../lib/motion'
import { useAnchorScroll } from '../lib/useAnchorScroll'

/** Which nav target is under the middle of the viewport (for the nav's current marker). */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        // The hero ('top') clears the marker so nothing is highlighted above the fold.
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === 'top' ? null : e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const NAV_IDS = ['top', ...site.nav.map((n) => n.href.slice(1))]

export function Nav() {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const go = useAnchorScroll()
  const active = useActiveSection(NAV_IDS)
  const menuRef = useRef<HTMLDivElement>(null)

  // Lock scrolling and allow Escape while the phone/tablet menu is open.
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  useGSAP(
    () => {
      if (!open) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-menu-item]', { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
        gsap.from('[data-menu-fade]', { autoAlpha: 0, duration: 0.6, delay: 0.25 })
      })
      return () => mm.revert()
    },
    { scope: menuRef, dependencies: [open] },
  )

  // Release the scroll lock synchronously so the in-page glide can run right away.
  const closeMenu = () => {
    lenis?.start()
    document.documentElement.style.overflow = ''
    setOpen(false)
  }
  const onMenuLink = (e: MouseEvent<HTMLAnchorElement>) => {
    closeMenu()
    go(e)
  }

  return (
    <>
    <header data-site-header className="sticky top-0 z-50 border-b border-[#1A1A1E] bg-page/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between pr-3 pl-5 md:h-16 md:pr-8 md:pl-10 lg:h-[72px] lg:px-16">
        <a href="#top" onClick={go} aria-label="Skyfall AI home" className="flex min-h-11 items-center text-ink transition-opacity hover:opacity-80">
          <SkyfallLogo className="h-[18px] w-auto md:h-[22px] lg:h-6" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-10 font-mono text-[13px] font-medium tracking-[0.02em] uppercase">
            {site.nav.map((item) => {
              const current = active === item.href.slice(1)
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={go}
                    aria-current={current ? 'location' : undefined}
                    className={`group relative inline-flex min-h-11 items-center gap-2 transition-colors duration-300 hover:text-ink ${
                      current ? 'text-ink' : 'text-body'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`block size-1 bg-brand transition-transform duration-300 ease-out-expo ${current ? 'scale-100' : 'scale-0'}`}
                    />
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute right-0 bottom-2.5 left-3 h-px origin-left scale-x-0 bg-brand-lift transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden md:contents">
            <CtaLink href={hero.primaryCta.href} dot size="md">
              {hero.primaryCta.label}
            </CtaLink>
          </span>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
            className="relative flex size-11 flex-col items-center justify-center gap-[5px] border border-rule-2 transition-colors hover:border-rule-3 active:scale-95 lg:hidden"
          >
            <span className={`block h-[1.5px] w-[18px] bg-ink transition-transform duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] w-[18px] bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-[18px] bg-ink transition-transform duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
    </header>

      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          className="fixed inset-x-0 top-14 bottom-0 z-40 flex flex-col justify-between overflow-y-auto border-t border-[#1A1A1E] bg-page px-5 pt-8 pb-8 md:top-16 md:px-10 lg:hidden"
        >
          <nav aria-label="Menu">
            <ul className="flex flex-col">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-rule">
                  <a
                    data-menu-item
                    href={item.href}
                    onClick={onMenuLink}
                    className="flex min-h-16 items-center gap-4 text-[32px] tracking-[-0.04em] transition-colors hover:text-brand-lift md:text-[40px]"
                  >
                    <span className="w-8 font-mono text-[11px] tracking-[0.06em] text-meta">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div data-menu-fade className="mt-10 flex flex-col gap-6">
            <CtaLink href={hero.primaryCta.href} block className="md:hidden" onNavigate={closeMenu}>
              {hero.primaryCta.label}
            </CtaLink>
            <div className="flex gap-6 font-mono text-xs tracking-[0.04em] text-meta uppercase">
              {site.social.map((s) => (
                <a key={s.label} href={s.href} className="inline-flex min-h-11 items-center hover:text-ink">
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
