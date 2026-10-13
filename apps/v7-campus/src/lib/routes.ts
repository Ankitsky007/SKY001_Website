import { useSyncExternalStore } from 'react'

// Where the two pages live. A normal deploy serves the front page at "/" and the launch page at
// "/sky-001". A host that serves one file and blocks navigation (the Claude artifact build) sets
// VITE_ROUTER=memory: the two links become in-page hashes (valid as
// selectors, since the nav looks its links up) and the app swaps pages in place.
export const IN_PLACE = import.meta.env.VITE_ROUTER === 'memory'
export const HOME = IN_PLACE ? '#page-home' : '/'
export const LAUNCH = IN_PLACE ? '#page-sky-001' : '/sky-001'

type Page = 'home' | 'launch'

function initial(): Page {
  if (typeof window === 'undefined') return 'home'
  return /\/sky-001\/?$/.test(window.location.pathname) ? 'launch' : 'home'
}

let page: Page = initial()
const listeners = new Set<() => void>()

/** Swap pages in place when `href` is one of the two page links. Returns false for any other link. */
export function goTo(href: string) {
  if (!IN_PLACE || (href !== HOME && href !== LAUNCH)) return false
  page = href === LAUNCH ? 'launch' : 'home'
  listeners.forEach((l) => l())
  return true
}

export function usePage() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => page,
    () => page,
  )
}
