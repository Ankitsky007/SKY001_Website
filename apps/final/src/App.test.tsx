// Reveal hides blocks (visibility) until they scroll into view. Hidden nodes have no accessible
// name, so headings inside them are matched by their text instead (minus the decorative slashes).
import { backers, benchmarks, blogPage, campusFlow, docCharts, hero, research, showcase, sky001, team, waitlistForm } from '@skyfall/core'
import { blogPosts } from '@skyfall/core/blog'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
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
  it('shows the front page at / and the SKY-001 page at /sky-001', () => {
    render(<App />)
    expect(heading(hero.title.replace('Post-Monolithic', 'Post\u2011Monolithic'))).toBeInTheDocument()
    cleanup()
    window.history.replaceState(null, '', '/sky-001')
    render(<App />)
    expect(heading(sky001.hero.title)).toBeInTheDocument()
  })

  it('shows the blog index at /blog and a full post at /blog/<slug>', async () => {
    window.history.replaceState(null, '', '/blog')
    render(<App />)
    expect(await screen.findByRole('heading', { level: 1, name: blogPage.title, hidden: true })).toBeInTheDocument()
    for (const p of blogPosts) expect(screen.getAllByRole('link', { name: new RegExp(p.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), hidden: true })[0]).toHaveAttribute('href', `/blog/${p.slug}`)
    cleanup()
    const post = blogPosts[1]
    window.history.replaceState(null, '', `/blog/${post.slug}`)
    render(<App />)
    expect(await screen.findByRole('heading', { level: 1, name: post.title, hidden: true })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: new RegExp(blogPage.reader.back), hidden: true })[0]).toHaveAttribute('href', '/blog')
  })

  it('has a Blog tab in the top nav', () => {
    render(<App />)
    expect(screen.getAllByRole('link', { name: blogPage.nav, hidden: true })[0]).toHaveAttribute('href', '/blog')
  })

  it('opens the waitlist pop-up from Join the waitlist', () => {
    window.history.replaceState(null, '', '/sky-001')
    render(<App />)
    const dialogs = document.querySelectorAll('dialog')
    for (const d of dialogs) d.showModal ??= function (this: HTMLDialogElement) { this.open = true }
    fireEvent.click(screen.getAllByRole('link', { name: sky001.intro.waitlist.cta.label, hidden: true })[0])
    const open = [...document.querySelectorAll('dialog')].find((d) => d.open)
    expect(open?.textContent).toContain(waitlistForm.title)
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
    for (const link of screen.getAllByRole('link', { name: hero.primaryCta.label, hidden: true })) expect(link).toHaveAttribute('href', '/sky-001')
    for (const f of team.founders) expect(screen.getByAltText(f.name)).toBeInTheDocument()
    for (const s of team.stats) expect(screen.getByText(s.label)).toBeInTheDocument()
    for (const sector of research.matters.sectors) expect(screen.getByText(sector)).toBeInTheDocument()
  })
})

describe('SKY-001 page', () => {
  it('renders the doc sections in order', () => {
    render(<LaunchPage />)
    const names = [sky001.contrarian.title, sky001.pareto.title, sky001.stages.title, benchmarks.bim.title, showcase.explore.title, sky001.why.title, sky001.next.title, sky001.team.title, sky001.faq.title]
    const found = names.map(heading)
    for (let i = 1; i < found.length; i++) expect(found[i - 1].compareDocumentPosition(found[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    for (const s of sky001.stages.items) expect(heading(s.title)).toBeInTheDocument()
  })

  it('redraws the four doc charts with the doc axes and values', () => {
    render(<LaunchPage />)
    const { pareto, versus } = docCharts
    const cad = screen.getByRole('img', { name: new RegExp(`^${pareto.cad.title}`), hidden: true })
    for (const tick of ['0%', '25%', '50%', '75%', '100%', '$0.001', '$0.01', '$0.10', '$1.00']) expect(within(cad).getByText(tick)).toBeInTheDocument()
    expect(within(cad).getByText('79.7%')).toBeInTheDocument()
    const cost = screen.getByRole('img', { name: new RegExp(`^${versus.cost.title}`), hidden: true })
    for (const t of ['150× cheaper', '50× cheaper']) expect(within(cost).getByText(t)).toBeInTheDocument()
    const time = screen.getByRole('img', { name: new RegExp(`^${versus.time.title}`), hidden: true })
    for (const t of ['51× faster', '32× faster']) expect(within(time).getByText(t)).toBeInTheDocument()
  })

  it('offers a film for each of the four models in the turning row', () => {
    render(<LaunchPage />)
    for (const m of showcase.models) expect(screen.getByRole('button', { name: `Play the film: ${m.title}` })).toBeInTheDocument()
  })

  it('points the waitlist and launch video links at their pop-ups', () => {
    render(<LaunchPage />)
    for (const a of screen.getAllByRole('link', { name: sky001.intro.waitlist.cta.label, hidden: true })) expect(a).toHaveAttribute('href', '#join-waitlist')
    for (const a of screen.getAllByRole('link', { name: new RegExp(sky001.intro.video.label, 'i'), hidden: true })) expect(a).toHaveAttribute('href', '#launch-video')
  })
})
