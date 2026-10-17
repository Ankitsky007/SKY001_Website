import { SkyfallLogo } from '@skyfall/core'
import { useEffect, useState } from 'react'
import { scrambleOnHover } from '../lib/scramble'

/** A nav tab. `spy` lights it while the page is between those two sections (ids), so a tab that links elsewhere can still mark its part of the page. */
export type NavTab = { label: string; href: string; current?: boolean; spy?: { from: string; to?: string } }

const ext = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

/**
 * Full-width rail (Ankit picked option B, 2026-10-17). Desktop: a white bar across the top with a
 * hairline under it, the logo on the left and the tabs on the right; the current tab is a solid blue
 * block wrapped in `< >`. Tabs that point at a section
 * of this page light up while that section is in the middle of the screen. Phones: a white header
 * with a menu sheet.
 */
export function Nav({ home, tabs }: { home: string; tabs: readonly NavTab[] }) {
  const [spied, setSpied] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  // Light the tab whose part of the page crosses a line 40% down the screen. Measured from the
  // live layout on every scroll, so pinned sections and late-loading media cannot throw it off.
  useEffect(() => {
    const spies = tabs
      .map((t) => ({ label: t.label, spy: t.spy ?? (t.href.startsWith('#') && t.href.length > 1 ? { from: t.href } : null) }))
      .filter((x): x is { label: string; spy: { from: string; to?: string } } => !!x.spy)
    let raf = 0
    const check = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let hit: string | null = null
      for (const { label, spy } of spies) {
        const a = document.querySelector(spy.from)
        const b = spy.to ? document.querySelector(spy.to) : a
        if (!a || !b) continue
        if (a.getBoundingClientRect().top <= line && b.getBoundingClientRect().bottom > line) hit = label
      }
      setSpied(hit)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [tabs])

  const isActive = (t: NavTab) => (spied ? t.label === spied : !!t.current)

  return (
    <>
      <nav aria-label="Main" className="fixed inset-x-0 top-0 z-50 hidden h-14 border-b border-line bg-white px-10 lg:block">
        <div className="mx-auto flex h-full max-w-[1208px] items-stretch justify-between">
          <a href={home} aria-label="Skyfall AI home" className="flex items-center text-ink">
            <SkyfallLogo width={132} />
          </a>
          <ul className="flex font-mono text-sm font-medium tracking-[-0.02em] uppercase">
            {tabs.map((tab, i) => {
              const active = isActive(tab)
              return (
                <li key={tab.label} className="flex">
                  <a
                    href={tab.href}
                    {...ext(tab.href)}
                    aria-current={active ? 'location' : undefined}
                    onPointerEnter={scrambleOnHover}
                    className={`flex items-center border-r border-line px-[22px] transition-colors duration-300 ease-out-expo ${i === 0 ? 'border-l' : ''} ${
                      active ? 'border-brand bg-brand font-semibold text-white' : 'bg-white text-ink hover:bg-studio'
                    }`}
                  >
                    <span data-scramble>{active ? `<${tab.label}>` : tab.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <header className={`sticky top-0 z-50 flex h-16 items-center justify-between border-b border-line bg-white pr-3 pl-6 lg:hidden`}>
        <a href={home} className="flex min-h-11 items-center text-ink" aria-label="Skyfall AI home">
          <SkyfallLogo width={140} />
        </a>
        <button type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)} className="relative grid size-11 cursor-pointer place-items-center">
          <span className={`absolute block h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
          <span className={`absolute block h-0.5 w-6 bg-ink transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
        </button>
      </header>
      <div
        id="mobile-menu"
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-white px-6 pt-2 pb-8 transition-[clip-path] duration-500 ease-out-expo lg:hidden ${open ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)]'}`}
      >
        <ul>
          {tabs.map((tab, i) => (
            <li key={tab.label} className="border-b border-line">
              <a href={tab.href} {...ext(tab.href)} onClick={() => setOpen(false)} className="flex min-h-16 items-center justify-between font-mono text-2xl font-medium tracking-[-0.04em] text-ink uppercase">
                {tab.label}
                <span aria-hidden="true" className="text-sm text-faint">
                  0{i + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
