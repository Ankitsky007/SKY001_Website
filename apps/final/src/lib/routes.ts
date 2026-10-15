// Page links. The front page lives at "/" and the SKY-001 page at "/sky-001". A build for a viewer
// that serves one file (the shareable Claude artifact) sets VITE_HASH_ROUTES=1 and switches pages
// on "#home" and "#sky-001" instead.
export const HASH_ROUTES = import.meta.env.VITE_HASH_ROUTES === '1'
export const HOME = HASH_ROUTES ? '#home' : '/'
export const LAUNCH = HASH_ROUTES ? '#sky-001' : '/sky-001'
/** The blog index at "/blog", each post at "/blog/<slug>" ("#blog" and "#blog/<slug>" in hash builds). */
export const BLOG = HASH_ROUTES ? '#blog' : '/blog'
export const postHref = (slug: string) => `${BLOG}/${slug}`

// The research site lives elsewhere for now (a temporary tunnel address from Ankit, 2026-10-14);
// the nav's Research tab and the hero's "Read our research" link both go there.
export const RESEARCH = 'https://temple-greene-saves-theorem.trycloudflare.com/'

/** Links that open pop-ups instead of going somewhere. */
export const WAITLIST_HREF = '#join-waitlist'
export const VIDEO_HREF = '#launch-video'

export type Page = 'home' | 'launch' | 'blog'

/** Where the address points: a page, plus the post's slug on a blog post. */
export type Route = { page: Page; post?: string }

/** Whether a hash names a page (as opposed to a section or a pop-up). */
export const isPageHash = (h: string) => h === HOME || h === LAUNCH || h === BLOG || h.startsWith(`${BLOG}/`)

export function routeOf(path: string): Route {
  const p = path.replace(/^#/, '/').replace(/\/+$/, '')
  if (p === '/sky-001') return { page: 'launch' }
  const blog = p.match(/^\/blog(?:\/([a-z0-9-]+))?$/)
  if (blog) return { page: 'blog', post: blog[1] }
  return { page: 'home' }
}

export function currentRoute(): Route {
  if (typeof window === 'undefined') return { page: 'home' }
  return routeOf(HASH_ROUTES ? window.location.hash : window.location.pathname)
}

export const currentPage = (): Page => currentRoute().page
