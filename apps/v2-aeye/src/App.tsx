import { hero, VersionSwitcher } from '@skyfall/core'
import { SmoothScroll, SplitReveal } from '@skyfall/core/motion'

// v2 aeye. Mobile-first: base classes target phones, sm/md/lg scale up.
function App() {
  return (
    <SmoothScroll>
      <main className="min-h-dvh">
        <section className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-end gap-6 px-4 pb-16 sm:px-6 lg:px-8">
          <SplitReveal as="h1" immediate className="text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {hero.title}
          </SplitReveal>
          <p className="max-w-prose text-base opacity-70 sm:text-lg">{hero.lede}</p>
        </section>
      </main>
      <VersionSwitcher current="v2" />
    </SmoothScroll>
  )
}

export default App
