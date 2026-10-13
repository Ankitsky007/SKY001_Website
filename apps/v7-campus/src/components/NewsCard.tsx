import { sky001 } from '@skyfall/core'
import { Window } from '../lib/ui'

/** TypeSafe-style news card: a small terminal window with the date in the title bar. */
export function NewsCard({ href = sky001.news.cta.href, className = '' }: { href?: string; className?: string }) {
  const { news } = sky001
  const external = href.startsWith('http')
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={`group block w-full max-w-[340px] ${className}`}>
      <Window title={`${news.date} • ${news.label}`} accent bodyClassName="bg-studio">
        <span className="block px-4 pt-3 pb-3 text-center font-mono text-[13px] leading-snug md:text-sm">
          {news.title}
          <span className="mt-2 block underline underline-offset-2 transition-colors group-hover:text-brand">{news.cta.label}</span>
        </span>
      </Window>
    </a>
  )
}
