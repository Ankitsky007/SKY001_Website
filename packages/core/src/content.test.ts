import { describe, expect, it } from 'vitest'
import { backers, functions, hero, team } from './content'

describe('shared content', () => {
  it('keeps the content-doc hero title', () => {
    expect(hero.title).toBe('Autonomous Business for the Post-Monolithic Era')
  })

  it('lists the six enterprise functions the hero diagrams use', () => {
    expect(functions).toHaveLength(6)
  })

  it('keeps the team stats and backers from the content doc', () => {
    expect(team.stats.map((s) => s.value)).toEqual(['30+', '25', '3'])
    expect(backers.investors).toEqual(['Fidelity', 'Touring Capital', 'M13', 'Inovia Capital'])
  })
})
