import { backers, hero, research, sky001Cta, team } from '@skyfall/core/v8'
import { gsap, Reveal, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useRef } from 'react'
import heroClip from '../assets/media/hero.mp4'
import heroPoster from '../assets/media/s-hero.jpg'
import { HeroGrid } from '../components/HeroGrid'
import { Clip } from '../components/Clip'
import { Footer } from '../components/Footer'
import { HalftoneField } from '../components/HalftoneField'
import { LineGrid } from '../components/LineGrid'
import { LogoRow } from '../components/LogoRow'
import { Nav } from '../components/Nav'
import { PixelIcon, type PixelIconName } from '../components/PixelIcon'
import { Reel } from '../components/Reel'
import { StepCards } from '../components/StepCards'
import { ParetoFigure } from '../figures/front'
import { footerPages, navTabs } from '../lib/nav'
import { SECTOR_TONES } from '../lib/pixelIcons'
import { HOME, LAUNCH, RESEARCH } from '../lib/routes'
import { ButtonLink, CountUp, DISPLAY, Display, GUTTER, H1, H3, IconCell, LABEL, Panel, RuleCol, Section, TextLink, Window, WRAP } from '../lib/ui'

const route = (href: string) => (href === '#sky-001' ? LAUNCH : href === '#research' ? RESEARCH : href)
const COPY = 'text-[17px] leading-[1.25] tracking-[-0.02em] md:text-[19px]'

// The SKY-001 output reel under the hero is hidden for now (Ankit, 2026-10-14); flip to bring it back.
const SHOW_REEL = false
// The SKY-001 band is hidden too: the content doc's front page does not introduce SKY-001 (Ankit, 2026-10-14).
const SHOW_SKY001 = false

/**
 * Front-page hero: the Grid cells field behind the headline and buttons, centred and set large, as
 * on the SKY-001 page (Ankit, 2026-10-18). The copy sits in the middle of the first screen.
 */
function Hero() {
  return (
    <section id="top" className={`relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-paper ${GUTTER} py-20 lg:min-h-svh lg:pt-14`}>
      <HeroGrid />
      <Reveal stagger={0.12} delay={0.15} className={`relative z-10 ${WRAP} flex flex-col items-center text-center`}>
        <h1 className={`${H1} max-w-[13ch] lg:text-[136px]`}>{hero.title}</h1>
        <p className={`${COPY} mt-8 max-w-[38ch] text-body`}>{hero.lede}</p>
        <div className="mt-8 flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row md:mt-12">
          <ButtonLink href={LAUNCH}>{hero.primaryCta.label}</ButtonLink>
          <TextLink href={RESEARCH}>{hero.secondaryCta.label}</TextLink>
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
            <Reel models={['jet', 'jaguar', 'arcmate', 'tractor']} className="h-[62svh] min-h-[380px]" />
          </div>
        </Window>
      </div>
    </section>
  )
}

/**
 * The mission statement in white on the logo-blue band, each word brightening as it scrolls through
 * the screen, with a chapter label above. The globe was removed (Ankit, 2026-10-18).
 */
function Mission() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const words = `${research.mission.before.trim()} ${research.mission.emphasis}`.split(' ')
  useGSAP(
    () => {
      if (reduced || !ref.current) return
      const spans = ref.current.querySelectorAll('[data-word]')
      gsap.fromTo(spans, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.4 } })
    },
    { dependencies: [reduced], scope: ref },
  )
  return (
    // option B (Ankit, 2026-10-18): the logo-blue band with the line grid, the statement in white
    <Section id="research" ground="blue" field={<LineGrid tone="blue" cell={56} mask="none" />}>
      <p className={`${LABEL} text-white`}>[ {research.mission.label} ]</p>
      <p ref={ref} className={`${DISPLAY} mt-6 max-w-[22ch] text-[34px] leading-[0.98] normal-case sm:text-[56px] lg:mt-8 lg:text-[clamp(56px,5vw,76px)] lg:leading-[0.94]`}>
        {words.map((w, i) => (
          <span key={i} data-word>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </Section>
  )
}

const PROBLEM_ICONS: PixelIconName[] = ['plan', 'simulate', 'energy']

/**
 * Option A (Ankit, 2026-10-18): the three problems as framed cards, each with a pixel icon, then the
 * two closing lines behind a blue rule, the last one in blue. The closing lines carry no number.
 */
function Problem() {
  const p = research.problem
  return (
    <Section id="problem" ground="studio">
      <Display>{p.title}</Display>
      <Reveal as="ol" stagger={0.08} className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
        {p.points.map((point, i) => (
          <li key={point.title} className="flex">
            <Window
              className="w-full"
              title={
                <span className="flex w-full justify-between gap-3 py-1">
                  <span>Problem.0{i + 1}</span>
                  <span>[0{i + 1}]</span>
                </span>
              }
            >
              <div className="px-5 pt-6 pb-7 md:px-6">
                <PixelIcon name={PROBLEM_ICONS[i]} active className="size-11" />
                <h3 className="mt-6 text-[22px] leading-[1.15] font-medium tracking-[-0.03em] md:text-2xl">{point.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.45] tracking-[-0.01em] text-body">{point.body}</p>
              </div>
            </Window>
          </li>
        ))}
      </Reveal>
      <Reveal className="mt-12 max-w-[980px] border-l-[3px] border-brand pl-5 lg:mt-14">
        {p.paragraphs.map((para, i) => (
          <p key={para.slice(0, 24)} className={`text-[20px] leading-[1.25] tracking-[-0.03em] md:text-[26px] lg:text-[28px] ${i ? 'mt-4 text-brand' : ''}`}>
            {para}
          </p>
        ))}
      </Reveal>
    </Section>
  )
}

function Build() {
  return (
    <Section>
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
    <Section ground="studio">
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

const SECTOR_ICONS: PixelIconName[] = ['industrial', 'manufacturing', 'enterprise', 'healthcare', 'beyond']

function Matters() {
  const m = research.matters
  return (
    <Section id="matters">
      <Display align="left">{m.title}</Display>
      <Reveal className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-14 lg:gap-12">
        <RuleCol label="[01]">
          <p className={`${COPY} text-[20px] md:text-[26px]`}>
            {m.description.before}
            <span className="text-brand">{m.description.emphasis}</span>
            {m.description.after}
          </p>
        </RuleCol>
        <RuleCol label={m.qualities.join(' / ')}>
          <p className={COPY}>{m.body}</p>
        </RuleCol>
      </Reveal>
      {/* two across on phones, 3 + 2 on tablets, all five in a row from desktop */}
      <ul className="mt-10 grid grid-cols-2 border-t border-l border-line md:grid-cols-6 lg:mt-14 lg:grid-cols-5">
        {m.sectors.map((sector, i) => (
          <IconCell key={sector} icon={SECTOR_ICONS[i]} tone={SECTOR_TONES[i]} className="min-h-40 last:col-span-2 md:col-span-2 md:min-h-52 md:nth-[n+4]:col-span-3 lg:col-span-1 lg:nth-[n+4]:col-span-1">
            <span className={`${LABEL} block text-faint`}>[0{i + 1}]</span>
            <span className={`${H3} mt-1 block`}>{sector}</span>
          </IconCell>
        ))}
      </ul>
    </Section>
  )
}

function Team() {
  return (
    <Section id="team" ground="studio">
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
        {/* phones: a row that swipes sideways, each founder at a readable size; three across from 640 */}
        <Reveal as="ul" stagger={0.08} className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 self-start overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-2 sm:overflow-visible sm:px-0 md:gap-3">
          {team.founders.map((f) => (
            <li key={f.name} className="w-[64%] shrink-0 snap-start sm:w-auto">
              <Window title={f.note}>
                <img src={f.photo} alt={f.name} loading="lazy" className="aspect-[4/5] w-full bg-studio object-cover" />
              </Window>
              <h3 className="mt-3 text-[15px] leading-tight font-medium tracking-[-0.04em] sm:text-xl">{f.name}</h3>
            </li>
          ))}
        </Reveal>
      </div>
      <dl className="mt-12 grid grid-cols-2 gap-4 lg:mt-20 lg:gap-12">
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
        <div>
          <p className={`${LABEL} mb-3 text-muted`}>{team.experienceLabel}</p>
          <LogoRow names={team.experienceFrom} />
        </div>
      </Reveal>
    </Section>
  )
}

function Backers() {
  return (
    <Section className="border-b border-line">
      <Display size="md">{backers.title}</Display>
      <Reveal className="mt-10 lg:mt-14">
        <LogoRow names={backers.investors} cols="grid-cols-2 lg:grid-cols-4" />
      </Reveal>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14">
        {backers.advisors.map((a) => (
          <li key={a.name}>
            <Window title={a.affiliations.join(' / ')}>
              <div className="flex items-center justify-between gap-4 p-4">
                <h3 className={H3}>{a.name}</h3>
                <a href={a.x} target="_blank" rel="noreferrer" aria-label={`${a.name} on X`} className="group inline-flex h-11 shrink-0 items-center gap-3 border border-ink px-4 text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span aria-hidden="true" className="font-mono text-[15px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </div>
            </Window>
          </li>
        ))}
      </ul>
      {/* option C, at option B's size (Ankit, 2026-10-18) */}
      <p className="mt-8 text-center text-xl font-medium tracking-[-0.04em] text-muted md:text-2xl">{backers.more}</p>
    </Section>
  )
}

const TABS = navTabs('home')

export function FrontPage() {
  return (
    <>
      <Nav home={HOME} tabs={TABS} />
      <main>
        <Hero />
        {SHOW_REEL && <ReelBand />}
        <Mission />
        <Problem />
        <Build />
        <Pareto />
        {SHOW_SKY001 && <Sky001Band />}
        <Matters />
        <Team />
        <Backers />
      </main>
      <Footer pages={footerPages()} />
    </>
  )
}
