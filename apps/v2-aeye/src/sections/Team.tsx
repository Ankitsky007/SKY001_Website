import { team } from '@skyfall/core'
import { gsap, prefersReducedMotion, Reveal, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { Marquee } from '../components/Marquee'
import { Eyebrow, PrimaryButton, SlashHeading } from '../components/ui'
import { pad2 } from '../lib/text'

/** N.02 Founding team: dark band with founder cards (swipe carousel on phones), stats and an experience marquee. */
export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="bg-night-2 text-white">
      <div className="wrap pt-16 pb-16 md:pt-24 md:pb-24 lg:pt-[120px] lg:pb-[120px]">
        <Eyebrow index={2} label="Founding team" tone="dark" />
        <div className="mt-8 flex items-start justify-between gap-12 md:mt-12">
          <div id="team-title">
            <SlashHeading tone="dark">{team.title}</SlashHeading>
          </div>
          <div className="hidden shrink-0 md:block">
            <PrimaryButton href={team.careersCta.href} tone="light" className="min-w-[200px]!">
              {team.careersCta.label}
            </PrimaryButton>
          </div>
        </div>
        <Reveal as="p" className="mt-4 max-w-[900px] text-[17px] leading-[1.55] tracking-[-0.02em] text-night-text md:mt-10 md:text-xl md:leading-[1.5] md:tracking-[-0.03em]">
          {team.story}
        </Reveal>

        <Founders />

        <div className="mt-12 grid gap-8 md:mt-20 lg:mt-24 lg:grid-cols-2 lg:gap-12">
          <Reveal stagger={0.12} className="flex flex-col justify-between gap-6">
            <p className="text-2xl leading-[1.3] tracking-[-0.05em] md:text-[28px]">{team.experience}</p>
            <p className="text-base leading-[1.5] tracking-[-0.02em] text-night-text md:text-lg">{team.researchTeam}</p>
          </Reveal>
          <Stats />
        </div>

        <Experience />

        <PrimaryButton href={team.careersCta.href} tone="light" className="mt-10 w-full md:hidden">
          {team.careersCta.label}
        </PrimaryButton>
      </div>
    </section>
  )
}

function Silhouette() {
  return (
    <svg viewBox="0 0 200 220" className="block h-auto w-[200px] md:w-[200px] lg:w-[240px]" aria-hidden="true">
      <circle cx="100" cy="80" r="38" fill="#2B2B2B" stroke="#474747" />
      <path d="M24 220 C24 158 58 132 100 132 C142 132 176 158 176 220" fill="#2B2B2B" stroke="#474747" />
    </svg>
  )
}

function Founders() {
  const track = useRef<HTMLUListElement>(null)
  const [snap, setSnap] = useState(0)
  const count = team.founders.length

  const step = () => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>('li')
    return card ? card.offsetWidth + 12 : 0
  }
  const onScroll = () => {
    const el = track.current
    const w = step()
    if (!el || !w) return
    setSnap(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / w))))
  }
  const go = (dir: -1 | 1) => {
    const el = track.current
    if (!el) return
    el.scrollTo({ left: Math.max(0, snap + dir) * step(), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <div className="mt-10 md:mt-16">
      <Reveal>
      <ul ref={track} onScroll={onScroll} className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {team.founders.map((f, i) => (
          <li
            key={f.name}
            data-snap={i === snap}
            className="group relative flex w-[316px] max-w-[85vw] shrink-0 snap-start flex-col border border-night-line transition-colors duration-300 max-md:data-[snap=true]:border-brand md:w-auto md:max-w-none md:hover:border-brand"
          >
            <div className="dots-dark relative flex h-[300px] items-end justify-center overflow-hidden md:h-[280px] lg:h-[360px]">
              <div className="transition-transform duration-700 ease-out-expo md:group-hover:scale-[1.04]">
                <Silhouette />
              </div>
              <span className="absolute top-3 left-3 bg-night-3 px-2 py-1 font-mono text-[11px] font-medium text-night-text uppercase md:top-4 md:left-4 md:text-xs">Dummy photo</span>
            </div>
            <div className="flex flex-col gap-2.5 p-5 md:p-6">
              <span className="font-mono text-xs font-medium text-muted transition-colors duration-300 max-md:group-data-[snap=true]:text-brand-lift md:text-[13px] md:group-hover:text-brand-lift">F.{pad2(i + 1)}</span>
              <h3 className="text-2xl font-medium tracking-[-0.05em] transition-colors duration-300 max-md:group-data-[snap=true]:text-brand-lift md:text-[28px] md:group-hover:text-brand-lift">{f.name}</h3>
              <span className="font-mono text-xs font-medium tracking-[-0.02em] text-night-text uppercase md:text-[13px]">{f.role}</span>
            </div>
            <div className="mt-auto flex h-[52px] items-center justify-between border-t border-night-line px-5 font-mono text-xs font-medium text-night-text uppercase md:px-6 md:text-[13px]">
              <span>{f.note}</span>
              <span aria-hidden="true" className="text-white transition-colors duration-300 max-md:group-data-[snap=true]:text-brand-lift md:group-hover:text-brand-lift">
                View ↗
              </span>
            </div>
            <span
              aria-hidden="true"
              className="absolute -inset-x-px -bottom-px block h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out-expo max-md:group-data-[snap=true]:scale-x-100 md:group-hover:scale-x-100"
            />
          </li>
        ))}
      </ul>
      </Reveal>
      <div className="mt-4 flex items-center justify-between md:hidden">
        <span className="font-mono text-xs text-night-text">
          {pad2(snap + 1)} / {pad2(count)} · swipe
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous founder"
            disabled={snap === 0}
            onClick={() => go(-1)}
            className="grid size-11 cursor-pointer place-items-center border border-night-line text-white transition-opacity disabled:cursor-default disabled:text-night-mid"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next founder"
            disabled={snap === count - 1}
            onClick={() => go(1)}
            className="grid size-11 cursor-pointer place-items-center border border-white bg-white text-ink transition-colors disabled:cursor-default disabled:border-night-line disabled:bg-transparent disabled:text-night-mid"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const match = /^(\d+)(.*)$/.exec(value)
  const n = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : ''

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !match || prefersReducedMotion()) return
      const counter = { v: 0 }
      gsap.to(counter, {
        v: n,
        duration: 1.6,
        ease: 'power3.out',
        snap: { v: 1 },
        onUpdate: () => {
          el.textContent = String(counter.v)
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
      el.textContent = '0'
    },
    { scope: ref },
  )

  return (
    <div className="flex flex-col gap-6 border-r border-b border-night-line p-4 md:gap-8 md:p-6">
      <span className="font-mono text-[11px] font-medium text-night-text uppercase md:text-[13px]">{label}</span>
      <span className="text-[44px] leading-none tracking-[-0.06em] tabular-nums md:text-[56px]">
        <span ref={ref}>{match ? n : value}</span>
        {suffix && <span className="text-brand-lift">{suffix}</span>}
      </span>
    </div>
  )
}

function Stats() {
  return (
    <Reveal stagger={0.08} className="grid grid-cols-2 border-t border-l border-night-line">
      {team.stats.map((s) => (
        <Stat key={s.label} value={s.value} label={s.label} />
      ))}
      <div className="dots-dark flex items-end border-r border-b border-night-line p-4 md:p-6">
        <span className="font-mono text-[11px] font-medium text-brand-lift uppercase md:text-[13px]">■ One research team</span>
      </div>
    </Reveal>
  )
}

const LOGO_TONE = 'text-night-text'

/** Typeset placeholder chip for a company/lab logo until official files arrive. */
function LogoChip({ name }: { name: string }) {
  const base = `flex h-12 shrink-0 items-center gap-2.5 border border-night-line px-5 ${LOGO_TONE} md:h-16 md:px-7`
  if (name.startsWith('University of ')) {
    return (
      <span className={`${base} flex-col items-start! justify-center gap-0! leading-[1.1]`}>
        <span className="font-mono text-[8px] tracking-[0.12em] uppercase md:text-[10px]">University of</span>
        <span className="text-base font-semibold tracking-[-0.02em] uppercase md:text-xl">{name.slice(14)}</span>
      </span>
    )
  }
  if (name === 'Microsoft') {
    return (
      <span className={`${base} text-lg font-medium tracking-[-0.02em] md:text-[22px]`}>
        <svg viewBox="0 0 22 22" className="size-4 md:size-[22px]" aria-hidden="true" fill="currentColor">
          <rect width="10" height="10" />
          <rect x="12" width="10" height="10" />
          <rect y="12" width="10" height="10" />
          <rect x="12" y="12" width="10" height="10" />
        </svg>
        {name}
      </span>
    )
  }
  if (name === 'Y Combinator') {
    return (
      <span className={`${base} text-lg font-medium tracking-[-0.02em] md:text-[22px]`}>
        <svg viewBox="0 0 24 24" className="size-5 md:size-6" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z"
          />
        </svg>
        {name.slice(2)}
      </span>
    )
  }
  const short = name.length <= 7
  return <span className={`${base} ${short ? 'text-xl font-semibold tracking-[-0.04em] md:text-[24px]' : 'text-lg font-medium tracking-[-0.03em] md:text-[22px]'} ${name === 'Mila' ? 'lowercase' : ''}`}>{name}</span>
}

function Experience() {
  const names = team.experienceFrom
  const rowB = [...names.slice(3), ...names.slice(0, 3)]
  return (
    <Reveal className="mt-12 flex flex-col gap-5 overflow-hidden border border-night-line py-8 md:mt-24 md:gap-7 md:py-10">
      <h3 className="px-5 text-2xl font-medium tracking-[-0.05em] md:px-10 md:text-[28px]">Our teams bring experience from</h3>
      <div className="flex flex-col gap-3 md:gap-4">
        <Marquee speed={45} groupClassName="gap-3 pr-3">
          {names.map((n) => (
            <LogoChip key={n} name={n} />
          ))}
        </Marquee>
        <Marquee speed={45} reverse groupClassName="gap-3 pr-3">
          {rowB.map((n) => (
            <LogoChip key={n} name={n} />
          ))}
        </Marquee>
      </div>
    </Reveal>
  )
}
