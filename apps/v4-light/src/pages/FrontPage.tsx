import { backers, hero, research, showcase, site, sky001Cta, team } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
import heroClip from '../assets/media/hero.mp4'
import heroPoster from '../assets/media/s-hero.jpg'
import { Clip } from '../components/Clip'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { Reel } from '../components/Reel'
import { ParetoFigure, ProblemFigure, StepGlyph } from '../figures/front'
import { media } from '../lib/media'
import { BODY, ButtonLink, CountUp, GUTTER, H1, H2, H3, LABEL, LEAD, Section, Tag, TextLink, WRAP } from '../lib/ui'

/** The SKY-001 launch page lives at /sky-001 in this version. */
export const LAUNCH = '/sky-001'
const route = (href: string) => (href === '#sky-001' ? LAUNCH : href)

function Hero() {
  return (
    <section className={`flex min-h-[calc(100svh-3.5rem)] flex-col bg-studio ${GUTTER} pt-8 pb-5 sm:pt-12 lg:min-h-[calc(100svh-4rem)]`}>
      <div className={`${WRAP} flex min-h-0 flex-1 flex-col`}>
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-12">
          <h1 className={H1}>{hero.title}</h1>
          <div>
            <p className={`${BODY} max-w-[38ch]`}>{hero.lede}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1">
              <ButtonLink href={route(hero.primaryCta.href)} arrow>
                {hero.primaryCta.label}
              </ButtonLink>
              <TextLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</TextLink>
            </div>
          </div>
        </div>
        <Reel models={['jet']} className="mt-4 min-h-[52svh] flex-1 lg:min-h-[58svh]" />
      </div>
    </section>
  )
}

function Mission() {
  return (
    <Section id="research">
      <Reveal>
        <Tag>Research</Tag>
        <p className="mt-5 max-w-[22ch] text-[30px] leading-[1.1] font-medium tracking-[-0.03em] text-balance sm:text-5xl lg:text-[60px]">
          {research.mission.before}
          <span className="text-brand">{research.mission.emphasis}</span>
        </p>
      </Reveal>
    </Section>
  )
}

function Problem() {
  return (
    <Section className="border-t border-line">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <h2 className={H2}>{research.problem.title}</h2>
          <div className="mt-6 space-y-4">
            {research.problem.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className={BODY}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal className="rounded-3xl bg-studio p-4 sm:p-8">
          <ProblemFigure />
        </Reveal>
      </div>
    </Section>
  )
}

function Build() {
  return (
    <Section ground="studio">
      <Reveal className="grid gap-6 lg:grid-cols-2 lg:gap-16">
        <h2 className={H2}>{research.build.title}</h2>
        <div>
          <p className={`${LEAD} text-ink`}>{research.build.lead}</p>
          <p className={`${BODY} mt-4`}>{research.build.rest}</p>
        </div>
      </Reveal>
      <Reveal as="ol" stagger={0.08} className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {research.build.steps.map((s, i) => (
          <li key={s.key} className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <StepGlyph step={s.key} />
              <span className={`${LABEL} text-faint`}>0{i + 1}</span>
            </div>
            <h3 className={`${H3} mt-6`}>{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}

function Pareto() {
  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="order-2 mx-auto w-full max-w-[520px] lg:order-1">
          <ParetoFigure />
        </Reveal>
        <Reveal className="lg:order-2">
          <h2 className={H2}>{research.pareto.title}</h2>
          <p className={`${BODY} mt-5 max-w-[52ch]`}>{research.pareto.body}</p>
        </Reveal>
      </div>
    </Section>
  )
}

function Sky001Band() {
  return (
    <Section id="sky-001" ground="stage">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-14">
        <Reveal>
          <span className={`${LABEL} text-brand-lift`}>{sky001Cta.eyebrow}</span>
          <h2 className={`${H2} mt-4`}>{sky001Cta.title}</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href={route(sky001Cta.primary.href)} arrow className="focus-visible:outline-white">
              {sky001Cta.primary.label}
            </ButtonLink>
            <ButtonLink href={sky001Cta.secondary.href} variant="onDark">
              {sky001Cta.secondary.label}
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal>
          <Clip src={heroClip} poster={heroPoster} label="SKY-001 output: a V8 engine assembly separating into its major assemblies" hud="SKY-001 output" />
        </Reveal>
      </div>
    </Section>
  )
}

function Matters() {
  const m = research.matters
  return (
    <Section>
      <Reveal>
        <p className="max-w-[24ch] text-[28px] leading-[1.12] font-medium tracking-[-0.03em] text-balance sm:text-4xl lg:text-[52px]">
          {m.statement.before}
          <span className="text-brand">{m.statement.emphasis}</span>
          {m.statement.after}
        </p>
      </Reveal>
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className={`${LEAD} text-ink`}>{m.infrastructure}</p>
          <p className={`${BODY} mt-4`}>{m.body}</p>
        </Reveal>
        <Reveal className="grid gap-6 sm:grid-cols-2">
          {[m.sectors, m.qualities].map((list) => (
            <ul key={list[0]} className="border-t border-line">
              {list.map((item) => (
                <li key={item} className="flex min-h-11 items-center border-b border-line text-[15px]">
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </Reveal>
      </div>
      <Reveal as="ul" stagger={0.06} className="mt-10 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4 lg:gap-4">
        {showcase.models.map((model) => (
          <li key={model.id} className="overflow-hidden rounded-2xl bg-studio">
            <img src={media.final(model.id)} alt={`${model.title}, SKY-001 output`} loading="lazy" className="aspect-[8/5] w-full object-contain" />
            <p className={`${LABEL} px-3 pb-3 text-muted`}>
              <span className="text-ink">{model.kind}</span> · {model.leaves} parts
            </p>
          </li>
        ))}
      </Reveal>
    </Section>
  )
}

function Team() {
  return (
    <Section id="team" className="border-t border-line">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <Reveal>
          <h2 className={H2}>{team.title}</h2>
          <p className={`${BODY} mt-5`}>{team.story}</p>
          <p className={`${BODY} mt-4`}>{team.experience}</p>
        </Reveal>
        <Reveal as="ul" stagger={0.08} className="grid grid-cols-3 gap-3 sm:gap-5">
          {team.founders.map((f) => (
            <li key={f.name}>
              <img src={f.photo} alt={f.name} loading="lazy" className="aspect-[4/5] w-full rounded-2xl bg-studio object-cover" />
              <h3 className="mt-3 text-[15px] leading-tight font-medium sm:text-lg">{f.name}</h3>
              <p className="mt-1 text-[13px] leading-snug text-muted sm:text-sm">{f.note}</p>
            </li>
          ))}
        </Reveal>
      </div>
      <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8 lg:mt-16">
        {team.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-1">
            <dt className="text-[13px] leading-snug text-muted sm:text-[15px]">{s.label}</dt>
            <dd className="text-4xl font-medium tracking-[-0.04em] text-brand sm:text-6xl lg:text-7xl">
              <CountUp value={s.value} />
            </dd>
          </div>
        ))}
      </dl>
      <Reveal className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <p className={BODY}>{team.researchTeam}</p>
        <ul className="flex flex-wrap gap-2">
          {team.experienceFrom.map((org) => (
            <li key={org} className="inline-flex min-h-9 items-center rounded-full border border-line px-4 text-sm">
              {org}
            </li>
          ))}
        </ul>
      </Reveal>
      <div id="careers" className="mt-8">
        <ButtonLink href={team.careersCta.href} variant="outline" arrow>
          {team.careersCta.label}
        </ButtonLink>
      </div>
    </Section>
  )
}

function Backers() {
  return (
    <Section ground="studio">
      <Reveal>
        <h2 className={`${H2} max-w-[24ch]`}>{backers.title}</h2>
      </Reveal>
      <Reveal as="ul" stagger={0.06} className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {backers.investors.map((name) => (
          <li key={name} className="flex min-h-24 items-center justify-center rounded-2xl border border-line bg-paper px-4 text-center text-lg font-medium tracking-[-0.01em] sm:text-xl">
            {name}
          </li>
        ))}
      </Reveal>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:gap-4">
        {backers.advisors.map((a) => (
          <li key={a.name} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-5">
            <div>
              <h3 className={H3}>{a.name}</h3>
              <p className={`${LABEL} mt-1 text-muted`}>{a.affiliations.join(' · ')}</p>
            </div>
            <a href={a.x} aria-label={`${a.name} on X`} className="inline-flex size-11 items-center justify-center rounded-full border border-line text-sm font-medium hover:border-brand hover:text-brand">
              X
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function FrontPage() {
  return (
    <>
      <Nav home="/" links={site.nav.map((n) => ({ ...n, href: route(n.href) }))} cta={{ label: hero.primaryCta.label, href: LAUNCH }} />
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
      <Footer home="/" note={showcase.disclaimer} />
    </>
  )
}
