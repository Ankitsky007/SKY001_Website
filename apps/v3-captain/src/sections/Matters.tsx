import { research } from '@skyfall/core'
import { gsap, prefersReducedMotion, Reveal, SplitReveal, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { Bracket, LABEL, Sq, TabGrid } from '../lib/ui'

const { matters } = research
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')
const SECTORS = matters.sectors.map((s, i) => ({
  id: slug(s),
  name: s,
  label: (
    <>
      {s}
      <span className="font-mono text-[10px] lg:text-[11px]">
        <span className="hidden lg:inline">[ </span>S.0{i + 1}
        <span className="hidden lg:inline"> ]</span>
      </span>
    </>
  ),
  className: i === matters.sectors.length - 1 ? 'col-span-2 md:col-span-1' : '',
}))

/** 1.4 Where it matters: the 'dream' statement and the sector tab grid. */
export function Matters() {
  const [sector, setSector] = useState<string>(slug(matters.sectors[0]))
  const strip = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !strip.current) return
      gsap.from('[data-sector]', { autoAlpha: 0, y: 8, duration: 0.6, ease: 'power3.out' })
    },
    { scope: strip, dependencies: [sector] },
  )

  return (
    <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 pt-14 pb-18 md:px-12 md:py-24 lg:gap-10 lg:py-30 xl:px-[116px]">
      <Bracket parts={['1.4', 'Where it matters']} className="text-brand" />
      <SplitReveal as="h2" className="max-w-[1060px] text-[30px] leading-[1.18] font-normal tracking-[-0.03em] md:text-[40px] lg:text-[48px] lg:leading-[1.14]">
        {matters.statement.before}
        <span className="text-brand">{matters.statement.emphasis}</span>
        {matters.statement.after}
      </SplitReveal>
      <Reveal stagger={0.1} className="grid gap-6 md:grid-cols-2 md:gap-12">
        <p className="text-lg leading-[1.45] tracking-[-0.01em] lg:text-xl">{matters.infrastructure}</p>
        <p className="text-base leading-normal text-body lg:text-lg">{matters.body}</p>
      </Reveal>
      <Reveal className="flex flex-col">
        <TabGrid
          label="Sectors"
          idBase="sector"
          items={SECTORS}
          value={sector}
          onChange={setSector}
          className="grid-cols-2 md:grid-cols-5"
          tabClassName="flex min-h-14 items-center justify-between gap-2 px-3 font-sans text-[15px] font-medium lg:min-h-18 lg:px-4 lg:text-[17px]"
        />
        <div
          ref={strip}
          id="sector-panel"
          role="tabpanel"
          aria-labelledby={`sector-tab-${sector}`}
          className={`flex min-h-11 flex-wrap items-center justify-center gap-x-2.5 gap-y-1 border-x border-b border-line px-3 py-2.5 text-center text-muted ${LABEL}`}
        >
          <span aria-hidden="true">[</span>
          <span data-sector className="inline-block text-brand">
            {SECTORS.find((x) => x.id === sector)?.name}
          </span>
          {matters.qualities.map((q) => (
            <span key={q} className="contents">
              <Sq />
              <span>{q}</span>
            </span>
          ))}
          <span aria-hidden="true">]</span>
        </div>
      </Reveal>
    </section>
  )
}
