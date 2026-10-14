import { sky001 } from '@skyfall/core'

/**
 * The launch news as a thin blue ticker across the very top of every page (Ankit, 2026-10-14),
 * in place of the news card in the SKY-001 hero. The line scrolls slowly and pauses under the
 * pointer; the whole strip links to the post; × hides it. Reduced motion shows it still.
 */
export function NewsTicker({ onClose }: { onClose: () => void }) {
  const { news } = sky001
  const external = news.cta.href.startsWith('http')
  const item = (
    <span className="flex shrink-0 items-center gap-3 pr-14">
      <span aria-hidden="true" className="block size-1.5 bg-white" />
      <span className="text-white/75">{news.date}</span>
      <span aria-hidden="true" className="text-white/50">·</span>
      <span className="text-white/75">{news.label}</span>
      <span aria-hidden="true" className="text-white/50">·</span>
      <span>{news.title}</span>
      <span className="underline underline-offset-2">{news.cta.label} →</span>
    </span>
  )
  // four copies per track and two tracks, so the loop is seamless on any screen width
  const track = (
    <span aria-hidden="true" className="ticker-track flex shrink-0">
      {item}
      {item}
      {item}
      {item}
    </span>
  )
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-stretch bg-brand font-mono text-[12px] font-medium tracking-[0.02em] text-white uppercase">
      <a href={news.cta.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} aria-label={`${news.date}, ${news.label}: ${news.title}. ${news.cta.label}`} className="ticker group flex min-w-0 flex-1 items-center overflow-hidden">
        {track}
        {track}
      </a>
      <button type="button" onClick={onClose} aria-label="Hide news" className="relative grid w-11 shrink-0 cursor-pointer place-items-center border-l border-white/30 text-base leading-none transition-colors after:absolute after:inset-x-0 after:-inset-y-1 hover:bg-white/10">
        ×
      </button>
    </div>
  )
}
