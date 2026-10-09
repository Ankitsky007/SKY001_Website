import { backers, research, sky001Cta, team } from '@skyfall/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(cleanup)

  it('renders the hero headline', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /Autonomous Business/ })).toBeInTheDocument()
  })

  it('renders every section heading from shared content', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /Engineering World Models\./ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: research.build.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: team.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: backers.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: sky001Cta.title })).toBeInTheDocument()
  })

  it('shows the hero figure at all three breakpoints and keeps nav targets on the page', () => {
    const { container } = render(<App />)
    expect(screen.getAllByRole('img', { name: /One decision rippling/ })).toHaveLength(3)
    for (const id of ['research', 'sky-001', 'team', 'careers', 'contact']) {
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    }
  })

  it('renders team stats with their final values', () => {
    render(<App />)
    for (const s of team.stats) expect(screen.getByText(s.label)).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('spotlights a FIG.03 step when its legend button is pressed', () => {
    const { container } = render(<App />)
    const plan = screen.getByRole('button', { name: new RegExp(research.build.steps[2].title) })
    fireEvent.click(plan)
    expect(plan).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('[data-show="plan"]')).not.toBeNull()
    fireEvent.click(plan)
    expect(plan).toHaveAttribute('aria-pressed', 'false')
  })

  it('opens and closes the phone menu', () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(toggle)
    expect(screen.getByRole('navigation', { name: 'Menu' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('navigation', { name: 'Menu' })).toBeNull()
  })
})
