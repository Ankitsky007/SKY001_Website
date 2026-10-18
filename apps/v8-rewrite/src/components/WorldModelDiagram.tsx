import { sky001 } from '@skyfall/core/v8'
import { Reveal } from '@skyfall/core/motion'
import { lazy, Suspense, useState } from 'react'
import { hasWebGL2 } from '../lib/inView'
import { H3, LABEL } from '../lib/ui'
import { PixelIcon, type PixelIconName } from './PixelIcon'

const GlobeScene = lazy(() => import('../scenes/GlobeScene'))
const BAND = 'World Model'
// One pixel icon per reason, in the doc's order: cause & effect, physics, latent space, long horizon planning.
const ICONS: PixelIconName[] = ['simulate', 'geometry', 'learn', 'plan']

/** Static globe in the same colours: shown without WebGL2 and while the three.js chunk loads. */
function GlobeStill() {
  return (
    <svg viewBox="0 0 340 340" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <radialGradient id="globe-fill" cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor="#a3b5fa" />
          <stop offset="0.45" stopColor="#3e57da" />
          <stop offset="1" stopColor="#17216b" />
        </radialGradient>
        <clipPath id="globe-clip">
          <circle cx="170" cy="160" r="104" />
        </clipPath>
      </defs>
      <circle cx="170" cy="160" r="104" fill="url(#globe-fill)" />
      <g clipPath="url(#globe-clip)" fill="none" stroke="#fff" strokeOpacity="0.4">
        {[24, 52, 80, 104].map((rx) => (
          <ellipse key={rx} cx="170" cy="160" rx={rx} ry="104" />
        ))}
        {[-66, -33, 0, 33, 66].map((dy) => (
          <path key={dy} d={`M60 ${160 + dy}Q170 ${160 + dy + 26} 280 ${160 + dy}`} />
        ))}
      </g>
      <g transform="rotate(-6 170 178)">
        <path d="M40 160Q170 214 300 160V198Q170 252 40 198Z" fill="#f1f3f8" stroke="#1a1a1a" strokeWidth="2" />
        <path id="globe-band" d="M52 186Q170 238 288 186" fill="none" />
        <text fill="#1a1a1a" style={{ fontFamily: 'var(--font-mono)', fontSize: 25, fontWeight: 700, letterSpacing: '0.04em' }}>
          <textPath href="#globe-band" startOffset="50%" textAnchor="middle">
            {BAND.toUpperCase()}
          </textPath>
        </text>
      </g>
    </svg>
  )
}

/**
 * Dotted strands running from behind the globe down to the cards. The drawing starts at the
 * globe's centre and sits under it, so the strands visibly come out of the globe. `ends` are the
 * card centres in % of the width.
 */
function Fan({ ends, className }: { ends: readonly number[]; className: string }) {
  const n = ends.length * 2
  const strands = ends.flatMap((end, i) => [-1, 1].map((side, j) => ({ end: end + side * (ends.length > 1 ? 3.2 : 5), start: 50 + (i * 2 + j - (n - 1) / 2) * (ends.length > 2 ? 1.5 : ends.length > 1 ? 3 : 6) })))
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={`relative z-0 w-full ${className}`}>
      {strands.map((s) => (
        <path key={s.start} d={`M${s.start} 0V46C${s.start} 80 ${s.end} 66 ${s.end} 100`} fill="none" stroke="#3e57da" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="flow" />
      ))}
    </svg>
  )
}

/**
 * "Why do the World Models excel here?" as a diagram: a turning WebGL globe wearing a "World Model"
 * band, with dotted strands running down to one card per reason. Layout after the content doc's
 * reference image, in the site's blue, white and grey.
 */
export function WorldModelDiagram() {
  const [webgl] = useState(() => typeof document !== 'undefined' && hasWebGL2())
  const { items } = sky001.why
  return (
    <div>
      <div role="img" aria-label={`A globe labelled ${BAND}, connected by dotted lines to: ${items.map((i) => i.title).join(', ')}.`} className="relative z-10 mx-auto size-[260px] md:size-[340px]">
        {webgl ? (
          <Suspense fallback={<GlobeStill />}>
            <GlobeScene label={BAND} fallback={<GlobeStill />} className="size-full" />
          </Suspense>
        ) : (
          <GlobeStill />
        )}
      </div>
      <Fan ends={[50]} className="-mt-[130px] h-[170px] sm:hidden" />
      <Fan ends={[25, 75]} className="-mt-[130px] hidden h-[210px] sm:block md:-mt-[170px] md:h-[240px] lg:hidden" />
      <Fan ends={[12.5, 37.5, 62.5, 87.5]} className="-mt-[170px] hidden h-[260px] lg:block" />
      <Reveal as="ol" stagger={0.08} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.title} className="flex min-h-44 flex-col justify-between gap-6 border border-brand bg-paper p-5 md:min-h-56 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <PixelIcon name={ICONS[i]} active className="size-14 md:size-16" />
              <span className={`${LABEL} text-faint`}>[0{i + 1}]</span>
            </div>
            <div>
              <span className={`${H3} block text-brand`}>{item.title}</span>
              {item.note && <span className="mt-2 block text-[17px] leading-snug tracking-[-0.02em] text-body">{item.note}</span>}
            </div>
          </li>
        ))}
      </Reveal>
    </div>
  )
}
