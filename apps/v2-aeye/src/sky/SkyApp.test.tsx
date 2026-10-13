import { benchmarks, sky001 } from '@skyfall/core'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import SkyApp from './SkyApp'

describe('SkyApp', () => {
  afterEach(cleanup)

  it('renders the hero headline', () => {
    render(<SkyApp />)
    expect(screen.getByRole('heading', { level: 1, name: /First World Model for the/ })).toBeInTheDocument()
  })

  it('renders every section heading from the content doc', () => {
    render(<SkyApp />)
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'), (h) => h.textContent?.replace(/\s+/g, ' ') ?? '')
    for (const name of [sky001.contrarian.title, sky001.pareto.title, sky001.moment.versus, sky001.stages.title, sky001.why.title, sky001.next.title, sky001.team.title, sky001.faq.title]) {
      expect(headings.some((h) => h.includes(name))).toBe(true)
    }
    expect(headings.some((h) => h.includes('1/150th'))).toBe(true)
  })

  it('draws both Pareto charts with every model from the doc', () => {
    render(<SkyApp />)
    expect(screen.getAllByRole('img', { name: /GPT-6 Astra 79.1% at \$0.75/ }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('img', { name: /Grok 4.7 28.2%/ }).length).toBeGreaterThan(0)
  })

  it('races the three models at their benchmark times', () => {
    render(<SkyApp />)
    for (const m of ['3.9 s / part', '199 s / part', '110 s / part']) expect(screen.getByText(m)).toBeInTheDocument()
    expect(benchmarks.cad.rows[0].seconds).toBe(3.9)
  })

  it('switches pipeline stages and opens FAQ answers', () => {
    render(<SkyApp />)
    const stage3 = screen.getByRole('button', { name: new RegExp(sky001.stages.items[2].title) })
    expect(stage3).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(stage3)
    expect(stage3).toHaveAttribute('aria-pressed', 'true')

    const q = screen.getByRole('button', { name: new RegExp(sky001.faq.items[4].q) })
    fireEvent.click(q)
    expect(q).toHaveAttribute('aria-expanded', 'true')
  })
})
