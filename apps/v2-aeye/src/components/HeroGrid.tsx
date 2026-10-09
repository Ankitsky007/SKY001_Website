import { functions } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { lazy, Suspense, useRef, useState, useSyncExternalStore, type PointerEvent, type ReactNode } from 'react'
import { HeroGridStatic } from '../scenes/HeroGridStatic'
import { canUseWebGL2, createPointerState, GRID_LAYOUTS, gridModeFor, labelStart, now, ROUTE_TIME, type GridMode } from '../scenes/heroGrid'

// three.js only arrives with this chunk, after first paint.
const HeroGridScene = lazy(() => import('../scenes/HeroGridScene'))

const MQ_MD = '(min-width: 768px)'
const MQ_LG = '(min-width: 1024px)'

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const queries = [window.matchMedia(MQ_MD), window.matchMedia(MQ_LG)]
  queries.forEach((q) => q.addEventListener('change', onChange))
  return () => queries.forEach((q) => q.removeEventListener('change', onChange))
}

function getMode(): GridMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'mobile'
  if (window.matchMedia(MQ_LG).matches) return 'desktop'
  if (window.matchMedia(MQ_MD).matches) return 'tablet'
  return gridModeFor(window.innerWidth)
}

function useGridMode() {
  return useSyncExternalStore(subscribe, getMode, () => 'mobile' as GridMode)
}

/**
 * The dark pixel-grid band: one decision cell (Δ) ripples out and routes to the six functions in
 * turn. WebGL (lazy) when available, static SVG + CSS pulse otherwise. Children overlay the band.
 */
export function HeroGrid({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const mode = useGridMode()
  const layout = GRID_LAYOUTS[mode]
  const reduced = useReducedMotion()
  const [webgl] = useState(() => typeof document !== 'undefined' && canUseWebGL2())
  const [live, setLive] = useState(false)
  const labels = useRef<(HTMLElement | null)[]>([])
  const pointer = useRef(createPointerState())
  const band = useRef<HTMLDivElement>(null)
  const scene = webgl && !reduced

  const cellAt = (e: PointerEvent) => {
    const rect = band.current!.getBoundingClientRect()
    return [Math.floor((rect.right - e.clientX) / layout.cell), Math.floor((e.clientY - rect.top) / layout.cell)] as const
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!scene || e.pointerType !== 'mouse') return
    const [rc, r] = cellAt(e)
    const key = `${rc}-${r}`
    const ptr = pointer.current
    if (key === ptr.last) return
    ptr.last = key
    ptr.trail.set([rc, r, now()], ptr.head * 3)
    ptr.head = (ptr.head + 1) % 8
  }

  const onPointerDown = (e: PointerEvent) => {
    if (!scene) return
    const [rc, r] = cellAt(e)
    pointer.current.click = [rc, r, now()]
  }

  const fallback = <HeroGridStatic layout={layout} live={false} />

  return (
    <div ref={band} onPointerMove={onPointerMove} onPointerDown={onPointerDown} className={`relative h-[308px] overflow-hidden bg-night md:h-[384px] ${className}`}>
      <HeroGridStatic layout={layout} live={live} />
      {scene && (
        <Suspense fallback={null}>
          <HeroGridScene
            className={`absolute! inset-0 transition-opacity duration-700 ${live ? 'opacity-100' : 'opacity-0'}`}
            fallback={fallback}
            layout={layout}
            labels={labels}
            pointer={pointer}
            onReady={() => setLive(true)}
          />
        </Suspense>
      )}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 font-mono font-medium text-[#F5F5F5] uppercase" data-live={live ? 'true' : 'false'}>
        <span
          className="absolute grid place-items-center text-[15px] font-semibold md:text-base"
          style={{ right: layout.origin[0] * layout.cell, top: layout.origin[1] * layout.cell, width: layout.cell, height: layout.cell }}
        >
          Δ
        </span>
        {functions.map((fn, i) => {
          const [rc, r] = layout.targets[i]
          return (
            <span key={fn} className="absolute" style={{ right: rc * layout.cell, top: r * layout.cell, width: layout.cell, height: layout.cell }}>
              <span
                ref={(el) => {
                  labels.current[i] = el
                }}
                className="fn-label absolute top-[5px] left-[3px] block max-w-[84px] px-0.5 text-[8px] leading-[1.25] tracking-[0.02em] transition-colors duration-300 md:top-1 md:left-1 md:max-w-none md:text-[10px] md:whitespace-nowrap"
                style={{ animationDelay: `${labelStart(i) + ROUTE_TIME}s` }}
              >
                {fn}
              </span>
            </span>
          )
        })}
      </div>
      {children}
    </div>
  )
}
