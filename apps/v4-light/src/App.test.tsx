// Reveal hides blocks (visibility) until they scroll into view. Hidden nodes have no accessible
// name, so headings inside them are matched by their text instead.
import { backers, benchmarks, hero, research, showcase, sky001, sky001Cta, team } from '@skyfall/core'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { FrontPage } from './pages/FrontPage'
import { LaunchPage } from './pages/LaunchPage'

function heading(text: string) {
  const found = screen.getAllByRole('heading', { hidden: true }).find((h) => h.textContent === text)
  if (!found) throw new Error(`No heading with text "${text}"`)
  return found
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('App routing', () => {
  it('shows the front page at / and the launch page at /sky-001', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: hero.title })).toBeInTheDocument()
    cleanup()
    window.history.replaceState(null, '', '/sky-001')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: sky001.hero.title })).toBeInTheDocument()
  })
})

describe('Front page', () => {
  it('renders every section heading from content', () => {
    render(<FrontPage />)
    for (const name of [research.problem.title, research.build.title, research.pareto.title, sky001Cta.title, team.title, backers.title]) {
      expect(heading(name)).toBeInTheDocument()
    }
    for (const step of research.build.steps) expect(heading(step.title)).toBeInTheDocument()
  })

  it('links to the launch page and shows founders and stats', () => {
    render(<FrontPage />)
    for (const link of screen.getAllByRole('link', { name: hero.primaryCta.label, hidden: true })) expect(link).toHaveAttribute('href', '/sky-001')
    for (const f of team.founders) expect(screen.getByAltText(f.name)).toBeInTheDocument()
    for (const s of team.stats) expect(screen.getByText(s.label)).toBeInTheDocument()
  })
})

describe('Launch page', () => {
  it('renders the doc sections in order', () => {
    render(<LaunchPage />)
    const names = [sky001.contrarian.title, sky001.pareto.title, sky001.stages.title, showcase.explore.title, sky001.why.title, sky001.next.title, sky001.team.title, sky001.faq.title]
    const found = names.map(heading)
    for (let i = 1; i < found.length; i++) expect(found[i - 1].compareDocumentPosition(found[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText(sky001.news.title)).toBeInTheDocument()
    for (const s of sky001.stages.items) expect(heading(s.title)).toBeInTheDocument()
  })

  it('charts print the exact benchmark values', () => {
    render(<LaunchPage />)
    const iou = screen.getByRole('group', { name: /^IoU/ })
    expect(within(iou).getByText('79.7%')).toBeInTheDocument()
    expect(within(iou).getByText('79.1%')).toBeInTheDocument()
    expect(within(iou).getByText('—')).toBeInTheDocument()
    const cost = screen.getByRole('group', { name: /^Cost per sample/ })
    expect(within(cost).getByText('$0.005')).toBeInTheDocument()
    expect(within(cost).getByText('$0.75')).toBeInTheDocument()
    const [cadTime, bimTime] = screen.getAllByRole('group', { name: /^Time per sample/ })
    expect(within(cadTime).getByText('3.9 s')).toBeInTheDocument()
    expect(within(cadTime).getByText('1,250 s')).toBeInTheDocument()
    expect(within(bimTime).getByText('4.5 s')).toBeInTheDocument()
    expect(within(bimTime).getByText('144.4 s')).toBeInTheDocument()
    expect(within(iou).getAllByRole('listitem')).toHaveLength(benchmarks.cad.rows.length)
  })

  it('lists all four showcase models in the explorer grid', () => {
    render(<LaunchPage />)
    for (const m of showcase.models) expect(screen.getByRole('button', { name: `${showcase.explore.cta}: ${m.title}`, hidden: true })).toBeInTheDocument()
  })
})
