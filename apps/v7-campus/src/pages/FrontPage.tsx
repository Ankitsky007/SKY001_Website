import { backers, hero, research, showcase, site, sky001Cta, team } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
import heroClip from '../assets/media/hero.mp4'
import heroPoster from '../assets/media/s-hero.jpg'
import { CampusHero } from '../components/CampusHero'
import { Clip } from '../components/Clip'
import { Footer } from '../components/Footer'
import { HalftoneField } from '../components/HalftoneField'
import { LogoRow } from '../components/LogoRow'
import { Nav } from '../components/Nav'
import type { PixelIconName } from '../components/PixelIcon'
import { Reel } from '../components/Reel'
import { StepCards } from '../components/StepCards'
import { ParetoFigure, ProblemFigure } from '../figures/front'
import { media } from '../lib/media'
import { ButtonLink, CountUp, DISPLAY, Display, GUTTER, H3, IconCell, LABEL, Panel, RuleCol, Section, SquareLabel, TextLink, Window, WRAP } from '../lib/ui'

/** The SKY-001 launch page lives at /sky-001 in this version. */
export const LAUNCH = '/sky-001'
const route = (href: string) => (href === '#sky-001' ? LAUNCH : href)
const COPY = 'text-[17px] leading-[1.25] tracking-[-0.02em] md:text-[19px]'

function ReelBand() {
  return (
    <section className={`bg-studio ${GUTTER} py-6 md:py-10`}>
      <div className={WRAP}>
        <Window title="SKY-001.Output" bodyClassName="bg-studio">
          <div className="px-3 pb-3 md:px-5">
            <Reel models={['jet', 'jaguar', 'arcmate', 'tractor']} className="h-[62svh] min-h-[380px]" />
          </div>
        </Window>
      </div>
    </section>
  )
}

function Mission() {
  return (
    <Section id="research">
      <Reveal>
        <p className={`${DISPLAY} max-w-[19ch] text-[34px] leading-[0.98] normal-case sm:text-[56px] lg:text-[80px] lg:leading-[0.94]`}>
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
      <Display>{research.problem.title}</Display>
      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <Reveal as="div" stagger={0.08} className="grid gap-8 sm:grid-cols-3 lg:gap-6">
          {research.problem.paragraphs.map((p, i) => (
            <RuleCol key={p.slice(0, 24)} label={`[0${i + 1}]`}>
              <p className="text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base">{p}</p>
            </RuleCol>
          ))}
        </Reveal>
        <Reveal>
          <Panel tag="Fig.01" title={research.mission.emphasis.replace('.', '')} caption="A chain of tokens against a connected enterprise.">
            <Window title="Enterprise.Graph">
              <div className="p-3 md:p-5">
                <ProblemFigure />
              </div>
            </Window>
          </Panel>
        </Reveal>
      </div>
    </Section>
  )
}

function Build() {
  return (
    <Section ground="studio">
      <Display>{research.build.title}</Display>
      <Reveal className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-14 lg:gap-12">
        <RuleCol label="[01]">
          <p className={`${COPY} text-[20px] md:text-[26px]`}>{research.build.lead}</p>
        </RuleCol>
        <RuleCol label="[02]">
          <p className={COPY}>{research.build.rest}</p>
        </RuleCol>
      </Reveal>
      <div className="mt-10 lg:mt-14">
        <StepCards />
      </div>
    </Section>
  )
}

function Pareto() {
  return (
    <Section>
      <Display align="left" note={research.pareto.axes.join(' / ')}>
        {research.pareto.title}
      </Display>
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <Panel tag="Pareto.Frontier">
            <Window title="Cost / Speed / Quality" className="mx-auto max-w-[460px]">
              <ParetoFigure />
            </Window>
          </Panel>
        </Reveal>
        <Reveal className="flex">
          <RuleCol label="[01]" className="lg:min-h-full">
            <p className={`${COPY} max-w-[30ch] text-[20px] md:text-[26px]`}>{research.pareto.body}</p>
          </RuleCol>
        </Reveal>
      </div>
    </Section>
  )
}

function Sky001Band() {
  return (
    <Section id="sky-001" ground="blue" field={<HalftoneField tone="blue" fade="up" cell={10} />}>
      <p className="text-center text-[15px] font-medium tracking-[-0.02em] md:text-base">{sky001Cta.eyebrow}</p>
      <Display tone="dark" className="mt-6">
        {sky001Cta.title}
      </Display>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-12">
        <Reveal>
          <Clip src={heroClip} poster={heroPoster} label="SKY-001 output: a V8 engine assembly separating into its major assemblies" hud="SKY-001 output" tone="light" />
        </Reveal>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end">
          <ButtonLink href={route(sky001Cta.primary.href)} tone="light">
            {sky001Cta.primary.label}
          </ButtonLink>
          <TextLink href={sky001Cta.secondary.href} tone="dark">
            {sky001Cta.secondary.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}

const SECTOR_ICONS: PixelIconName[] = ['industrial', 'healthcare', 'chemical', 'enterprise', 'beyond']

function Matters() {
  const m = research.matters
  return (
    <Section>
      <Display align="left">
        {m.statement.before}
        <span className="text-brand">{m.statement.emphasis}</span>
        {m.statement.after}
      </Display>
      <Reveal className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-14 lg:gap-12">
        <RuleCol label="[01]">
          <p className={`${COPY} text-[20px] md:text-[26px]`}>{m.infrastructure}</p>
        </RuleCol>
        <RuleCol label={m.qualities.join(' / ')}>
          <p className={COPY}>{m.body}</p>
        </RuleCol>
      </Reveal>
      <ul className="mt-10 grid grid-cols-2 border-t border-l border-line md:grid-cols-5 lg:mt-14">
        {m.sectors.map((sector, i) => (
          <IconCell key={sector} icon={SECTOR_ICONS[i]} className="min-h-40 last:col-span-2 md:min-h-52 md:last:col-span-1">
            <span className={`${LABEL} block text-faint`}>[0{i + 1}]</span>
            <span className={`${H3} mt-1 block`}>{sector}</span>
          </IconCell>
        ))}
      </ul>
      <ul className="grid grid-cols-2 border-l border-line lg:grid-cols-4">
        {showcase.models.map((model) => (
          <li key={model.id} className="border-r border-b border-line bg-studio">
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
    <Section id="team" className="border-t border-line">
      <Display>{team.title}</Display>
      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <Reveal className="grid gap-8">
          <RuleCol label="[01]">
            <p className="text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base">{team.story}</p>
          </RuleCol>
          <RuleCol label="[02]">
            <p className="text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base">{team.experience}</p>
          </RuleCol>
        </Reveal>
        <Reveal as="ul" stagger={0.08} className="grid grid-cols-3 gap-2 self-start md:gap-3">
          {team.founders.map((f) => (
            <li key={f.name}>
              <Window title={f.note}>
                <img src={f.photo} alt={f.name} loading="lazy" className="aspect-[4/5] w-full bg-studio object-cover" />
              </Window>
              <h3 className="mt-3 text-[15px] leading-tight font-medium tracking-[-0.04em] sm:text-xl">{f.name}</h3>
            </li>
          ))}
        </Reveal>
      </div>
      <dl className="mt-12 grid grid-cols-3 gap-4 lg:mt-20 lg:gap-12">
        {team.stats.map((s) => (
          <RuleCol key={s.label} label={<dt>{s.label}</dt>}>
            <dd className={`${DISPLAY} text-[52px] leading-[0.85] text-brand sm:text-[96px] lg:text-[150px]`}>
              <CountUp value={s.value} />
            </dd>
          </RuleCol>
        ))}
      </dl>
      <Reveal className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <RuleCol label="[03]">
          <p className="text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base">{team.researchTeam}</p>
        </RuleCol>
        <LogoRow names={team.experienceFrom} />
      </Reveal>
      <div id="careers" className="mt-8">
        <TextLink href={team.careersCta.href}>{team.careersCta.label}</TextLink>
      </div>
    </Section>
  )
}

function Backers() {
  return (
    <Section ground="studio">
      <Display size="md">{backers.title}</Display>
      <Reveal as="ul" stagger={0.06} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:mt-14 lg:grid-cols-4 lg:gap-x-12">
        {backers.investors.map((name, i) => (
          <li key={name}>
            <RuleCol label={`[0${i + 1}]`}>
              <span className={`${DISPLAY} block text-[26px] leading-[0.95] sm:text-[40px]`}>{name}</span>
            </RuleCol>
          </li>
        ))}
      </Reveal>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14">
        {backers.advisors.map((a) => (
          <li key={a.name}>
            <Window title={a.affiliations.join(' / ')}>
              <div className="flex items-center justify-between gap-4 p-4">
                <h3 className={H3}>{a.name}</h3>
                <a href={a.x} aria-label={`${a.name} on X`} className={`${LABEL} inline-flex size-11 items-center justify-center border border-ink text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white`}>
                  X
                </a>
              </div>
            </Window>
          </li>
        ))}
      </ul>
      <SquareLabel className="mt-6">{showcase.disclaimer}</SquareLabel>
    </Section>
  )
}

export function FrontPage() {
  const tabs = [{ label: 'Home', href: '#top', current: true }, ...site.nav.map((n) => ({ label: n.label, href: route(n.href) }))]
  return (
    <>
      <Nav home="/" tabs={tabs} cta={{ label: hero.primaryCta.label, href: LAUNCH }} />
      <main>
        <CampusHero launchHref={LAUNCH} />
        <ReelBand />
        <Mission />
        <Problem />
        <Build />
        <Pareto />
        <Sky001Band />
        <Matters />
        <Team />
        <Backers />
      </main>
      <Footer pages={site.nav.map((n) => ({ ...n, href: route(n.href) }))} />
    </>
  )
}
