import { sky001 } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef } from 'react'
import { CELLS, type PixelIconName } from '../lib/pixelIcons'

// Three small looping canvas illustrations for the contrarian points on the SKY-001 page (Ankit's
// picks, 2026-10-14): a part built one decision at a time, many designs dreamt at once from one
// input, and a globe with the page's domains in orbit. Each is drawn in a 400 × 250 design space
// scaled to its box, runs only while on screen, and shows one still frame for reduced motion.
// The parts and designs are drawn in code to explain the idea; they are not SKY-001 output.

const W = 400
const H = 250
const INK = '#1A1A1A'
const BRAND = '#3E57DA'
const PALE = '#B9C3F2'
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

// ---------------------------------------------------------------------------------------------
// 1. Not a plug-in: a plate built one decision at a time, with a wrong option rejected each step.
// ---------------------------------------------------------------------------------------------

const { figures } = sky001.contrarian
const STEP_S = 2.2
const CHAIN_PERIOD = 11

type Plate = { sketch: number; sketchShape?: 'rect' | 'circle'; h: number; bore: number; boreAt?: [number, number]; holes: number; holesInRow?: boolean }

/** Isometric point for plate coordinates (x, y on the ground, z up), centred on (ox, oy). */
const iso = (ox: number, oy: number, s: number) => (x: number, y: number, z: number) => [ox + (x - y) * 0.866 * s, oy + (x + y) * 0.5 * s - z * s] as const

const PX = 110
const PY = 74

function drawPlate(g: CanvasRenderingContext2D, ox: number, oy: number, s: number, p: Plate, ghost = false) {
  const P = iso(ox, oy, s)
  const poly = (pts: (readonly [number, number])[], fill: string | null, stroke: string, dash: number[] = []) => {
    g.beginPath()
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
    g.closePath()
    if (fill) {
      g.fillStyle = fill
      g.fill()
    }
    g.setLineDash(dash)
    g.strokeStyle = stroke
    g.stroke()
    g.setLineDash([])
  }
  const x0 = -PX / 2
  const x1 = PX / 2
  const y0 = -PY / 2
  const y1 = PY / 2
  g.lineWidth = 1
  g.lineJoin = 'round'
  const line = ghost ? GREY : INK
  const dash = ghost ? [3, 3] : []
  // the sketch on the ground, drawn along its outline
  if (p.sketch > 0 && p.h < 0.5) {
    g.strokeStyle = ghost ? GREY : BRAND
    g.lineWidth = ghost ? 1 : 1.6
    g.setLineDash(dash)
    g.beginPath()
    if (p.sketchShape === 'circle') {
      const [cx, cy] = P(0, 0, 0)
      g.ellipse(cx, cy, 44 * 1.22 * s, 44 * 0.707 * s, 0, 0, Math.PI * 2 * p.sketch)
    } else {
      const corners = [P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0), P(x0, y0, 0)]
      const lens = corners.slice(1).map((c, i) => Math.hypot(c[0] - corners[i][0], c[1] - corners[i][1]))
      let left = lens.reduce((a, b) => a + b, 0) * p.sketch
      g.moveTo(...corners[0])
      for (let i = 0; i < 4 && left > 0; i++) {
        const k = Math.min(1, left / lens[i])
        g.lineTo(corners[i][0] + (corners[i + 1][0] - corners[i][0]) * k, corners[i][1] + (corners[i + 1][1] - corners[i][1]) * k)
        left -= lens[i]
      }
    }
    g.stroke()
    g.setLineDash([])
    g.lineWidth = 1
    return
  }
  const h = p.h
  // the faint sketch it was extruded from
  if (!ghost) poly([P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0)], null, PALE, [3, 3])
  poly([P(x0, y1, 0), P(x1, y1, 0), P(x1, y1, h), P(x0, y1, h)], ghost ? null : '#EDEDED', line, dash)
  poly([P(x1, y0, 0), P(x1, y1, 0), P(x1, y1, h), P(x1, y0, h)], ghost ? null : '#D6D6D6', line, dash)
  poly([P(x0, y0, h), P(x1, y0, h), P(x1, y1, h), P(x0, y1, h)], ghost ? null : '#FFFFFF', line, dash)
  const hole = (x: number, y: number, r: number) => {
    const [cx, cy] = P(x, y, h)
    g.beginPath()
    g.ellipse(cx, cy, r * 1.22 * s, r * 0.707 * s, 0, 0, Math.PI * 2)
    if (!ghost) {
      g.fillStyle = '#E0E0E0'
      g.fill()
    }
    g.setLineDash(dash)
    g.strokeStyle = line
    g.stroke()
    g.setLineDash([])
  }
  if (p.bore > 0) {
    const [bx, by] = p.boreAt ?? [0, 0]
    hole(bx, by, 16 * p.bore)
  }
  const spots: [number, number][] = p.holesInRow
    ? [-39, -13, 13, 39].map((x) => [x, y1 - 11])
    : [
        [x0 + 13, y0 + 12],
        [x1 - 13, y0 + 12],
        [x1 - 13, y1 - 12],
        [x0 + 13, y1 - 12],
      ]
  for (let i = 0; i < Math.floor(p.holes); i++) hole(spots[i][0], spots[i][1], 5)
  const frac = p.holes % 1
  if (frac > 0) hole(spots[Math.floor(p.holes)][0], spots[Math.floor(p.holes)][1], 5 * frac)
}

const H_FULL = 26

/** Plate state after `step` steps are done and the current one is `k` of the way through. */
function plateAt(step: number, k: number): Plate {
  const p: Plate = { sketch: 1, h: 0, bore: 0, holes: 0 }
  if (step === 0) p.sketch = k
  if (step >= 1) p.h = step === 1 ? H_FULL * k : H_FULL
  if (step >= 2) p.bore = step === 2 ? k : 1
  if (step >= 3) p.holes = step === 3 ? 4 * k : 4
  return p
}

/** The wrong option tried at each step, drawn small and dashed beside the part. */
function wrongAt(step: number): Plate {
  const done = plateAt(step, 0)
  if (step === 0) return { ...done, sketch: 1, sketchShape: 'circle' }
  if (step === 1) return { ...done, h: 5 }
  if (step === 2) return { ...done, bore: 0.7, boreAt: [-38, -20] }
  return { ...done, holes: 4, holesInRow: true }
}

const drawChain: Draw = (g, time) => {
  const t = time % CHAIN_PERIOD
  const fade = 1 - span(t, CHAIN_PERIOD - 0.6, CHAIN_PERIOD)
  const step = Math.min(3, Math.floor(t / STEP_S))
  const u = t - step * STEP_S
  const allDone = t >= 4 * STEP_S
  const k = allDone ? 1 : span(u, 0.9, 1.9)
  g.globalAlpha = fade

  label(g, `${figures.step} 0${step + 1} / 04 · ${figures.steps[step]}`, 16, 26, INK, 'left', 12)

  // the part
  drawPlate(g, 152, 126, 1.12, plateAt(step, k))

  // the rejected option, tried first
  if (!allDone) {
    const shown = span(u, 0, 0.2) * (1 - span(u, 0.8, 1.0))
    if (shown > 0) {
      g.globalAlpha = fade * shown
      drawPlate(g, 322, 96, 0.6, wrongAt(step), true)
      const cross = span(u, 0.45, 0.75)
      g.strokeStyle = INK
      g.lineWidth = 1.5
      g.beginPath()
      g.moveTo(298, 72)
      g.lineTo(298 + 48 * cross, 72 + 48 * cross)
      if (cross > 0.5) {
        const c2 = (cross - 0.5) * 2
        g.moveTo(346, 72)
        g.lineTo(346 - 48 * c2, 72 + 48 * c2)
      }
      g.stroke()
      g.lineWidth = 1
      label(g, figures.rejected, 322, 150, MUTED, 'center', 10)
      g.globalAlpha = fade
    }
  }

  // the timeline of decisions
  const xs = [56, 152, 248, 344]
  const y = 204
  g.strokeStyle = '#E0E0E0'
  g.beginPath()
  g.moveTo(xs[0], y)
  g.lineTo(xs[3], y)
  g.stroke()
  const reached = allDone ? 3 : step - 1 + k
  if (reached > 0) {
    g.strokeStyle = BRAND
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(xs[0], y)
    const i = Math.min(2, Math.floor(reached))
    g.lineTo(xs[i] + (xs[i + 1] - xs[i]) * Math.min(1, reached - i), y)
    g.stroke()
    g.lineWidth = 1
  }
  xs.forEach((x, i) => {
    const done = allDone || i < step || (i === step && k >= 1)
    const current = i === step && !done
    g.fillStyle = done ? BRAND : '#FFFFFF'
    g.fillRect(x - 5, y - 5, 10, 10)
    g.strokeStyle = done || current ? BRAND : GREY
    g.strokeRect(x - 4.5, y - 4.5, 9, 9)
    label(g, figures.steps[i], x, y + 26, done || current ? BRAND : MUTED, 'center', 11)
  })
  g.globalAlpha = 1
}

// ---------------------------------------------------------------------------------------------
// 2. First model that can dream: fourteen different designs grow out of noise at the same moment
// around one input sketch, then one is picked.
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
  const dim = span(t, 3.2, 3.7)
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
      g.globalAlpha = fade * (picked && !isPick ? 1 - dim * 0.55 : 1)
      g.fillStyle = isPick ? BRAND : INK
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
// Not a plug-in, two more takes for review (?plugin=snap, ?plugin=voxel): reasoning in 3D space.
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
function solid(g: CanvasRenderingContext2D, P: ReturnType<typeof iso>, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, look: Look) {
  quad(g, [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], look.left, look.line)
  quad(g, [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], look.right, look.line)
  quad(g, [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], look.top, look.line)
}

/** X, Y and Z arrows from one corner; `lit` axes are blue. */
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

const SNAP_PERIOD = 7.6
const OFF = { x: 70, y: -55, z: 60 }

const drawSnap: Draw = (g, time) => {
  const t = time % SNAP_PERIOD
  const fade = Math.min(span(t, 0, 0.4) + 0.0001, 1 - span(t, SNAP_PERIOD - 0.6, SNAP_PERIOD))
  const kx = span(t, 0.8, 2.0)
  const ky = span(t, 2.2, 3.4)
  const kz = span(t, 3.6, 4.8)
  const mated = t >= 4.8
  const dx = OFF.x * (1 - kx)
  const dy = OFF.y * (1 - ky)
  const dz = OFF.z * (1 - kz) + Math.sin(t * 3) * 2 * (1 - kx)
  const P = iso(196, 158, 1)
  const BASE_H = 14
  const PART_H = 26
  g.globalAlpha = fade

  // the base, and where the part has to land on it
  solid(g, P, -62, -42, 0, 62, 42, BASE_H, PLAIN)
  if (!mated) quad(g, [P(-20, -20, BASE_H), P(20, -20, BASE_H), P(20, 20, BASE_H), P(-20, 20, BASE_H)], null, BRAND, [3, 3])

  // the guide for the axis being solved
  const z = BASE_H + dz
  g.strokeStyle = BRAND
  g.setLineDash([3, 3])
  g.beginPath()
  if (kx < 1) {
    g.moveTo(...P(dx, dy, z))
    g.lineTo(...P(0, dy, z))
  } else if (ky < 1) {
    g.moveTo(...P(0, dy, z))
    g.lineTo(...P(0, 0, z))
  } else if (kz < 1) {
    g.moveTo(...P(0, 0, z))
    g.lineTo(...P(0, 0, BASE_H))
  }
  g.stroke()
  g.setLineDash([])

  // the part
  solid(g, P, dx - 20, dy - 20, z, dx + 20, dy + 20, z + PART_H, mated ? PLAIN : BLUE)

  if (mated) {
    const pulse = 1 - span(t, 4.8, 5.6)
    if (pulse > 0) {
      g.globalAlpha = fade * pulse
      quad(g, [P(-20 - 14 * (1 - pulse), -20 - 14 * (1 - pulse), BASE_H), P(20 + 14 * (1 - pulse), -20 - 14 * (1 - pulse), BASE_H), P(20 + 14 * (1 - pulse), 20 + 14 * (1 - pulse), BASE_H), P(-20 - 14 * (1 - pulse), 20 + 14 * (1 - pulse), BASE_H)], null, BRAND)
      g.globalAlpha = fade
    }
    const [mx, my] = P(20, -20, BASE_H + PART_H)
    g.fillStyle = BRAND
    g.fillRect(mx + 12, my - 9, 6, 6)
    label(g, figures.mated, mx + 22, my - 2, BRAND, 'left', 11)
  }

  // offsets per axis, counting down to zero as each one locks
  const rows: [string, number, boolean, boolean][] = [
    ['X', dx, kx >= 1, kx > 0 && kx < 1],
    ['Y', dy, ky >= 1, ky > 0 && ky < 1],
    ['Z', dz, kz >= 1, kz > 0 && kz < 1],
  ]
  rows.forEach(([name, v, locked, active], i) => {
    const y = 26 + i * 17
    const c = locked ? BRAND : active ? INK : MUTED
    if (locked) {
      g.fillStyle = BRAND
      g.fillRect(16, y - 8, 7, 7)
    } else {
      g.strokeStyle = active ? INK : GREY
      g.strokeRect(16.5, y - 7.5, 6, 6)
    }
    label(g, `Δ${name} ${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}`, 30, y, c, 'left', 12)
  })

  gizmo(g, 46, 214, { x: kx > 0, y: ky > 0, z: kz > 0 })
  g.globalAlpha = 1
}

const NX = 6
const NY = 5
const NZ = 5
const VOX = 14
/** An L-bracket: a two-voxel-thick base with a bore, and a back wall with a window. */
const filled = (x: number, y: number, z: number) => {
  const mid = x >= 2 && x <= 3
  if (z <= 1) return !(mid && y >= 2 && y <= 3)
  return y <= 1 && !(mid && z === 3)
}
const VOXELS = (() => {
  const list: [number, number, number][] = []
  for (let z = 0; z < NZ; z++) for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) if (filled(x, y, z)) list.push([x, y, z])
  return list.sort((a, b) => a[2] - b[2] || a[0] + a[1] - (b[0] + b[1]))
})()
const VOXEL_PERIOD = 7.5
const LAYER_S = 1

const drawVoxels: Draw = (g, time) => {
  const t = time % VOXEL_PERIOD
  const fade = Math.min(span(t, 0, 0.3) + 0.0001, 1 - span(t, VOXEL_PERIOD - 0.5, VOXEL_PERIOD))
  const P0 = iso(212, 166, VOX)
  const P = (x: number, y: number, z: number) => P0(x - NX / 2, y - NY / 2, z)
  const layerNow = Math.min(NZ - 1, Math.floor(Math.max(0, t - 0.3) / LAYER_S))
  const done = t >= 0.3 + NZ * LAYER_S
  g.globalAlpha = fade

  // the floor grid and the bounding volume
  g.strokeStyle = '#E6E6E6'
  for (let x = 0; x <= NX; x++) {
    g.beginPath()
    g.moveTo(...P(x, 0, 0))
    g.lineTo(...P(x, NY, 0))
    g.stroke()
  }
  for (let y = 0; y <= NY; y++) {
    g.beginPath()
    g.moveTo(...P(0, y, 0))
    g.lineTo(...P(NX, y, 0))
    g.stroke()
  }
  quad(g, [P(0, 0, NZ), P(NX, 0, NZ), P(NX, NY, NZ), P(0, NY, NZ)], null, '#D0D0D0', [2, 4])
  ;[
    [0, 0],
    [NX, 0],
    [NX, NY],
    [0, NY],
  ].forEach(([x, y]) => {
    g.setLineDash([2, 4])
    g.strokeStyle = '#D0D0D0'
    g.beginPath()
    g.moveTo(...P(x, y, 0))
    g.lineTo(...P(x, y, NZ))
    g.stroke()
    g.setLineDash([])
  })

  // voxels, layer by layer
  let count = 0
  const perLayer = new Map<number, number>()
  const drawList: [number, number, number, number][] = []
  for (const [x, y, z] of VOXELS) {
    const idx = perLayer.get(z) ?? 0
    perLayer.set(z, idx + 1)
    const total = VOXELS.filter((v) => v[2] === z).length
    const start = 0.3 + z * LAYER_S + (idx / total) * LAYER_S * 0.75
    const k = clamp((t - start) / 0.18)
    if (k <= 0) continue
    count++
    drawList.push([x, y, z, k])
  }
  drawList
    .sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]) || a[2] - b[2])
    .forEach(([x, y, z, k]) => {
      const lift = (1 - k) * 0.8
      g.globalAlpha = fade * k
      solid(g, P, x, y, z + lift, x + 1, y + 1, z + 1 + lift, z === layerNow && !done ? BLUE : PLAIN)
    })
  g.globalAlpha = fade

  // the plane of the layer being built
  if (!done && t > 0.3) {
    const zl = layerNow + 1
    quad(g, [P(0, 0, zl), P(NX, 0, zl), P(NX, NY, zl), P(0, NY, zl)], null, BRAND, [4, 3])
    const [lx, ly] = P(NX, 0, zl)
    label(g, `Z ${zl}`, lx + 8, ly + 4, BRAND, 'left', 11)
  }

  label(g, `${figures.layer} Z 0${done ? NZ : layerNow + 1} / 0${NZ}`, 16, 26, INK, 'left', 12)
  label(g, `${figures.voxels} ${String(count).padStart(3, '0')}`, 16, 43, done ? BRAND : MUTED, 'left', 12)
  gizmo(g, 46, 214, { z: true, x: done, y: done })
  g.globalAlpha = 1
}


/** Rotate (x, y) about the origin by `a`, then translate. */
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

// Option 3: a turning part, marked up one measurement at a time.

const MARKUP_PERIOD = 8
const PLATE = { hx: 60, hy: 40, h: 14 }
const BOSS = { r: 16, h: 16, bore: 7 }

const drawMarkup: Draw = (g, time) => {
  const t = time % MARKUP_PERIOD
  const fade = Math.min(span(t, 0, 0.4) + 0.0001, 1 - span(t, MARKUP_PERIOD - 0.6, MARKUP_PERIOD))
  const yaw = Math.sin(time * 0.5) * 0.3
  const P = iso(238, 150, 1)
  const R = (x: number, y: number, z: number) => {
    const [a, b] = turn(x, y, yaw)
    return P(a, b, z)
  }
  const k = (i: number) => span(t, 0.6 + i * 0.9, 1.3 + i * 0.9)
  const { hx, hy, h } = PLATE
  const top = h + BOSS.h
  g.globalAlpha = fade

  prism(g, P, hx, hy, yaw, 0, 0, 0, h, PLAIN)
  cylinder(g, P, 0, 0, BOSS.r, h, top, PLAIN, BOSS.bore)

  g.strokeStyle = BRAND
  g.fillStyle = BRAND
  g.lineWidth = 1.2

  // 0 · the centre axis
  g.setLineDash([8, 3, 2, 3])
  partLine(g, P(0, 0, -10), P(0, 0, top + 26), k(0))
  g.setLineDash([])

  // 1 · length, along the front edge
  if (k(1) > 0) {
    const off = hy + 16
    g.setLineDash([2, 2])
    partLine(g, R(-hx, hy + 3, 0), R(-hx, off + 4, 0), k(1))
    partLine(g, R(hx, hy + 3, 0), R(hx, off + 4, 0), k(1))
    g.setLineDash([])
    const a = R(-hx, off, 0)
    const b = R(hx, off, 0)
    partLine(g, a, b, k(1))
    if (k(1) >= 1) {
      g.fillRect(a[0] - 2, a[1] - 2, 4, 4)
      g.fillRect(b[0] - 2, b[1] - 2, 4, 4)
      const m = R(0, off + 12, 0)
      label(g, String(hx * 2), m[0], m[1] + 8, BRAND, 'center', 11)
    }
  }

  // 2 · height, at the right corner
  if (k(2) > 0) {
    const a = R(hx + 12, hy, 0)
    const b = R(hx + 12, hy, h)
    partLine(g, a, b, k(2))
    if (k(2) >= 1) {
      g.fillRect(a[0] - 2, a[1] - 2, 4, 4)
      g.fillRect(b[0] - 2, b[1] - 2, 4, 4)
      label(g, String(h), b[0] + 8, (a[1] + b[1]) / 2 + 4, BRAND, 'left', 11)
    }
  }

  // 3 · the right angle at the far-right corner of the top
  if (k(3) > 0) {
    const r = 14
    g.beginPath()
    const n = 16
    for (let i = 0; i <= n * k(3); i++) {
      const a = (i / n) * (Math.PI / 2)
      const p = R(hx - r * Math.cos(a), -hy + r * Math.sin(a), h)
      if (i) g.lineTo(...p)
      else g.moveTo(...p)
    }
    g.stroke()
    if (k(3) >= 1) {
      const p = R(hx - 26, -hy + 10, h)
      label(g, '90°', p[0], p[1] - 4, BRAND, 'center', 11)
    }
  }

  // 4 · the boss diameter, across its top
  if (k(4) > 0) {
    const [cx, cy] = P(0, 0, top)
    const rx = BOSS.r * 1.22
    partLine(g, [cx - rx, cy] as const, [cx + rx, cy] as const, k(4))
    if (k(4) >= 1) {
      g.beginPath()
      g.moveTo(cx + rx, cy)
      g.lineTo(cx + rx + 18, cy - 12)
      g.lineTo(cx + rx + 30, cy - 12)
      g.stroke()
      label(g, `Ø ${BOSS.r * 2}`, cx + rx + 33, cy - 8, BRAND, 'left', 11)
    }
  }
  g.lineWidth = 1

  figures.markup.forEach((name, i) => checkRow(g, 26 + i * 16, name, k(i) >= 1 ? 'done' : k(i) > 0 ? 'now' : 'todo'))
  g.globalAlpha = 1
}

// Option 4: a bracket mated to a base by constraints, its degrees of freedom counting down.

const CONSTRAIN_PERIOD = 8
const BASE = { hx: 64, hy: 38, h: 12 }
const PINS: [number, number][] = [
  [-30, 0],
  [30, 0],
]
const PIN = { r: 6, h: 14 }
const BRACKET = { hx: 46, hy: 17, h: 10, hole: 7.5 }

const drawConstrain: Draw = (g, time) => {
  const t = time % CONSTRAIN_PERIOD
  const fade = Math.min(span(t, 0, 0.4) + 0.0001, 1 - span(t, CONSTRAIN_PERIOD - 0.6, CONSTRAIN_PERIOD))
  const kA = span(t, 0.8, 2.0)
  const kB = span(t, 2.3, 3.5)
  const kF = span(t, 3.8, 4.8)
  const done = t >= 4.8
  const P = iso(226, 150, 1)
  const seat = BASE.h
  const hover = BASE.h + PIN.h + 4
  // start: turned and off to the side, high up
  const yaw = 0.45 * (1 - kB)
  const start = { x: 52, y: -58, z: hover + 30 }
  // hole A is local (-30, 0); once A is solved it sits over pin A and the bracket turns about it
  const holeA = turn(-30, 0, yaw)
  const aimX = PINS[0][0] - holeA[0]
  const aimY = PINS[0][1] - holeA[1]
  const tx = start.x + (aimX - start.x) * kA
  const ty = start.y + (aimY - start.y) * kA
  const tz = start.z + (hover - start.z) * kA + (seat - hover) * kF
  const holes = [turn(-30, 0, yaw, tx, ty), turn(30, 0, yaw, tx, ty)]
  g.globalAlpha = fade

  prism(g, P, BASE.hx, BASE.hy, 0, 0, 0, 0, BASE.h, PLAIN)
  PINS.forEach(([x, y]) => cylinder(g, P, x, y, PIN.r, BASE.h, BASE.h + PIN.h, PLAIN))

  // the constraint links, grey until solved
  const links: { a: Pt; b: Pt; k: number }[] = [
    { a: P(holes[0][0], holes[0][1], tz), b: P(PINS[0][0], PINS[0][1], BASE.h + PIN.h), k: kA },
    { a: P(holes[1][0], holes[1][1], tz), b: P(PINS[1][0], PINS[1][1], BASE.h + PIN.h), k: kB },
    { a: P(tx, ty, tz), b: P(0, 0, BASE.h), k: kF },
  ]
  links.forEach(({ a, b, k }) => {
    if (k >= 1) return
    g.strokeStyle = k > 0 ? BRAND : GREY
    g.setLineDash([3, 3])
    g.beginPath()
    g.moveTo(...a)
    g.lineTo(...b)
    g.stroke()
    g.setLineDash([])
  })

  // the bracket, with its two holes
  prism(g, P, BRACKET.hx, BRACKET.hy, yaw, tx, ty, tz, tz + BRACKET.h, done ? PLAIN : BLUE)
  holes.forEach(([x, y]) => {
    const [cx, cy] = P(x, y, tz + BRACKET.h)
    g.beginPath()
    g.ellipse(cx, cy, BRACKET.hole * 1.22, BRACKET.hole * 0.707, 0, 0, Math.PI * 2)
    g.fillStyle = '#FFFFFF'
    g.fill()
    g.strokeStyle = done ? INK : BRAND
    g.stroke()
  })
  // pins showing through the holes once it is seated
  if (tz + BRACKET.h < BASE.h + PIN.h) PINS.forEach(([x, y]) => cylinder(g, P, x, y, PIN.r, tz + BRACKET.h, BASE.h + PIN.h, PLAIN))

  if (done) {
    const pulse = 1 - span(t, 4.8, 5.6)
    if (pulse > 0) {
      g.globalAlpha = fade * pulse
      g.strokeStyle = BRAND
      const grow = 1 + (1 - pulse) * 0.25
      quad(g, [P(-BRACKET.hx * grow, -BRACKET.hy * grow, seat), P(BRACKET.hx * grow, -BRACKET.hy * grow, seat), P(BRACKET.hx * grow, BRACKET.hy * grow, seat), P(-BRACKET.hx * grow, BRACKET.hy * grow, seat)], null, BRAND)
      g.globalAlpha = fade
    }
  }

  const ks = [kA, kB, kF]
  figures.constraints.forEach((name, i) => checkRow(g, 26 + i * 16, name, ks[i] >= 1 ? 'done' : ks[i] > 0 ? 'now' : 'todo'))
  const dof = done ? 0 : kB >= 1 ? 1 : kA >= 1 ? 2 : 6
  label(g, `${figures.dof} ${dof}`, 16, 84, dof === 0 ? BRAND : INK, 'left', 12)
  if (done) label(g, figures.constrained, 16, 100, BRAND, 'left', 11)
  g.globalAlpha = 1
}

const PLUGIN_TAKES = { snap: { draw: drawSnap, still: 5.6, alt: figures.snapAlt }, voxel: { draw: drawVoxels, still: 6.2, alt: figures.voxelAlt }, markup: { draw: drawMarkup, still: 6, alt: figures.markupAlt }, constrain: { draw: drawConstrain, still: 6, alt: figures.constrainAlt } } as const

const DRAWS = [drawChain, drawDreams, drawDomains]
const STILLS = [4 * STEP_S + 0.5, 4.5, 0.6]

/** The illustration for contrarian point `i`. */
export function ContrarianFigure({ i }: { i: number }) {
  const take = i === 0 ? PLUGIN_TAKES[new URLSearchParams(window.location.search).get('plugin') as keyof typeof PLUGIN_TAKES] : undefined
  if (take) return <Figure draw={take.draw} still={take.still} label={take.alt} />
  return <Figure draw={DRAWS[i]} still={STILLS[i]} label={figures.alts[i]} />
}
