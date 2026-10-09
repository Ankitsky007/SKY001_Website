import type { MouseEvent } from 'react'
import { useLenis } from '@skyfall/core/motion'

/** In-page anchors glide with Lenis (offset by the sticky header) instead of jumping. */
export function useAnchorScroll() {
  const lenis = useLenis()
  return (e: MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href') ?? ''
    if (!href.startsWith('#') || href.length < 2) return
    const target = document.querySelector<HTMLElement>(href)
    if (!target) return
    e.preventDefault()
    const header = document.querySelector<HTMLElement>('[data-site-header]')
    const offset = -(header?.offsetHeight ?? 0)
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 })
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset })
    history.replaceState(null, '', href)
  }
}
