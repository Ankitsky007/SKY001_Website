import { partnership, site } from '@skyfall/core'
import type { NavTab } from '../components/Nav'
import { PARTNERSHIP_HREF } from './partnership'
import { HOME, LAUNCH, RESEARCH, type Page } from './routes'

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

/** The footer's page links: Research and SKY-001 as in the nav, the rest as sections of the front page. */
export function footerPages() {
  return site.nav.map((n) => ({ label: n.label, href: n.href === '#research' ? RESEARCH : n.href === '#sky-001' ? LAUNCH : n.href === '#contact' ? n.href : `${HOME}${n.href}` }))
}
