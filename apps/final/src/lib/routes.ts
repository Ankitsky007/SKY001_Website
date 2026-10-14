// Page links. The front page lives at "/" and the SKY-001 page at "/sky-001". A build for a viewer
// that serves one file (the shareable Claude artifact) sets VITE_HASH_ROUTES=1 and switches pages
// on "#home" and "#sky-001" instead.
export const HASH_ROUTES = import.meta.env.VITE_HASH_ROUTES === '1'
export const HOME = HASH_ROUTES ? '#home' : '/'
export const LAUNCH = HASH_ROUTES ? '#sky-001' : '/sky-001'

// The research site lives elsewhere for now (a temporary tunnel address from Ankit, 2026-10-14);
// the nav's Research tab and the hero's "Read our research" link both go there.
export const RESEARCH = 'https://temple-greene-saves-theorem.trycloudflare.com/'

/** Links that open pop-ups instead of going somewhere. */
export const WAITLIST_HREF = '#join-waitlist'
export const VIDEO_HREF = '#launch-video'

export type Page = 'home' | 'launch'

export function currentPage(): Page {
  if (typeof window === 'undefined') return 'home'
  if (HASH_ROUTES) return window.location.hash === LAUNCH ? 'launch' : 'home'
  return /\/sky-001\/?$/.test(window.location.pathname) ? 'launch' : 'home'
}
