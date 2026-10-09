import { gsap, prefersReducedMotion, useGSAP } from '@skyfall/core/motion'
import { useRef } from 'react'

// Pixel icons from the storyboard (80×80, 8px cells). Active = blue cells plus a pale ghost one
// cell up-right; inactive = grey outlined cells. Extracted from Research-Desktop.dc.html.
const ICONS = {
  learn: ['..........', '#########.', '#.......#.', '#.#####.#.', '#.#...#.#.', '#.#.#.#.#.', '#.#...#.#.', '#.#####.#.', '#.......#.', '#########.'],
  simulate: ['..........', '###.......', '###.......', '###.......', '.#........', '.######...', '......#...', '.....###..', '.....###..', '.....###..'],
  plan: ['..........', '.......##.', '.......##.', '.....###..', '.....#....', '...###....', '...#......', '.###......', '.#........', '##........'],
  guardrails: ['..........', '#########.', '#.......#.', '#.#####.#.', '#.#...#.#.', '#.#.#.#.#.', '.#.#.#.#..', '.#..#..#..', '..#...#...', '...###....'],
  industrial: ['..........', '.#........', '.#........', '.#........', '.#..#..#..', '.#.##.##..', '.########.', '.########.', '.##.#.##..', '.########.'],
  healthcare: ['..........', '...###....', '...###....', '...###....', '#########.', '#########.', '#########.', '...###....', '...###....', '...###....'],
  chemical: ['..........', '...###....', '....#.....', '....#.....', '...#.#....', '..#...#...', '.#.....#..', '.#######..', '#########.', '#########.'],
  enterprise: ['..........', '.#######..', '.#.#.#.#..', '.#######..', '.#.#.#.#..', '.#######..', '.#.#.#.#..', '.#######..', '.#..#..#..', '#########.'],
  beyond: ['..........', '.....#....', '......#...', '.......#..', '#########.', '.......#..', '......#...', '.....#....', '..........', '..........'],
} as const

export type PixelIconName = keyof typeof ICONS

const CELLS = Object.fromEntries(
  Object.entries(ICONS).map(([name, rows]) => [
    name,
    rows.flatMap((row, r) => [...row].flatMap((ch, c) => (ch === '#' ? [[c, r] as const] : []))),
  ]),
) as Record<PixelIconName, (readonly [number, number])[]>

const outline = (cells: readonly (readonly [number, number])[], dx = 0, dy = 0) =>
  cells.map(([c, r]) => `M${(c + dx) * 8 + 0.5} ${(r + dy) * 8 + 0.5}h7v7h-7z`).join('')

/**
 * Crossfades between the grey outline and the blue pixel icon; when it turns active the blue
 * cells assemble in a random order (a small "pixel reveal"), skipped for reduced motion.
 */
export function PixelIcon({ name, active, className = 'size-[50px] lg:size-20' }: { name: PixelIconName; active: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const cells = CELLS[name]
  const was = useRef(active)

  useGSAP(
    () => {
      const turnedOn = active && !was.current
      was.current = active
      if (!turnedOn || prefersReducedMotion()) return
      gsap.from('[data-px]', { autoAlpha: 0, duration: 0.18, ease: 'none', stagger: { each: 0.012, from: 'random' } })
    },
    { scope: ref, dependencies: [active] },
  )

  return (
    <svg ref={ref} viewBox="0 0 80 80" className={`block shrink-0 overflow-visible ${className}`} aria-hidden="true">
      <path d={outline(cells)} fill="none" stroke="#ADADAD" className={`transition-opacity duration-300 ${active ? 'opacity-0' : 'opacity-100'}`} />
      <g className={`transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
        <path d={outline(cells, 1, -1)} fill="none" stroke="#B9C3F2" />
        <g fill="#3E57DA">
          {cells.map(([c, r]) => (
            <rect key={`${c}-${r}`} data-px x={c * 8} y={r * 8} width="8" height="8" />
          ))}
        </g>
      </g>
    </svg>
  )
}
