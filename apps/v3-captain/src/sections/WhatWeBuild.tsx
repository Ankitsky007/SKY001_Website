import { research, sky001Cta } from '@skyfall/core'
import { Reveal, SplitReveal } from '@skyfall/core/motion'
import { Fragment, lazy, Suspense, useRef, useState } from 'react'
import { GlobeFallback } from '../figures/globe'
import { useLiveScene } from '../lib/live'
import { ButtonLink, LABEL } from '../lib/ui'

const WorldGlobe = lazy(() => import('../scenes/WorldGlobe'))

/** 1.2 What we build: navy flagship band with the wireframe world-model globe. */
export function WhatWeBuild() {
  const figure = useRef<HTMLDivElement>(null)
  const live = useLiveScene(figure)
  const [ready, setReady] = useState(false)

  return (
    <section className="border-t border-navy-line bg-navy text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-6 py-14 md:px-12 md:py-20 lg:min-h-[720px] lg:flex-row lg:items-center lg:gap-8 lg:py-16 xl:px-[116px]">
        <div className="flex flex-col items-start gap-6 lg:w-[260px] lg:shrink-0 xl:w-[300px]">
          <span className={`bg-brand px-2 py-[5px] lg:px-2.5 lg:py-1.5 ${LABEL}`}>[ 1.2 · What we build ]</span>
          <SplitReveal as="h2" className="text-[34px] leading-[1.1] font-normal tracking-[-0.035em] md:text-[40px] lg:text-[48px] lg:leading-[1.08]">
            {research.build.title}
          </SplitReveal>
        </div>

        <div ref={figure} className="relative aspect-[440/460] w-full max-w-[342px] self-center sm:max-w-[440px] lg:w-[400px] lg:shrink-0 xl:w-[440px]">
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : ''}`} aria-hidden={ready}>
            <GlobeFallback className="h-full w-full" />
          </div>
          {live && (
            <Suspense fallback={null}>
              <WorldGlobe className="absolute! inset-0" onReady={() => setReady(true)} />
            </Suspense>
          )}
        </div>

        <div className="flex flex-col items-start gap-6 self-stretch lg:flex-1 lg:gap-7 lg:self-center">
          <Reveal as="p" className="text-[17px] leading-[1.45] tracking-[-0.01em] lg:text-[19px]">
            {research.build.lead} <span className="text-navy-muted">{research.build.rest}</span>
          </Reveal>
          <Reveal stagger={0.06} className={`flex flex-wrap items-center gap-1.5 lg:gap-2 ${LABEL}`}>
            {research.build.steps.map((s, i) => (
              <Fragment key={s.key}>
                {i > 0 && <span aria-hidden="true">→</span>}
                <span className="bg-white/10 px-[7px] py-[5px] lg:px-[9px] lg:py-1.5">{s.label}</span>
              </Fragment>
            ))}
          </Reveal>
          <ButtonLink href={sky001Cta.primary.href} arrow className="w-full sm:w-auto sm:min-w-[200px]">
            {sky001Cta.primary.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
