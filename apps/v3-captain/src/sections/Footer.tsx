import { site, SkyfallLogo } from '@skyfall/core'
import { useLenis } from '@skyfall/core/motion'
import type { MouseEvent } from 'react'

const HEAD = 'mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.04em] text-navy-muted lg:mb-2 lg:text-xs'
const LINK = 'flex min-h-11 items-center gap-1.5 text-white transition-colors hover:text-lift'

/** Navy footer. Column headings, "Back to top" and the © line are storyboard labels. */
export function Footer() {
  const lenis = useLenis()
  const toTop = (e: MouseEvent) => {
    e.preventDefault()
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="bg-navy text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 pt-14 pb-8 md:px-12 md:pt-20 lg:gap-16 lg:pb-10 xl:px-[116px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-4 lg:gap-6">
            <SkyfallLogo width={194} className="lg:hidden" />
            <SkyfallLogo width={258} className="hidden lg:block" />
            <p className="max-w-[360px] text-lg leading-[1.35] tracking-[-0.02em] text-navy-muted lg:text-xl">{site.tagline}</p>
          </div>
          <div className="flex flex-col gap-10 md:flex-row md:gap-16 xl:gap-24">
            <nav aria-label="Footer pages" className="grid grid-cols-2 gap-x-4 md:flex md:flex-col md:gap-0">
              <span className={`col-span-2 ${HEAD}`}>[ Pages ]</span>
              {site.nav.map((n) => (
                <a key={n.href} href={n.href} className={LINK}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-x-4 md:flex md:flex-col">
              <span className={`col-span-2 ${HEAD}`}>[ Follow us ]</span>
              {site.social.map((s) => (
                <a key={s.label} href={s.href} className={LINK}>
                  {s.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <address className="flex flex-col gap-2.5 not-italic md:gap-0">
              <span className={HEAD}>[ Get in touch ]</span>
              <span className="md:flex md:min-h-11 md:items-center">{site.contactEmail}</span>
              <span className="md:flex md:min-h-11 md:items-center">{site.officeAddress}</span>
            </address>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-navy-line pt-5 font-mono text-[10px] font-medium tracking-[0.04em] text-navy-muted uppercase lg:flex-row lg:items-center lg:justify-between lg:pt-6 lg:text-xs">
          <span className="mb-2 lg:mb-0">
            © {site.year} {site.name}
          </span>
          <span className="flex flex-wrap gap-x-5 lg:gap-x-6">
            {site.legal.map((l) => (
              <a key={l.label} href={l.href} className="flex min-h-11 items-center text-white transition-colors hover:text-lift">
                {l.label}
              </a>
            ))}
            <a href="#top" onClick={toTop} className="flex min-h-11 items-center text-white transition-colors hover:text-lift">
              Back to top ↑
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
