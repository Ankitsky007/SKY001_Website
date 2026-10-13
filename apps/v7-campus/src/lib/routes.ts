// Where the two pages live. A normal deploy serves the front page at "/" and the launch page at
// "/sky-001". A static bundle with no server routing (the Claude artifact build) sets
// VITE_HOME_HREF and VITE_LAUNCH_HREF to two real files instead, e.g. ./index.html and ./sky-001.html.
export const HOME = (import.meta.env.VITE_HOME_HREF as string | undefined) ?? '/'
export const LAUNCH = (import.meta.env.VITE_LAUNCH_HREF as string | undefined) ?? '/sky-001'

/**
 * True when the current page is the launch page: by address under either scheme, or because the
 * static bundle's launch file marks itself with <html data-page="launch">.
 */
export function isLaunchPath(pathname: string) {
  if (typeof document !== 'undefined' && document.documentElement.dataset.page === 'launch') return true
  return /\/sky-001(\.html)?\/?$/.test(pathname)
}
