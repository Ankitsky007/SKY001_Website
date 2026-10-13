import { backers, hero, research, showcase, site, sky001Cta, team } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
import heroClip from '../assets/media/hero.mp4'
import heroPoster from '../assets/media/s-hero.jpg'
import { Clip } from '../components/Clip'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import type { PixelIconName } from '../components/PixelIcon'
import { Reel } from '../components/Reel'
import { StepCards } from '../components/StepCards'
import { ParetoFigure, ProblemFigure } from '../figures/front'
import { media } from '../lib/media'
import { Accent, BODY, ButtonLink, Corners, CountUp, FigCaption, GUTTER, H1, H3, IconCell, LABEL, LEAD, Section, SlashHeading, SquareLabel, TextLink, WRAP } from '../lib/ui'

/** The SKY-001 launch page lives at /sky-001 in this version. */
export const LAUNCH = '/sky-001'
const route = (href: string) => (href === '#sky-001' ? LAUNCH : href)
const TOTAL = 8
const eb = (index: number, label: string) => ({ index, total: TOTAL, label })

/** Split copy around an accent phrase so it can be set as a blue bracket word: [before, phrase, after]. */
function splitAccent(text: string, phrase: string): [string, string, string] {
  const i = text.indexOf(phrase)
  return i < 0 ? [text, '', ''] : [text.slice(0, i), phrase, text.slice(i + phrase.length)]
}

function Hero() {
  const [before, accent, after] = splitAccent(hero.title, 'Post-Monolithic')
  return (
    <section id="top" className={`flex min-h-[calc(100svh-4rem)] flex-col bg-studio ${GUTTER} pt-8 pb-5 md:min-h-svh md:pt-24`}>
      <div className={`${WRAP} flex min-h-0 flex-1 flex-col`}>
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-12">
          <h1 className={H1}>
            {before}
            {accent && <Accent>{accent}</Accent>}
            {after}
          </h1>
          <div>
            <p className={`${BODY} max-w-[38ch]`}>{hero.lede}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <ButtonLink href={route(hero.primaryCta.href)}>{hero.primaryCta.label}</ButtonLink>
              <TextLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</TextLink>
            </div>
          </div>
        </div>
        <Reel models={['jet']} className="mt-4 min-h-[50svh] flex-1 lg:min-h-[56svh]" />
      </div>
    </section>
  )
}

function Mission() {
  return (
    <Section id="research" eyebrow={eb(1, 'Research')}>
      <Reveal>
        <p className="max-w-[22ch] text-[30px] leading-[1.1] tracking-[-0.055em] text-balance sm:text-5xl lg:text-[60px]">
          {research.mission.before}
          <Accent wrap>{research.mission.emphasis}</Accent>
        </p>
      </Reveal>
    </Section>
  )
}

function Problem() {
  return (
    <Section eyebrow={eb(2, 'The problem')} className="border-t border-line">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SlashHeading>{research.problem.title}</SlashHeading>
          <Reveal className="mt-6 space-y-4">
            {research.problem.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className={BODY}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
        <Reveal>
          <div className="dots relative border border-line p-4 sm:p-8">
            <Corners />
            <ProblemFigure />
          </div>
          <FigCaption className="mt-3">Fig. 01 / A chain of tokens against a connected enterprise</FigCaption>
        </Reveal>
      </div>
    </Section>
  )
}

function Build() {
  return (
    <Section eyebrow={eb(3, 'What we build')} ground="studio">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
        <SlashHeading>{research.build.title}</SlashHeading>
        <Reveal>
          <p className={LEAD}>{research.build.lead}</p>
          <p className={`${BODY} mt-4`}>{research.build.rest}</p>
        </Reveal>
      </div>
      <div className="mt-10 lg:mt-14">
        <StepCards />
      </div>
    </Section>
  )
}

function Pareto() {
  return (
    <Section eyebrow={eb(4, 'Pareto frontier')}>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="dots relative mx-auto w-full max-w-[560px] border border-line p-4">
            <Corners />
            <ParetoFigure />
          </div>
        </Reveal>
        <div className="lg:order-2">
          <SlashHeading>{research.pareto.title}</SlashHeading>
          <Reveal>
            <p className={`${BODY} mt-5 max-w-[52ch]`}>{research.pareto.body}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {research.pareto.axes.map((a) => (
                <li key={a}>
                  <SquareLabel className="text-ink">{a}</SquareLabel>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

function Sky001Band() {
  return (
    <Section id="sky-001" ground="night" eyebrow={eb(5, sky001Cta.eyebrow)}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-14">
        <div>
          <SlashHeading tone="dark">{sky001Cta.title}</SlashHeading>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <ButtonLink href={route(sky001Cta.primary.href)} tone="light">
              {sky001Cta.primary.label}
            </ButtonLink>
            <TextLink href={sky001Cta.secondary.href} tone="dark">
              {sky001Cta.secondary.label}
            </TextLink>
          </div>
        </div>
        <Reveal>
          <Clip src={heroClip} poster={heroPoster} label="SKY-001 output: a V8 engine assembly separating into its major assemblies" hud="SKY-001 output" />
        </Reveal>
      </div>
    </Section>
  )
}

const SECTOR_ICONS: PixelIconName[] = ['industrial', 'healthcare', 'chemical', 'enterprise', 'beyond']

function Matters() {
  const m = research.matters
  return (
    <Section eyebrow={eb(6, 'Why it matters')}>
      <Reveal>
        <p className="max-w-[24ch] text-[28px] leading-[1.12] tracking-[-0.055em] text-balance sm:text-4xl lg:text-[52px]">
          {m.statement.before}
          <Accent>{m.statement.emphasis}</Accent>
          {m.statement.after}
        </p>
      </Reveal>
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className={LEAD}>{m.infrastructure}</p>
        </Reveal>
        <Reveal>
          <p className={BODY}>{m.body}</p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {m.qualities.map((q) => (
              <li key={q}>
                <SquareLabel className="text-ink">{q}</SquareLabel>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <ul className="mt-10 grid grid-cols-2 border-t border-l border-line md:grid-cols-5 lg:mt-14">
        {m.sectors.map((sector, i) => (
          <IconCell key={sector} icon={SECTOR_ICONS[i]} className="min-h-40 last:col-span-2 md:min-h-52 md:last:col-span-1">
            <span className={`${LABEL} block text-faint`}>// 00{i + 1}</span>
            <span className={`${H3} mt-1 block`}>{sector}</span>
          </IconCell>
        ))}
      </ul>
      <ul className="grid grid-cols-2 border-l border-line lg:grid-cols-4">
        {showcase.models.map((model) => (
          <li key={model.id} className="relative border-r border-b border-line bg-studio">
            <img src={media.final(model.id)} alt={`${model.title}, SKY-001 output`} loading="lazy" className="aspect-[8/5] w-full object-contain" />
            <p className={`${LABEL} border-t border-line bg-paper px-3 py-2.5 text-muted`}>
              <span className="text-ink">{model.kind}</span> <span className="text-faint">/</span> {model.leaves} parts
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Team() {
  return (
    <Section id="team" eyebrow={eb(7, 'Team')} className="border-t border-line">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <SlashHeading>{team.title}</SlashHeading>
          <Reveal>
            <p className={`${BODY} mt-5`}>{team.story}</p>
            <p className={`${BODY} mt-4`}>{team.experience}</p>
          </Reveal>
        </div>
        <Reveal as="ul" stagger={0.08} className="grid grid-cols-3 border-t border-l border-line self-start">
          {team.founders.map((f, i) => (
            <li key={f.name} className="border-r border-b border-line">
              <img src={f.photo} alt={f.name} loading="lazy" className="aspect-[4/5] w-full bg-studio object-cover" />
              <div className="border-t border-line p-3 md:p-4">
                <span className={`${LABEL} block text-faint`}>// 00{i + 1}</span>
                <h3 className="mt-1 text-[15px] leading-tight font-medium tracking-[-0.04em] sm:text-xl">{f.name}</h3>
                <p className="mt-1 text-[13px] leading-snug text-muted sm:text-sm">{f.note}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
      <dl className="mt-12 grid grid-cols-3 border-t border-l border-line lg:mt-16">
        {team.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-2 border-r border-b border-line p-4 md:p-6">
            <dt className={`${LABEL} text-muted`}>{s.label}</dt>
            <dd className="text-5xl tracking-[-0.06em] text-brand sm:text-7xl lg:text-[88px]">
              <CountUp value={s.value} />
            </dd>
          </div>
        ))}
      </dl>
      <Reveal className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <p className={BODY}>{team.researchTeam}</p>
        <ul className="flex flex-wrap content-start gap-2">
          {team.experienceFrom.map((org) => (
            <li key={org} className={`${LABEL} inline-flex h-9 items-center border border-line px-3 text-ink`}>
              {org}
            </li>
          ))}
        </ul>
      </Reveal>
      <div id="careers" className="mt-8">
        <TextLink href={team.careersCta.href}>{team.careersCta.label}</TextLink>
      </div>
    </Section>
  )
}

function Backers() {
  return (
    <Section eyebrow={eb(8, 'Backers')} ground="studio">
      <SlashHeading className="max-w-[24ch]">{backers.title}</SlashHeading>
      <Reveal as="ul" stagger={0.06} className="mt-10 grid grid-cols-2 border-t border-l border-line lg:grid-cols-4">
        {backers.investors.map((name) => (
          <li key={name} className="flex min-h-28 items-center justify-center border-r border-b border-line bg-paper px-4 text-center text-xl font-medium tracking-[-0.05em] sm:text-2xl">
            {name}
          </li>
        ))}
      </Reveal>
      <ul className="grid border-l border-line sm:grid-cols-2">
        {backers.advisors.map((a) => (
          <li key={a.name} className="flex items-center justify-between gap-4 border-r border-b border-line bg-paper p-5">
            <div>
              <h3 className={H3}>{a.name}</h3>
              <p className={`${LABEL} mt-1.5 text-muted`}>{a.affiliations.join(' / ')}</p>
            </div>
            <a href={a.x} aria-label={`${a.name} on X`} className={`${LABEL} inline-flex size-11 items-center justify-center border border-ink text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white`}>
              X
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function FrontPage() {
  const tabs = [{ label: 'Home', href: '#top', current: true }, ...site.nav.map((n) => ({ label: n.label, href: route(n.href) }))]
  return (
    <>
      <Nav home="/" tabs={tabs} cta={{ label: hero.primaryCta.label, href: LAUNCH }} />
      <main>
        <Hero />
        <Mission />
        <Problem />
        <Build />
        <Pareto />
        <Sky001Band />
        <Matters />
        <Team />
        <Backers />
      </main>
      <Footer pages={site.nav.map((n) => ({ ...n, href: route(n.href) }))} note={showcase.disclaimer} />
    </>
  )
}
