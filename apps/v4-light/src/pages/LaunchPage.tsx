import { benchmarks, showcase, sky001 } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
import extrudeClip from '../assets/media/extrude.mp4'
import plansClip from '../assets/media/plans.mp4'
import restackClip from '../assets/media/restack.mp4'
import extrudePoster from '../assets/media/s-extrude.jpg'
import plansPoster from '../assets/media/s-plans.jpg'
import restackPoster from '../assets/media/s-restack.jpg'
import towerPoster from '../assets/media/s-tower.jpg'
import towerClip from '../assets/media/tower.mp4'
import { BarPanel, type BarRow } from '../components/Charts'
import { Clip } from '../components/Clip'
import { ExplorerGrid } from '../components/Explorer'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { Reel } from '../components/Reel'
import { StageScrub } from '../components/StageScrub'
import { media, type ModelId } from '../lib/media'
import { BODY, ButtonLink, CountUp, GUTTER, H1, H2, H3, LABEL, LEAD, Section, Tag, TextLink, WRAP } from '../lib/ui'

const MODELS = showcase.models.map((m) => m.id) as ModelId[]
const money = (n: number) => `$${n < 0.01 ? n.toFixed(3) : n.toFixed(2)}`
const secs = (n: number) => `${n.toLocaleString('en-US')} s`

function Hero() {
  const { news, hero } = sky001
  return (
    <section className={`flex min-h-[calc(100svh-3.5rem)] flex-col bg-studio ${GUTTER} pt-6 pb-5 sm:pt-10 lg:min-h-[calc(100svh-4rem)]`}>
      <div className={`${WRAP} flex min-h-0 flex-1 flex-col`}>
        <a
          href={news.cta.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex min-h-11 flex-wrap items-center gap-x-3 gap-y-0.5 self-start rounded-xl border border-line bg-paper px-3 py-1.5 font-mono text-[11px] transition-colors hover:border-brand sm:text-xs"
        >
          <span className="text-brand uppercase">
            {news.label} · {news.date}
          </span>
          <span className="text-ink">{news.title}</span>
          <span className="text-muted underline underline-offset-2 group-hover:text-brand">{news.cta.label}</span>
        </a>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-12">
          <h1 className={H1}>{hero.title}</h1>
          <div>
            <p className={`${BODY} max-w-[40ch]`}>{hero.lede}</p>
            <p className={`${LABEL} mt-3 text-brand`}>{hero.note}</p>
          </div>
        </div>
        <Reel models={MODELS} className="mt-3 min-h-[48svh] flex-1 lg:min-h-[54svh]" />
      </div>
    </section>
  )
}

function Intro() {
  const { intro } = sky001
  return (
    <Section id="intro">
      <Reveal className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-[30px] leading-[1.08] font-medium tracking-[-0.03em] text-balance sm:text-5xl lg:text-[60px]">
            {/* Non-breaking hyphen keeps "SKY-001" on one line. */}
            {intro.before.replace('SKY-001', 'SKY\u2011001')}
            <span className="text-brand">{intro.emphasis}</span>
          </h2>
          <p className="mt-6 max-w-[26ch] text-2xl leading-[1.15] tracking-[-0.02em] text-balance text-muted sm:text-3xl lg:text-4xl">{intro.statement}</p>
        </div>
        <div className="self-end rounded-2xl bg-studio p-5 sm:p-6">
          <Tag>{intro.waitlist.title}</Tag>
          <p className={`${LEAD} mt-3`}>{intro.waitlist.body}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1">
            <ButtonLink href={intro.waitlist.cta.href} arrow>
              {intro.waitlist.cta.label}
            </ButtonLink>
            <TextLink href={intro.video.href}>{intro.video.label}</TextLink>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

// One real showcase render beside each of the three points.
const POINT_MEDIA: { src: string; alt: string }[] = [
  { src: media.poster('arcmate'), alt: 'Welding robot as a clay 3D shape, generated from one image' },
  { src: media.final('tractor'), alt: 'Compact tractor, 92 refined parts' },
  { src: media.final('jet'), alt: 'Jet engine, 70 refined parts' },
]

function Contrarian() {
  const { contrarian } = sky001
  return (
    <Section className="border-t border-line">
      <Reveal>
        <h2 className={`${H2} max-w-[20ch]`}>{contrarian.title}</h2>
      </Reveal>
      <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-14">
        {contrarian.points.map((p, i) => (
          <li key={p.title} className="flex flex-col overflow-hidden rounded-2xl border border-line">
            <img src={POINT_MEDIA[i].src} alt={POINT_MEDIA[i].alt} loading="lazy" className="aspect-[8/5] w-full bg-studio object-contain" />
            <div className="flex-1 border-t border-line p-5">
              <span className={`${LABEL} text-faint`}>0{i + 1}</span>
              <h3 className={`${H3} mt-2`}>{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}

function Pareto() {
  const { cad, bim } = benchmarks
  const iou: BarRow[] = cad.rows.map((r) => ({ model: r.model, ours: r.ours, value: r.iou, display: r.iou === null ? '—' : `${r.iou.toFixed(1)}%`, sub: `${r.success} success` }))
  const time: BarRow[] = cad.rows.map((r) => ({ model: r.model, ours: r.ours, value: r.seconds, display: secs(r.seconds) }))
  const cost: BarRow[] = cad.rows.map((r) => ({ model: r.model, ours: r.ours, value: r.cost, display: money(r.cost) }))
  const bimTime: BarRow[] = bim.rows.map((r) => ({ model: r.model, ours: r.ours, value: r.seconds, display: secs(r.seconds) }))

  return (
    <Section id="results" className="border-t border-line">
      <Reveal className="grid gap-5 lg:grid-cols-2 lg:gap-16">
        <h2 className={H2}>{sky001.pareto.title}</h2>
        <p className={`${LEAD} self-end text-muted`}>{sky001.pareto.body}</p>
      </Reveal>

      <div className="mt-10 lg:mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={H3}>{cad.title}</h3>
          <span className={`${LABEL} text-muted`}>{cad.cases}</span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <BarPanel title="IoU" hint="Higher is better" rows={iou} max={100} ticks={['0%', '50%', '100%']} />
          <BarPanel title="Time per sample" hint="Lower is better" rows={time} max={1300} ticks={['0 s', '650 s', '1,300 s']} />
          <BarPanel title="Cost per sample" hint="Lower is better" rows={cost} max={0.8} ticks={['$0', '$0.40', '$0.80']} />
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="lg:pt-1">
          <h3 className={H3}>{bim.title}</h3>
          <span className={`${LABEL} mt-1 block text-muted`}>{bim.cases}</span>
        </div>
        <div className="lg:col-span-2">
          <BarPanel title="Time per sample" hint="Lower is better" rows={bimTime} max={600} ticks={['0 s', '300 s', '600 s']} />
        </div>
      </div>

      <ul className="mt-6 space-y-1 text-[13px] leading-relaxed text-muted">
        {[...cad.notes, ...bim.notes, `Bar lengths use linear scales. Source: ${benchmarks.source}.`].map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </Section>
  )
}

function Moment() {
  const { moment } = sky001
  return (
    <Section ground="studio">
      <Reveal className="grid gap-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <Tag>{moment.eyebrow}</Tag>
          <h2 className={`${H2} mt-4`}>
            {moment.before}
            <span className="text-brand">{moment.emphasis}</span>
            {moment.after}
          </h2>
        </div>
        <p className={`${BODY} self-end`}>{moment.body}</p>
      </Reveal>
      <div className="mt-10 lg:mt-14">
        <h3 className={`${LABEL} text-muted`}>{moment.versus}</h3>
        <dl className="mt-4 grid gap-4 md:grid-cols-3">
          {benchmarks.headline.map((h) => (
            <div key={h.detail} className="flex flex-col-reverse rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <dt>
                <span className="block text-lg font-medium">{h.label}</span>
                <span className="mt-1 block font-mono text-xs text-muted">{h.detail}</span>
              </dt>
              <dd className="text-6xl font-medium tracking-[-0.05em] text-brand sm:text-7xl lg:text-[88px]">
                <CountUp value={h.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}

function Stages() {
  return (
    <section id="how" aria-labelledby="how-title" className="border-t border-line bg-studio">
      <div className={`${GUTTER} pt-16 pb-8 sm:pt-20 lg:pt-28`}>
        <Reveal className={WRAP}>
          <Tag>Step by step</Tag>
          <h2 id="how-title" className={`${H2} mt-4 max-w-[22ch]`}>
            {sky001.stages.title}
          </h2>
        </Reveal>
      </div>
      <StageScrub model="jaguar" />
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
    <Section id="bim" ground="stage">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-end lg:gap-14">
        <Reveal>
          <span className={`${LABEL} text-brand-lift`}>{benchmarks.bim.cases}</span>
          <h2 className={`${H2} mt-4`}>{benchmarks.bim.title}</h2>
          <p className="mt-5 flex items-baseline gap-3">
            <span className="text-6xl font-medium tracking-[-0.05em] text-brand-lift sm:text-7xl">{bimHeadline.value}</span>
            <span className="text-lg">{bimHeadline.label}</span>
          </p>
          <p className="mt-1 font-mono text-xs text-stage-muted">{bimHeadline.detail}</p>
        </Reveal>
        <Reveal>
          <Clip src={towerClip} poster={towerPoster} label="SKY-001 output: a 36-level tower built level by level" hud="BIM · 36 levels" />
        </Reveal>
      </div>
      <Reveal as="div" stagger={0.08} className="mt-4 grid gap-4 md:grid-cols-3">
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
    <Section id="explore" ground="studio">
      <Reveal className="grid gap-5 lg:grid-cols-2 lg:gap-16">
        <div>
          <Tag>{explore.eyebrow}</Tag>
          <h2 className={`${H2} mt-4`}>{explore.title}</h2>
        </div>
        <p className={`${LEAD} self-end text-muted`}>{explore.body}</p>
      </Reveal>
      <div className="mt-10 lg:mt-14">
        <ExplorerGrid />
      </div>
    </Section>
  )
}

function Why() {
  const { why, next } = sky001
  return (
    <Section>
      <Reveal>
        <h2 className={H2}>{why.title}</h2>
      </Reveal>
      <Reveal as="ol" stagger={0.06} className="mt-8 grid border-t border-l border-line sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {why.items.map((item, i) => (
          <li key={item.title} className="flex min-h-36 flex-col justify-between border-r border-b border-line p-5">
            <span className={`${LABEL} text-brand`}>0{i + 1}</span>
            <span>
              <span className={`${H3} block`}>{item.title}</span>
              {item.note && <span className="mt-1 block text-[15px] text-muted">{item.note}</span>}
            </span>
          </li>
        ))}
      </Reveal>

      <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className={H2}>{next.title}</h2>
          <p className={`${BODY} mt-5`}>{next.body}</p>
        </Reveal>
        <Reveal className="flex flex-col justify-between gap-8">
          <ul className="flex flex-wrap gap-2">
            {next.domains.map((d) => (
              <li key={d} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-[15px]">
                {d}
              </li>
            ))}
          </ul>
          <p className={`${LEAD} text-brand`}>{next.closing}</p>
        </Reveal>
      </div>
    </Section>
  )
}

function TeamFaq() {
  const { team, faq } = sky001
  return (
    <Section className="border-t border-line">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className={H2}>{team.title}</h2>
          <dl className="mt-8 border-t border-line">
            {team.groups.map((g) => (
              <div key={g.label} className="grid grid-cols-[10rem_1fr] gap-4 border-b border-line py-4">
                <dt className={`${LABEL} pt-1 text-muted`}>{g.label}</dt>
                <dd className="text-lg">{g.names}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal>
          <h2 id="faq" className={H2}>
            {faq.title}
          </h2>
          <div className="mt-8 border-t border-line">
            {faq.items.map((item) => (
              <details key={item.q} className="group border-b border-line">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-[17px] font-medium">
                  {item.q}
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="shrink-0 text-brand transition-transform duration-300 group-open:rotate-45">
                    <path d="M6 1v10M1 6h10" />
                  </svg>
                </summary>
                {item.a && <p className={`${BODY} pb-4`}>{item.a}</p>}
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

function Waitlist() {
  const { waitlist, video } = sky001.intro
  return (
    <Section id="waitlist" ground="stage" className="border-b border-stage-line">
      <Reveal className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className={`${LABEL} text-brand-lift`}>{waitlist.title}</span>
          <h2 className="mt-4 max-w-[16ch] text-[34px] leading-[1.04] font-medium tracking-[-0.035em] text-balance sm:text-5xl lg:text-[64px]">{waitlist.body}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#" arrow className="focus-visible:outline-white">
            {waitlist.cta.label}
          </ButtonLink>
          <ButtonLink href={video.href} variant="onDark">
            {video.label}
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  )
}

export function LaunchPage() {
  return (
    <>
      <Nav home="/" links={sky001.nav} cta={sky001.intro.waitlist.cta} />
      <main>
        <Hero />
        <Intro />
        <Contrarian />
        <Pareto />
        <Moment />
        <Stages />
        <Bim />
        <Explore />
        <Why />
        <TeamFaq />
        <Waitlist />
      </main>
      <Footer home="/" note={showcase.disclaimer} />
    </>
  )
}
