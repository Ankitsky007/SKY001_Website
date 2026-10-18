import { blogPage, site } from '@skyfall/core/v8'
import type { NavTab } from '../components/Nav'
import { BLOG, LAUNCH, type Page } from './routes'

/**
 * The top nav, the same on every page: SKY-001 and Blog. The logo is the way home. Research,
 * Partnership and the call to action on the right were taken out (Ankit, 2026-10-17); the
 * partnership form still opens from a shared #partnership link.
 */
export function navTabs(page: Page): NavTab[] {
  const tabs: NavTab[] = []
  for (const n of site.nav) {
    if (n.href === '#sky-001') tabs.push({ label: n.label, href: LAUNCH, current: page === 'launch' })
  }
  tabs.push({ label: blogPage.nav, href: BLOG, current: page === 'blog' })
  return tabs
}

/** The footer's page links: the same links as the top nav. */
export function footerPages() {
  return navTabs('launch').map(({ label, href }) => ({ label, href }))
}
