// Reveal hides blocks (visibility) until they scroll into view. Hidden nodes have no accessible
// name, so headings inside them are matched by their text instead (minus the decorative slashes).
import { backers, campusFlow, hero, research, team } from '@skyfall/core'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { FrontPage } from './pages/FrontPage'

function heading(text: string) {
  const found = screen.getAllByRole('heading', { hidden: true }).find((h) => h.textContent?.replace(/^\/|\/$/g, '') === text)
  if (!found) throw new Error(`No heading with text "${text}"`)
  return found
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('App', () => {
  it('shows the front page', () => {
    render(<App />)
    expect(heading(hero.title.replace('Post-Monolithic', 'Post\u2011Monolithic'))).toBeInTheDocument()
  })
})

describe('Front page', () => {
  it('shows the campus hero with its description', () => {
    render(<FrontPage />)
    expect(screen.getByRole('img', { name: campusFlow.alt })).toBeInTheDocument()
  })

  it('renders every section heading from content', () => {
    render(<FrontPage />)
    for (const name of [research.problem.title, research.build.title, research.pareto.title, team.title, backers.title]) {
      expect(heading(name)).toBeInTheDocument()
    }
    for (const step of research.build.steps) expect(heading(step.title)).toBeInTheDocument()
  })

  it('links to the launch page and shows founders and stats', () => {
    render(<FrontPage />)
    for (const link of screen.getAllByRole('link', { name: hero.primaryCta.label, hidden: true })) expect(link).toHaveAttribute('href', '#')
    for (const f of team.founders) expect(screen.getByAltText(f.name)).toBeInTheDocument()
    for (const s of team.stats) expect(screen.getByText(s.label)).toBeInTheDocument()
    for (const sector of research.matters.sectors) expect(screen.getByText(sector)).toBeInTheDocument()
  })
})
