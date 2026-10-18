// Pixel icons from the storyboard (10 × 10 cells). Shared by PixelIcon and the canvas illustrations.
// Pixel icons from the storyboard (80×80, 8px cells). Active = blue cells plus a pale ghost one
// cell up-right; inactive = grey outlined cells. Extracted from Research-Desktop.dc.html.
export const ICONS = {
  learn: ['..........', '#########.', '#.......#.', '#.#####.#.', '#.#...#.#.', '#.#.#.#.#.', '#.#...#.#.', '#.#####.#.', '#.......#.', '#########.'],
  simulate: ['..........', '###.......', '###.......', '###.......', '.#........', '.######...', '......#...', '.....###..', '.....###..', '.....###..'],
  plan: ['..........', '.......##.', '.......##.', '.....###..', '.....#....', '...###....', '...#......', '.###......', '.#........', '##........'],
  guardrails: ['..........', '#########.', '#.......#.', '#.#####.#.', '#.#...#.#.', '#.#.#.#.#.', '.#.#.#.#..', '.#..#..#..', '..#...#...', '...###....'],
  industrial: ['..........', '.#........', '.#........', '.#........', '.#..#..#..', '.#.##.##..', '.########.', '.########.', '.##.#.##..', '.########.'],
  manufacturing: ['..........', '....##....', '.#.####.#.', '..######..', '.###..###.', '.###..###.', '..######..', '.#.####.#.', '....##....', '..........'],
  healthcare: ['..........', '...###....', '...###....', '...###....', '#########.', '#########.', '#########.', '...###....', '...###....', '...###....'],
  chemical: ['..........', '...###....', '....#.....', '....#.....', '...#.#....', '..#...#...', '.#.....#..', '.#######..', '#########.', '#########.'],
  enterprise: ['..........', '.#######..', '.#.#.#.#..', '.#######..', '.#.#.#.#..', '.#######..', '.#.#.#.#..', '.#######..', '.#..#..#..', '#########.'],
  // Oblique cube, for geometry.
  geometry: ['..........', '...######.', '..#....##.', '.######.#.', '.#....#.#.', '.#....#.#.', '.#....#.#.', '.#....##..', '.######...', '..........'],
  beyond: ['..........', '.....#....', '......#...', '.......#..', '#########.', '.......#..', '......#...', '.....#....', '..........', '..........'],
  // The SKY-001 page's three contrarian points, from the v2 page (2026-10-14).
  plugin: ['..........', '..#...#...', '..#...#...', '.#######..', '.#######..', '.#######..', '..#####...', '....#.....', '....#.....', '....#.....'],
  dream: ['..........', '...####.#.', '..##....#.', '.##...###.', '.##.......', '.##.......', '.##.......', '..##......', '...####...', '..........'],
  domains: ['..........', '###..###..', '###..###..', '###..###..', '..........', '..........', '###..###..', '###..###..', '###..###..', '..........'],
  // The seven domains named on the SKY-001 page, from the v2 page (2026-10-14).
  pcb: ['..........', '..#.#.#...', '.#######..', '##.....##.', '.#.###.#..', '##.###.##.', '.#.###.#..', '##.....##.', '.#######..', '..#.#.#...'],
  aerospace: ['..........', '....#.....', '...###....', '...###....', '.#######..', '#########.', '...###....', '...###....', '..#####...', '.##...##..'],
  energy: ['..........', '.....##...', '....##....', '...##.....', '..######..', '.....##...', '....##....', '...##.....', '..##......', '..#.......'],
  protein: ['..........', '#.......#.', '.#.....#..', '..##.##...', '....#.....', '..##.##...', '.#.....#..', '#.......#.', '.#.....#..', '..##.##...'],
  molecule: ['..........', '##.....##.', '##.....##.', '..#...#...', '...###....', '...###....', '...###....', '....#.....', '...###....', '...###....'],
  cua: ['..........', '#.........', '##........', '#.#.......', '#..#......', '#...#.....', '#....#....', '#..###....', '#.#.......', '##........'],
  software: ['..........', '#########.', '#.#.#...#.', '#########.', '#.......#.', '#.###...#.', '#.......#.', '#.#####.#.', '#.......#.', '#########.'],
} as const

export type PixelIconName = keyof typeof ICONS

export const CELLS = Object.fromEntries(
  Object.entries(ICONS).map(([name, rows]) => [
    name,
    rows.flatMap((row, r) => [...row].flatMap((ch, c) => (ch === '#' ? [[c, r] as const] : []))),
  ]),
) as Record<PixelIconName, (readonly [number, number])[]>


/** One icon per domain on the SKY-001 page, in the order of `sky001.next.domains`. */
export const DOMAIN_ICONS: PixelIconName[] = ['pcb', 'aerospace', 'energy', 'protein', 'molecule', 'cua', 'software']

export type Tone = { color: string; ghost: string }

/** A muted tone for a pixel icon: its fill, and a pale ghost of it (the colour mixed 65% towards white). */
function tone(color: string): Tone {
  const n = parseInt(color.slice(1), 16)
  const mix = (c: number) => Math.round(c + (255 - c) * 0.65)
  const rgb = [n >> 16, (n >> 8) & 255, n & 255].map(mix)
  return { color, ghost: `rgb(${rgb.join(',')})` }
}

// Muted tones from Ankit's palette (2026-10-14), one per icon wherever icons stand for fields.
const OLIVE = tone('#4A5B46')
const WINKLE = tone('#97ABC5')
const ARIZONA = tone('#CA8F73')
const MAUVE = tone('#84565C')
const STORM = tone('#6D8C8E')
const TWANG = tone('#CDAD91')
const MOSS = tone('#A7B89F')

/** Tones for the SKY-001 page's domains, in the order of `sky001.next.domains`. */
export const DOMAIN_TONES: Tone[] = [OLIVE, WINKLE, ARIZONA, MAUVE, STORM, TWANG, MOSS]

/** Tones for the front page's sectors: industrial, healthcare, chemical, enterprise, and beyond. */
export const SECTOR_TONES: Tone[] = [STORM, ARIZONA, MOSS, WINKLE, MAUVE]
