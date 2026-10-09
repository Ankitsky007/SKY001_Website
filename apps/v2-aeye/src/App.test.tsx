import { backers, functions, research, sky001Cta, team } from '@skyfall/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(cleanup)

  it('renders the hero headline', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /Autonomous Business/ })).toBeInTheDocument()
  })

  it('renders every section heading from the content core', () => {
    render(<App />)
    // Blocks wait (hidden) for their scroll reveal, so read heading text straight from the DOM.
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'), (h) => h.textContent?.replace(/\s+/g, ' ') ?? '')
    for (const name of [research.problem.title, research.build.title, research.pareto.title, team.title, backers.title]) {
      expect(headings.some((h) => h.includes(name))).toBe(true)
    }
    expect(screen.getByRole('heading', { level: 2, name: /First World Model/ })).toBeInTheDocument()
    expect(screen.getAllByText(sky001Cta.eyebrow).length).toBeGreaterThan(0)
  })

  it('labels the hero grid with the six functions', () => {
    render(<App />)
    for (const fn of functions) expect(screen.getAllByText(fn).length).toBeGreaterThan(0)
  })

  it('has working figure toggles and step cards', () => {
    render(<App />)
    const fig2 = screen.getByRole('switch', { name: /Show an enterprise/ })
    expect(fig2).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(fig2)
    expect(fig2).toHaveAttribute('aria-checked', 'false')

    const fig4 = screen.getByRole('switch', { name: /world-model frontier/ })
    fireEvent.click(fig4)
    expect(fig4).toHaveAttribute('aria-checked', 'false')

    const step3 = screen.getByRole('button', { name: new RegExp(research.build.steps[2].title) })
    expect(step3).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(step3)
  })

  it('opens and closes the phone menu', () => {
    render(<App />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  })
})
