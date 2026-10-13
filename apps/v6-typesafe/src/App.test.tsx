// Reveal hides blocks (visibility) until they scroll into view. Hidden nodes have no accessible
// name, so headings inside them are matched by their text instead (minus the decorative slashes).
import { backers, benchmarks, docCharts, hero, research, showcase, sky001, sky001Cta, team } from '@skyfall/core'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { FrontPage } from './pages/FrontPage'
import { LaunchPage } from './pages/LaunchPage'

function heading(text: string) {
  const found = screen.getAllByRole('heading', { hidden: true }).find((h) => h.textContent?.replace(/^\/|\/$/g, '') === text)
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
    expect(heading(hero.title)).toBeInTheDocument()
    cleanup()
    window.history.replaceState(null, '', '/sky-001')
    render(<App />)
    expect(heading(sky001.hero.title)).toBeInTheDocument()
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
    for (const sector of research.matters.sectors) expect(screen.getByText(sector)).toBeInTheDocument()
  })
})

describe('Launch page', () => {
  it('renders the doc sections in order', () => {
    render(<LaunchPage />)
    const names = [sky001.contrarian.title, sky001.pareto.title, sky001.stages.title, benchmarks.bim.title, showcase.explore.title, sky001.why.title, sky001.next.title, sky001.team.title, sky001.faq.title]
    const found = names.map(heading)
    for (let i = 1; i < found.length; i++) expect(found[i - 1].compareDocumentPosition(found[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getAllByText(sky001.news.title).length).toBeGreaterThan(0)
    for (const s of sky001.stages.items) expect(heading(s.title)).toBeInTheDocument()
  })

  it('redraws the four doc charts with the doc axes and values', () => {
    render(<LaunchPage />)
    const { pareto, versus } = docCharts
    const cad = screen.getByRole('img', { name: new RegExp(`^${pareto.cad.title}`), hidden: true })
    for (const tick of ['0%', '25%', '50%', '75%', '100%', '$0.001', '$0.01', '$0.10', '$1.00']) expect(within(cad).getByText(tick)).toBeInTheDocument()
    for (const p of pareto.cad.points) expect(within(cad).getByText(p.model, { exact: false })).toBeInTheDocument()
    expect(within(cad).getByText('79.7%')).toBeInTheDocument()
    const bim = screen.getByRole('img', { name: new RegExp(`^${pareto.bim.title}`), hidden: true })
    for (const tick of ['20%', '30%', '40%', '50%']) expect(within(bim).getByText(tick)).toBeInTheDocument()
    expect(within(bim).getByText('43.6%')).toBeInTheDocument()
    expect(within(bim).getAllByText(/^(Gemini|GPT|Opus|Kimi|Qwen|Grok)/)).toHaveLength(6)
    const cost = screen.getByRole('img', { name: new RegExp(`^${versus.cost.title}`), hidden: true })
    for (const t of ['30', '90', '$0.001', '$1', '150× cheaper', '50× cheaper']) expect(within(cost).getByText(t)).toBeInTheDocument()
    const time = screen.getByRole('img', { name: new RegExp(`^${versus.time.title}`), hidden: true })
    for (const t of ['1.0 s', '10 s', '100 s', '1000 s', '51× faster', '32× faster']) expect(within(time).getByText(t)).toBeInTheDocument()
  })

  it('lists all four showcase models in the explorer grid', () => {
    render(<LaunchPage />)
    for (const m of showcase.models) expect(screen.getByRole('button', { name: `${showcase.explore.cta}: ${m.title}`, hidden: true })).toBeInTheDocument()
  })
})
