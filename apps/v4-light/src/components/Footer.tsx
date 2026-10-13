import { site, SkyfallLogo } from '@skyfall/core'
import { GUTTER, LABEL, WRAP } from '../lib/ui'

/** Dark closing footer, shared by both pages. `note` carries page-specific small print. */
export function Footer({ home, note }: { home: string; note?: string }) {
  return (
    <footer id="contact" className={`bg-stage text-white ${GUTTER} pt-14 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] lg:pt-20`}>
      <div className={`${WRAP} grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]`}>
        <div>
          <a href={home} aria-label="Skyfall AI home" className="inline-flex min-h-11 items-center">
            <SkyfallLogo width={150} />
          </a>
          <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-stage-muted">{site.tagline}</p>
        </div>
        <div>
          <span className={`${LABEL} text-stage-muted`}>Contact</span>
          <p className="mt-3 text-[15px]">{site.contactEmail}</p>
          <p className="text-[15px] text-stage-muted">{site.officeAddress}</p>
        </div>
        <div>
          <span className={`${LABEL} text-stage-muted`}>Follow</span>
          <ul className="mt-1">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="inline-flex min-h-11 items-center text-[15px] hover:text-brand-lift focus-visible:outline-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`${WRAP} mt-10 flex flex-col gap-3 border-t border-stage-line pt-6 text-[13px] text-stage-muted md:flex-row md:items-center md:justify-between`}>
        <p>
          © {site.year} {site.name}
        </p>
        {note && <p className="max-w-[60ch]">{note}</p>}
        <ul className="flex gap-6">
          {site.legal.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="inline-flex min-h-11 items-center hover:text-white focus-visible:outline-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
