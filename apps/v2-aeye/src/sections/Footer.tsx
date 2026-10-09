import { site, SkyfallLogo } from '@skyfall/core'
import { Reveal, useLenis } from '@skyfall/core/motion'
import { scrambleOnHover } from '../lib/motion'

const heading = 'mb-1 text-[15px] font-semibold tracking-[-0.02em] uppercase md:mb-2 md:text-base'
const link = 'flex min-h-11 items-center text-[17px] tracking-[-0.03em] text-body transition-colors duration-300 hover:text-brand md:text-lg'

/** aeye-style footer: boxed grid with tagline + big wordmark, pages, socials, contact, then the legal row. */
export function Footer() {
  const lenis = useLenis()
  const toTop = () => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }))

  return (
    <footer id="contact" className="wrap pt-14 pb-8 md:pt-24 md:pb-10">
      <Reveal className="grid border border-line lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-8 border-b border-line p-6 md:p-12 lg:gap-24 lg:border-r lg:border-b-0">
          <div className="flex flex-col gap-4">
            <p className="text-xl leading-[1.25] font-medium tracking-[-0.05em] md:text-[30px] md:leading-[1.2]">
              <span className="text-brand">/</span> {site.tagline}
            </p>
            <span className="hidden font-mono text-[13px] font-medium text-muted uppercase lg:block">{site.name} · Research lab</span>
          </div>
          <SkyfallLogo width={540} className="h-auto w-full max-w-[540px] text-ink" />
        </div>

        <div className="grid lg:grid-rows-[auto_1fr]">
          <div className="grid border-b border-line md:grid-cols-2">
            <nav aria-label="Footer pages" className="flex flex-col border-b border-line p-6 md:border-r md:border-b-0 md:p-12">
              <span className={heading}>Pages</span>
              <ul className="grid grid-cols-2 gap-x-4 md:grid-cols-1">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={link} onPointerEnter={scrambleOnHover}>
                      <span data-scramble>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col p-6 md:p-12">
              <span className={heading}>Follow us</span>
              {site.social.map((s) => (
                <a key={s.label} href={s.href} className={`${link} group gap-3`}>
                  <span aria-hidden="true" className="w-5 font-mono font-semibold text-ink transition-colors group-hover:text-brand">
                    {s.label === 'LinkedIn' ? 'in' : s.label}
                  </span>
                  <span aria-hidden="true" className="flex-1 border-t border-dashed border-slash transition-colors group-hover:border-ghost" />
                  {s.label}
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
          <address className="flex flex-col gap-2 p-6 not-italic md:p-12">
            <span className={heading}>Get in touch</span>
            <span className="text-[17px] tracking-[-0.03em] text-body md:text-lg">{site.contactEmail}</span>
            <span className="text-[17px] tracking-[-0.03em] text-body md:text-lg">{site.officeAddress}</span>
          </address>
        </div>
      </Reveal>

      <div className="mt-6 flex flex-col gap-2 text-[15px] tracking-[-0.02em] text-muted md:mt-12 md:flex-row md:items-center md:justify-between">
        <span>
          © {site.year} {site.name}
        </span>
        <span className="flex items-center gap-3">
          {site.legal.map((l, i) => (
            <span key={l.label} className="flex items-center gap-3">
              {i > 0 && <span className="text-slash">/</span>}
              <a href={l.href} className="flex min-h-11 items-center text-body underline underline-offset-2 transition-colors hover:text-brand">
                {l.label}
              </a>
            </span>
          ))}
        </span>
        <button
          type="button"
          onClick={toTop}
          onPointerEnter={scrambleOnHover}
          className="hidden min-h-11 cursor-pointer items-center font-mono text-[13px] font-medium text-ink uppercase transition-colors hover:text-brand md:flex"
        >
          <span data-scramble>Back to top</span>&nbsp;↑
        </button>
      </div>
    </footer>
  )
}
