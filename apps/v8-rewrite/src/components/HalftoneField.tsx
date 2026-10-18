import { hasWebGL2 } from '../lib/inView'
import { lazy, Suspense, useState } from 'react'
import { useFx } from '../lib/fx'
import { FIELD_CSS, type FieldTone } from '../scenes/halftone'

const HalftoneScene = lazy(() => import('../scenes/HalftoneScene'))

const FADE = { none: 0, down: 1, up: -1 } as const
const MASK = {
  none: undefined,
  down: 'linear-gradient(to bottom, #000 20%, transparent)',
  up: 'linear-gradient(to top, #000 20%, transparent)',
} as const

/**
 * Live field behind a section: one WebGL shader with several looks (see lib/fx.ts; `mode` fixes one), all drifting
 * with slow noise and reacting to the pointer. Purely decorative. Without WebGL2 (and while the three.js chunk loads)
 * it is a static CSS dot grid in the same colour; reduced motion renders one still frame.
 */
export function HalftoneField({ tone = 'light', fade = 'none', cell = 9, mode, className = '' }: { tone?: FieldTone; fade?: keyof typeof FADE; cell?: number; mode?: number; className?: string }) {
  const fx = useFx()
  const [webgl] = useState(() => typeof document !== 'undefined' && hasWebGL2())
  const still = (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(${FIELD_CSS[tone]} 1.6px, transparent 2px)`,
        backgroundSize: `${cell}px ${cell}px`,
        maskImage: MASK[fade],
        WebkitMaskImage: MASK[fade],
        opacity: 0.5,
      }}
    />
  )
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {webgl ? (
        <Suspense fallback={still}>
          <HalftoneScene key={fx.id} tone={tone} fade={FADE[fade]} cell={cell} mode={mode ?? fx.mode} fallback={still} className="size-full" />
        </Suspense>
      ) : (
        still
      )}
    </div>
  )
}
