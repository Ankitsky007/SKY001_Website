import { site, SkyfallLogo } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
import { useAnchorScroll } from '../lib/useAnchorScroll'

const colLabel = 'mb-1.5 font-mono text-[10px] tracking-[0.06em] text-dim uppercase md:mb-0 md:text-[11px]'
const link =
  'inline-flex min-h-11 items-center self-start text-base text-soft transition-colors duration-300 hover:text-brand-lift md:min-h-9 md:text-[15px]'

export function Footer() {
  const go = useAnchorScroll()
  return (
    <footer id="contact" className="border-t border-[#1A1A1E]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pt-12 pb-6 md:gap-12 md:px-10 md:pt-14 md:pb-7 lg:gap-16 lg:px-16 lg:pt-16 lg:pb-8">
        <Reveal stagger={0.08} y={16} className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-6 lg:grid-cols-12">
          <div className="col-span-2 flex flex-col gap-3.5 md:col-span-4 lg:col-span-5 lg:gap-5">
            <a href="#top" onClick={go} aria-label="Skyfall AI home" className="self-start text-ink">
              <SkyfallLogo className="h-[22px] w-auto md:h-6 lg:h-7" />
            </a>
            <p className="m-0 max-w-[360px] text-[15px] leading-[1.5] text-meta">{site.tagline}</p>
          </div>
          {/* Column labels (Pages, Follow, Get in touch) are board labels, not content.ts copy. */}
          <nav aria-label="Pages" className="flex flex-col md:gap-1 lg:col-span-2 lg:col-start-7">
            <span className={colLabel}>Pages</span>
            {site.nav.map((n) => (
              <a key={n.href} href={n.href} onClick={go} className={link}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-8 md:contents">
            <nav aria-label="Social" className="flex flex-col md:gap-1 lg:col-span-2">
              <span className={colLabel}>Follow</span>
              {site.social.map((s) => (
                <a key={s.label} href={s.href} className={link}>
                  {s.label} ↗
                </a>
              ))}
            </nav>
            <div className="flex flex-col md:gap-1 lg:col-span-2">
              <span className={colLabel}>Get in touch</span>
              <a href="#contact" className={`${link} text-sm`}>
                {site.contactEmail}
              </a>
            </div>
          </div>
        </Reveal>
        <div className="flex flex-col items-start gap-1 border-t border-[#1A1A1E] pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 font-mono text-[11px] tracking-[0.04em] text-meta uppercase lg:pt-6 lg:text-xs">
          <span>
            © {site.year} {site.name}
          </span>
          <span className="flex gap-4 md:gap-5 lg:gap-6">
            {site.legal.map((l) => (
              <a key={l.label} href={l.href} className="inline-flex min-h-11 items-center transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  )
}
