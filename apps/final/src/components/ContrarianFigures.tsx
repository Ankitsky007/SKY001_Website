import { sky001 } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef } from 'react'
import { CELLS, type PixelIconName } from '../lib/pixelIcons'

// Three small looping canvas illustrations for the contrarian points on the SKY-001 page (Ankit's
// picks, 2026-10-14): a bracket reasoned onto a base in 3D, many designs dreamt at once from one
// input, and a globe with the page's domains in orbit. Each is drawn in a 400 × 250 design space
// scaled to its box, runs only while on screen, and shows one still frame for reduced motion.
// The parts and designs are drawn in code to explain the idea; they are not SKY-001 output.

const W = 400
const H = 250
const INK = '#1A1A1A'
const BRAND = '#3E57DA'
const GREY = '#ADADAD'
const MUTED = '#7A7A7A'
const MONO = '"Geist Mono", ui-monospace, monospace'

type Draw = (g: CanvasRenderingContext2D, t: number) => void

/** Runs `draw` every frame while the canvas is on screen; one frame at `still` seconds for reduced motion. */
function useCanvasLoop(ref: React.RefObject<HTMLCanvasElement | null>, draw: Draw, still: number) {
  const reduced = useReducedMotion()
  useEffect(() => {
    const cv = ref.current
    const g = cv?.getContext('2d')
    if (!cv || !g) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let visible = false
    let last = performance.now()
    // `?figT=4` freezes every illustration at that second, for reviewing one moment
    const frozen = Number(new URLSearchParams(window.location.search).get('figT'))
    let t = reduced ? still : frozen || 0
    const paint = () => {
      const s = cv.width / W
      g.setTransform(s, 0, 0, s, 0, 0)
      g.clearRect(0, 0, W, H)
      draw(g, t)
    }
    const resize = () => {
      const r = cv.getBoundingClientRect()
      cv.width = Math.max(1, Math.round(r.width * dpr))
      cv.height = Math.max(1, Math.round(r.height * dpr))
      paint()
    }
    const frame = (now: number) => {
      t += Math.min(0.1, (now - last) / 1000)
      last = now
      paint()
      raf = requestAnimationFrame(frame)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => {
      if (reduced || frozen) return
      if (e.isIntersecting && !visible) {
        visible = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!e.isIntersecting && visible) {
        visible = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(cv)
    resize()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [ref, draw, still, reduced])
}

function Figure({ draw, still, label }: { draw: Draw; still: number; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useCanvasLoop(ref, draw, still)
  return <canvas ref={ref} role="img" aria-label={label} className="block aspect-[8/5] w-full" />
}

const clamp = (x: number) => Math.min(1, Math.max(0, x))
const ease = (x: number) => {
  const v = clamp(x)
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2
}
/** Progress 0→1 of a phase running from `a` to `b` seconds. */
const span = (t: number, a: number, b: number) => ease((t - a) / (b - a))

function label(g: CanvasRenderingContext2D, text: string, x: number, y: number, color = MUTED, align: CanvasTextAlign = 'left', size = 11) {
  g.font = `500 ${size}px ${MONO}`
  g.fillStyle = color
  g.textAlign = align
  g.textBaseline = 'alphabetic'
  g.fillText(text.toUpperCase(), x, y)
}

const { figures } = sky001.contrarian
const iso = (ox: number, oy: number, s: number) => (x: number, y: number, z: number) => [ox + (x - y) * 0.866 * s, oy + (x + y) * 0.5 * s - z * s] as const

// ---------------------------------------------------------------------------------------------
// 2. First model that can dream: fourteen different designs grow out of noise at the same moment
// around one input sketch, in light grey, then one is picked in blue.
// ---------------------------------------------------------------------------------------------

const DREAM_PERIOD = 7.5
const TILE = 66
const GAP = 12
const COLS = 5
const ROWS = 3
const PITCH = 3
const CELLS_N = TILE / PITCH // 22
const GRID_X = (W - (COLS * TILE + (COLS - 1) * GAP)) / 2
const GRID_Y = (H - (ROWS * TILE + (ROWS - 1) * GAP)) / 2 + 2
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)

/** Seeded random, so every visitor sees the same fourteen designs. */
function rng(seed: number) {
  let a = seed * 9301 + 49297
  return () => {
    a = (a * 1103515245 + 12345) % 2147483648
    return a / 2147483648
  }
}
const hash = (x: number, y: number, z: number) => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453
  return v - Math.floor(v)
}

type Shade = { top: number; left: number; right: number }
const SHADE: Shade = { top: 1, left: 0.78, right: 0.5 }

/** Paints one design (a box, a bored block, a hub, an L-bracket or a stepped block) in greys. */
function paintDesign(o: CanvasRenderingContext2D, kind: number, r: () => number) {
  const s = CELLS_N
  const P = iso(s / 2, s * 0.62, 1)
  const face = (pts: (readonly [number, number])[], v: number) => {
    const c = Math.round(v * 255)
    o.fillStyle = `rgb(${c},${c},${c})`
    o.beginPath()
    pts.forEach(([x, y], i) => (i ? o.lineTo(x, y) : o.moveTo(x, y)))
    o.closePath()
    o.fill()
  }
  const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
    face([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], SHADE.left)
    face([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], SHADE.right)
    face([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], SHADE.top)
  }
  const cyl = (rad: number, z0: number, z1: number) => {
    const [cx, cy0] = P(0, 0, z0)
    const [, cy1] = P(0, 0, z1)
    const rx = rad * 1.22
    const ry = rad * 0.707
    const grad = o.createLinearGradient(cx - rx, 0, cx + rx, 0)
    grad.addColorStop(0, 'rgb(170,170,170)')
    grad.addColorStop(1, 'rgb(70,70,70)')
    o.fillStyle = grad
    o.fillRect(cx - rx, cy1, rx * 2, cy0 - cy1)
    o.beginPath()
    o.ellipse(cx, cy0, rx, ry, 0, 0, Math.PI)
    o.fill()
    o.fillStyle = 'rgb(242,242,242)'
    o.beginPath()
    o.ellipse(cx, cy1, rx, ry, 0, 0, Math.PI * 2)
    o.fill()
  }
  const hole = (rad: number, z: number) => {
    const [cx, cy] = P(0, 0, z)
    o.fillStyle = 'rgb(40,40,40)'
    o.beginPath()
    o.ellipse(cx, cy, rad * 1.22, rad * 0.707, 0, 0, Math.PI * 2)
    o.fill()
  }
  const a = 4 + r() * 3
  const b = 3 + r() * 3
  const h = 2 + r() * 5
  if (kind === 0) box(-a, -b, 0, a, b, h)
  else if (kind === 1) {
    box(-a, -b, 0, a, b, h)
    hole(1.2 + r() * 1.4, h)
  } else if (kind === 2) {
    cyl(4.5 + r() * 2, 0, 1.5 + r() * 1.5)
    const top = 1.5 + r() * 1.5 + 2 + r() * 5
    cyl(2 + r() * 1.4, 2.4, top)
    hole(1, top)
  } else if (kind === 3) {
    box(-a, -b, 0, a, b, 2)
    box(-a, -b, 0, -a + 2, b, 2 + h + 2)
  } else {
    box(-a, -b, 0, a, b, h * 0.5)
    box(-a * 0.5, -b * 0.6, h * 0.5, a * 0.5, b * 0.6, h + 2)
  }
}

let designs: Float32Array[] | null = null
/** Brightness per cell for each of the fourteen designs, painted once. */
function getDesigns() {
  if (designs) return designs
  const off = document.createElement('canvas')
  off.width = CELLS_N
  off.height = CELLS_N
  const o = off.getContext('2d', { willReadFrequently: true })
  designs = []
  for (let i = 0; i < COLS * ROWS - 1; i++) {
    const v = new Float32Array(CELLS_N * CELLS_N)
    if (o) {
      o.fillStyle = '#000'
      o.fillRect(0, 0, CELLS_N, CELLS_N)
      const r = rng(i + 3)
      paintDesign(o, i % 5, r)
      const data = o.getImageData(0, 0, CELLS_N, CELLS_N).data
      for (let c = 0; c < v.length; c++) v[c] = data[c * 4] / 255
    }
    designs.push(v)
  }
  return designs
}

const drawDreams: Draw = (g, time) => {
  const t = time % DREAM_PERIOD
  const cycle = Math.floor(time / DREAM_PERIOD)
  const fade = 1 - span(t, DREAM_PERIOD - 0.6, DREAM_PERIOD)
  const grow = span(t, 0.7, 2.7)
  const picked = t > 3.2
  const pick = (cycle * 5 + 3) % (COLS * ROWS - 1)
  const list = getDesigns()
  const flicker = Math.floor(time * 12)
  g.globalAlpha = fade
  let d = 0
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = GRID_X + col * (TILE + GAP)
      const y = GRID_Y + row * (TILE + GAP)
      const centre = row === 1 && col === 2
      if (centre) {
        // the one input: a sketch in blue lines
        g.fillStyle = '#FFFFFF'
        g.fillRect(x, y, TILE, TILE)
        g.strokeStyle = BRAND
        g.lineWidth = 1
        g.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1)
        label(g, figures.input, x + 5, y + 13, BRAND, 'left', 9)
        const k = span(t, 0, 0.7)
        g.lineWidth = 1.6
        g.beginPath()
        const pts: [number, number][] = [
          [x + 14, y + 52],
          [x + 52, y + 52],
          [x + 52, y + 44],
          [x + 41, y + 44],
          [x + 41, y + 24],
          [x + 25, y + 24],
          [x + 25, y + 44],
          [x + 14, y + 44],
          [x + 14, y + 52],
        ]
        const n = (pts.length - 1) * k
        g.moveTo(...pts[0])
        for (let i = 1; i <= Math.floor(n); i++) g.lineTo(...pts[i])
        const f = n % 1
        if (f > 0 && Math.floor(n) + 1 < pts.length) {
          const [ax, ay] = pts[Math.floor(n)]
          const [bx, by] = pts[Math.floor(n) + 1]
          g.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f)
        }
        g.stroke()
        g.lineWidth = 1
        continue
      }
      const v = list[d]
      const isPick = picked && d === pick
      g.strokeStyle = isPick ? BRAND : '#E0E0E0'
      g.lineWidth = isPick ? 1.5 : 1
      g.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1)
      g.lineWidth = 1
      g.globalAlpha = fade
      g.fillStyle = isPick ? BRAND : '#C4C4C4'
      for (let cy = 0; cy < CELLS_N; cy++) {
        for (let cx = 0; cx < CELLS_N; cx++) {
          const b = v[cy * CELLS_N + cx]
          const r = hash(cx, cy, d)
          const shape = b > 0.02 && b > BAYER[(cy % 4) * 4 + (cx % 4)] && r < grow * 1.15
          const noise = grow < 1 && hash(cx, cy, d * 31 + flicker) < 0.22 * (1 - grow) * Math.min(1, grow * 6 + 0.15)
          if (shape || noise) g.fillRect(x + cx * PITCH + 0.3, y + cy * PITCH + 0.3, 2.4, 2.4)
        }
      }
      g.globalAlpha = fade
      if (isPick) label(g, figures.picked, x + TILE, y - 3, BRAND, 'right', 9)
      d++
    }
  }
  g.globalAlpha = 1
}

// ---------------------------------------------------------------------------------------------
// 3. One model, many domains: a dotted globe turning, with the page's domains orbiting it.
// ---------------------------------------------------------------------------------------------

const DOMAIN_ICONS: PixelIconName[] = ['pcb', 'aerospace', 'energy', 'protein', 'molecule', 'cua', 'software']
const GLOBE = { x: 200, y: 112, r: 58 }
const ORBIT = { rx: 168, ry: 40, y: 118 }

function drawIcon(g: CanvasRenderingContext2D, name: PixelIconName, cx: number, cy: number, cell: number, lit: boolean) {
  const x0 = cx - cell * 5
  const y0 = cy - cell * 5
  for (const [c, r] of CELLS[name]) {
    if (lit) {
      g.fillStyle = BRAND
      g.fillRect(x0 + c * cell, y0 + r * cell, cell, cell)
    } else {
      g.fillStyle = '#FFFFFF'
      g.fillRect(x0 + c * cell, y0 + r * cell, cell, cell)
      g.strokeStyle = GREY
      g.strokeRect(x0 + c * cell + 0.5, y0 + r * cell + 0.5, cell - 1, cell - 1)
    }
  }
}

const drawDomains: Draw = (g, time) => {
  const turn = time * 0.35
  const orbit = time * 0.32
  const n = DOMAIN_ICONS.length
  const icons = DOMAIN_ICONS.map((name, i) => {
    const a = orbit + (i / n) * Math.PI * 2
    return { name, i, x: GLOBE.x + ORBIT.rx * Math.cos(a), y: ORBIT.y + ORBIT.ry * Math.sin(a), depth: Math.sin(a) }
  })
  const front = icons.reduce((a, b) => (b.depth > a.depth ? b : a))
  const drawOne = (ic: (typeof icons)[number]) => {
    const scale = 0.62 + 0.38 * ((ic.depth + 1) / 2)
    g.globalAlpha = 0.45 + 0.55 * ((ic.depth + 1) / 2)
    drawIcon(g, ic.name, ic.x, ic.y, 2.6 * scale, ic === front)
    g.globalAlpha = 1
  }

  // the orbit's back half, then the icons behind the globe
  g.strokeStyle = '#E0E0E0'
  g.setLineDash([3, 4])
  g.beginPath()
  g.ellipse(GLOBE.x, ORBIT.y, ORBIT.rx, ORBIT.ry, 0, Math.PI, Math.PI * 2)
  g.stroke()
  g.setLineDash([])
  icons.filter((ic) => ic.depth <= 0).forEach(drawOne)

  // the globe: a dotted sphere, front dots dark, back dots faint, equator in blue
  g.fillStyle = '#FFFFFF'
  g.beginPath()
  g.arc(GLOBE.x, GLOBE.y, GLOBE.r + 2, 0, Math.PI * 2)
  g.fill()
  const tilt = 0.32
  for (let lat = -75; lat <= 75; lat += 12.5) {
    const la = (lat * Math.PI) / 180
    const ring = Math.cos(la)
    const count = Math.max(6, Math.round(34 * ring))
    for (let j = 0; j < count; j++) {
      const lo = (j / count) * Math.PI * 2 + turn
      const x = ring * Math.sin(lo)
      const y0 = Math.sin(la)
      const z0 = ring * Math.cos(lo)
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt)
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt)
      if (z < -0.05) continue
      const px = GLOBE.x + x * GLOBE.r
      const py = GLOBE.y - y * GLOBE.r
      const size = 1.2 + z * 1.2
      g.fillStyle = Math.abs(lat) < 1 ? BRAND : INK
      g.globalAlpha = 0.18 + 0.7 * z
      g.fillRect(px - size / 2, py - size / 2, size, size)
    }
  }
  g.globalAlpha = 1
  g.strokeStyle = '#E0E0E0'
  g.beginPath()
  g.arc(GLOBE.x, GLOBE.y, GLOBE.r + 2, 0, Math.PI * 2)
  g.stroke()

  // the orbit's front half and the icons in front of the globe
  g.strokeStyle = '#E0E0E0'
  g.setLineDash([3, 4])
  g.beginPath()
  g.ellipse(GLOBE.x, ORBIT.y, ORBIT.rx, ORBIT.ry, 0, 0, Math.PI)
  g.stroke()
  g.setLineDash([])
  icons
    .filter((ic) => ic.depth > 0)
    .sort((a, b) => a.depth - b.depth)
    .forEach(drawOne)

  // the domain at the front, named
  label(g, sky001.next.domains[front.i], GLOBE.x, 238, BRAND, 'center', 12)
}

// ---------------------------------------------------------------------------------------------
// 1. Not a plug-in: a bracket reasoned onto a base in 3D space, constraint by constraint.
// ---------------------------------------------------------------------------------------------

type Pt = readonly [number, number]

function quad(g: CanvasRenderingContext2D, pts: Pt[], fill: string | null, stroke: string | null, dash: number[] = []) {
  g.beginPath()
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
  g.closePath()
  if (fill) {
    g.fillStyle = fill
    g.fill()
  }
  if (stroke) {
    g.setLineDash(dash)
    g.strokeStyle = stroke
    g.stroke()
    g.setLineDash([])
  }
}

type Look = { top: string; left: string; right: string; line: string }
const PLAIN: Look = { top: '#FFFFFF', left: '#EDEDED', right: '#D6D6D6', line: INK }
const BLUE: Look = { top: '#EEF1FC', left: '#DCE2F8', right: '#B9C3F2', line: BRAND }

/** A solid box from (x0, y0, z0) to (x1, y1, z1), its three visible faces filled. */
function gizmo(g: CanvasRenderingContext2D, x: number, y: number, lit: { x?: boolean; y?: boolean; z?: boolean }) {
  const L = 30
  const axes: [string, number, number, boolean | undefined][] = [
    ['X', 0.866, 0.5, lit.x],
    ['Y', -0.866, 0.5, lit.y],
    ['Z', 0, -1, lit.z],
  ]
  for (const [name, dx, dy, on] of axes) {
    const ex = x + dx * L
    const ey = y + dy * L
    g.strokeStyle = on ? BRAND : GREY
    g.lineWidth = on ? 1.8 : 1
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(ex, ey)
    g.stroke()
    g.fillStyle = on ? BRAND : GREY
    g.fillRect(ex - 2.5, ey - 2.5, 5, 5)
    label(g, name, x + dx * (L + 11), y + dy * (L + 11) + 4, on ? BRAND : MUTED, 'center', 11)
  }
  g.lineWidth = 1
}

const turn = (x: number, y: number, a: number, tx = 0, ty = 0) => [tx + x * Math.cos(a) - y * Math.sin(a), ty + x * Math.sin(a) + y * Math.cos(a)] as const

/** A box of half-size (hx, hy) turned by `yaw` about its centre (tx, ty), from z0 to z1; only the sides facing the viewer are drawn. */
function prism(g: CanvasRenderingContext2D, P: ReturnType<typeof iso>, hx: number, hy: number, yaw: number, tx: number, ty: number, z0: number, z1: number, look: Look) {
  const local: [number, number][] = [
    [-hx, -hy],
    [hx, -hy],
    [hx, hy],
    [-hx, hy],
  ]
  const c = local.map(([x, y]) => turn(x, y, yaw, tx, ty))
  const sides = c.map((a, i) => {
    const b = c[(i + 1) % 4]
    // outward normal of the edge a→b (the corners run clockwise in plate space)
    const nx = b[1] - a[1]
    const ny = -(b[0] - a[0])
    return { a, b, facing: nx + ny, shade: nx - ny }
  })
  sides
    .filter((sd) => sd.facing > 0.01)
    .forEach(({ a, b, shade }) => quad(g, [P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)], shade < 0 ? look.left : look.right, look.line))
  quad(
    g,
    c.map(([x, y]) => P(x, y, z1)),
    look.top,
    look.line,
  )
}

/** An upright cylinder of radius r at (x, y) from z0 to z1, optionally with a bore of radius `bore`. */
function cylinder(g: CanvasRenderingContext2D, P: ReturnType<typeof iso>, x: number, y: number, r: number, z0: number, z1: number, look: Look, bore = 0) {
  const [cx, b] = P(x, y, z0)
  const [, t] = P(x, y, z1)
  const rx = r * 1.22
  const ry = r * 0.707
  g.beginPath()
  g.moveTo(cx - rx, t)
  g.lineTo(cx - rx, b)
  g.ellipse(cx, b, rx, ry, 0, Math.PI, 0, true)
  g.lineTo(cx + rx, t)
  g.closePath()
  g.fillStyle = look.left
  g.fill()
  g.strokeStyle = look.line
  g.stroke()
  g.beginPath()
  g.ellipse(cx, t, rx, ry, 0, 0, Math.PI * 2)
  g.fillStyle = look.top
  g.fill()
  g.stroke()
  if (bore) {
    g.beginPath()
    g.ellipse(cx, t, bore * 1.22, bore * 0.707, 0, 0, Math.PI * 2)
    g.fillStyle = '#D6D6D6'
    g.fill()
    g.stroke()
  }
}

/** A line from a to b drawn `k` of the way. */
function partLine(g: CanvasRenderingContext2D, a: Pt, b: Pt, k: number) {
  if (k <= 0) return
  g.beginPath()
  g.moveTo(...a)
  g.lineTo(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)
  g.stroke()
}

/** A checklist row in the corner: a square that fills blue once found, and its text. */
function checkRow(g: CanvasRenderingContext2D, y: number, text: string, state: 'todo' | 'now' | 'done') {
  if (state === 'done') {
    g.fillStyle = BRAND
    g.fillRect(16, y - 8, 7, 7)
  } else {
    g.strokeStyle = state === 'now' ? INK : GREY
    g.strokeRect(16.5, y - 7.5, 6, 6)
  }
  label(g, text, 30, y, state === 'done' ? BRAND : state === 'now' ? INK : MUTED, 'left', 11)
}

const BASE = { hx: 64, hy: 38, h: 12 }
const PINS: [number, number][] = [
  [-30, 0],
  [30, 0],
]
const PIN = { r: 6, h: 14 }
const BRACKET = { hx: 46, hy: 17, h: 10, hole: 7.5 }

// Hole A slides over pin A along X then Y, the bracket turns about Z until hole B meets pin B,
// then it drops face to face. Constraints and degrees of freedom count down top left; X, Y, Z and
// angle offsets count to zero bottom right; the XYZ marker lights each axis as it is solved.

const MIX_PERIOD = 8.6

const drawMix: Draw = (g, time) => {
  const t = time % MIX_PERIOD
  const fade = Math.min(span(t, 0, 0.4) + 0.0001, 1 - span(t, MIX_PERIOD - 0.6, MIX_PERIOD))
  const kX = span(t, 0.8, 1.6)
  const kY = span(t, 1.7, 2.5)
  const kB = span(t, 2.8, 3.8)
  const kF = span(t, 4.1, 5.0)
  const kA = Math.min(kX, kY)
  const done = t >= 5.0
  const P = iso(232, 150, 1)
  const seat = BASE.h
  const hover = BASE.h + PIN.h + 4
  const YAW0 = 0.45
  const yaw = YAW0 * (1 - kB)
  const start = { x: 52, y: -58, z: hover + 30 }
  // where the centre must be for hole A to sit over pin A at the starting angle
  const holeA0 = turn(-30, 0, YAW0)
  const aim = { x: PINS[0][0] - holeA0[0], y: PINS[0][1] - holeA0[1] }
  const holeA = turn(-30, 0, yaw)
  // X, then Y; after that the bracket turns about hole A
  const cx = kB > 0 ? PINS[0][0] - holeA[0] : start.x + (aim.x - start.x) * kX
  const cy = kB > 0 ? PINS[0][1] - holeA[1] : start.y + (aim.y - start.y) * kY
  const tz = start.z + (hover - start.z) * span(t, 0.8, 2.5) + (seat - hover) * kF
  const holes = [turn(-30, 0, yaw, cx, cy), turn(30, 0, yaw, cx, cy)]
  g.globalAlpha = fade

  prism(g, P, BASE.hx, BASE.hy, 0, 0, 0, 0, BASE.h, PLAIN)
  PINS.forEach(([x, y]) => cylinder(g, P, x, y, PIN.r, BASE.h, BASE.h + PIN.h, PLAIN))

  // the constraint links, grey until solved
  const pinTop = BASE.h + PIN.h
  const links: { a: Pt; b: Pt; k: number }[] = [
    { a: P(holes[0][0], holes[0][1], tz), b: P(PINS[0][0], PINS[0][1], pinTop), k: kA },
    { a: P(holes[1][0], holes[1][1], tz), b: P(PINS[1][0], PINS[1][1], pinTop), k: kB },
    { a: P(cx, cy, tz), b: P(cx, cy, BASE.h), k: kF },
  ]
  links.forEach(({ a, b, k }, i) => {
    if (k >= 1 || (i === 2 && kB < 1)) return
    g.strokeStyle = k > 0 ? BRAND : '#CFCFCF'
    g.setLineDash([3, 3])
    g.beginPath()
    g.moveTo(...a)
    g.lineTo(...b)
    g.stroke()
    g.setLineDash([])
  })

  // the guide for the axis being solved
  g.strokeStyle = BRAND
  g.lineWidth = 1.2
  if (kX > 0 && kX < 1) partLine(g, P(holes[0][0], holes[0][1], tz), P(PINS[0][0], holes[0][1], tz), 1)
  if (kY > 0 && kY < 1) partLine(g, P(holes[0][0], holes[0][1], tz), P(holes[0][0], PINS[0][1], tz), 1)
  if (kB > 0 && kB < 1) {
    // the arc hole B travels about pin A
    g.setLineDash([2, 3])
    g.beginPath()
    for (let i = 0; i <= 20; i++) {
      const a = yaw * (1 - i / 20)
      const [x, y] = turn(60, 0, a, PINS[0][0], PINS[0][1])
      const p = P(x, y, tz)
      if (i) g.lineTo(...p)
      else g.moveTo(...p)
    }
    g.stroke()
    g.setLineDash([])
  }
  g.lineWidth = 1

  // the bracket, with its two holes
  prism(g, P, BRACKET.hx, BRACKET.hy, yaw, cx, cy, tz, tz + BRACKET.h, done ? PLAIN : BLUE)
  holes.forEach(([x, y]) => {
    const [hx, hy] = P(x, y, tz + BRACKET.h)
    g.beginPath()
    g.ellipse(hx, hy, BRACKET.hole * 1.22, BRACKET.hole * 0.707, 0, 0, Math.PI * 2)
    g.fillStyle = '#FFFFFF'
    g.fill()
    g.strokeStyle = done ? INK : BRAND
    g.stroke()
  })
  if (tz + BRACKET.h < pinTop) PINS.forEach(([x, y]) => cylinder(g, P, x, y, PIN.r, tz + BRACKET.h, pinTop, PLAIN))

  if (done) {
    const pulse = 1 - span(t, 5.0, 5.8)
    if (pulse > 0) {
      g.globalAlpha = fade * pulse
      const k = 1 + (1 - pulse) * 0.25
      quad(g, [P(cx - BRACKET.hx * k, cy - BRACKET.hy * k, seat), P(cx + BRACKET.hx * k, cy - BRACKET.hy * k, seat), P(cx + BRACKET.hx * k, cy + BRACKET.hy * k, seat), P(cx - BRACKET.hx * k, cy + BRACKET.hy * k, seat)], null, BRAND)
      g.globalAlpha = fade
    }
    const [mx, my] = P(cx + BRACKET.hx, cy - BRACKET.hy, seat + BRACKET.h)
    g.fillStyle = BRAND
    g.fillRect(mx + 8, my - 9, 6, 6)
    label(g, figures.mated, mx + 18, my - 2, BRAND, 'left', 11)
  }

  // constraints and degrees of freedom, top left
  const ks = [kA, kB, kF]
  figures.constraints.forEach((name, i) => checkRow(g, 26 + i * 16, name, ks[i] >= 1 ? 'done' : ks[i] > 0 ? 'now' : 'todo'))
  const dof = done ? 0 : kB >= 1 ? 1 : kA >= 1 ? 2 : 6
  label(g, `${figures.dof} ${dof}`, 16, 84, dof === 0 ? BRAND : INK, 'left', 12)
  if (done) label(g, figures.constrained, 16, 100, BRAND, 'left', 11)

  // offsets, bottom right, counting down to zero
  const off: [string, number, number, string][] = [
    // hole A to pin A, then the bracket's height above its seat and its angle
    ['ΔX', holes[0][0] - PINS[0][0], kX, ''],
    ['ΔY', holes[0][1] - PINS[0][1], kY, ''],
    ['ΔZ', tz - seat, kF, ''],
    ['Δθ', (yaw * 180) / Math.PI, kB, '°'],
  ]
  off.forEach(([name, v, k, unit], i) => {
    const locked = Math.abs(v) < 0.05
    const c = locked ? BRAND : k > 0 ? INK : MUTED
    label(g, `${name} ${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}${unit}`, 384, 190 + i * 16, c, 'right', 11)
  })

  gizmo(g, 46, 214, { x: kX > 0, y: kY > 0, z: kB > 0 || kF > 0 })
  g.globalAlpha = 1
}

const DRAWS = [drawMix, drawDreams, drawDomains]
const STILLS = [6, 4.5, 0.6]

/** The illustration for contrarian point `i`. */
export function ContrarianFigure({ i }: { i: number }) {
  return <Figure draw={DRAWS[i]} still={STILLS[i]} label={figures.alts[i]} />
}
