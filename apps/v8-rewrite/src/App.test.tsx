// Reveal hides blocks (visibility) until they scroll into view. Hidden nodes have no accessible
// name, so headings inside them are matched by their text instead (minus the decorative slashes).
import { backers, benchmarkRaw, benchmarkStory, blogPage, hero, research, showcase, sky001, team, waitlistForm } from '@skyfall/core/v8'
import { blogPosts } from '@skyfall/core/blog'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { FrontPage } from './pages/FrontPage'
import { LaunchPage } from './pages/LaunchPage'
import { formatLike, metricValue } from './lib/benchmarkRates'

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
    // the partnership form's fields
    for (const f of ['name', 'email', 'website', 'message']) expect(open?.querySelector(`[name="${f}"]`)).not.toBeNull()
  })
})

describe('Front page', () => {
  it('shows the hero headline and description', () => {
    render(<FrontPage />)
    expect(heading(hero.title)).toBeInTheDocument()
    expect(screen.getAllByText(hero.lede).length).toBeGreaterThan(0)
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
    for (const link of screen.getAllByRole('link', { name: 'SKY-001', hidden: true })) expect(link).toHaveAttribute('href', '/sky-001')
    for (const f of team.founders) expect(screen.getByAltText(f.name)).toBeInTheDocument()
    for (const s of team.stats) expect(screen.getByText(s.label)).toBeInTheDocument()
    for (const sector of research.matters.sectors) expect(screen.getAllByText(sector).length).toBeGreaterThan(0)
  })
})

describe('SKY-001 page', () => {
  it('renders the doc sections in order', () => {
    render(<LaunchPage />)
    const { moment } = sky001
    const names = [sky001.contrarian.title, `${moment.before}${moment.emphasis}${moment.after}`, sky001.stages.title, sky001.next.title, sky001.faq.title]
    const found = names.map(heading)
    for (let i = 1; i < found.length; i++) expect(found[i - 1].compareDocumentPosition(found[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    for (const s of sky001.stages.items) expect(heading(s.title)).toBeInTheDocument()
  })

  it('draws 3D CAD in the table units and order, and BIM as rates for now', () => {
    render(<LaunchPage />)
    const labels = () => screen.getAllByRole('img', { hidden: true }).map((el) => el.getAttribute('aria-label') ?? '')
    for (const metric of ['iou', 'time', 'cost'] as const) {
      const charts = labels().filter((l) => l.startsWith(`${benchmarkRaw.charts[metric].title}, 3D CAD, `))
      expect(charts.length).toBeGreaterThan(0)
      for (const c of charts) expect(c).toMatch(/: SKY-001 /)
    }
    expect(labels().find((l) => l.startsWith('Time / sample, 3D CAD, '))).toContain('SKY-001 3.9 s, GPT-6 Astra 199 s')
    expect(labels().find((l) => l.startsWith('IoU, 3D CAD, '))).toContain('Grok 4.7 –')
    expect(labels().some((l) => l.startsWith('Time / sample, BIM, '))).toBe(false)
    for (const metric of ['speed', 'cost', 'iou'] as const) expect(labels().some((l) => l.startsWith(`${benchmarkStory.charts[metric].title}, BIM: SKY-001 `))).toBe(true)
  })

  it('states claims that match the benchmark numbers', () => {
    for (const m of benchmarkStory.models) {
      const ours = m.rows.find((r) => r.ours)!
      const astra = m.rows.find((r) => r.model === 'GPT-6 Astra')!
      const bestLlm = Math.max(...m.rows.filter((r) => !r.ours).map((r) => r.iou ?? 0))
      const [speed, cost, iou] = m.claims
      expect(speed.value).toBe(`${Math.round(astra.seconds / ours.seconds)}×`)
      expect(cost.value).toBe(`${Math.round(astra.cost / ours.cost)}×`)
      expect(iou.value).toBe(`${ours.iou}%`)
      expect(iou.detail).toContain(`${bestLlm}%`)
      for (const c of m.claims) expect(c.detail).not.toMatch(/Astra/)
    }
  })

  it('labels every bar with the table text for its own number', () => {
    for (const m of benchmarkStory.models) {
      m.rows.forEach((r, i) => {
        const [iou, time, cost] = benchmarkRaw.labels[m.key][i]
        expect(iou).toBe(r.iou === null ? '–' : `${r.iou}%`)
        expect(Number(time.replace(/[ s,]/g, ''))).toBe(r.seconds)
        expect(Number(cost.replace('$', ''))).toBe(r.cost)
      })
    }
    expect(formatLike('1,250 s', 625)).toBe('625 s')
    expect(formatLike('$0.00237', 0.001)).toBe('$0.00100')
    expect(metricValue(benchmarkStory.models[0].rows[0], 'time')).toBe(3.9)
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
