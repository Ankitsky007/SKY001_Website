// The "enterprise campus" hero: an enterprise drawn as one isometric campus on a 2D canvas.
// Eight departments sit on a slab with a world model floating above them. Work is handed between
// departments in a random order, several hand-offs at a time, each travelling as a pulse along the
// boulevard between the two rows; every hand-off that lands adds to MRR on the long floor at the
// front, where the operating log also runs. All text comes from `campus` and `campusFlow` in
// @skyfall/core; the geometry lives here.
import { campus, campusFlow } from '@skyfall/core'

export type CampusPalette = {
  bg: string
  /** Slab top. */
  carbon: string
  /** Roofs. */
  panel: string
  /** Wall facing the viewer's left, and the darker one facing right. */
  faceL: string
  faceR: string
  rule: string
  ruleHi: string
  /** Line and text colour. */
  paper: string
  muted: string
  blue: string
  /** Accent used for active lines and labels. */
  lift: string
  /** Plate behind each department's name on the ground. */
  label: string
  /** Soft shadow under the slab. */
  shadow: string
}

export const CAMPUS_LIGHT: CampusPalette = { bg: '#FFFFFF', carbon: '#F4F5F8', panel: '#FFFFFF', faceL: '#EEF0F5', faceR: '#DFE3EB', rule: '#D9DCE2', ruleHi: '#B7BCC7', paper: '#1A1A1A', muted: '#7A7A7A', blue: '#3E57DA', lift: '#3E57DA', label: '#E6E8EE', shadow: 'rgba(30,40,80,0.16)' }
export const CAMPUS_DARK: CampusPalette = { bg: '#07080A', carbon: '#111419', panel: '#1B1F27', faceL: '#13161C', faceR: '#0C0E12', rule: '#262A32', ruleHi: '#3A3F4B', paper: '#ECEDEF', muted: '#8B90A0', blue: '#3E57DA', lift: '#6F83F0', label: '#22262E', shadow: 'rgba(0,0,0,0.6)' }

type DeptKey = keyof typeof campus.departments
type Pt = [number, number]
type P3 = [number, number, number]
/** A building inside a unit tile: u, v, width, depth, height. */
type Block = [number, number, number, number, number]
type Detail = 'tickets' | 'windows' | 'racks' | 'mast' | 'vault' | 'silos'

const MONO = "'Geist Mono',ui-monospace,Menlo,monospace"

// Departments on a 4 x 2 grid (row 0 at the back). Heights in the front row stay under the depth
// of the boulevard, so no front-row building ever covers a back-row name.
const GEO: Record<DeptKey, { g: Pt; b: Block[]; detail: Detail }> = {
  support: { g: [0, 0], b: [[0.12, 0.15, 0.18, 0.18, 0.12], [0.42, 0.15, 0.18, 0.18, 0.12], [0.72, 0.15, 0.18, 0.18, 0.12], [0.12, 0.52, 0.18, 0.18, 0.12], [0.42, 0.52, 0.18, 0.18, 0.12], [0.72, 0.52, 0.18, 0.18, 0.2]], detail: 'tickets' },
  product: { g: [1, 0], b: [[0.25, 0.2, 0.5, 0.5, 0.42], [0.36, 0.31, 0.28, 0.28, 0.62]], detail: 'windows' },
  design: { g: [2, 0], b: [[0.15, 0.15, 0.08, 0.6, 0.5], [0.42, 0.15, 0.08, 0.6, 0.62], [0.69, 0.15, 0.08, 0.6, 0.44]], detail: 'windows' },
  engineering: { g: [3, 0], b: [[0.1, 0.1, 0.14, 0.7, 0.34], [0.33, 0.1, 0.14, 0.7, 0.34], [0.56, 0.1, 0.14, 0.7, 0.34], [0.79, 0.1, 0.14, 0.7, 0.34]], detail: 'racks' },
  marketing: { g: [3, 1], b: [[0.2, 0.5, 0.4, 0.35, 0.18], [0.66, 0.3, 0.06, 0.06, 0.78]], detail: 'mast' },
  sales: { g: [2, 1], b: [[0.15, 0.25, 0.32, 0.32, 0.68], [0.55, 0.5, 0.3, 0.3, 0.46]], detail: 'windows' },
  finance: { g: [1, 1], b: [[0.3, 0.25, 0.38, 0.38, 0.8], [0.12, 0.7, 0.25, 0.2, 0.2]], detail: 'vault' },
  operations: { g: [0, 1], b: [[0.1, 0.2, 0.8, 0.45, 0.22], [0.2, 0.78, 0.12, 0.12, 0.36], [0.5, 0.78, 0.12, 0.12, 0.36]], detail: 'silos' },
}
const KEYS = Object.keys(GEO) as DeptKey[]
const PITCH = 1.4 // column pitch; tiles are 1 x 1
const ROW_Z = [0, 1.9] // z of each row; the gap between them is the boulevard
const LANE = 1.45 // where hand-offs travel, mid-boulevard
const EXT: Pt = [3 * PITCH + 1, ROW_Z[1] + 1]
const M = 0.35 // slab margin
const TH = 0.28 // slab thickness
// the long floor at the front: MRR at its right end, the operating log along the rest
const FLOOR = { x0: -M, x1: EXT[0] + M, z0: EXT[1] + M + 0.22, z1: EXT[1] + M + 1.3, top: -0.12, base: -0.36 }
const SPLIT = 3.85 // where the log stops and the MRR figure starts, along x

const tile = (k: DeptKey): Pt => [GEO[k].g[0] * PITCH, ROW_Z[GEO[k].g[1]]]
const tc = (k: DeptKey): Pt => [tile(k)[0] + 0.5, tile(k)[1] + 0.5]

/** The road from a department's edge out to the boulevard: back row leaves from its front, front row from its back. */
function door(k: DeptKey): { x: number; edge: number } {
  const [x0, z0] = tile(k)
  return GEO[k].g[1] === 0 ? { x: x0 + 0.9, edge: z0 + 1 } : { x: x0 + 0.1, edge: z0 }
}

/** The route of a hand-off: out of one department, along the boulevard, into the other. */
function route(a: DeptKey, b: DeptKey): Pt[] {
  const p = door(a)
  const q = door(b)
  return [
    [p.x, p.edge],
    [p.x, LANE],
    [q.x, LANE],
    [q.x, q.edge],
  ]
}
function pathLength(pts: Pt[]) {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return L
}
/** The point at distance d along a route. */
function along(pts: Pt[], d: number): Pt {
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    if (d <= l || i === pts.length - 1) {
      const f = l ? cl(d / l) : 0
      return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]
    }
    d -= l
  }
  return pts[pts.length - 1]
}

const LOOP = 48

const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const seg = (t: number, a: number, b: number) => cl((t - a) / (b - a))
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}
const up = (s: string) => s.toUpperCase()

/** A small seeded generator, so each loop plays a different but repeatable order. */
function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Hand = { from: DeptKey; to: DeptKey; artefact: string; log: string; k: number; t0: number; t1: number; bounce: boolean; path: Pt[]; L: number }
type Log = { t: number; who: DeptKey | 'model'; text: string; key: boolean }
type Plan = { hands: Hand[]; logs: Log[]; model: number[] }

/** One loop's schedule: hand-offs drawn at random from the pool, overlapping, with the guardrail once in the middle. */
function plan(seed: number): Plan {
  const r = mulberry(seed * 7919 + 13)
  const pool = campusFlow.handoffs
  const hands: Hand[] = []
  const make = (h: { from: string; to: string; artefact: string; log: string }, t0: number, k: number, bounce: boolean): Hand => {
    const path = route(h.from as DeptKey, h.to as DeptKey)
    const L = pathLength(path)
    return { from: h.from as DeptKey, to: h.to as DeptKey, artefact: h.artefact, log: h.log, k, t0, t1: t0 + (bounce ? 2.6 : 0.7 + L * 0.3), bounce, path, L }
  }
  const recent: number[] = []
  let guarded = false
  let t = 1.2
  while (t < LOOP - 4) {
    if (!guarded && t > LOOP * 0.42) {
      guarded = true
      hands.push(make(campusFlow.guardrail, t, 0, true))
      t += 1.4
      continue
    }
    let i = Math.floor(r() * pool.length)
    for (let n = 0; n < 6 && recent.includes(i); n++) i = Math.floor(r() * pool.length)
    recent.push(i)
    if (recent.length > 4) recent.shift()
    const h = pool[i]
    hands.push(make(h, t, h.k, false))
    t += 0.5 + r() * 0.9
  }
  const model = [0.5, LOOP * 0.34, LOOP * 0.7]
  const logs: Log[] = [
    ...hands.map((h) => ({ t: h.t1, who: h.to, text: h.log, key: h.bounce })),
    ...model.map((t, i) => ({ t, who: 'model' as const, text: campusFlow.modelLines[(i + seed) % campusFlow.modelLines.length], key: true })),
  ].sort((a, b) => a.t - b.t)
  return { hands, logs, model }
}

function inPoly(p: Pt[], x: number, y: number) {
  let c = false
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if (p[i][1] > y !== p[j][1] > y && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) c = !c
  }
  return c
}

export type CampusOptions = {
  palette: CampusPalette
  /** Right edge of the hero copy in px from the canvas's left, so the campus keeps clear of it. 0 when the copy is stacked above. */
  textRight: () => number
  /** Draw one finished frame and stop (reduced motion). */
  still: boolean
}

/** Starts the campus on a canvas and returns a function that stops it and removes its listeners. */
export function startCampus(cv: HTMLCanvasElement, { palette: C, textRight, still }: CampusOptions) {
  const context = cv.getContext('2d')
  if (!context) return () => {}
  const g: CanvasRenderingContext2D = context

  let W = 0
  let H = 0
  let narrow = false
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  const V = { cx: 0, cy: 0, s: 1, zoom: 1, fx: 0, fz: 0, cos: 1, sin: 0 }
  const mouse = { x: -1, y: -1, in: false }
  let hover: DeptKey | null = null
  let zoomKey: DeptKey | null = null
  let zoomT = -9
  let seed = 1
  let story = plan(seed)
  // `?campusT=20` starts the story at that second, for reviewing one moment
  const startAt = Number(new URLSearchParams(window.location.search).get('campusT'))
  let T = still ? LOOP - 3 : cl(startAt || 0, 0, LOOP)
  let clock = 0 // seconds since start, for the camera drift
  let last = performance.now()
  let raf = 0
  let visible = true
  let ground: HTMLCanvasElement | null = null

  const resize = () => {
    const r = cv.getBoundingClientRect()
    W = r.width
    H = r.height
    narrow = W < 1024
    cv.width = Math.round(W * DPR)
    cv.height = Math.round(H * DPR)
    g.setTransform(DPR, 0, 0, DPR, 0, 0)
    if (still) frame(performance.now())
  }

  /** World to screen, through the isometric camera, turned a few degrees by the drift. */
  const P = (x: number, y: number, z: number): Pt => {
    const dx = x - V.fx
    const dz = z - V.fz
    const rx = dx * V.cos - dz * V.sin
    const rz = dx * V.sin + dz * V.cos
    const X = (rx - rz) * 0.866
    const Y = (rx + rz) * 0.5 - y
    return [V.cx + X * V.s * V.zoom, V.cy + Y * V.s * V.zoom]
  }
  const trace = (pts: Pt[]) => {
    g.beginPath()
    pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])))
    g.closePath()
  }
  const poly = (pts: Pt[], fill: string | null, stroke: string | null, a: number, lw = 1) => {
    trace(pts)
    if (fill) {
      g.globalAlpha = a
      g.fillStyle = fill
      g.fill()
    }
    if (stroke) {
      g.globalAlpha = a
      g.strokeStyle = stroke
      g.lineWidth = lw
      g.stroke()
    }
  }
  const line = (a: Pt, b: Pt) => {
    g.beginPath()
    g.moveTo(a[0], a[1])
    g.lineTo(b[0], b[1])
    g.stroke()
  }
  const label = (t: string, x: number, y: number, size: number, col: string, align: CanvasTextAlign = 'left', weight = 400) => {
    g.font = `${weight} ${size}px ${MONO}`
    g.fillStyle = col
    g.textAlign = align
    g.textBaseline = 'alphabetic'
    g.fillText(t, x, y)
  }

  /** A shaded box: lit roof, a light wall to the left, a darker wall to the right. `roof` tints the roof when the department is working. */
  const box = (x0: number, z0: number, w: number, d: number, h: number, y0: number, stroke: string, a: number, lw = 1, roof = 0) => {
    const x1 = x0 + w
    const z1 = z0 + d
    const y1 = y0 + h
    poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], C.faceR, stroke, a, lw)
    poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], C.faceL, stroke, a, lw)
    const top: Pt[] = [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]
    poly(top, C.panel, stroke, a, lw)
    if (roof > 0) {
      g.globalAlpha = a * roof * 0.65
      g.fillStyle = C.blue
      trace(top)
      g.fill()
    }
  }

  /** Floor lines across a building's two visible walls. */
  const windows = (x0: number, z0: number, w: number, d: number, h: number, a: number, col: string) => {
    if (h < 0.3) return
    g.globalAlpha = a * 0.35
    g.strokeStyle = col
    g.lineWidth = 0.6
    g.beginPath()
    for (let y = 0.1; y < h - 0.05; y += 0.1) {
      g.moveTo(...P(x0 + 0.03, y, z0 + d))
      g.lineTo(...P(x0 + w - 0.03, y, z0 + d))
      g.moveTo(...P(x0 + w, y, z0 + 0.03))
      g.lineTo(...P(x0 + w, y, z0 + d - 0.03))
    }
    g.stroke()
  }

  /** An upright cylinder (silo), drawn as its shaded silhouette and a roof ellipse. */
  const cylinder = (cx: number, cz: number, r: number, h: number, stroke: string, a: number, roof: number) => {
    const ring = (y: number, a0: number, a1: number, n = 18): Pt[] => Array.from({ length: n + 1 }, (_, i) => P(cx + r * Math.cos(lerp(a0, a1, i / n)), y, cz + r * Math.sin(lerp(a0, a1, i / n))))
    // the half that faces the viewer runs from 135° down through 45° to -45°
    const side = [...ring(0, (3 * Math.PI) / 4, -Math.PI / 4), ...ring(h, -Math.PI / 4, (3 * Math.PI) / 4)]
    poly(side, C.faceL, stroke, a)
    const top = ring(h, 0, Math.PI * 2, 32)
    poly(top, C.panel, stroke, a)
    if (roof > 0) {
      g.globalAlpha = a * roof * 0.65
      g.fillStyle = C.blue
      trace(top)
      g.fill()
    }
  }

  /** The dotted ground around the slab, fading out on all sides. */
  function drawGround(A: number) {
    ground ??= document.createElement('canvas')
    if (ground.width !== cv.width || ground.height !== cv.height) {
      ground.width = cv.width
      ground.height = cv.height
    }
    const q = ground.getContext('2d')
    if (!q) return
    q.setTransform(1, 0, 0, 1, 0, 0)
    q.globalCompositeOperation = 'source-over'
    q.clearRect(0, 0, ground.width, ground.height)
    q.setTransform(DPR, 0, 0, DPR, 0, 0)
    const sp = 0.35
    const n = 18
    const y = FLOOR.base
    q.fillStyle = C.ruleHi
    for (let i = -n; i <= Math.round(EXT[0] / sp) + n; i++) {
      for (let j = -n; j <= Math.round(FLOOR.z1 / sp) + n; j++) {
        const p = P(i * sp, y, j * sp)
        const major = i % 4 === 0 && j % 4 === 0
        q.globalAlpha = major ? 1 : 0.7
        const s = major ? 2 : 1.3
        q.fillRect(p[0] - s / 2, p[1] - s / 2, s, s)
      }
    }
    const c = P(EXT[0] / 2, y, FLOOR.z1 / 2)
    const rx = Math.min(W * 0.55, 7.6 * V.s * V.zoom)
    q.globalCompositeOperation = 'destination-in'
    q.globalAlpha = 1
    q.save()
    q.translate(c[0], c[1])
    q.scale(1, 0.58)
    const gr = q.createRadialGradient(0, 0, rx * 0.3, 0, 0, rx)
    gr.addColorStop(0, 'rgba(0,0,0,1)')
    gr.addColorStop(0.55, 'rgba(0,0,0,.5)')
    gr.addColorStop(1, 'rgba(0,0,0,0)')
    q.fillStyle = gr
    q.fillRect(-rx * 2, -rx * 3, rx * 4, rx * 6)
    q.restore()
    q.globalCompositeOperation = 'source-over'
    g.save()
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.globalAlpha = A
    g.drawImage(ground, 0, 0)
    g.restore()
  }

  /** Sets a transform that draws flat on the ground plane at height y, with (0,0) at world (x, z) and 100 units per world unit. */
  const U = 100
  const onPlane = (x: number, y: number, z: number) => {
    const o = P(x, y, z)
    const ex = P(x + 1, y, z)
    const ez = P(x, y, z + 1)
    g.setTransform((DPR * (ex[0] - o[0])) / U, (DPR * (ex[1] - o[1])) / U, (DPR * (ez[0] - o[0])) / U, (DPR * (ez[1] - o[1])) / U, DPR * o[0], DPR * o[1])
  }

  /** MRR in $ at story time T: it climbs from the start figure to the end figure over the loop, each landed hand-off adding its share as it rolls in. */
  const mrr = () => {
    const { start, end } = campusFlow.mrr
    let total = 0
    let done = 0
    for (const h of story.hands) {
      if (h.bounce) continue
      total += h.k
      if (T >= h.t1) done += h.k * ease(seg(T, h.t1, h.t1 + 0.8))
    }
    return total ? start + (end - start) * (done / total) : start
  }

  /** The long floor at the front: the operating log on the left, MRR on the right. */
  function drawFloor(k: number, A: number) {
    const { x0, x1, z0, z1, top, base } = FLOOR
    // walls and top
    poly([P(x1, base, z0), P(x1, top, z0), P(x1, top, z1), P(x1, base, z1)], C.faceR, C.ruleHi, A * 0.9)
    poly([P(x0, base, z1), P(x1, base, z1), P(x1, top, z1), P(x0, top, z1)], C.faceL, C.ruleHi, A * 0.9)
    poly([P(x0, top, z0), P(x1, top, z0), P(x1, top, z1), P(x0, top, z1)], C.panel, C.ruleHi, A)
    // the divider between log and figure
    g.globalAlpha = A * 0.8
    g.strokeStyle = C.ruleHi
    g.lineWidth = 1
    line(P(SPLIT, top, z0 + 0.08), P(SPLIT, top, z1 - 0.08))
    const booking = story.hands.some((h) => !h.bounce && T >= h.t1 && T < h.t1 + 0.9)
    const depth = z1 - z0
    g.save()
    onPlane(x0, top, z0)
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    // log: a header, then the latest lines, newest first, sliding down as new ones arrive
    const lw = (SPLIT - x0 - 0.2) * U
    const head = depth * U * 0.16
    g.globalAlpha = A
    g.fillStyle = C.lift
    g.font = `500 ${head * 0.7}px ${MONO}`
    g.fillText(`■ ${up(campusFlow.labels.log)}`, 14, head * 0.75)
    const seen = story.logs.filter((l) => T >= l.t)
    const rows = 4
    const rh = (depth * U - head * 1.35) / rows
    const newest = seen.length ? seen[seen.length - 1] : null
    const slide = newest ? 1 - ease(cl((T - newest.t) / 0.35)) : 0
    const shown = seen.slice(-rows - 1).reverse()
    g.save()
    g.beginPath()
    g.rect(0, head * 1.3, lw + 14, rows * rh)
    g.clip()
    shown.forEach((l, i) => {
      const y = head * 1.3 + (i - slide) * rh + rh / 2
      const who = up(l.who === 'model' ? campusFlow.model : campus.departments[l.who].name)
      const text = l.text.includes(' · ') ? l.text.slice(l.text.indexOf(' · ') + 3) : l.text
      let fs = rh * 0.42
      g.font = `400 ${fs}px ${MONO}`
      const str = `${who}  ${text}`
      const tw = g.measureText(str).width
      if (tw > lw) fs *= lw / tw
      g.globalAlpha = A * (i === 0 ? 1 : Math.max(0.25, 0.8 - i * 0.16))
      g.font = `500 ${fs}px ${MONO}`
      g.fillStyle = i === 0 || l.key ? C.lift : C.muted
      g.fillText(who, 14, y)
      const ww = g.measureText(`${who}  `).width
      g.font = `400 ${fs}px ${MONO}`
      g.fillStyle = i === 0 ? C.paper : C.muted
      g.fillText(text, 14 + ww, y)
    })
    g.restore()
    // MRR: a label and the figure, filling the right end
    const mx = (SPLIT - x0) * U + 16
    const mw = (x1 - SPLIT) * U - 30
    g.globalAlpha = A
    g.fillStyle = C.lift
    g.font = `500 ${head * 0.7}px ${MONO}`
    g.fillText(up(campusFlow.labels.mrr), mx, head * 0.75)
    const fig = `$${Math.round(mrr()).toLocaleString('en-US')}`
    let fs = depth * U * 0.42
    g.font = `500 ${fs}px ${MONO}`
    const fw = g.measureText(fig).width
    if (fw > mw) fs *= mw / fw
    g.font = `500 ${fs}px ${MONO}`
    g.fillStyle = booking ? C.lift : C.paper
    g.fillText(fig, mx, head * 1.3 + (depth * U - head * 1.3) / 2)
    g.restore()
    g.setTransform(DPR, 0, 0, DPR, 0, 0)
    g.textBaseline = 'alphabetic'
    void k
  }

  /** How strongly a department shows as working: just received work, or sending some. */
  const busy = (key: DeptKey) => {
    let v = 0
    for (const h of story.hands) {
      if (h.to === key && !h.bounce && T >= h.t1) v = Math.max(v, cl(1 - (T - h.t1) / 2.4))
      if (h.from === key && T >= h.t0 - 0.3 && T < h.t1) v = Math.max(v, 0.7)
    }
    return v
  }

  function drawCampus(k: number, A: number) {
    drawGround(A)
    const c0: P3 = [-M, 0, -M]
    const c1: P3 = [EXT[0] + M, 0, -M]
    const c2: P3 = [EXT[0] + M, 0, EXT[1] + M]
    const c3: P3 = [-M, 0, EXT[1] + M]
    // soft shadow under the slab and the floor
    g.save()
    g.shadowColor = C.shadow
    g.shadowBlur = 46 * DPR * Math.max(0.6, k)
    g.shadowOffsetY = 22 * DPR * Math.max(0.6, k)
    poly([P(c0[0], -TH, c0[2]), P(c1[0], -TH, c1[2]), P(c2[0], FLOOR.base, FLOOR.z1), P(c3[0], FLOOR.base, FLOOR.z1)], C.bg, null, A * 0.9)
    g.restore()
    // slab
    poly([P(c1[0], 0, c1[2]), P(c2[0], 0, c2[2]), P(c2[0], -TH, c2[2]), P(c1[0], -TH, c1[2])], C.faceR, C.ruleHi, A * 0.9)
    poly([P(c3[0], 0, c3[2]), P(c2[0], 0, c2[2]), P(c2[0], -TH, c2[2]), P(c3[0], -TH, c3[2])], C.faceL, C.ruleHi, A * 0.9)
    poly([P(c0[0], 0, c0[2]), P(c1[0], 0, c1[2]), P(c2[0], 0, c2[2]), P(c3[0], 0, c3[2])], C.carbon, C.ruleHi, A)
    drawFloor(k, A)
    // dots on the slab
    g.globalAlpha = A * 0.5
    g.fillStyle = C.ruleHi
    for (let x = -M + 0.175; x < EXT[0] + M; x += 0.35) {
      for (let z = -M + 0.175; z < EXT[1] + M; z += 0.35) {
        const p = P(x, 0, z)
        g.fillRect(p[0] - 0.6, p[1] - 0.6, 1.2, 1.2)
      }
    }
    // the boulevard: two kerbs, a dashed centre line, and a dashed road from each department
    g.globalAlpha = A * 0.7
    g.strokeStyle = C.ruleHi
    g.lineWidth = 1
    line(P(-M + 0.1, 0, LANE - 0.16), P(EXT[0] + M - 0.1, 0, LANE - 0.16))
    line(P(-M + 0.1, 0, LANE + 0.16), P(EXT[0] + M - 0.1, 0, LANE + 0.16))
    g.setLineDash([3, 5])
    g.globalAlpha = A * 0.5
    line(P(-M + 0.2, 0, LANE), P(EXT[0] + M - 0.2, 0, LANE))
    for (const key of KEYS) {
      const d = door(key)
      line(P(d.x, 0, d.edge), P(d.x, 0, LANE + (GEO[key].g[1] ? 0.16 : -0.16)))
    }
    g.setLineDash([])
    // hover
    hover = null
    if (mouse.in) {
      for (const key of KEYS) {
        const [x0, z0] = tile(key)
        if (inPoly([P(x0, 0, z0), P(x0 + 1, 0, z0), P(x0 + 1, 0, z0 + 1), P(x0, 0, z0 + 1)], mouse.x, mouse.y)) hover = key
      }
    }
    cv.style.cursor = hover ? 'pointer' : 'default'
    // department names: a plate on the ground just in front of each tile, clear of every building
    const drawName = (key: DeptKey) => {
      const [x0, tz] = tile(key)
      const z0 = tz + 1.06
      const depth = 0.18
      const name = up(campus.departments[key].name)
      const hot = busy(key) > 0.5 || key === hover
      g.save()
      onPlane(x0, 0, z0)
      let fs = depth * U * 0.6
      g.font = `500 ${fs}px ${MONO}`
      const maxW = (GEO[key].g[1] === 0 ? 0.84 : 0.96) * U - 16
      let tw = g.measureText(name).width
      if (tw > maxW) {
        fs *= maxW / tw
        g.font = `500 ${fs}px ${MONO}`
        tw = maxW
      }
      const pw = tw + 16
      g.globalAlpha = A
      g.fillStyle = hot ? C.lift : C.label
      g.fillRect(0, 0, pw, depth * U)
      // bracket ticks at the plate's corners, as the site frames its labels
      g.strokeStyle = hot ? C.lift : C.ruleHi
      g.lineWidth = 1.2
      g.beginPath()
      g.moveTo(-4, 4)
      g.lineTo(-4, -4)
      g.lineTo(4, -4)
      g.moveTo(pw + 4, depth * U - 4)
      g.lineTo(pw + 4, depth * U + 4)
      g.lineTo(pw - 4, depth * U + 4)
      g.stroke()
      g.fillStyle = hot ? '#FFFFFF' : C.paper
      g.textAlign = 'left'
      g.textBaseline = 'middle'
      g.fillText(name, 8, (depth * U) / 2 + 0.5)
      g.restore()
      g.textBaseline = 'alphabetic'
    }
    // back row: tiles, buildings, then names (the front row never reaches them); then the front row
    const order = KEYS.slice().sort((a, b) => GEO[a].g[1] - GEO[b].g[1] || GEO[a].g[0] - GEO[b].g[0])
    for (const row of [0, 1]) {
      for (const key of order) if (GEO[key].g[1] === row) drawDept(key, A, k)
      for (const key of order) if (GEO[key].g[1] === row) drawName(key)
    }
    drawHands(k, A)
    drawOrb(k, A)
    // hover card
    if (hover) {
      const d = campus.departments[hover]
      const c = tc(hover)
      const s = P(c[0], 1.1, c[1])
      const w = 200 * Math.max(0.8, k)
      const h = 58 * Math.max(0.8, k)
      const x = cl(s[0] - w / 2, 4, W - w - 4)
      const y = Math.max(4, s[1] - h - 6)
      g.globalAlpha = 1
      g.fillStyle = C.carbon
      g.fillRect(x, y, w, h)
      g.strokeStyle = C.lift
      g.lineWidth = 1
      g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
      const fs = Math.max(8, 10 * k)
      label(up(`${d.name} · ${campusFlow.labels.live}`), x + 10, y + fs + 8, fs, C.lift, 'left', 500)
      label(d.stat[0], x + 10, y + fs * 2 + 14, fs, C.paper)
      label(d.stat[1], x + 10, y + fs * 3 + 19, fs, C.muted)
    }
    g.globalAlpha = A
  }

  /** One department: its tile, its buildings and the small things that say what it does. */
  function drawDept(key: DeptKey, A: number, k: number) {
    const d = GEO[key]
    const [x0, z0] = tile(key)
    const lit = busy(key)
    const hov = key === hover
    const tileP: Pt[] = [P(x0, 0, z0), P(x0 + 1, 0, z0), P(x0 + 1, 0, z0 + 1), P(x0, 0, z0 + 1)]
    poly(tileP, C.panel, lit > 0.3 || hov ? C.lift : C.rule, A, lit > 0.3 || hov ? 1.3 : 1)
    if (lit > 0) {
      g.globalAlpha = A * lit * 0.1
      g.fillStyle = C.blue
      trace(tileP)
      g.fill()
    }
    const stroke = lit > 0.3 ? C.lift : C.paper
    const sa = A * (lit > 0.3 ? 0.9 : hov ? 0.75 : 0.5)
    const blocks = d.b.slice().sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
    for (const b of blocks) {
      const bx = x0 + b[0]
      const bz = z0 + b[1]
      if (d.detail === 'silos' && b[2] < 0.2) {
        cylinder(bx + b[2] / 2, bz + b[3] / 2, b[2] / 2, b[4], stroke, sa, lit)
        continue
      }
      box(bx, bz, b[2], b[3], b[4], 0, stroke, sa, 1, lit)
      if (d.detail === 'windows' || d.detail === 'vault') windows(bx, bz, b[2], b[3], b[4], A, stroke)
      if (d.detail === 'racks') {
        // status lights down the front of each rack, blinking blue while engineering works
        for (let i = 0; i < 4; i++) {
          const y = 0.07 + i * 0.07
          const on = lit > 0.3 && rnd(i + b[0] * 40 + Math.floor(T * 6)) > 0.4
          const p = P(bx + b[2] * 0.5, y, bz + b[3])
          g.globalAlpha = A * (on ? 1 : 0.45)
          g.fillStyle = on ? C.blue : C.ruleHi
          g.fillRect(p[0] - 1.5, p[1] - 1, 3, 2)
        }
      }
    }
    if (d.detail === 'tickets') {
      // a stack of tickets on the tall desk
      const b = d.b[5]
      for (let i = 0; i < 3; i++) box(x0 + b[0] + 0.03, z0 + b[1] + 0.03, 0.12, 0.12, 0.025, b[4] + i * 0.035, stroke, sa * 0.9, 0.8, i === 2 ? lit : 0)
    }
    if (d.detail === 'vault') {
      // a round vault door on the low strongroom
      const b = d.b[1]
      const cx = x0 + b[0] + b[2] / 2
      const zf = z0 + b[1] + b[3]
      const pts: Pt[] = Array.from({ length: 25 }, (_, i) => P(cx + 0.07 * Math.cos((i / 24) * Math.PI * 2), 0.1 + 0.07 * Math.sin((i / 24) * Math.PI * 2), zf))
      poly(pts, null, lit > 0.3 ? C.lift : C.paper, A * 0.7, 1)
    }
    if (d.detail === 'mast') {
      // broadcast rings off the mast while marketing works
      const b = d.b[1]
      const top = P(x0 + b[0] + b[2] / 2, b[4] + 0.04, z0 + b[1] + b[3] / 2)
      for (let r = 1; r < 4; r++) {
        const ph = (T * 0.8 + r / 3) % 1
        g.globalAlpha = A * (1 - ph) * (lit > 0.3 ? 0.9 : 0.25)
        g.strokeStyle = C.lift
        g.lineWidth = 1
        g.beginPath()
        g.ellipse(top[0], top[1], ph * 22 * k * V.zoom + 1, ph * 11 * k * V.zoom + 0.5, 0, 0, 7)
        g.stroke()
      }
    }
  }

  /** Hand-offs: a blue pulse with a fading trail, out of one department, along the boulevard, into the next. */
  function drawHands(k: number, A: number) {
    for (const h of story.hands) {
      if (T < h.t0 || T > h.t1 + 0.4) continue
      let f = seg(T, h.t0, h.t1)
      let d: number
      if (h.bounce) {
        // the guardrail: out to a gate halfway along, held there, and sent back
        const half = h.L * 0.5
        d = f < 0.4 ? ease(f / 0.4) * half : f < 0.6 ? half : half * (1 - ease((f - 0.6) / 0.4))
        const [gx, gz] = along(h.path, half)
        const ga = ease(seg(T, h.t0 + 0.4, h.t0 + 0.8)) * (1 - seg(T, h.t1 - 0.1, h.t1 + 0.3))
        const horiz = Math.abs(gz - LANE) < 0.01
        const off = (s: number): [number, number] => (horiz ? [gx, gz + s] : [gx + s, gz])
        const a1 = P(off(-0.26)[0], 0, off(-0.26)[1])
        const a2 = P(off(0.26)[0], 0, off(0.26)[1])
        const b1 = P(off(-0.26)[0], 0.4, off(-0.26)[1])
        const b2 = P(off(0.26)[0], 0.4, off(0.26)[1])
        g.globalAlpha = A * ga
        g.strokeStyle = C.lift
        g.lineWidth = 1.6
        g.beginPath()
        g.moveTo(...a1)
        g.lineTo(...b1)
        g.moveTo(...a2)
        g.lineTo(...b2)
        g.moveTo(...b1)
        g.lineTo(...b2)
        for (let n = 1; n < 4; n++) {
          const y = (0.4 * n) / 4
          g.moveTo(...P(off(-0.26)[0], y, off(-0.26)[1]))
          g.lineTo(...P(off(0.26)[0], y, off(0.26)[1]))
        }
        g.stroke()
        g.fillStyle = C.lift
        g.globalAlpha = A * ga * 0.12
        trace([a1, b1, b2, a2])
        g.fill()
        g.globalAlpha = A * ga
        label(up(campusFlow.guardrail.label), b1[0], b1[1] - 12, Math.max(8, 9.5 * k), C.lift, 'center', 500)
      } else {
        d = ease(f) * h.L
      }
      const out = T > h.t1 ? 1 - seg(T, h.t1, h.t1 + 0.4) : 1
      // trail
      const tail = Math.min(0.9, h.L * 0.45)
      const n = 16
      g.lineCap = 'round'
      for (let i = 0; i < n; i++) {
        const da = d - tail * (1 - i / n)
        const db = d - tail * (1 - (i + 1) / n)
        if (db < 0) continue
        const pa = along(h.path, Math.max(0, da))
        const pb = along(h.path, db)
        g.globalAlpha = A * out * (i / n) ** 1.6 * 0.9
        g.strokeStyle = C.lift
        g.lineWidth = 2.6 * Math.max(0.7, k)
        line(P(pa[0], 0.03, pa[1]), P(pb[0], 0.03, pb[1]))
      }
      g.lineCap = 'butt'
      // head: a glow and a bright core
      const hp = along(h.path, d)
      const s = P(hp[0], 0.03, hp[1])
      const R = 10 * Math.max(0.7, k)
      const gr = g.createRadialGradient(s[0], s[1], 0, s[0], s[1], R)
      gr.addColorStop(0, 'rgba(62,87,218,.55)')
      gr.addColorStop(1, 'rgba(62,87,218,0)')
      g.globalAlpha = A * out
      g.fillStyle = gr
      g.beginPath()
      g.arc(s[0], s[1], R, 0, 7)
      g.fill()
      g.fillStyle = C.lift
      g.beginPath()
      g.arc(s[0], s[1], 3 * Math.max(0.7, k), 0, 7)
      g.fill()
      g.fillStyle = '#FFFFFF'
      g.beginPath()
      g.arc(s[0], s[1], 1.2 * Math.max(0.7, k), 0, 7)
      g.fill()
      // what it carries, on a small tag above the pulse
      if (!narrow || k > 0.8) {
        const fs = Math.max(7.5, 8.5 * k)
        g.font = `500 ${fs}px ${MONO}`
        const txt = up(h.artefact)
        const tw = g.measureText(txt).width
        const tx = s[0] - tw / 2 - 4
        const ty = s[1] - R - fs - 6
        g.globalAlpha = A * out * 0.95
        g.fillStyle = C.bg
        g.fillRect(tx, ty, tw + 8, fs + 6)
        g.strokeStyle = C.lift
        g.lineWidth = 1
        g.strokeRect(tx + 0.5, ty + 0.5, tw + 7, fs + 5)
        label(txt, s[0], ty + fs + 1.5, fs, C.lift, 'center', 500)
      }
    }
  }

  /** The world model: a blue sphere of points above the campus, with beams to the departments it is directing. */
  function drawOrb(k: number, A: number) {
    const oc = P(EXT[0] / 2, 2.05, EXT[1] / 2)
    const replan = story.model.some((t) => T >= t && T < t + 1.8)
    const kick = story.hands.reduce((v, h) => Math.max(v, T >= h.t0 && T < h.t0 + 0.5 ? 1 - (T - h.t0) / 0.5 : 0), 0)
    const pulse = 1 + 0.04 * Math.sin(clock * 2.2) + 0.08 * kick + (replan ? 0.1 * Math.max(0, Math.sin(T * Math.PI * 2.4)) ** 6 : 0)
    const R = (narrow ? 0.34 : 0.3) * V.s * pulse * Math.min(1.25, V.zoom)
    const base: Pt = [oc[0], oc[1] + R * 0.85]
    // beams: faint to everyone, bright to whoever is sending or receiving, all bright when it re-plans
    const active = new Set<DeptKey>()
    for (const h of story.hands) {
      if (T < h.t0 - 0.2 || T >= h.t1 + 0.3) continue
      active.add(h.from)
      active.add(h.to)
    }
    for (const key of KEYS) {
      const c = tc(key)
      const top = Math.max(...GEO[key].b.map((b) => b[4]))
      const p = P(c[0], top + 0.06, c[1])
      const on = replan || active.has(key)
      g.globalAlpha = A * (on ? 0.55 : 0.1)
      g.strokeStyle = C.lift
      g.lineWidth = on ? 1.2 : 0.8
      if (on) {
        g.setLineDash([4, 5])
        g.lineDashOffset = -clock * 18
      }
      line(base, p)
      g.setLineDash([])
      g.lineDashOffset = 0
      if (on) {
        g.globalAlpha = A * 0.9
        g.fillStyle = C.lift
        g.beginPath()
        g.ellipse(p[0], p[1], 4 * Math.max(0.7, k), 2 * Math.max(0.7, k), 0, 0, 7)
        g.fill()
      }
    }
    // halo
    const gr = g.createRadialGradient(oc[0], oc[1], R * 0.2, oc[0], oc[1], R * 2.6)
    gr.addColorStop(0, `rgba(62,87,218,${0.32 + 0.18 * kick + (replan ? 0.15 : 0)})`)
    gr.addColorStop(0.5, 'rgba(62,87,218,.10)')
    gr.addColorStop(1, 'rgba(62,87,218,0)')
    g.globalAlpha = A
    g.fillStyle = gr
    g.beginPath()
    g.arc(oc[0], oc[1], R * 2.6, 0, 7)
    g.fill()
    // a slow orbit ring around the equator
    g.globalAlpha = A * 0.55
    g.strokeStyle = C.lift
    g.lineWidth = 1
    g.beginPath()
    g.ellipse(oc[0], oc[1], R * 1.45, R * 0.42, -0.12, 0, 7)
    g.stroke()
    const ang = clock * 0.9
    g.globalAlpha = A
    g.fillStyle = C.lift
    g.beginPath()
    g.arc(oc[0] + Math.cos(ang) * R * 1.45 * Math.cos(-0.12) - Math.sin(ang) * R * 0.42 * Math.sin(-0.12), oc[1] + Math.cos(ang) * R * 1.45 * Math.sin(-0.12) + Math.sin(ang) * R * 0.42 * Math.cos(-0.12), 2.4, 0, 7)
    g.fill()
    // the sphere: points on a turning Fibonacci sphere, brighter on the near side
    for (let i = 0; i < 320; i++) {
      const y = 1 - ((i + 0.5) / 320) * 2
      const rr = Math.sqrt(1 - y * y)
      const th = i * 2.3999 + clock * 0.4
      const near = Math.sin(th)
      const f = 3 / (3 + near * rr)
      g.globalAlpha = A * (0.35 + 0.55 * (near * 0.5 + 0.5)) * (0.7 + 0.3 * rnd(i))
      g.fillStyle = i % 9 ? C.blue : C.paper
      const sz = 1.2 + 0.8 * (near * 0.5 + 0.5)
      g.fillRect(oc[0] + Math.cos(th) * rr * R * f - sz / 2, oc[1] - y * R * f * 0.95 - sz / 2, sz, sz)
    }
    // its name, in a bracketed tag above
    const fs = Math.max(8, 9.5 * k)
    g.font = `500 ${fs}px ${MONO}`
    const txt = up(campusFlow.model)
    const tw = g.measureText(txt).width
    const tx = oc[0] - tw / 2 - 6
    const ty = oc[1] - R * 1.25 - fs - 12
    g.globalAlpha = A
    g.fillStyle = C.lift
    g.fillRect(tx, ty, tw + 12, fs + 8)
    label(txt, oc[0], ty + fs + 2.5, fs, '#FFFFFF', 'center', 500)
  }

  /** Fit the whole scene (slab, floor and world model) into a box on screen. */
  function fit(l: number, t: number, r: number, b: number) {
    V.s = 1
    V.cx = 0
    V.cy = 0
    V.zoom = 1
    const pts: Pt[] = [P(-M, 0, -M), P(EXT[0] + M, 0, -M), P(EXT[0] + M, -TH, EXT[1] + M), P(FLOOR.x0, FLOOR.base, FLOOR.z1), P(FLOOR.x1, FLOOR.base, FLOOR.z1), P(FLOOR.x1, FLOOR.base, FLOOR.z0), P(EXT[0] / 2, 2.05 + 0.75, EXT[1] / 2)]
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const bw = Math.max(...xs) - Math.min(...xs)
    const bh = Math.max(...ys) - Math.min(...ys)
    V.s = Math.min((r - l) / bw, (b - t) / bh)
    V.cx = (l + r) / 2 - ((Math.max(...xs) + Math.min(...xs)) / 2) * V.s
    V.cy = (t + b) / 2 - ((Math.max(...ys) + Math.min(...ys)) / 2) * V.s
  }

  function frame(now: number) {
    raf = 0
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000))
    last = now
    if (!still) {
      T += dt
      clock += dt
      if (T > LOOP) {
        T = 0
        seed += 1
        story = plan(seed)
      }
    }
    if (W > 0 && H > 0) {
      const k = narrow ? Math.min(1.2, W / 390) : Math.min(W / 1440, H / 920)
      g.setTransform(DPR, 0, 0, DPR, 0, 0)
      g.globalAlpha = 1
      g.clearRect(0, 0, W, H)
      g.fillStyle = C.bg
      g.fillRect(0, 0, W, H)
      const fade = still ? 1 : seg(T, 0, 0.6) * (1 - seg(T, LOOP - 1.2, LOOP))
      // a slow drift of a couple of degrees, so the drawing never sits frozen
      const rot = still ? 0 : 0.035 * Math.sin((clock / 40) * Math.PI * 2)
      V.cos = 1
      V.sin = 0
      V.fx = EXT[0] / 2
      V.fz = FLOOR.z1 / 2
      // layout: the campus takes the space the copy leaves free
      if (narrow) fit(12, 16, W - 12, H - 16)
      else fit(textRight() + 32, 84, W - 32, H - 40)
      V.cos = Math.cos(rot)
      V.sin = Math.sin(rot)
      // click a department to fly in for a few seconds
      const zt = performance.now() / 1000 - zoomT
      const zf = zoomKey && zt < 4.2 ? ease(seg(zt, 0, 0.6)) * (1 - ease(seg(zt, 3.4, 4.2))) : 0
      const ctr: Pt = [EXT[0] / 2, FLOOR.z1 / 2]
      const zc = zoomKey ? tc(zoomKey) : ctr
      V.fx = lerp(ctr[0], zc[0], zf)
      V.fz = lerp(ctr[1], zc[1], zf)
      V.zoom = 1 + 0.8 * zf
      g.save()
      drawCampus(k, fade)
      g.restore()
    }
    if (!still && visible) raf = requestAnimationFrame(frame)
  }

  const onMove = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect()
    mouse.x = e.clientX - r.left
    mouse.y = e.clientY - r.top
    mouse.in = true
    if (still && !raf) raf = requestAnimationFrame(frame)
  }
  const onLeave = () => {
    mouse.in = false
    hover = null
  }
  const onClick = () => {
    if (hover) {
      zoomKey = hover
      zoomT = performance.now() / 1000
    } else zoomT = -9
  }
  cv.addEventListener('pointermove', onMove)
  cv.addEventListener('pointerleave', onLeave)
  cv.addEventListener('click', onClick)
  const ro = new ResizeObserver(resize)
  ro.observe(cv)
  // the loop sleeps while the hero is off screen
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true
    if (visible && !still && !raf) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  })
  io.observe(cv)
  resize()
  raf = requestAnimationFrame(frame)
  document.fonts?.ready.then(() => still && frame(performance.now())).catch(() => {})

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    cv.removeEventListener('pointermove', onMove)
    cv.removeEventListener('pointerleave', onLeave)
    cv.removeEventListener('click', onClick)
  }
}
