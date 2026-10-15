import { describe, expect, it } from 'vitest'
import { routeOf } from './routes'

describe('routeOf', () => {
  it('reads paths and hash routes the same way', () => {
    expect(routeOf('/')).toEqual({ page: 'home' })
    expect(routeOf('/sky-001')).toEqual({ page: 'launch' })
    expect(routeOf('#sky-001')).toEqual({ page: 'launch' })
    expect(routeOf('/blog')).toEqual({ page: 'blog', post: undefined })
    expect(routeOf('/blog/')).toEqual({ page: 'blog', post: undefined })
    expect(routeOf('#blog/scope-hierarchical-planner-55x-faster-than-llms')).toEqual({ page: 'blog', post: 'scope-hierarchical-planner-55x-faster-than-llms' })
    expect(routeOf('/blogger')).toEqual({ page: 'home' })
  })
})
