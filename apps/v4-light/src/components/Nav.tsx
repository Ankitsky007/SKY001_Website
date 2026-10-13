import { SkyfallLogo } from '@skyfall/core'
import { useState } from 'react'
import { ButtonLink, GUTTER, WRAP } from '../lib/ui'

type NavLink = { label: string; href: string }

/** Sticky white header: logo, page links, one blue button. Phones get a 44px menu button. */
export function Nav({ home, links, cta }: { home: string; links: readonly NavLink[]; cta: NavLink }) {
  const [open, setOpen] = useState(false)

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md ${GUTTER} pt-[env(safe-area-inset-top,0px)]`}>
      <div className={`${WRAP} flex min-h-14 items-center gap-4 lg:min-h-16`}>
        <a href={home} aria-label="Skyfall AI home" className="mr-auto inline-flex min-h-11 items-center text-ink">
          <SkyfallLogo width={132} />
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <ButtonLink href={cta.href} className="min-h-10 px-4 text-sm">
          {cta.label}
        </ButtonLink>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
        >
          <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {open ? <path d="M5 5l10 10M15 5 5 15" /> : <path d="M3 7h14M3 13h14" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Menu" className={`${WRAP} flex flex-col border-t border-line py-2 lg:hidden`}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex min-h-11 items-center text-base"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
