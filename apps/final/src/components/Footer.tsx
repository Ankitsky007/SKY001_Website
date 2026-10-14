import { site, SkyfallLogo } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
import { scrambleOnHover } from '../lib/scramble'
import { GUTTER, WRAP } from '../lib/ui'

const heading = 'mb-1 text-[15px] font-semibold tracking-[-0.02em] uppercase md:mb-2 md:text-base'
const link = 'flex min-h-11 items-center text-[17px] tracking-[-0.03em] text-body transition-colors duration-300 hover:text-brand md:text-lg'

/** aeye-style light footer: a boxed grid with the tagline and big wordmark, pages, socials and contact. */
export function Footer({ pages, note }: { pages: readonly { label: string; href: string }[]; note?: string }) {
  // contact details show once they are real values, not the content doc's [PLACEHOLDERS]
  const contact = [site.contactEmail, site.officeAddress].filter((v) => !v.startsWith('['))
  return (
    <footer id="contact" className={`${GUTTER} bg-paper pt-14 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] md:pt-20`}>
      <Reveal className={`${WRAP} grid border border-line lg:grid-cols-2`}>
        <div className="flex flex-col justify-between gap-8 border-b border-line p-6 md:p-10 lg:gap-20 lg:border-r lg:border-b-0">
          <p className="max-w-[20ch] text-xl leading-[1.25] font-medium tracking-[-0.05em] md:text-[30px] md:leading-[1.2]">
            <span aria-hidden="true" className="font-mono text-brand">
              /{' '}
            </span>
            {site.tagline}
          </p>
          <SkyfallLogo width={540} className="h-auto w-full max-w-[540px] text-ink" />
        </div>
        <div className="grid lg:grid-rows-[auto_1fr]">
          <div className={`grid md:grid-cols-2 ${contact.length > 0 ? 'border-b border-line' : ''}`}>
            <nav aria-label="Footer pages" className="flex flex-col border-b border-line p-6 md:border-r md:border-b-0 md:p-10">
              <span className={heading}>Pages</span>
              <ul className="grid grid-cols-2 gap-x-4 md:grid-cols-1">
                {pages.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className={link} onPointerEnter={scrambleOnHover} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>
                      <span data-scramble>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col p-6 md:p-10">
              <span className={heading}>Follow us</span>
              {site.social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className={`${link} group gap-3`}>
                  {s.label}
                  <span aria-hidden="true" className="flex-1 border-t border-dashed border-slash transition-colors group-hover:border-ghost" />
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
          {contact.length > 0 && (
            <address className="flex flex-col gap-2 p-6 not-italic md:p-10">
              <span className={heading}>Get in touch</span>
              {contact.map((v) => (
                <span key={v} className="text-[17px] tracking-[-0.03em] text-body md:text-lg">
                  {v}
                </span>
              ))}
            </address>
          )}
        </div>
      </Reveal>
      <div className={`${WRAP} mt-5 flex flex-col gap-2 font-mono text-xs text-muted uppercase md:flex-row md:items-center md:justify-between`}>
        <p>
          © {site.year} {site.name}
        </p>
        {note && <p className="max-w-[70ch] normal-case">{note}</p>}
        <ul className="flex gap-6">
          {site.legal.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="inline-flex min-h-11 items-center hover:text-brand">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
