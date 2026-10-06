// Mobile-first: base styles target phones; sm/md/lg breakpoints scale up to tablet and desktop.
function App() {
  return (
    <main className="min-h-dvh bg-white text-ink">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:py-24 lg:px-8">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Introducing</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl lg:text-6xl">SKY 001</h1>
          <p className="mt-4 max-w-prose text-base text-neutral-600 sm:text-lg">
            Placeholder hero. Product content and interactive sections go here.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-brand px-6 font-medium text-white"
          >
            Learn more
          </a>
        </div>
        <div className="aspect-square w-full rounded-3xl bg-neutral-100 md:w-1/2" aria-hidden="true" />
      </section>
    </main>
  )
}

export default App
