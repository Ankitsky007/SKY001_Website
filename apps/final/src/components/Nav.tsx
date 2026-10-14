import { SkyfallLogo } from '@skyfall/core'
import { ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useState } from 'react'
import { scrambleOnHover } from '../lib/scramble'
import { ButtonLink } from '../lib/ui'

export type NavTab = { label: string; href: string; current?: boolean }

const ext = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

/**
 * aeye boxed nav. md+: a row of white tabs hangs from the top edge, the current one is the tall
 * blue tab wrapped in `< >`, and the call to action sits on the right. Tabs that point at a section
 * of this page light up while that section is in the middle of the screen. Phones: a white header
 * with a menu sheet.
 */
export function Nav({ home, tabs, cta }: { home: string; tabs: readonly NavTab[]; cta: { label: string; href: string } }) {
  const [spied, setSpied] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useGSAP(() => {
    const triggers = tabs
      .filter((t) => t.href.startsWith('#') && t.href.length > 1 && document.querySelector(t.href))
      .map((t) => ScrollTrigger.create({ trigger: t.href, start: 'top 50%', end: 'bottom 50%', onToggle: (self) => setSpied(self.isActive ? t.href : null) }))
    return () => triggers.forEach((t) => t.kill())
  })

  const isActive = (t: NavTab) => (spied ? t.href === spied : !!t.current)

  return (
    <>
      <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-10 lg:block">
        <div className="mx-auto flex max-w-[1208px] items-start justify-between">
          <ul className="pointer-events-auto flex items-start font-mono text-[13px] font-medium tracking-[-0.02em] uppercase lg:text-sm">
            <li>
              <a href={home} aria-label="Skyfall AI home" className="flex h-11 items-center border-r border-b border-l border-night-mid bg-white px-3.5 text-ink">
                <SkyfallLogo width={118} />
              </a>
            </li>
            {tabs.map((tab) => {
              const active = isActive(tab)
              return (
                <li key={tab.label}>
                  <a
                    href={tab.href}
                    {...ext(tab.href)}
                    aria-current={active ? 'location' : undefined}
                    onPointerEnter={scrambleOnHover}
                    className={`flex items-center px-2.5 transition-[height,background-color,color] duration-300 ease-out-expo lg:px-3.5 ${
                      active ? 'h-[52px] bg-brand font-semibold text-white' : 'h-11 border-r border-b border-night-mid bg-white text-ink hover:bg-line'
                    }`}
                  >
                    <span data-scramble>{active ? `<${tab.label}>` : tab.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
          <a
            href={cta.href}
            onPointerEnter={scrambleOnHover}
            className="group pointer-events-auto flex h-[52px] items-center gap-3 border border-t-0 border-night-mid bg-white px-4 font-mono text-[14px] font-semibold tracking-[-0.02em] text-ink uppercase transition-colors duration-300 hover:text-brand lg:px-5 lg:text-[15px]"
          >
            <span aria-hidden="true" className="block size-2 bg-brand transition-transform duration-300 group-hover:-rotate-180" />
            <span data-scramble>{cta.label}</span>
          </a>
        </div>
      </nav>

      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-line bg-white pr-3 pl-6 lg:hidden">
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
        className={`fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col justify-between overflow-y-auto bg-white px-6 pt-2 pb-8 transition-[clip-path] duration-500 ease-out-expo lg:hidden ${open ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)]'}`}
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
        <div onClick={() => setOpen(false)}>
          <ButtonLink href={cta.href} className="w-full">
            {cta.label}
          </ButtonLink>
        </div>
      </div>
    </>
  )
}
