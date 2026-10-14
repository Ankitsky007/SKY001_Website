import { partnership, site } from '@skyfall/core'
import type { NavTab } from '../components/Nav'
import { PARTNERSHIP_HREF } from './partnership'
import { LAUNCH, RESEARCH, type Page } from './routes'

/**
 * The top nav, the same on both pages: Research (the research site), SKY-001 and Partnership (a
 * pop-up). The logo is the way home; Team, Careers and Contact live in the page and footer only.
 * On the front page Research lights while its research sections are on screen.
 */
export function navTabs(page: Page): NavTab[] {
  const tabs: NavTab[] = []
  for (const n of site.nav) {
    if (n.href === '#research') tabs.push({ label: n.label, href: RESEARCH, spy: page === 'home' ? { from: '#problem', to: '#matters' } : undefined })
    if (n.href === '#sky-001') tabs.push({ label: n.label, href: LAUNCH, current: page === 'launch' })
  }
  tabs.push({ label: partnership.nav, href: PARTNERSHIP_HREF })
  return tabs
}

/** The footer's page links: the same three as the top nav (Team, Careers and Contact are hidden for now, 2026-10-14). */
export function footerPages() {
  return navTabs('launch').map(({ label, href }) => ({ label, href }))
}
