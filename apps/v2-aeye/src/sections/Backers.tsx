import { backers } from '@skyfall/core'
import { Reveal } from '@skyfall/core/motion'
import { useState, type ReactNode } from 'react'
import { Eyebrow, SlashHeading, SquareLabel } from '../components/ui'
import { pad2, wordmarkClass } from '../lib/text'

// Monochrome marks for the advisors' affiliations (typeset placeholders, from the storyboard).
const AFFILIATION_ICONS: Record<string, ReactNode> = {
  Google: (
    <svg viewBox="0 0 24 24" className="size-[18px] md:size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  Keras: (
    <svg viewBox="0 0 24 24" className="size-[18px] md:size-5" aria-hidden="true">
      <path fill="currentColor" d="M24 0H0v24h24V0zM8.45 5.16l.2.17v6.24l6.46-6.45h1.96l.2.4-5.14 5.1 5.47 7.94-.2.3h-1.94l-4.65-6.88-2.16 2.08v4.6l-.19.2H7l-.2-.2V5.33l.17-.17h1.48z" />
    </svg>
  ),
  Databricks: (
    <svg viewBox="0 0 24 24" className="size-[18px] md:size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.974 2.647 6.681 12 1.388l7.76 4.368.668-.411v-.566L12 0 .95 6.27v.72L12 13.207l9.919-5.55v2.26L12 15.52 1.516 9.56l-.565.308Z"
      />
    </svg>
  ),
}

function Affiliation({ name }: { name: string }) {
  const chip = 'flex h-11 items-center gap-2 border border-line bg-white px-3 text-[15px] font-medium tracking-[-0.02em] text-body md:h-[52px] md:px-4 md:text-[17px]'
  if (name === 'Intel') {
    return (
      <span className={chip} aria-label="Intel" role="img">
        <svg viewBox="0 0 24 24" className="h-8 w-8 md:h-10 md:w-10" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.42 7.345v9.18h1.651v-9.18zM0 7.475v1.737h1.737V7.474zm9.78.352v6.053c0 .513.044.945.13 1.292.087.34.235.618.44.828.203.21.475.359.803.451.334.093.754.136 1.255.136h.216v-1.533c-.24 0-.445-.012-.593-.037a.672.672 0 0 1-.39-.173.693.693 0 0 1-.173-.377 4.002 4.002 0 0 1-.037-.606v-2.182h1.193v-1.416h-1.193V7.827zm-3.505 2.312c-.396 0-.76.08-1.082.241-.327.161-.6.384-.822.668l-.087.117v-.902H2.658v6.256h1.639v-3.214c.018-.588.16-1.02.433-1.299.29-.297.642-.445 1.044-.445.476 0 .841.149 1.082.433.235.284.359.686.359 1.2v3.324h1.663V12.97c.006-.89-.229-1.595-.686-2.09-.458-.495-1.1-.742-1.917-.742zm10.065.006a3.252 3.252 0 0 0-2.306.946c-.29.29-.525.637-.692 1.033a3.145 3.145 0 0 0-.254 1.273c0 .452.08.878.241 1.274.161.395.39.742.674 1.032.284.29.637.526 1.045.693.408.173.86.26 1.342.26 1.397 0 2.262-.637 2.782-1.23l-1.187-.904c-.248.297-.841.699-1.583.699-.464 0-.847-.105-1.138-.321a1.588 1.588 0 0 1-.593-.872l-.019-.056h4.915v-.587c0-.451-.08-.872-.235-1.267a3.393 3.393 0 0 0-.661-1.033 3.013 3.013 0 0 0-1.02-.692 3.345 3.345 0 0 0-1.311-.248zm-16.297.118v6.256h1.651v-6.256zm16.278 1.286c1.132 0 1.664.797 1.664 1.255l-3.32.006c0-.458.525-1.255 1.656-1.261z"
          />
        </svg>
      </span>
    )
  }
  const icon = AFFILIATION_ICONS[name]
  return <span className={`${chip} ${icon ? '' : 'font-mono font-semibold tracking-[0.04em]'}`}>{icon}{name}</span>
}

/** N.03 Investors & advisors. */
export function Backers() {
  const [advisor, setAdvisor] = useState(0)

  return (
    <section id="backers" aria-labelledby="backers-title" className="wrap pt-16 md:pt-24 lg:pt-[120px]">
      <Eyebrow index={3} label="Investors & advisors" />
      <div id="backers-title" className="mt-8 max-w-[960px] md:mt-12">
        <SlashHeading>{backers.title}</SlashHeading>
      </div>

      <SquareLabel className="mt-12 md:mt-[72px]">Investors</SquareLabel>
      <Reveal as="ul" stagger={0.08} className="mt-4 grid grid-cols-2 border-t border-l border-line md:mt-5 md:grid-cols-4">
        {backers.investors.map((name, i) => (
          <li key={name} className="group relative flex h-[104px] flex-col justify-between border-r border-b border-line p-3 md:h-[180px] md:p-5">
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 outline outline-1 -outline-offset-1 outline-transparent transition-[outline-color] duration-300 group-hover:outline-brand" />
            <span className="flex justify-between font-mono text-[11px] font-medium text-faint transition-colors duration-300 group-hover:text-brand md:text-xs">
              <span>I.{pad2(i + 1)}</span>
              <span aria-hidden="true" className="translate-y-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                ↗
              </span>
            </span>
            <span className={`self-center text-center text-[17px] text-body transition-colors duration-300 group-hover:text-brand md:text-[21px] lg:text-[26px] ${wordmarkClass(name)}`}>{name}</span>
            <span className="h-3 md:h-3.5" />
            <span aria-hidden="true" className="absolute inset-x-0 -bottom-px block h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
          </li>
        ))}
      </Reveal>

      <SquareLabel className="mt-12 md:mt-24">Advisors</SquareLabel>
      <Reveal as="ul" stagger={0.1} className="mt-4 border-t border-line md:mt-5">
        {backers.advisors.map((a, i) => {
          const on = i === advisor
          return (
            <li
              key={a.name}
              onPointerEnter={() => setAdvisor(i)}
              onFocus={() => setAdvisor(i)}
              className={`relative -mt-px flex flex-col gap-4 border-y px-4 py-5 transition-colors duration-300 lg:h-32 lg:flex-row lg:items-center lg:gap-7 lg:px-6 lg:py-0 ${
                on ? 'dots z-10 border-brand' : 'border-line border-t-transparent bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4 lg:contents">
                <div className="flex flex-col gap-1 lg:contents">
                  <span className={`font-mono text-xs font-medium transition-colors duration-300 lg:text-[13px] ${on ? 'text-brand' : 'text-faint'}`}>A.{pad2(i + 1)}</span>
                  <span className={`text-[28px] tracking-[-0.05em] transition-colors duration-300 lg:text-4xl ${on ? 'text-brand' : 'text-ink'}`}>{a.name}</span>
                </div>
                <span aria-hidden="true" className={`hidden flex-1 border-t border-dashed transition-colors duration-300 lg:block ${on ? 'border-ghost' : 'border-slash'}`} />
                <ul className="hidden gap-2 lg:flex">
                  {a.affiliations.map((aff) => (
                    <li key={aff}>
                      <Affiliation name={aff} />
                    </li>
                  ))}
                </ul>
                <a
                  href={a.x}
                  aria-label={`${a.name} on X`}
                  className={`grid size-11 shrink-0 place-items-center font-mono text-sm font-semibold text-white transition-colors duration-300 lg:ml-5 lg:size-[52px] lg:text-[15px] ${on ? 'bg-brand' : 'bg-ink hover:bg-brand'}`}
                >
                  X ↗
                </a>
              </div>
              <ul className="flex flex-wrap gap-2 lg:hidden">
                {a.affiliations.map((aff) => (
                  <li key={aff}>
                    <Affiliation name={aff} />
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </Reveal>
    </section>
  )
}
