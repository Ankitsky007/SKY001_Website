import { benchmarkStory, sky001 } from '@skyfall/core/v8'
import { gsap, Reveal, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useRef } from 'react'
import cadBenchmarkClip from '../assets/media/cad-benchmark.mp4'
import cadBenchmarkPoster from '../assets/media/s-cad-benchmark.jpg'
import towerPoster from '../assets/media/s-tower.jpg'
import towerClip from '../assets/media/tower.mp4'
import { BenchmarkBlock } from '../components/BenchmarkStory'
import { ContrarianFigure } from '../components/ContrarianFigures'
import { PixelIcon } from '../components/PixelIcon'
import { DOMAIN_ICONS, DOMAIN_TONES, type PixelIconName } from '../lib/pixelIcons'
import { Footer } from '../components/Footer'
import { LineGrid } from '../components/LineGrid'
import { HeroGrid } from '../components/HeroGrid'
import { Nav } from '../components/Nav'
import { StageVideos } from '../components/StageVideos'
import { TiltedModels } from '../components/TiltedModels'
import { WorldModelDiagram } from '../components/WorldModelDiagram'
import { footerPages, navTabs } from '../lib/nav'
import { HOME, VIDEO_HREF, WAITLIST_HREF } from '../lib/routes'
import { ButtonLink, DISPLAY, Display, GUTTER, H1, RuleCol, Section, TextLink, Window, WRAP } from '../lib/ui'

const COPY = 'text-[17px] leading-[1.25] tracking-[-0.02em] md:text-[19px]'
const SMALL = 'text-[15px] leading-[1.3] tracking-[-0.02em] md:text-base'

function Hero() {
  const { hero, intro } = sky001
  return (
    <section id="top" className={`relative overflow-hidden bg-paper ${GUTTER} pt-14 pb-14 md:pt-24 md:pb-20 lg:pt-32`}>
      {/* "Clear centre" (Ankit picked it from six options, 2026-10-18): the cells fade out in a soft oval behind the copy */}
      <HeroGrid className="h-[300px] md:h-[440px]" mask="radial-gradient(ellipse 46% 62% at 50% 62%, transparent 45%, #000 85%)" />
      {/* the hero rises in line by line on load, like the reveals further down */}
      <Reveal stagger={0.12} delay={0.15} className={`relative z-10 ${WRAP} flex flex-col items-center text-center`}>
        <p className="text-[15px] font-medium tracking-[-0.02em] md:text-base">
          {/* Non-breaking hyphen keeps "SKY-001" on one line. */}
          {intro.before.replace('SKY-001', 'SKY‑001')}
          {intro.emphasis}
        </p>
        <h1 data-grid-avoid className={`${H1} mt-6 max-w-[12ch] md:mt-8 lg:text-[136px]`}>{hero.title}</h1>
        <p data-grid-avoid className={`${COPY} mt-8 max-w-[38ch] text-body`}>{hero.lede}</p>
        {/* the same pair as the front page hero: a filled button and an underlined link (Ankit, 2026-10-18) */}
        <div className="mt-8 flex flex-col items-center gap-x-6 gap-y-3 sm:flex-row md:mt-12">
          <ButtonLink href={WAITLIST_HREF}>{intro.waitlist.cta.label}</ButtonLink>
          <TextLink href={VIDEO_HREF}>{intro.video.label}</TextLink>
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
  // the hero's note now heads the model row in place of the intro statement (Ankit, 2026-10-18)
  const [claim, rest] = sky001.hero.note.split(';')
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

const STORY_CLIPS = {
  cad: { src: cadBenchmarkClip, poster: cadBenchmarkPoster, tone: 'native-light' as const },
  // stand-in until the BIM benchmark video exists
  bim: { src: towerClip, poster: towerPoster, tone: 'dark' as const },
}

/** The claim once at the top, then per model: blue claim, the video under it, the three charts under that (Ankit, 2026-10-17). */
function Benchmarks() {
  const { moment } = sky001
  return (
    <Section id="results">
      <Display size="md" align="left" note={moment.eyebrow}>
        {moment.before}
        {moment.emphasis}
        {moment.after}
      </Display>
      <Reveal>
        <RuleCol label={moment.versus} className="mt-10 max-w-[560px]">
          <p className={COPY}>{moment.body}</p>
        </RuleCol>
      </Reveal>
      <div className="mt-12 flex flex-col gap-16 md:gap-20 lg:mt-16 lg:gap-24">
        {benchmarkStory.models.map((m) => (
          <BenchmarkBlock key={m.key} story={m} clip={STORY_CLIPS[m.key]} />
        ))}
      </div>
    </Section>
  )
}

function Stages() {
  return (
    <section id="how" aria-labelledby="how-title" className={`bg-studio ${GUTTER} py-16 md:py-24 lg:py-28`}>
      <div className={WRAP}>
        <StageVideos titleId="how-title" />
      </div>
    </section>
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
        <Benchmarks />
        <Stages />
        <Why />
        <Next />
        <Faq />
        <Waitlist />
      </main>
      <Footer pages={footerPages()} />
    </>
  )
}
