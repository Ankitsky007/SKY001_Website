import { useRef, useState } from 'react'
import { team } from '@skyfall/core'
import { Reveal, SplitReveal } from '@skyfall/core/motion'
import { CtaLink, Eyebrow, Frame } from '../components/ui'
import { gsap, MOTION_OK, useGSAP } from '../lib/motion'

/** 02 · Founding team: story, founders (rail on phones), stats that count up, and where the team comes from. */
export function Team() {
  return (
    <section id="team" aria-label="Founding team" className="scroll-mt-14 border-t border-[#1A1A1E] md:scroll-mt-16 lg:scroll-mt-[72px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 py-16 md:gap-16 md:py-24 lg:gap-24 lg:py-[120px]">
        <Frame className="flex flex-col gap-5 md:gap-6 lg:gap-8">
          <Eyebrow index={2} label="Founding team" />
          <div className="flex flex-col gap-5 md:gap-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
            <SplitReveal
              as="h2"
              className="m-0 text-4xl leading-[1.1] font-normal tracking-[-0.045em] md:text-[44px] lg:col-span-4 lg:text-[56px]"
            >
              {team.title}
            </SplitReveal>
            <Reveal
              as="p"
              className="m-0 text-[17px] leading-[1.55] text-body md:max-w-[680px] md:text-[19px] md:leading-[1.5] lg:col-span-7 lg:col-start-6 lg:max-w-none lg:text-xl lg:tracking-[-0.01em]"
            >
              {team.story}
            </Reveal>
          </div>
        </Frame>

        <Founders />

        <Frame className="flex flex-col gap-5 md:gap-5 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
          <Reveal stagger={0.1} className="flex flex-col gap-5 lg:col-span-6">
            <p className="m-0 text-lg leading-[1.5] tracking-[-0.01em] md:max-w-[640px] md:text-xl">{team.experience}</p>
            <p className="m-0 text-base leading-[1.6] text-body md:max-w-[640px] md:text-[17px]">{team.researchTeam}</p>
          </Reveal>
          <div id="careers" className="flex scroll-mt-24 items-end lg:col-span-5 lg:col-start-8 lg:justify-end">
            <CtaLink href={team.careersCta.href} variant="outline" arrow>
              {team.careersCta.label}
            </CtaLink>
          </div>
          <Stats />
        </Frame>

        <Frame className="flex flex-col gap-4 md:gap-4 lg:gap-6">
          {/* Label from the board; content.ts has no field for it. */}
          <span className="font-mono text-[11px] tracking-[0.04em] text-meta uppercase md:text-xs">Our teams bring experience from</span>
          <Reveal
            as="ul"
            stagger={0.05}
            y={12}
            className="m-0 grid list-none grid-cols-2 border-t border-l border-rule p-0 text-soft md:grid-cols-3"
          >
            {team.experienceFrom.map((name) => (
              <li
                key={name}
                className="flex h-24 items-center justify-center border-r border-b border-rule px-3 text-center transition-colors duration-300 hover:bg-surface hover:text-ink md:h-28 lg:h-[140px]"
              >
                <OrgMark name={name} />
              </li>
            ))}
          </Reveal>
        </Frame>
      </div>
    </section>
  )
}

/** Typeset stand-in for an organisation logo until official SVGs are sourced. */
function OrgMark({ name }: { name: string }) {
  if (name.startsWith('University of ')) {
    return (
      <span className="flex flex-col items-center leading-tight">
        <span className="font-mono text-[9px] tracking-[0.12em] uppercase md:text-[10px] lg:text-[13px]">University of</span>
        <span className="text-[19px] font-semibold uppercase md:text-[21px] lg:text-[26px]">{name.slice('University of '.length)}</span>
      </span>
    )
  }
  return <span className="text-[19px] font-semibold tracking-[-0.03em] md:text-[21px] lg:text-[26px]">{name}</span>
}

function Silhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" aria-hidden className={className}>
      <circle cx="100" cy="80" r="38" fill="#111114" stroke="#2E2E35" />
      <path d="M24 220 C24 158 58 132 100 132 C142 132 176 158 176 220" fill="#111114" stroke="#2E2E35" />
    </svg>
  )
}

function Founders() {
  const rail = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(rail.current?.children ?? [], {
          autoAlpha: 0,
          y: 28,
          duration: 1.1,
          stagger: 0.1,
          scrollTrigger: { trigger: rail.current, start: 'top 85%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: rail },
  )

  const onScroll = () => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const p = max > 0 ? el.scrollLeft / max : 0
    setPage(Math.round(p * (team.founders.length - 1)))
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div
        ref={rail}
        onScroll={onScroll}
        className="rail flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:px-10 lg:gap-6 lg:px-16"
      >
        {team.founders.map((f, i) => (
          <article key={f.name} className="group flex w-[264px] flex-none snap-start flex-col gap-3.5 md:w-auto lg:gap-5">
            <div className="dot-grid relative flex h-80 items-end justify-center overflow-hidden border border-rule transition-colors duration-500 group-hover:border-rule-3 md:h-[300px] lg:h-[440px]">
              <Silhouette className="block w-[180px] transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5 md:w-[170px] lg:w-[260px]" />
              <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.06em] text-meta lg:top-4 lg:left-4 lg:text-[11px]">
                [ DUMMY PHOTO ]
              </span>
              <span className="absolute top-3 right-3 hidden font-mono text-[11px] tracking-[0.06em] text-brand-lift lg:top-4 lg:right-4 lg:block">
                F.{String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 lg:gap-2">
              <h3 className="m-0 text-xl leading-[1.3] font-medium tracking-[-0.02em] lg:text-2xl">{f.name}</h3>
              <p className="m-0 font-mono text-[11px] tracking-[0.04em] text-meta uppercase lg:text-xs">
                {f.role}
                <span className="hidden lg:inline"> · {f.note}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
      {/* Phone rail position */}
      <div className="flex items-center justify-between px-5 md:hidden" aria-hidden>
        <div className="flex gap-1.5">
          {team.founders.map((f, i) => (
            <span key={f.name} className={`block h-0.5 w-5 transition-colors duration-300 ${i === page ? 'bg-brand-lift' : 'bg-rule-3'}`} />
          ))}
        </div>
        <span className="font-mono text-[11px] tracking-[0.04em] text-meta">SWIPE →</span>
      </div>
    </div>
  )
}

function Stats() {
  const ref = useRef<HTMLDListElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ref.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
          const to = Number(el.dataset.count)
          const n = { v: 0 }
          gsap.to(n, {
            v: to,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(n.v))
            },
          })
          el.textContent = '0'
        })
        return () => {
          ref.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
            el.textContent = el.dataset.count ?? ''
          })
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <dl ref={ref} className="m-0 grid grid-cols-3 border border-rule lg:col-span-12">
      {team.stats.map((s, i) => {
        const [, num = s.value, suffix = ''] = /^(\d+)(.*)$/.exec(s.value) ?? []
        return (
          <div
            key={s.label}
            className={`flex flex-col-reverse justify-end gap-2.5 px-3 py-4 md:gap-3 md:p-6 lg:gap-4 lg:p-8 ${i < 2 ? 'border-r border-rule' : ''}`}
          >
            <dt className="font-mono text-[9px] tracking-[0.05em] text-meta uppercase md:text-[11px] md:tracking-[0.04em] lg:text-xs">{s.label}</dt>
            <dd className="m-0 text-[40px] leading-none tracking-[-0.05em] tabular-nums md:text-[64px] lg:text-[88px]">
              <span data-count={num}>{num}</span>
              {suffix && <span className="text-brand-lift">{suffix}</span>}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
