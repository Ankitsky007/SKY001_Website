import { benchmarks, sky001, team } from '@skyfall/core'
import { gsap, prefersReducedMotion, Reveal, ScrollTrigger, SplitReveal, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Marquee } from '../components/Marquee'
import { PixelIcon, type PixelIconName } from '../components/PixelIcon'
import { Eyebrow, FigCaption, PrimaryButton, Slash, SlashHeading, SquareLabel, SubLabel, UnderlineLink } from '../components/ui'
import { scrambleOnHover } from '../lib/motion'
import { pad2, splitAccent } from '../lib/text'
import { useScrambleIn } from '../lib/useScrambleIn'
import { canUseWebGL2, createPointerState, now } from '../scenes/heroGrid'
import { ParetoChart, VersusChart } from './figures/Charts'
import { HeroFigure } from './figures/HeroFigure'
import { Race } from './figures/Race'
import { ConstructFigure, DecomposeFigure, ExploreFigure, SketchFigure } from './figures/StageFigures'
import { AccentWord, CountUp } from './ui'

// three.js arrives with this chunk (shared with the front page's bands).
const CtaGridScene = lazy(() => import('../scenes/CtaGridScene'))

const TOTAL = 6
const BIM_NOTE = 'BIM cost and IoU are the research notes’ calculated figures; the team has not confirmed them yet.'
const COPY = 'text-[17px] leading-[1.5] tracking-[-0.02em] text-body lg:text-lg'

/** Cell size of the `grid-dark` band: 44px on phones, 48px from md. */
function useCell() {
  const [cell, setCell] = useState(() => (typeof window !== 'undefined' && window.matchMedia?.('(min-width: 768px)').matches ? 48 : 44))
  useEffect(() => {
    const mq = window.matchMedia?.('(min-width: 768px)')
    if (!mq) return
    const on = () => setCell(mq.matches ? 48 : 44)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return cell
}

/**
 * A `grid-dark` band whose live WebGL grid sends rollouts out from `cardRef` (the element the
 * band is about) and follows the pointer, as on the front page's SKY-001 band.
 */
function LiveGridBand({ cardRef, className = '', children }: { cardRef: React.RefObject<HTMLElement | null>; className?: string; children: ReactNode }) {
  const band = useRef<HTMLDivElement>(null)
  const card = useRef<[number, number, number, number]>([0, 0, 0, 0])
  const pointer = useRef(createPointerState())
  const cell = useCell()
  const reduced = useReducedMotion()
  const [webgl] = useState(() => typeof document !== 'undefined' && canUseWebGL2())
  const [live, setLive] = useState(false)
  const scene = webgl && !reduced

  useEffect(() => {
    if (!scene || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const b = band.current?.getBoundingClientRect()
      const c = cardRef.current?.getBoundingClientRect()
      if (!b || !c) return
      card.current = [c.left - b.left, c.top - b.top, c.right - b.left, c.bottom - b.top]
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(band.current!)
    if (cardRef.current) ro.observe(cardRef.current)
    return () => ro.disconnect()
  }, [scene, cardRef])

  const cellAt = (e: PointerEvent) => {
    const rect = band.current!.getBoundingClientRect()
    return [Math.floor((e.clientX - rect.left) / cell), Math.floor((e.clientY - rect.top) / cell)] as const
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!scene || e.pointerType !== 'mouse') return
    const [cx, cy] = cellAt(e)
    const key = `${cx}-${cy}`
    const ptr = pointer.current
    if (key === ptr.last) return
    ptr.last = key
    ptr.trail.set([cx, cy, now()], ptr.head * 3)
    ptr.head = (ptr.head + 1) % 8
  }
  const onPointerDown = (e: PointerEvent) => {
    if (!scene) return
    const [cx, cy] = cellAt(e)
    pointer.current.click = [cx, cy, now()]
  }

  return (
    <div ref={band} onPointerMove={onPointerMove} onPointerDown={onPointerDown} className={`grid-dark relative overflow-hidden ${className}`}>
      {scene && (
        <Suspense fallback={null}>
          <CtaGridScene className={`absolute! inset-0 transition-opacity duration-700 ${live ? 'opacity-100' : 'opacity-0'}`} fallback={null} cell={cell} card={card} pointer={pointer} onReady={() => setLive(true)} />
        </Suspense>
      )}
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------------------------

const HEADLINE = [
  {
    value: benchmarks.headline[1].value,
    label: benchmarks.headline[1].label,
    detail: benchmarks.headline[1].detail,
  },
  {
    value: benchmarks.headline[0].value,
    label: benchmarks.headline[0].label,
    detail: benchmarks.headline[0].detail,
  },
  {
    value: '79.7%',
    label: 'IoU accuracy',
    detail: '3D Construction · GPT-6 Astra 79.1%',
  },
  {
    value: benchmarks.headline[2].value,
    label: benchmarks.headline[2].label,
    detail: benchmarks.headline[2].detail,
  },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const figure = useRef<HTMLDivElement>(null)
  const { hero, intro, news, nav } = sky001
  const [before, accent, after] = splitAccent(hero.title, 'Engineered')

  useScrambleIn(root, {
    immediate: true,
    delay: 0.55,
    duration: 1.2,
    selector: 'h1 [data-scramble-in]',
  })
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'expo.out' },
      })
      tl.from('[data-hero-chrome]', { autoAlpha: 0, y: 12, stagger: 0.08 }, 0.15)
        .from('[data-hero-figure]', { clipPath: 'inset(50% 0% 50% 0%)', duration: 1.2 }, 0.3)
        .from('[data-hero-rule]', { scaleX: 0, transformOrigin: 'left center', duration: 1.4 }, 0.5)
        .from('[data-hero-fade]', { autoAlpha: 0, y: 20, stagger: 0.08 }, 0.6)
        .from('[data-stat]', { autoAlpha: 0, y: 16, stagger: 0.06 }, 0.8)
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} aria-label="Introduction">
      <LiveGridBand cardRef={figure} className="md:pt-[52px]">
        <div className="wrap relative grid gap-6 pt-6 pb-6 md:pt-16 md:pb-10 lg:grid-cols-[1fr_minmax(0,620px)] lg:gap-10 lg:pt-[72px] lg:pb-[72px]">
          <div className="flex flex-col justify-between gap-8">
            <a
              data-hero-chrome
              href={news.cta.href}
              onPointerEnter={scrambleOnHover}
              className="group flex max-w-[560px] flex-col gap-2 border border-night-mid bg-white p-4 text-ink transition-colors duration-300 hover:border-brand md:p-5"
            >
              <span className="flex items-center justify-between font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-xs">
                <span className="flex items-center gap-2 text-brand">
                  <span aria-hidden="true" className="block size-2 bg-brand" />
                  {news.label}
                </span>
                <span className="text-muted transition-colors group-hover:text-brand">
                  <span data-scramble>{news.cta.label}</span> ↗
                </span>
              </span>
              <span className="text-lg leading-[1.25] tracking-[-0.04em] md:text-[22px]">{news.title}</span>
            </a>
            <div data-hero-chrome className="flex flex-col gap-4 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[44px] leading-none font-medium tracking-[-0.08em] md:text-[72px]">SKY‑001</span>
                <span className="bg-night-mid px-2 py-[5px] font-mono text-[11px] font-medium tracking-[-0.02em] text-line uppercase md:text-[13px]">World model</span>
              </div>
              <ul className="flex flex-wrap font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px]">
                {nav.map((l, i) => (
                  <li key={l.label} className="flex items-center">
                    {i > 0 && <span className="px-2 text-night-mid">/</span>}
                    <a href={l.href} onPointerEnter={scrambleOnHover} className="flex min-h-11 items-center text-night-text transition-colors hover:text-white">
                      <span data-scramble>{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div ref={figure} data-hero-figure className="relative">
            <HeroFigure />
          </div>
        </div>
      </LiveGridBand>

      <div className="wrap pt-12 md:pt-16 lg:pt-20">
        <SplitReveal as="h1" immediate className="max-w-[1180px] text-[clamp(30px,10vw,40px)] leading-[1.1] font-normal tracking-[-0.06em] md:text-[64px] lg:text-[80px]">
          {before}
          <AccentWord caret>{accent}</AccentWord>
          {after}
        </SplitReveal>
        <div className="relative mt-6 flex flex-col gap-8 md:mt-12 md:pt-8 lg:mt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <span data-hero-rule aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-px bg-line md:block" />
          <div data-hero-fade className="flex max-w-[560px] flex-col gap-3">
            <p className="text-lg leading-[1.45] tracking-[-0.03em] text-body md:text-xl md:leading-[1.4]">{hero.lede}</p>
            <SubLabel>{`// ${hero.note}`}</SubLabel>
          </div>
          <div data-hero-fade className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <PrimaryButton href={intro.waitlist.cta.href}>{intro.waitlist.cta.label}</PrimaryButton>
            <UnderlineLink href={intro.video.href}>{intro.video.label}</UnderlineLink>
          </div>
        </div>
      </div>

      <div className="wrap mt-12 lg:mt-14">
        <div className="flex h-11 items-center font-mono text-xs font-medium tracking-[-0.02em] text-muted uppercase lg:hidden">[ vs GPT-6 Astra ]</div>
        <ul className="grid grid-cols-2 border-t border-l border-line lg:grid-cols-5">
          <li data-stat className="hidden flex-col justify-center gap-1.5 border-r border-b border-line px-6 font-mono text-[13px] font-medium tracking-[-0.02em] text-muted uppercase lg:flex">
            <span>[ vs GPT-6 Astra ]</span>
            <span className="text-faint">Per part · 20 cases</span>
          </li>
          {HEADLINE.map((s) => (
            <li data-stat key={s.detail} className="group flex flex-col justify-between gap-6 border-r border-b border-line p-4 transition-colors duration-300 hover:bg-panel md:p-6 lg:h-40">
              <span className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-2">
                <CountUp value={s.value} className="text-[34px] leading-none tracking-[-0.06em] text-ink transition-colors group-hover:text-brand md:text-[48px]" />
                <span className="text-base tracking-[-0.03em] text-body md:text-lg">{s.label}</span>
              </span>
              <span className="font-mono text-[10px] leading-[1.4] tracking-[0.02em] text-muted uppercase md:text-[11px]">{s.detail}</span>
            </li>
          ))}
        </ul>
        <div aria-hidden="true" className="dots h-10 border-x border-line [background-size:12px_12px] lg:h-12 lg:[background-size:14px_14px]" />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// N.01 Introducing SKY-001 + the contrarian approach
// ---------------------------------------------------------------------------------------------

const CONTRARIAN_ICONS: PixelIconName[] = ['plugin', 'dream', 'domains']

/** Hoverable bordered cells with a pixel icon that assembles when the cell lights. */
function IconCells({ items, icons, cols, tone = 'light', tall = true }: { items: readonly { title: string; body?: string }[]; icons: PixelIconName[]; cols: string; tone?: 'light' | 'dark'; tall?: boolean }) {
  const [active, setActive] = useState(0)
  const dark = tone === 'dark'
  const line = dark ? 'border-night-line' : 'border-line'
  return (
    <Reveal as="ul" stagger={0.08} className={`grid border-t border-l ${line} ${cols}`}>
      {items.map((it, i) => {
        const on = i === active
        return (
          <li key={it.title} className={`relative border-r border-b ${line}`}>
            <button
              type="button"
              aria-pressed={on}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`flex h-full w-full cursor-pointer flex-col gap-6 p-5 text-left transition-colors duration-300 md:p-7 ${tall ? 'lg:min-h-[400px] lg:justify-between' : 'lg:min-h-[260px] lg:justify-between'} ${on && !dark ? 'bg-panel' : ''}`}
            >
              <span className="flex items-start justify-between">
                <PixelIcon name={icons[i]} active={on} className="size-[50px] lg:size-16" />
                <span className={`font-mono text-sm tracking-[-0.04em] ${on ? 'text-brand' : dark ? 'text-night-text' : 'text-muted'}`}>{`// ${String(i + 1).padStart(3, '0')}`}</span>
              </span>
              <span className="flex flex-col gap-3">
                <span className={`text-[22px] leading-[1.15] font-medium tracking-[-0.05em] lg:text-[28px] ${on ? 'text-brand' : dark ? 'text-white' : 'text-ink'}`}>{it.title}</span>
                {it.body && <span className={`text-base leading-[1.5] tracking-[-0.02em] ${dark ? 'text-night-text' : 'text-body'}`}>{it.body}</span>}
              </span>
            </button>
            <span aria-hidden="true" className={`absolute inset-x-0 -bottom-px block h-1 origin-left bg-brand transition-transform duration-500 ease-out-expo ${on ? 'scale-x-100' : 'scale-x-0'}`} />
          </li>
        )
      })}
    </Reveal>
  )
}

export function Model() {
  const { intro, contrarian } = sky001
  return (
    <section id="model" aria-labelledby="model-title" className="wrap pt-16 pb-4 md:pt-24 lg:pt-[120px]">
      <Eyebrow index={1} total={TOTAL} label="Introducing SKY-001" />
      <div id="model-title" className="mt-8 max-w-[1100px] md:mt-12">
        <SlashHeading>
          {intro.before}
          <span className="text-brand">{intro.emphasis}</span>
        </SlashHeading>
      </div>
      <Reveal as="p" className="mt-6 max-w-[820px] text-xl leading-[1.45] tracking-[-0.03em] text-body md:mt-8 lg:text-2xl">
        {intro.statement}
      </Reveal>

      <div className="mt-16 flex flex-col gap-4 lg:mt-24 lg:gap-6">
        <SubLabel>{'// 1.1'}</SubLabel>
        <h3 className="text-[26px] leading-[1.15] font-medium tracking-[-0.05em] lg:text-[36px]">{contrarian.title}</h3>
      </div>
      <div className="mt-8 lg:mt-12">
        <IconCells items={contrarian.points} icons={CONTRARIAN_ICONS} cols="md:grid-cols-3" />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// N.02 Benchmarks: Pareto frontier, 1/150th the cost, the race
// ---------------------------------------------------------------------------------------------

export function Benchmarks() {
  const { pareto, moment } = sky001
  const ref = useRef<HTMLDivElement>(null)
  useScrambleIn(ref, {
    selector: 'h2 [data-scramble-in]',
    delay: 0.4,
    duration: 1.1,
  })
  return (
    <section id="benchmarks" aria-labelledby="benchmarks-title" className="wrap pt-20 pb-20 md:pt-24 lg:pt-[120px] lg:pb-[120px]">
      <Eyebrow index={2} total={TOTAL} label="Benchmarks" />

      <div className="mt-8 flex flex-col gap-4 md:mt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div id="benchmarks-title" className="flex max-w-[860px] flex-col gap-4 lg:gap-6">
          <SubLabel>{'// 2.1 Pareto frontier'}</SubLabel>
          <SlashHeading>{pareto.title}</SlashHeading>
        </div>
        <Reveal as="p" className={`max-w-[440px] ${COPY}`}>
          {pareto.body}
        </Reveal>
      </div>
      <div className="mt-8 grid gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-6">
        <ParetoChart
          which="cad"
          fig="Fig.02"
          place={{
            'SKY-001': [12, -10],
            'GPT-6 Astra': [-10, -10],
            'Opus 5.5': [-10, 4],
            'Gemini 3.8 Flash': [10, -8],
            'Qwen 3.8 Max': [-10, 4],
            'Kimi K3': [10, -8],
          }}
          phonePlace={{
            'SKY-001': [10, -10],
            'GPT-6 Astra': [-9, -9],
            'Opus 5.5': [-9, 4],
            'Gemini 3.8 Flash': [-9, -8],
            'Qwen 3.8 Max': [-9, 4],
            'Kimi K3': [-9, -8],
          }}
        />
        <ParetoChart
          which="bim"
          fig="Fig.03"
          place={{
            'SKY-001': [12, -10],
            'Gemini 3.8 Flash': [-10, -9],
            'GPT-6 Astra': [-10, 16],
            'Opus 5.5': [-10, -6],
            'Kimi K3': [-10, 13],
            'Qwen 3.8 Max': [-10, 4],
            'Grok 4.7': [10, 4],
          }}
          phonePlace={{
            'SKY-001': [10, -10],
            'Gemini 3.8 Flash': [-9, -9],
            'GPT-6 Astra': [-6, -11],
            'Opus 5.5': [-9, -6],
            'Kimi K3': [-9, 12],
            'Qwen 3.8 Max': [-9, 4],
            'Grok 4.7': [-2, 18, 'start'],
          }}
          footnote={BIM_NOTE}
        />
      </div>

      <div ref={ref} className="mt-20 lg:mt-[120px]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <SubLabel>{`// 2.2 ${moment.eyebrow}`}</SubLabel>
          <SplitReveal as="h2" className="max-w-[1100px] text-[34px] leading-[1.12] font-normal tracking-[-0.06em] md:text-[48px] md:leading-[1.1] lg:text-[64px]">
            <Slash side="start" />
            {moment.before}
            <AccentWord>{moment.emphasis}</AccentWord>
            {moment.after}
            <Slash side="end" />
          </SplitReveal>
          <Reveal as="p" className={`max-w-[820px] ${COPY}`}>
            {moment.body}
          </Reveal>
        </div>
        <div className="mt-8 grid gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-6">
          <VersusChart kind="cost" fig="Fig.04" />
          <VersusChart kind="time" fig="Fig.05" />
        </div>
        <FigCaption>Fig.04–05 — SKY-001 against GPT-6 Astra per part, 20 cases each. {BIM_NOTE}</FigCaption>
      </div>

      <div className="mt-20 lg:mt-[120px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-4 lg:gap-6">
            <SubLabel>{'// 2.3'}</SubLabel>
            <SlashHeading>{moment.versus}</SlashHeading>
          </div>
          <Reveal as="p" className={`max-w-[440px] ${COPY}`}>
            One 3D CAD part, built by SKY-001, GPT-6 Astra and Opus 5.5 at their measured time per part.
          </Reveal>
        </div>
        <div className="mt-8 lg:mt-14">
          <Race />
        </div>
        <ul className="mt-4 flex flex-col gap-1.5 font-mono text-[10px] leading-[1.45] tracking-[0.02em] text-muted uppercase md:text-[11px]">
          <li>Source · {benchmarks.source}</li>
          {benchmarks.cad.notes.map((n) => (
            <li key={n}>■ {n}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// N.03 How it works: four stages
// ---------------------------------------------------------------------------------------------

const STAGE_FIGURES = [ExploreFigure, DecomposeFigure, SketchFigure, ConstructFigure]
const STAGE_MS = 7000

export function Stages() {
  const { stages } = sky001
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const reduced = useReducedMotion()
  const Figure = STAGE_FIGURES[active]

  useEffect(() => {
    const el = root.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      end: 'bottom 25%',
      onToggle: (s) => setInView(s.isActive),
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    if (!auto || !inView || reduced) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % stages.items.length), STAGE_MS)
    return () => window.clearTimeout(id)
  }, [active, auto, inView, reduced, stages.items.length])

  const pick = (i: number) => {
    setAuto(false)
    setActive(i)
  }

  return (
    <section id="stages" aria-labelledby="stages-title" className="border-t border-line">
      <div className="wrap pt-16 pb-20 md:pt-24 lg:pt-[120px] lg:pb-[120px]">
        <Eyebrow index={3} total={TOTAL} label="How it works" />
        <div id="stages-title" className="mt-8 max-w-[1000px] md:mt-12">
          <SlashHeading>{stages.title}</SlashHeading>
        </div>
        <div ref={root} className="mt-8 grid gap-4 lg:mt-14 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-6">
          <ol className="grid grid-cols-2 border-t border-l border-line lg:grid-cols-1">
            {stages.items.map((s, i) => {
              const on = i === active
              return (
                <li key={s.key} className="relative border-r border-b border-line">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`${s.label}: ${s.title}`}
                    onClick={() => pick(i)}
                    className={`flex min-h-11 w-full cursor-pointer flex-col gap-2 p-4 text-left transition-colors duration-300 md:p-5 lg:p-6 ${on ? 'bg-panel' : 'hover:bg-panel'}`}
                  >
                    <span className={`font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px] ${on ? 'text-brand' : 'text-muted'}`}>{`[S.${pad2(i + 1)}] ${s.label}`}</span>
                    <span className={`text-[17px] leading-[1.2] font-medium tracking-[-0.04em] md:text-xl lg:text-[22px] ${on ? 'text-brand' : 'text-ink'}`}>{s.title}</span>
                    <span className={`hidden text-base leading-[1.5] tracking-[-0.02em] text-body lg:block ${on ? '' : 'lg:hidden'}`}>{s.body}</span>
                  </button>
                  <span aria-hidden="true" className="absolute inset-x-0 -bottom-px block h-1 overflow-hidden">
                    <span
                      key={`${active}-${auto}-${inView}`}
                      className={`block h-full origin-left bg-brand ${on ? '' : 'scale-x-0'}`}
                      style={
                        on && auto && inView && !reduced
                          ? {
                              animation: `stage-fill ${STAGE_MS}ms linear forwards`,
                            }
                          : undefined
                      }
                    />
                  </span>
                </li>
              )
            })}
          </ol>
          <div className="dots flex flex-col gap-3 border border-line p-3 [background-size:12px_12px] md:gap-4 md:p-5 md:[background-size:14px_14px]">
            <div className="flex items-center justify-between font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px]">
              <span className="text-muted">Fig.07 · Stage {active + 1} / 4</span>
              <span className="text-brand">{stages.items[active].label}</span>
            </div>
            <div className="border border-line bg-white">
              <Figure key={active} />
            </div>
            <p className="text-base leading-[1.5] tracking-[-0.02em] text-body lg:hidden">{stages.items[active].body}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// N.04 Why world models excel (dark band)
// ---------------------------------------------------------------------------------------------

const WHY_ICONS: PixelIconName[] = ['cause', 'physics', 'latent', 'horizon']

export function Why() {
  const { why } = sky001
  return (
    <section id="why" aria-labelledby="why-title" className="bg-night-2 text-white">
      <div className="wrap pt-16 pb-16 md:pt-24 md:pb-24 lg:pt-[120px] lg:pb-[120px]">
        <Eyebrow index={4} total={TOTAL} label="Why world models" tone="dark" />
        <div id="why-title" className="mt-8 md:mt-12">
          <SlashHeading tone="dark">{why.title}</SlashHeading>
        </div>
        <div className="mt-8 lg:mt-14">
          <IconCells
            items={why.items.map((w) => ({
              title: w.title,
              body: w.note ? w.note[0].toUpperCase() + w.note.slice(1) : undefined,
            }))}
            icons={WHY_ICONS}
            cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            tone="dark"
            tall={false}
          />
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// N.05 Roadmap: reinventing the physical economy
// ---------------------------------------------------------------------------------------------

const DOMAIN_ICONS: PixelIconName[] = ['pcb', 'aerospace', 'energy', 'protein', 'molecule', 'cua', 'software', 'beyond']
// The doc's paragraph, split at its sentences into today / next / beyond.
const PHASES = [
  {
    tag: 'Today',
    title: 'Hierarchical visual world model',
    body: 'Plans and designs the assembly of engineered objects.',
  },
  {
    tag: 'Next phase',
    title: 'Paired with a VLA agent',
    body: 'From plan generation to physical execution.',
  },
  {
    tag: 'Beyond',
    title: 'The blueprint for physical design',
    body: 'Beyond manufacturing, across every domain below.',
  },
]

export function Roadmap() {
  const { next } = sky001
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useScrambleIn(ref, {
    selector: '[data-scramble-in]',
    delay: 0.2,
    duration: 1,
  })
  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="wrap pt-16 pb-20 md:pt-24 lg:pt-[120px] lg:pb-[120px]">
      <Eyebrow index={5} total={TOTAL} label="Roadmap" />
      <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[1fr_440px] lg:items-end lg:gap-12">
        <div id="roadmap-title">
          <SlashHeading>{next.title}</SlashHeading>
        </div>
        <Reveal as="p" className={COPY}>
          {next.body}
        </Reveal>
      </div>

      <Reveal as="ol" stagger={0.1} className="mt-10 grid border-t border-l border-line md:grid-cols-3 lg:mt-16">
        {PHASES.map((p, i) => (
          <li key={p.tag} className={`relative flex flex-col gap-6 border-r border-b border-line p-5 md:p-7 lg:min-h-[220px] lg:justify-between ${i === 0 ? 'bg-ink text-white' : ''}`}>
            <span className={`flex items-center justify-between font-mono text-xs font-medium tracking-[-0.02em] uppercase md:text-[13px] ${i === 0 ? 'text-line' : 'text-muted'}`}>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className={`block size-2 ${i === 0 ? 'bg-brand' : 'border border-faint'}`} />
                {p.tag}
              </span>
              <span>{`P.${pad2(i + 1)}`}</span>
            </span>
            <span className="flex flex-col gap-2">
              <span className="text-[22px] leading-[1.15] font-medium tracking-[-0.05em] lg:text-[28px]">{p.title}</span>
              <span className={`text-base leading-[1.5] tracking-[-0.02em] ${i === 0 ? 'text-night-text' : 'text-body'}`}>{p.body}</span>
            </span>
            {i < PHASES.length - 1 && (
              <span aria-hidden="true" className="absolute top-1/2 -right-3 z-10 hidden size-6 -translate-y-1/2 place-items-center bg-brand font-mono text-xs text-white md:grid">
                →
              </span>
            )}
          </li>
        ))}
      </Reveal>

      <div className="mt-16 lg:mt-24">
        <SquareLabel>Domains</SquareLabel>
        <Reveal as="ul" stagger={0.05} className="mt-4 grid grid-cols-2 border-t border-l border-line md:grid-cols-4 lg:mt-6">
          {[...next.domains, 'And beyond'].map((d, i) => {
            const on = i === active
            return (
              <li key={d} className="relative border-r border-b border-line">
                <button
                  type="button"
                  aria-pressed={on}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex h-[150px] w-full cursor-pointer flex-col justify-between p-4 text-left transition-colors duration-300 md:h-[200px] md:p-5 lg:h-[240px] lg:p-7 ${on ? 'text-brand' : 'text-ink'}`}
                >
                  <span className="flex items-start justify-between">
                    <PixelIcon name={DOMAIN_ICONS[i]} active={on} className="size-[44px] lg:size-16" />
                    <span className={`text-sm tracking-[-0.04em] ${on ? 'text-brand' : 'text-muted'}`}>{`//D.${pad2(i + 1)}`}</span>
                  </span>
                  <span className="text-lg leading-[1.15] font-medium tracking-[-0.05em] lg:text-[24px]">{d}</span>
                </button>
                <span aria-hidden="true" className={`absolute inset-x-0 -bottom-px block h-1 origin-left bg-brand transition-transform duration-500 ease-out-expo ${on ? 'scale-x-100' : 'scale-x-0'}`} />
              </li>
            )
          })}
        </Reveal>
      </div>

      <div ref={ref} className="mt-12 flex items-start gap-3 lg:mt-16">
        <span aria-hidden="true" className="mt-3 block size-3 shrink-0 bg-brand md:mt-4" />
        <p className="max-w-[1000px] text-[26px] leading-[1.2] tracking-[-0.05em] md:text-[36px]">
          <span data-scramble-in>{next.closing}</span>
        </p>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// N.06 Team + FAQ
// ---------------------------------------------------------------------------------------------

export function Team() {
  const groups = sky001.team.groups
  const others = groups.filter((g) => g.label !== 'Leadership')
  return (
    <section id="team" aria-labelledby="team-title" className="border-t border-line">
      <div className="wrap pt-16 pb-16 md:pt-24 md:pb-24 lg:pt-[120px] lg:pb-[120px]">
        <Eyebrow index={6} total={TOTAL} label="Team" />
        <div id="team-title" className="mt-8 md:mt-12">
          <SlashHeading>{sky001.team.title}</SlashHeading>
        </div>
        <div className="mt-8 grid gap-4 lg:mt-14 lg:grid-cols-[1fr_400px] lg:gap-6">
          <div>
            <SquareLabel className="mb-4">Leadership</SquareLabel>
            <Reveal as="ul" stagger={0.1} className="grid grid-cols-3 border-t border-l border-line">
              {team.founders.map((f) => (
                <li key={f.name} className="group border-r border-b border-line">
                  <div className="dots-sm aspect-[4/5] overflow-hidden">
                    <img src={f.photo} alt={f.name} loading="lazy" className="h-full w-full object-cover grayscale transition-[filter,scale] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  </div>
                  <div className="flex flex-col gap-1 p-3 md:p-5">
                    <span className="text-[15px] leading-[1.2] font-medium tracking-[-0.04em] md:text-xl">{f.name}</span>
                    <span className="font-mono text-[10px] tracking-[0.02em] text-muted uppercase md:text-xs">{f.note}</span>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
          <div className="flex flex-col">
            {others.map((g, i) => (
              <div key={g.label} className={i > 0 ? 'mt-6' : ''}>
                <SquareLabel className="mb-4">{g.label}</SquareLabel>
                <p className="dots border border-line p-5 text-[22px] leading-[1.25] tracking-[-0.05em] md:p-7 md:text-[28px]">{g.names}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const { faq } = sky001
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" aria-labelledby="faq-title" className="wrap pb-20 lg:pb-[120px]">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start lg:gap-6">
          <SubLabel>{'// FAQ'}</SubLabel>
          <div id="faq-title">
            <SlashHeading>{faq.title}</SlashHeading>
          </div>
        </div>
        <ul className="border-t border-line">
          {faq.items.map((item, i) => {
            const on = open === i
            return (
              <li key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="group flex min-h-16 w-full cursor-pointer items-center gap-4 py-4 text-left md:gap-6"
                  >
                    <span className={`w-10 shrink-0 font-mono text-xs font-medium tracking-[-0.02em] md:text-[13px] ${on ? 'text-brand' : 'text-faint'}`}>{`Q.${pad2(i + 1)}`}</span>
                    <span className={`flex-1 text-lg leading-[1.3] tracking-[-0.04em] transition-colors md:text-[22px] ${on ? 'text-brand' : 'text-ink group-hover:text-brand'}`}>{item.q}</span>
                    <span aria-hidden="true" className="relative grid size-6 shrink-0 place-items-center">
                      <span className="absolute block h-0.5 w-3.5 bg-ink" />
                      <span className={`absolute block h-3.5 w-0.5 bg-ink transition-transform duration-300 ${on ? 'scale-y-0' : ''}`} />
                    </span>
                  </button>
                </h3>
                <div id={`faq-${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-14 text-base leading-[1.5] tracking-[-0.02em] text-body md:pl-16 md:text-lg">{item.a || 'Answer to come from the team.'}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// Waitlist band
// ---------------------------------------------------------------------------------------------

export function Waitlist() {
  const { intro } = sky001
  const root = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false)
  useScrambleIn(root, {
    selector: 'h2 [data-scramble-in]',
    start: 'top 70%',
    delay: 0.4,
    duration: 1.2,
  })
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-cta-card]',
          start: 'top 80%',
          once: true,
        },
        defaults: { ease: 'expo.out' },
      })
      tl.from('[data-cta-card]', {
        clipPath: 'inset(50% 0% 50% 0%)',
        duration: 1.2,
      })
        .from('[data-corner]', { scale: 0, duration: 0.6, stagger: 0.08 }, 0.5)
        .from('[data-cta-fade]', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.9 }, 0.6)
    },
    { scope: root },
  )
  return (
    <section id="waitlist" ref={root} aria-labelledby="waitlist-title">
      <div aria-hidden="true" className="border-t border-line">
        <Marquee speed={60} copies={4} wrapWhenStill={false} className="h-14 md:h-[72px]" groupClassName="gap-12 pr-12 md:gap-[72px] md:pr-[72px]">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center gap-12 font-mono text-[13px] font-medium tracking-[-0.02em] whitespace-nowrap text-brand uppercase md:gap-[72px] md:text-[15px]">
              <span>[#SKY-001] &amp; [#Engineered World]</span>
              <span>{'//'}</span>
            </span>
          ))}
        </Marquee>
      </div>
      <LiveGridBand cardRef={card} className="px-4 py-11 md:px-10 md:py-24">
        <div ref={card} data-cta-card className="relative mx-auto flex max-w-[1208px] flex-col items-center gap-7 bg-white px-5 py-16 text-center md:gap-9 md:py-24 lg:min-h-[488px] lg:justify-center">
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
            <span key={pos} data-corner aria-hidden="true" className={`absolute block size-4 bg-ink md:size-6 ${pos}`} />
          ))}
          <span data-cta-fade className="bg-chip px-2 py-1 font-mono text-xs font-medium tracking-[-0.02em] text-muted uppercase md:text-[13px]">
            {intro.waitlist.title}
          </span>
          <SplitReveal as="h2" className="max-w-[820px] text-[38px] leading-[1.1] font-normal tracking-[-0.06em] text-ink md:text-[56px] lg:text-[72px]">
            <span id="waitlist-title">
              Join the <AccentWord caret>waitlist</AccentWord> now for early access.
            </span>
          </SplitReveal>
          <form
            data-cta-fade
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
            className="flex w-full max-w-[560px] flex-col gap-3 md:flex-row md:gap-0"
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Work email
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="you@company.com"
              className="h-[52px] w-full min-w-0 border md:flex-1 border-ink bg-white px-4 font-mono text-[15px] tracking-[-0.02em] text-ink placeholder:text-faint focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              onPointerEnter={scrambleOnHover}
              className="group relative inline-flex h-[52px] cursor-pointer items-center justify-between gap-8 overflow-hidden bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-[scale] duration-300 active:scale-[0.98]"
            >
              <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0" />
              <span aria-hidden="true" className="relative block size-2 bg-white transition-[rotate] duration-300 group-hover:-rotate-180" />
              <span className="relative" data-scramble>
                Join
              </span>
            </button>
          </form>
          <p data-cta-fade aria-live="polite" className="min-h-4 font-mono text-[11px] tracking-[0.02em] text-muted uppercase md:text-xs">
            {sent ? 'Thanks. Sign-up is not connected to a list yet in this preview.' : ''}
          </p>
          <div data-cta-fade>
            <UnderlineLink href={intro.video.href} className="md:min-w-[240px]">
              {intro.video.label}
            </UnderlineLink>
          </div>
        </div>
      </LiveGridBand>
    </section>
  )
}
