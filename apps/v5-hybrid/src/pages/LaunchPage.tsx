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
import type { PixelIconName } from '../components/PixelIcon'
import { Reel } from '../components/Reel'
import { StageScrub } from '../components/StageScrub'
import { media, type ModelId } from '../lib/media'
import { Accent, BODY, ButtonLink, Corners, CountUp, Eyebrow, FigCaption, GUTTER, H1, H3, IconCell, LABEL, LEAD, Section, SlashHeading, SquareLabel, TextLink, WRAP } from '../lib/ui'

const MODELS = showcase.models.map((m) => m.id) as ModelId[]
const money = (n: number) => `$${n < 0.01 ? n.toFixed(3) : n.toFixed(2)}`
const secs = (n: number) => `${n.toLocaleString('en-US')} s`
const TOTAL = 12
const eb = (index: number, label: string) => ({ index, total: TOTAL, label })

function Hero() {
  const { news, hero } = sky001
  const cut = hero.title.indexOf('Engineered World')
  return (
    <section id="top" className={`flex min-h-[calc(100svh-4rem)] flex-col bg-studio ${GUTTER} pt-6 pb-5 md:min-h-svh md:pt-24`}>
      <div className={`${WRAP} flex min-h-0 flex-1 flex-col`}>
        <a href={news.cta.href} target="_blank" rel="noreferrer" className="group flex min-h-11 flex-wrap items-center gap-x-3 gap-y-0.5 self-start border border-ink bg-paper px-3 py-1.5 font-mono text-[11px] tracking-[-0.02em] transition-colors hover:border-brand sm:text-xs">
          <span className="flex items-center gap-2 text-brand uppercase">
            <span aria-hidden="true" className="block size-2 bg-brand" />
            {news.label} / {news.date}
          </span>
          <span className="text-ink">{news.title}</span>
          <span className="text-muted underline underline-offset-2 group-hover:text-brand">{news.cta.label} ↗</span>
        </a>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-12">
          <h1 className={H1}>
            {hero.title.slice(0, cut)}
            <Accent>{hero.title.slice(cut)}</Accent>
          </h1>
          <div>
            <p className={`${BODY} max-w-[40ch]`}>{hero.lede}</p>
            <SquareLabel className="mt-3 text-brand">{hero.note}</SquareLabel>
          </div>
        </div>
        <Reel models={MODELS} className="mt-3 min-h-[46svh] flex-1 lg:min-h-[52svh]" />
      </div>
    </section>
  )
}

function Intro() {
  const { intro } = sky001
  return (
    <Section id="intro" eyebrow={eb(1, 'Introducing')}>
      <Reveal className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-[32px] leading-[1.08] tracking-[-0.055em] text-balance sm:text-5xl lg:text-[60px]">
            {/* Non-breaking hyphen keeps "SKY-001" on one line. */}
            {intro.before.replace('SKY-001', 'SKY‑001')}
            <span className="text-brand">{intro.emphasis}</span>
          </h2>
          <p className="mt-6 max-w-[26ch] text-2xl leading-[1.15] tracking-[-0.05em] text-balance text-muted sm:text-3xl lg:text-4xl">{intro.statement}</p>
        </div>
        <div className="dots relative self-end border border-line p-6 md:p-8">
          <Corners />
          <SquareLabel className="text-brand">{intro.waitlist.title}</SquareLabel>
          <p className={`${LEAD} mt-3`}>{intro.waitlist.body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <ButtonLink href={intro.waitlist.cta.href}>{intro.waitlist.cta.label}</ButtonLink>
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
    <Section eyebrow={eb(2, 'Approach')} className="border-t border-line">
      <SlashHeading className="max-w-[20ch]">{contrarian.title}</SlashHeading>
      <Reveal as="ul" stagger={0.08} className="mt-10 grid border-t border-l border-line md:grid-cols-3 lg:mt-14">
        {contrarian.points.map((p, i) => (
          <li key={p.title} className="flex flex-col border-r border-b border-line">
            <div className="relative bg-studio">
              <Corners />
              <img src={POINT_MEDIA[i].src} alt={POINT_MEDIA[i].alt} loading="lazy" className="aspect-[8/5] w-full object-contain" />
            </div>
            <div className="flex-1 border-t border-line p-5 md:p-6">
              <span className="text-base tracking-[-0.04em] text-brand md:text-[22px]">// 00{i + 1}</span>
              <h3 className={`${H3} mt-3`}>{p.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.45] text-body">{p.body}</p>
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
    <Section id="results" eyebrow={eb(3, 'Results')} className="border-t border-line">
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-16">
        <SlashHeading>{sky001.pareto.title}</SlashHeading>
        <Reveal className="self-end">
          <p className={`${LEAD} text-body`}>{sky001.pareto.body}</p>
        </Reveal>
      </div>

      <div className="mt-10 lg:mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border border-b-0 border-line bg-studio px-4 py-3 md:px-5">
          <h3 className="text-lg font-medium tracking-[-0.04em] md:text-xl">
            <span className="mr-2 text-brand">// 001</span>
            {cad.title}
          </h3>
          <span className={`${LABEL} text-muted`}>{cad.cases}</span>
        </div>
        <div className="grid border-t border-l border-line lg:grid-cols-3">
          <BarPanel title="IoU" hint="Higher is better" rows={iou} max={100} ticks={['0%', '50%', '100%']} />
          <BarPanel title="Time per sample" hint="Lower is better" rows={time} max={1300} ticks={['0 s', '650 s', '1,300 s']} />
          <BarPanel title="Cost per sample" hint="Lower is better" rows={cost} max={0.8} ticks={['$0', '$0.40', '$0.80']} />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border border-b-0 border-line bg-studio px-4 py-3 md:px-5">
          <h3 className="text-lg font-medium tracking-[-0.04em] md:text-xl">
            <span className="mr-2 text-brand">// 002</span>
            {bim.title}
          </h3>
          <span className={`${LABEL} text-muted`}>{bim.cases}</span>
        </div>
        <div className="grid border-t border-l border-line">
          <BarPanel title="Time per sample" hint="Lower is better" rows={bimTime} max={600} ticks={['0 s', '300 s', '600 s']} />
        </div>
      </div>

      <ul className="mt-5 space-y-1">
        {[...cad.notes, ...bim.notes, `Bar lengths use linear scales. Source: ${benchmarks.source}.`].map((n) => (
          <li key={n}>
            <FigCaption className="normal-case">{n}</FigCaption>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Moment() {
  const { moment } = sky001
  return (
    <Section eyebrow={eb(4, moment.eyebrow)} ground="studio">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
        <SlashHeading>
          {moment.before}
          <span className="text-brand">{moment.emphasis}</span>
          {moment.after}
        </SlashHeading>
        <Reveal className="self-end">
          <p className={BODY}>{moment.body}</p>
        </Reveal>
      </div>
      <div className="mt-10 lg:mt-14">
        <h3>
          <SquareLabel>{moment.versus}</SquareLabel>
        </h3>
        <dl className="mt-4 grid border-t border-l border-line md:grid-cols-3">
          {benchmarks.headline.map((h, i) => (
            <div key={h.detail} className="relative flex flex-col-reverse border-r border-b border-line bg-paper p-5 md:p-6">
              <dt>
                <span className={`${H3} block`}>{h.label}</span>
                <span className={`${LABEL} mt-1.5 block text-muted`}>{h.detail}</span>
              </dt>
              <dd className="text-7xl tracking-[-0.06em] text-brand sm:text-[88px] lg:text-[104px]">
                <CountUp value={h.value} />
              </dd>
              <span className={`${LABEL} absolute top-5 right-5 text-faint`}>// 00{i + 1}</span>
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
      <div className={`${GUTTER} pt-14 pb-8 md:pt-20 lg:pt-24`}>
        <div className={WRAP}>
          <Eyebrow {...eb(5, 'Step by step')} />
          <SlashHeading id="how-title" className="mt-8 max-w-[22ch] md:mt-12">
            {sky001.stages.title}
          </SlashHeading>
        </div>
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
    <Section id="bim" ground="night" eyebrow={eb(6, 'BIM')}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-end lg:gap-14">
        <div>
          <SlashHeading tone="dark">{benchmarks.bim.title}</SlashHeading>
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-7xl tracking-[-0.06em] text-brand-lift sm:text-[88px]">{bimHeadline.value}</span>
            <span className={H3}>{bimHeadline.label}</span>
          </p>
          <p className={`${LABEL} mt-2 text-night-text`}>{bimHeadline.detail}</p>
        </div>
        <Reveal>
          <Clip src={towerClip} poster={towerPoster} label="SKY-001 output: a 36-level tower built level by level" hud="BIM / 36 levels" />
        </Reveal>
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
    <Section id="explore" eyebrow={eb(7, explore.eyebrow)}>
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-16">
        <SlashHeading>{explore.title}</SlashHeading>
        <Reveal className="self-end">
          <p className={`${LEAD} text-body`}>{explore.body}</p>
        </Reveal>
      </div>
      <div className="mt-10 lg:mt-14">
        <ExplorerGrid />
      </div>
    </Section>
  )
}

const WHY_ICONS: PixelIconName[] = ['simulate', 'chemical', 'learn', 'plan']

function Why() {
  const { why } = sky001
  return (
    <Section eyebrow={eb(8, 'Why world models')} ground="studio">
      <SlashHeading>{why.title}</SlashHeading>
      <ol className="mt-8 grid border-t border-l border-line bg-paper sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {why.items.map((item, i) => (
          <IconCell key={item.title} icon={WHY_ICONS[i]} className="min-h-52">
            <span className={`${LABEL} block text-brand`}>// 00{i + 1}</span>
            <span className={`${H3} mt-1 block`}>{item.title}</span>
            {item.note && <span className="mt-1 block text-[15px] text-muted">{item.note}</span>}
          </IconCell>
        ))}
      </ol>
    </Section>
  )
}

function Next() {
  const { next } = sky001
  return (
    <Section eyebrow={eb(9, 'What comes next')}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <SlashHeading>{next.title}</SlashHeading>
          <Reveal>
            <p className={`${BODY} mt-5`}>{next.body}</p>
          </Reveal>
        </div>
        <Reveal className="flex flex-col justify-between gap-8">
          <ul className="border-t border-line">
            {next.domains.map((d, i) => (
              <li key={d} className="flex min-h-11 items-center gap-3 border-b border-line text-[17px] tracking-[-0.03em]">
                <span className={`${LABEL} w-8 text-faint`}>0{i + 1}</span>
                {d}
                <span aria-hidden="true" className="flex-1 border-t border-dashed border-slash" />
                <span aria-hidden="true" className="block size-2 bg-brand" />
              </li>
            ))}
          </ul>
          <p className={`${LEAD} text-brand`}>{next.closing}</p>
        </Reveal>
      </div>
    </Section>
  )
}

function Team() {
  const { team } = sky001
  return (
    <Section eyebrow={eb(10, 'Team')} className="border-t border-line">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <SlashHeading>{team.title}</SlashHeading>
        <Reveal>
          <dl className="border-t border-line">
          {team.groups.map((g) => (
            <div key={g.label} className="flex min-h-14 items-center gap-3 border-b border-line py-3">
              <dt className={`${LABEL} shrink-0 text-muted`}>{g.label}</dt>
              <span aria-hidden="true" className="flex-1 border-t border-dashed border-slash" />
              <dd className="text-right text-lg tracking-[-0.04em]">{g.names}</dd>
            </div>
          ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}

function Faq() {
  const { faq } = sky001
  return (
    <Section id="faq" eyebrow={eb(11, 'FAQ')} ground="studio">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <SlashHeading>{faq.title}</SlashHeading>
        <div className="border-t border-line bg-paper">
          {faq.items.map((item, i) => (
            <details key={item.q} className="group border-x border-b border-line open:border-y-brand open:dots">
              <summary className="flex min-h-16 cursor-pointer items-center gap-4 px-4 py-3 text-[17px] font-medium tracking-[-0.04em] group-open:text-brand md:px-5 md:text-xl">
                <span className={`${LABEL} hidden w-8 text-faint sm:block`}>0{i + 1}</span>
                <span className="flex-1">{item.q}</span>
                <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center bg-ink text-white transition-colors duration-300 group-open:bg-brand">
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-300 group-open:rotate-45">
                    <path d="M6 1v10M1 6h10" />
                  </svg>
                </span>
              </summary>
              {item.a && <p className={`${BODY} px-4 pb-5 sm:pl-[4.25rem] md:px-5`}>{item.a}</p>}
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Waitlist() {
  const { waitlist, video } = sky001.intro
  return (
    <Section id="waitlist" ground="night" eyebrow={eb(12, waitlist.title)}>
      <Reveal className="relative bg-paper p-8 text-ink md:p-14">
        <Corners />
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className={`${H1} max-w-[16ch]`}>{waitlist.body}</h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ButtonLink href="#">{waitlist.cta.label}</ButtonLink>
            <TextLink href={video.href}>{video.label}</TextLink>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

export function LaunchPage() {
  return (
    <>
      <Nav home="/" tabs={[{ label: 'SKY-001', href: '#top', current: true }, ...sky001.nav]} cta={sky001.intro.waitlist.cta} />
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
        <Next />
        <Team />
        <Faq />
        <Waitlist />
      </main>
      <Footer pages={[{ label: 'Skyfall AI', href: '/' }, ...sky001.nav]} note={showcase.disclaimer} />
    </>
  )
}
