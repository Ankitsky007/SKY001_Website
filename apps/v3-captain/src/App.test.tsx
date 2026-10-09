// Reveal hides blocks (visibility) until they scroll into view, so some queries include hidden nodes.
import { backers, hero, research, sky001Cta, team } from '@skyfall/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(cleanup)

describe('App', () => {
  it('renders the hero headline', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /Autonomous Business/ })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: hero.primaryCta.label }).length).toBeGreaterThan(0)
  })

  it('renders every section heading', () => {
    render(<App />)
    for (const name of [research.problem.title, research.build.title, research.pareto.title, team.title, backers.title, sky001Cta.title]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
    for (const step of research.build.steps) {
      expect(screen.getByRole('heading', { name: step.title, hidden: true })).toBeInTheDocument()
    }
  })

  it('renders the founders, stats and backers from content', () => {
    render(<App />)
    for (const f of team.founders) expect(screen.getByText(f.name).tagName).toBe('H3')
    for (const s of team.stats) expect(screen.getByText(`[ ${s.label} ]`)).toBeInTheDocument()
    for (const a of backers.advisors) expect(screen.getByLabelText(`${a.name} on X`)).toHaveAttribute('href', a.x)
  })

  it('switches figure tabs', () => {
    render(<App />)
    const language = screen.getByRole('tab', { name: '[ A · Language ]' })
    expect(language).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(language)
    expect(language).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('img', { name: /linear chain of tokens/ }).length).toBeGreaterThan(0)

    const sector = screen.getAllByRole('tab', { hidden: true }).find((t) => t.textContent?.startsWith('Healthcare'))!
    fireEvent.click(sector)
    expect(sector).toHaveAttribute('aria-selected', 'true')
  })

  it('steps tabs change the active step', () => {
    render(<App />)
    const plan = screen.getByRole('tab', { name: /Plan/ })
    fireEvent.click(plan)
    expect(plan).toHaveAttribute('aria-selected', 'true')
  })
})
