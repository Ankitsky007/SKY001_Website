import { benchmarks, docCharts, sky001 } from '@skyfall/core'
import { gsap, Reveal, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef, useState } from 'react'
import extrudeClip from '../assets/media/extrude.mp4'
import plansClip from '../assets/media/plans.mp4'
import restackClip from '../assets/media/restack.mp4'
import extrudePoster from '../assets/media/s-extrude.jpg'
import plansPoster from '../assets/media/s-plans.jpg'
import restackPoster from '../assets/media/s-restack.jpg'
import towerPoster from '../assets/media/s-tower.jpg'
import towerClip from '../assets/media/tower.mp4'
import { ParetoScatter, VersusLines } from '../components/Charts'
import { Clip } from '../components/Clip'
import { ContrarianFigure } from '../components/ContrarianFigures'
import { PixelIcon } from '../components/PixelIcon'
import { DOMAIN_ICONS, DOMAIN_TONES, type PixelIconName } from '../lib/pixelIcons'
import { Footer } from '../components/Footer'
import { LineGrid } from '../components/LineGrid'
import { WarpBackground } from '../components/ui/warp-background'
import { Nav } from '../components/Nav'
import { StageScrub } from '../components/StageScrub'
import { TiltedModels } from '../components/TiltedModels'
import { WorldModelDiagram } from '../components/WorldModelDiagram'
import { footerPages, navTabs } from '../lib/nav'
import { HOME, VIDEO_HREF, WAITLIST_HREF } from '../lib/routes'
import { BigLink, ButtonLink, CountUp, DISPLAY, Display, GUTTER, H1, H3, LABEL, Panel, RuleCol, Section, TextLink, Window, WRAP } from '../lib/ui'

const COPY = 'text-[17px] leading-[1.25] tracking-[-0.02em] md:text-[19px]'
const SMALL = 'text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base'

/** The middle of `el`, in px down from the top of `box`. Layout offsets, so the reveal's slide-in does not move it. */
function middleWithin(el: HTMLElement, box: HTMLElement) {
  let top = el.offsetHeight / 2
  for (let n: HTMLElement | null = el; n && n !== box; n = n.offsetParent as HTMLElement | null) top += n.offsetTop
  return top
}

function Hero() {
  const { hero, intro } = sky001
  // the warp's squares meet on the middle of the headline (Ankit, 2026-10-17), on every screen size
  const section = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const [originY, setOriginY] = useState<number>()
  useEffect(() => {
    const box = section.current
    const h1 = title.current
    if (!box || !h1) return
    const measure = () => setOriginY(middleWithin(h1, box))
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    ro.observe(h1)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])
  return (
    <section ref={section} id="top" className={`relative bg-paper ${GUTTER} pt-12 pb-14 md:pt-20 md:pb-20 lg:pt-28 short-laptop:pt-20`}>
      {/* the warp: grid walls in perspective with blue beams running towards the viewer */}
      <WarpBackground aria-hidden="true" perspective={120} originY={originY} beamsPerSide={4} beamSize={5} beamDuration={4} gridColor="var(--color-grid)" className="pointer-events-none absolute! inset-0 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]" />
      {/* the hero rises in line by line on load, like the reveals further down */}
      <Reveal stagger={0.12} delay={0.15} className={`relative z-10 ${WRAP} flex flex-col items-center text-center`}>
        <p className="text-[15px] font-medium tracking-[-0.02em] md:text-base">
          {/* Non-breaking hyphen keeps "SKY-001" on one line. */}
          {intro.before.replace('SKY-001', 'SKY‑001')}
          {intro.emphasis}
        </p>
        <h1 ref={title} data-grid-avoid className={`${H1} mt-6 max-w-[10ch] md:mt-8 short-laptop:mt-5 short-laptop:max-w-[14ch] short-laptop:text-[92px]`}>{hero.title}</h1>
        <p data-grid-avoid className={`${COPY} mt-8 max-w-[38ch] text-body short-laptop:mt-6`}>{hero.lede}</p>
        <p className={`${LABEL} mt-3 text-brand`}>{hero.note}</p>
        <div className="mt-8 flex flex-col items-center gap-3 md:mt-12 short-laptop:mt-8">
          <BigLink href={WAITLIST_HREF}>{intro.waitlist.cta.label}</BigLink>
          <TextLink href={VIDEO_HREF} className="border-b-0">
            {intro.video.label}
          </TextLink>
        </div>
      </Reveal>
    </section>
  )
}

/**
 * Right under the hero, one section from claim to proof: the intro statement fills in word by word
 * as it scrolls by (grey to ink, the part after the semicolon to brand blue, as the homepage
 * mission does), and right below it the four models' renders turn on a curved row (from V7) over a
 * soft blue glow and a floor shadow. Hover pauses the row; a click plays that model's film.
 */
function ModelRing() {
  const statement = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const [claim, rest] = sky001.intro.statement.split(';')
  const words = [...claim.trim().split(' ').map((w) => ({ w, em: false })), ...(rest ? rest.trim().split(' ').map((w) => ({ w, em: true })) : [])]
  useGSAP(
    () => {
      if (reduced || !statement.current) return
      gsap.fromTo(statement.current.querySelectorAll('[data-word]'), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: statement.current, start: 'top 85%', end: 'bottom 50%', scrub: 0.4 } })
    },
    { dependencies: [reduced], scope: statement },
  )
  return (
    <section id="intro" aria-labelledby="intro-statement" className="relative overflow-hidden bg-paper pt-12 pb-14 md:pt-20 md:pb-20">
      {/* glow behind the row, and a floor shadow under it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(55%_45%_at_50%_45%,rgba(62,87,218,0.14),transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[12%] bottom-10 h-16 rounded-[50%] bg-[radial-gradient(closest-side,rgba(26,26,26,0.12),transparent)] blur-md md:bottom-14" />
      {/* the white fades into the next section's grey, so the two run together */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-studio md:h-48" />
      <div className={`relative ${GUTTER}`}>
        <p id="intro-statement" ref={statement} className={`${DISPLAY} mx-auto max-w-[22ch] text-center text-[32px] leading-[0.98] normal-case sm:text-[48px] lg:text-[64px] lg:leading-[0.95]`}>
          {words.map(({ w, em }, i) => (
            <span key={i} data-word className={em ? 'text-brand' : undefined}>
              {w}
              {i === words.findIndex((x) => x.em) - 1 ? '; ' : i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
      <TiltedModels className="relative mt-10 h-[260px] sm:h-[340px] md:mt-14 lg:h-[420px]" />
    </section>
  )
}

// An animated illustration beside each point (Ankit's picks, 2026-10-14): a bracket reasoned onto
// a base in 3D, many designs dreamt at once, and a globe with the domains in orbit. The point's
// title sits on the window's band and its number above the text. No hover state (Ankit, 2026-10-14).
function Contrarian() {
  const { contrarian } = sky001
  return (
    <Section ground="studio">
      <Display>{contrarian.title}</Display>
      {/* tablets and small laptops: one point per row, its illustration beside its text, so the
          drawings stay large enough to read; three across from 1100 */}
      <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-10 md:gap-8 lg:mt-14 lg:gap-10 min-[1100px]:grid-cols-3">
        {contrarian.points.map((p, i) => (
          <li key={p.title} className="flex flex-col gap-5 md:max-[1099px]:grid md:max-[1099px]:grid-cols-2 md:max-[1099px]:gap-6">
            <Window title={<h3>{p.title}</h3>} bodyClassName="bg-paper">
              <ContrarianFigure i={i} />
            </Window>
            <RuleCol label={String(i + 1).padStart(2, '0')} className="flex-1">
              <p className={SMALL}>{p.body}</p>
            </RuleCol>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}

function Results() {
  const { pareto } = docCharts
  return (
    <Section id="results">
      <Display size="md" align="left" note={`${pareto.cad.title} / ${pareto.bim.title}`}>
        {sky001.pareto.title}
      </Display>
      <Reveal>
        <RuleCol className="mt-10 max-w-[560px]">
          <p className={`${COPY} text-[20px] md:text-[26px]`}>{sky001.pareto.body}</p>
        </RuleCol>
      </Reveal>
      <div className="mt-12 grid gap-x-6 gap-y-10 lg:mt-16 lg:grid-cols-2">
        <Panel tag="3D CAD" title={pareto.cad.title} caption={`${pareto.yLabel} against ${pareto.xLabel.toLowerCase()}. ${pareto.hint}.`}>
          <ParetoScatter chart="cad" />
        </Panel>
        <Panel tag="BIM" title={pareto.bim.title} caption={`${pareto.yLabel} against ${pareto.xLabel.toLowerCase()}. ${pareto.hint}.`}>
          <ParetoScatter chart="bim" />
        </Panel>
      </div>
    </Section>
  )
}

function Moment() {
  const { moment } = sky001
  return (
    <Section ground="blue" field={<LineGrid tone="blue" mask="linear-gradient(to bottom, #000 40%, transparent 75%)" />}>
      <Display tone="dark" align="left" note={moment.eyebrow}>
        {moment.before}
        {moment.emphasis}
        {moment.after}
      </Display>
      <Reveal>
        <RuleCol tone="dark" label={moment.versus} className="mt-10 max-w-[620px]">
          <p className={COPY}>{moment.body}</p>
        </RuleCol>
      </Reveal>
      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
        <VersusLines chart="cost" />
        <VersusLines chart="time" />
      </div>
      <dl className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-16 lg:gap-12">
        {benchmarks.headline.map((h) => (
          <RuleCol key={h.detail} tone="dark" label={<dt>{h.detail}</dt>}>
            <dd>
              <span className={`${DISPLAY} block text-[88px] leading-[0.85] sm:text-[104px] lg:text-[150px]`}>
                <CountUp value={h.value} />
              </span>
              <span className={`${H3} mt-2 block`}>{h.label}</span>
            </dd>
          </RuleCol>
        ))}
      </dl>
    </Section>
  )
}

function Stages() {
  return (
    <section id="how" aria-labelledby="how-title" className="bg-studio">
      <StageScrub model="jaguar" title={sky001.stages.title} titleId="how-title" />
    </section>
  )
}

const BIM_CLIPS = [
  { src: plansClip, poster: plansPoster, label: 'SKY-001 output: floor plan candidates for one level, one selected', hud: 'Floor plan candidates' },
  { src: extrudeClip, poster: extrudePoster, label: 'SKY-001 output: a floor plan extruded into a 3D level', hud: 'Plan to 3D' },
  { src: restackClip, poster: restackPoster, label: 'SKY-001 output: levels stacked into a building', hud: 'Level by level' },
]

function Bim() {
  const bimHeadline = benchmarks.headline[2]
  return (
    <Section id="bim" ground="night">
      <Display tone="dark" align="left" note={bimHeadline.detail}>
        {benchmarks.bim.title}
      </Display>
      <div className="mt-10 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <Clip src={towerClip} poster={towerPoster} label="SKY-001 output: a 36-level tower built level by level" hud="BIM / 36 levels" />
        </Reveal>
        <RuleCol tone="dark" label={benchmarks.bim.cases} className="py-2">
          <span className={`${DISPLAY} block text-[88px] leading-[0.85] text-brand-lift lg:text-[150px]`}>{bimHeadline.value}</span>
          <span className={`${H3} mt-2 block`}>{bimHeadline.label}</span>
        </RuleCol>
      </div>
      <Reveal as="div" stagger={0.08} className="mt-3 grid gap-3 md:grid-cols-3">
        {BIM_CLIPS.map((c) => (
          <Clip key={c.hud} {...c} />
        ))}
      </Reveal>
    </Section>
  )
}

function Why() {
  return (
    <Section ground="studio">
      <Display size="md">{sky001.why.title}</Display>
      {/* the globe's canvas has air above the globe itself, so the diagram tucks up under the heading */}
      <div className="-mt-6 md:-mt-12 lg:-mt-16">
        <WorldModelDiagram />
      </div>
    </Section>
  )
}

/** One domain: its pixel icon, in the domain's own muted tone, over its name. */
function DomainCell({ name, icon, tone }: { name: string; icon: PixelIconName; tone: { color: string; ghost: string } }) {
  return (
    <li className="flex min-h-32 flex-col justify-between gap-4 border-r border-b border-line p-4 transition-colors hover:bg-studio">
      <PixelIcon name={icon} active className="size-10 lg:size-12" color={tone.color} ghost={tone.ghost} />
      <span className="font-mono text-[13px] font-medium tracking-[-0.01em] text-ink md:text-sm">{name}</span>
    </li>
  )
}

function Next() {
  const { next } = sky001
  return (
    <Section>
      <Display>{next.title}</Display>
      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-12">
        <Reveal className="flex">
          <RuleCol label="[01]">
            <p className={COPY}>{next.body}</p>
          </RuleCol>
        </Reveal>
        <Reveal className="flex flex-col justify-between gap-8">
          <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {next.domains.map((d, i) => (
              <DomainCell key={d} name={d} icon={DOMAIN_ICONS[i]} tone={DOMAIN_TONES[i]} />
            ))}
          </ul>
          <RuleCol label="[02]">
            <p className={`${COPY} text-[20px] text-brand md:text-[26px]`}>{next.closing}</p>
          </RuleCol>
        </Reveal>
      </div>
    </Section>
  )
}

function Faq() {
  const { faq } = sky001
  return (
    <Section id="faq" ground="ink">
      <Display tone="dark" size="md">
        {faq.title}
      </Display>
      <div className="mx-auto mt-10 max-w-[860px] border-t border-night-mid lg:mt-14">
        {faq.items.map((item) => (
          <details key={item.q} className="group border-b border-night-mid">
            <summary className="flex min-h-14 cursor-pointer items-center gap-4 py-3 font-mono text-[13px] tracking-[0.03em] group-open:text-brand-lift md:text-sm">
              <span className="flex-1">{item.q}</span>
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center bg-white text-ink transition-colors duration-300 group-open:bg-brand group-open:text-white">
                <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-300 group-open:rotate-45">
                  <path d="M6 1v10M1 6h10" />
                </svg>
              </span>
            </summary>
            {item.a && <p className={`${COPY} max-w-[60ch] pb-5 text-white/85`}>{item.a}</p>}
          </details>
        ))}
      </div>
    </Section>
  )
}

function Waitlist() {
  const { waitlist, video } = sky001.intro
  return (
    <Section id="waitlist" field={<LineGrid mask="linear-gradient(to bottom, transparent, #000 30%, #000 calc(100% - 120px), transparent)" />}>
      <div className="flex flex-col items-center text-center">
        <p className="text-[15px] font-medium tracking-[-0.02em] md:text-base">{waitlist.title}</p>
        <h2 className={`${H1} mt-6 max-w-[11ch]`}>{waitlist.body}</h2>
        <div className="mt-8 flex flex-col items-center gap-3 md:mt-12">
          <ButtonLink href={WAITLIST_HREF}>{waitlist.cta.label}</ButtonLink>
          <TextLink href={VIDEO_HREF} className="border-b-0">
            {video.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}

export function LaunchPage() {
  return (
    <>
      <Nav home={HOME} tabs={navTabs('launch')} />
      <main>
        <Hero />
        <ModelRing />
        <Contrarian />
        <Results />
        <Moment />
        <Stages />
        <Bim />
        <Why />
        <Next />
        <Faq />
        <Waitlist />
      </main>
      <Footer pages={footerPages()} />
    </>
  )
}
