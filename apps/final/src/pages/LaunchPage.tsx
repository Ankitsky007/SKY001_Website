import { benchmarks, docCharts, showcase, sky001 } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
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
import { ExplorerGrid } from '../components/Explorer'
import { Footer } from '../components/Footer'
import { LineGrid } from '../components/LineGrid'
import { WarpBackground } from '../components/ui/warp-background'
import { Nav } from '../components/Nav'
import { NewsCard } from '../components/NewsCard'
import { Reel } from '../components/Reel'
import { StageScrub } from '../components/StageScrub'
import { WorldModelDiagram } from '../components/WorldModelDiagram'
import { media, type ModelId } from '../lib/media'
import { footerPages, navTabs } from '../lib/nav'
import { HOME, VIDEO_HREF, WAITLIST_HREF } from '../lib/routes'
import { BigLink, ButtonLink, CountUp, DISPLAY, Display, GUTTER, H1, H3, LABEL, Panel, RuleCol, Section, TextLink, Window, WRAP } from '../lib/ui'

const MODELS = showcase.models.map((m) => m.id) as ModelId[]
const COPY = 'text-[17px] leading-[1.25] tracking-[-0.02em] md:text-[19px]'
const SMALL = 'text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base'

function Hero() {
  const { hero, intro } = sky001
  return (
    <section id="top" className={`relative bg-paper ${GUTTER} pt-8 pb-14 md:pt-28 md:pb-20`}>
      {/* the warp: grid walls in perspective with blue beams running towards the viewer */}
      <WarpBackground aria-hidden="true" perspective={120} beamsPerSide={4} beamSize={5} beamDuration={4} className="pointer-events-none absolute! inset-0 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]" />
      {/* the hero rises in line by line on load, like the reveals further down */}
      <Reveal stagger={0.12} delay={0.15} className={`relative z-10 ${WRAP} flex flex-col items-center text-center`}>
        <NewsCard />
        <p className="mt-12 text-[15px] font-medium tracking-[-0.02em] md:mt-20 md:text-base">
          {/* Non-breaking hyphen keeps "SKY-001" on one line. */}
          {intro.before.replace('SKY-001', 'SKY‑001')}
          {intro.emphasis}
        </p>
        <h1 data-grid-avoid className={`${H1} mt-6 max-w-[10ch] md:mt-8`}>{hero.title}</h1>
        <p data-grid-avoid className={`${COPY} mt-8 max-w-[38ch] text-body`}>{hero.lede}</p>
        <p className={`${LABEL} mt-3 text-brand`}>{hero.note}</p>
        <div className="mt-8 flex flex-col items-center gap-3 md:mt-12">
          <BigLink href={WAITLIST_HREF}>{intro.waitlist.cta.label}</BigLink>
          <TextLink href={VIDEO_HREF} className="border-b-0">
            {intro.video.label}
          </TextLink>
        </div>
      </Reveal>
    </section>
  )
}

function ReelBand() {
  return (
    <section className={`bg-studio ${GUTTER} py-6 md:py-10`}>
      <div className={WRAP}>
        <Window title="SKY-001.Output" bodyClassName="bg-studio">
          <div className="px-3 pb-3 md:px-5">
            <Reel models={MODELS} className="h-[62svh] min-h-[380px]" />
          </div>
        </Window>
      </div>
    </section>
  )
}

function Intro() {
  const { intro } = sky001
  return (
    <Section id="intro">
      <Reveal>
        <p className={`${DISPLAY} max-w-[20ch] text-[34px] leading-[0.98] normal-case sm:text-[56px] lg:text-[80px] lg:leading-[0.94]`}>{intro.statement}</p>
      </Reveal>
    </Section>
  )
}

// One real showcase render beside each of the three points.
const POINT_MEDIA: { src: string; alt: string; file: string }[] = [
  { src: media.poster('arcmate'), alt: 'Welding robot as a clay 3D shape, generated from one image', file: 'Shape.Welding robot' },
  { src: media.final('tractor'), alt: 'Compact tractor, 92 refined parts', file: 'Parts.Compact tractor' },
  { src: media.final('jet'), alt: 'Jet engine, 70 refined parts', file: 'Parts.Turbofan' },
]

function Contrarian() {
  const { contrarian } = sky001
  return (
    <Section ground="studio">
      <Display>{contrarian.title}</Display>
      <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6 lg:mt-14 lg:gap-10">
        {contrarian.points.map((p, i) => (
          <li key={p.title} className="flex flex-col gap-5">
            <Window title={POINT_MEDIA[i].file} bodyClassName="bg-studio">
              <img src={POINT_MEDIA[i].src} alt={POINT_MEDIA[i].alt} loading="lazy" className="aspect-[8/5] w-full object-contain" />
            </Window>
            <RuleCol label={<h3>{p.title}</h3>} className="flex-1">
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
        <RuleCol label="[01]" className="mt-10 max-w-[560px]">
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

function Explore() {
  const { explore } = showcase
  return (
    <Section id="explore">
      <Display note={explore.eyebrow}>{explore.title}</Display>
      <Reveal>
        <RuleCol label="[01]" className="mt-10 max-w-[520px]">
          <p className={`${COPY} text-[20px] md:text-[26px]`}>{explore.body}</p>
        </RuleCol>
      </Reveal>
      <div className="mt-10 lg:mt-14">
        <ExplorerGrid />
      </div>
      <p className="mt-4 font-mono text-[11px] text-muted md:text-xs">{showcase.disclaimer}</p>
    </Section>
  )
}

function Why() {
  return (
    <Section ground="studio">
      <Display size="md">{sky001.why.title}</Display>
      <div className="mt-4 lg:mt-6">
        <WorldModelDiagram />
      </div>
    </Section>
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
          <ul className="flex flex-wrap gap-1.5">
            {next.domains.map((d) => (
              <li key={d} className="bg-ink px-1.5 py-0.5 font-mono text-[13px] font-medium text-white md:text-sm">
                {d}
              </li>
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

function Team() {
  const { team } = sky001
  return (
    <Section ground="studio">
      <Display size="md">{team.title}</Display>
      <Reveal>
        <dl className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-14 lg:gap-12">
          {team.groups.map((g) => (
            <RuleCol key={g.label} label={<dt>{g.label}</dt>}>
              <dd className={`${DISPLAY} text-[28px] leading-[1] sm:text-[36px]`}>{g.names}</dd>
            </RuleCol>
          ))}
        </dl>
      </Reveal>
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
    <Section id="waitlist" field={<LineGrid mask="linear-gradient(to top, #000 20%, transparent 80%)" />}>
      <div className="flex flex-col items-center text-center">
        <NewsCard />
        <p className="mt-10 text-[15px] font-medium tracking-[-0.02em] md:text-base">{waitlist.title}</p>
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
      <Nav home={HOME} tabs={navTabs('launch')} cta={{ label: sky001.intro.waitlist.cta.label, href: WAITLIST_HREF }} />
      <main>
        <Hero />
        <ReelBand />
        <Intro />
        <Contrarian />
        <Results />
        <Moment />
        <Stages />
        <Bim />
        <Explore />
        <Why />
        <Next />
        <Team />
        <Faq />
        <Waitlist />
      </main>
      <Footer pages={footerPages()} />
    </>
  )
}
