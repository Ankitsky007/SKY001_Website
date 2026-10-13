// The "enterprise campus" hero: an enterprise drawn as one isometric campus on a 2D canvas.
// Eight departments sit on a slab with a world model floating above them. A churn signal ripples
// department to department, a finance guardrail turns back an oversized discount, and the sales
// counter at the front only moves when a loop closes. Ported from Ankit's hero direction
// (2026-10-13); all story text comes from `campus` in @skyfall/core, the geometry lives here.
import { campus } from '@skyfall/core'

export type CampusPalette = {
  bg: string
  /** Slab top and card fill. */
  carbon: string
  /** Tile and roof fill. */
  panel: string
  rule: string
  ruleHi: string
  /** Line and text colour. */
  paper: string
  muted: string
  blue: string
  /** Accent used for active lines and labels. */
  lift: string
}

export const CAMPUS_LIGHT: CampusPalette = { bg: '#FFFFFF', carbon: '#F1F2F5', panel: '#F8F8FA', rule: '#D9DCE2', ruleHi: '#B7BCC7', paper: '#1A1A1A', muted: '#7A7A7A', blue: '#3E57DA', lift: '#3E57DA' }
export const CAMPUS_DARK: CampusPalette = { bg: '#07080A', carbon: '#14171C', panel: '#0D0F13', rule: '#262A32', ruleHi: '#3A3F4B', paper: '#ECEDEF', muted: '#8B90A0', blue: '#3E57DA', lift: '#6F83F0' }

type DeptKey = keyof typeof campus.departments
type Pt = [number, number]
/** A building inside a unit tile: u, v, width, depth, height. */
type Block = [number, number, number, number, number]

const MONO = "'Geist Mono',ui-monospace,Menlo,monospace"
const SANS = "'Geist',ui-sans-serif,system-ui,sans-serif"

// Departments on a 4 x 2 grid (row 0 at the back).
const GEO: Record<DeptKey, { g: Pt; b: Block[]; mast?: boolean }> = {
  support: { g: [0, 0], b: [[0.12, 0.15, 0.18, 0.18, 0.12], [0.42, 0.15, 0.18, 0.18, 0.12], [0.72, 0.15, 0.18, 0.18, 0.12], [0.12, 0.55, 0.18, 0.18, 0.12], [0.42, 0.55, 0.18, 0.18, 0.12], [0.72, 0.55, 0.18, 0.18, 0.2]] },
  product: { g: [1, 0], b: [[0.25, 0.25, 0.5, 0.5, 0.42], [0.36, 0.36, 0.28, 0.28, 0.62]] },
  design: { g: [2, 0], b: [[0.15, 0.2, 0.08, 0.6, 0.5], [0.42, 0.2, 0.08, 0.6, 0.62], [0.69, 0.2, 0.08, 0.6, 0.44]] },
  engineering: { g: [3, 0], b: [[0.1, 0.12, 0.14, 0.76, 0.34], [0.33, 0.12, 0.14, 0.76, 0.34], [0.56, 0.12, 0.14, 0.76, 0.34], [0.79, 0.12, 0.14, 0.76, 0.34]] },
  marketing: { g: [3, 1], b: [[0.2, 0.5, 0.4, 0.35, 0.18], [0.62, 0.25, 0.08, 0.08, 1.05]], mast: true },
  sales: { g: [2, 1], b: [[0.15, 0.2, 0.32, 0.32, 0.72], [0.55, 0.45, 0.3, 0.3, 0.5]] },
  finance: { g: [1, 1], b: [[0.3, 0.25, 0.38, 0.38, 0.98], [0.12, 0.7, 0.25, 0.2, 0.2]] },
  operations: { g: [0, 1], b: [[0.1, 0.2, 0.8, 0.5, 0.22], [0.2, 0.78, 0.12, 0.12, 0.36], [0.5, 0.78, 0.12, 0.12, 0.36]] },
}
const KEYS = Object.keys(GEO) as DeptKey[]
const GAP = 1.4 // tile pitch; tile size 1
const tc = (k: DeptKey): Pt => [GEO[k].g[0] * GAP + 0.5, GEO[k].g[1] * GAP + 0.5]
const ROADS: [DeptKey, DeptKey][] = [['support', 'product'], ['product', 'design'], ['design', 'engineering'], ['engineering', 'marketing'], ['marketing', 'sales'], ['sales', 'finance'], ['finance', 'operations'], ['operations', 'support'], ['product', 'finance'], ['design', 'sales']]

const LOOP = 44
const HOPS = campus.hops
type Log = { t: number; who: DeptKey | 'model'; text: string; key: boolean }
const LOGS: Log[] = [...campus.logs.map((l) => ({ ...l }) as Log), ...HOPS.map((h) => ({ t: h.t1, who: h.to as DeptKey, text: h.log, key: h.bounce }))].sort((a, b) => a.t - b.t)

const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const seg = (t: number, a: number, b: number) => cl((t - a) / (b - a))
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}
const up = (s: string) => s.toUpperCase()

/** MRR in $M at story time T. */
function mrr(T: number) {
  return T < 24.6 ? 1.2 : T < 26.4 ? lerp(1.2, 1.29, ease(seg(T, 24.6, 26.4))) : T < 35.4 ? 1.29 : lerp(1.29, 1.34, ease(seg(T, 35.4, 37.4)))
}

function activeKey(T: number): DeptKey | null {
  for (const h of HOPS) if (T >= h.t1 && T < h.t1 + 1.2) return h.to as DeptKey
  if (T >= 3 && T < 6) return 'support'
  if (T >= 28 && T < 29.4) return 'sales'
  return null
}

function litAmount(key: DeptKey, T: number) {
  let v = 0
  for (const h of HOPS) if (h.to === key && !h.bounce) v = Math.max(v, cl(1 - (T - h.t1) / 2.2) * (T >= h.t1 ? 1 : 0))
  if (key === 'support' && T >= 3 && T < 6) v = 1
  if (key === 'sales' && T >= 28 && T < 29.4) v = 1
  return v
}

function inPoly(p: Pt[], x: number, y: number) {
  let c = false
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if (p[i][1] > y !== p[j][1] > y && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) c = !c
  }
  return c
}

/** Odometer digits for value v, most significant first: the digit and how far it has rolled to the next. */
function odo(v: number, places: number) {
  const out: { d: number; f: number }[] = []
  for (let p = places - 1; p >= 0; p--) {
    const pos = v / 10 ** p
    const d = Math.floor(pos) % 10
    let f = 0
    if (p === 0) f = pos - Math.floor(pos)
    else {
      const low = (v / 10 ** (p - 1)) % 10
      if (low > 9) f = low - 9
    }
    out.push({ d, f })
  }
  return out
}

export type CampusOptions = {
  palette: CampusPalette
  /** Right edge of the hero copy in px from the canvas's left, so the campus keeps clear of it. 0 when the copy is stacked above. */
  textRight: () => number
  /** Called when the story moves to a new entry of `campus.states`. */
  onState: (index: number) => void
  /** Draw one finished frame and stop (reduced motion). */
  still: boolean
}

/** Starts the campus on a canvas and returns a function that stops it and removes its listeners. */
export function startCampus(cv: HTMLCanvasElement, { palette: C, textRight, onState, still }: CampusOptions) {
  const context = cv.getContext('2d')
  if (!context) return () => {}
  const g: CanvasRenderingContext2D = context

  let W = 0
  let H = 0
  let narrow = false
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  const V = { cx: 0, cy: 0, s: 1, zoom: 1, fx: 0, fz: 0 }
  const mouse = { x: -1, y: -1, in: false }
  let hover: DeptKey | null = null
  let zoomKey: DeptKey | null = null
  let zoomT = -9
  let T = still ? 39 : 0
  let last = performance.now()
  let raf = 0
  let visible = true
  let stateIndex = -1
  let ground: HTMLCanvasElement | null = null

  const resize = () => {
    const r = cv.getBoundingClientRect()
    W = r.width
    H = r.height
    narrow = W < 760
    cv.width = Math.round(W * DPR)
    cv.height = Math.round(H * DPR)
    g.setTransform(DPR, 0, 0, DPR, 0, 0)
    if (still) frame(performance.now())
  }

  /** World to screen, through the isometric camera. */
  const P = (x: number, y: number, z: number): Pt => {
    const X = (x - V.fx - (z - V.fz)) * 0.866
    const Y = (x - V.fx + (z - V.fz)) * 0.5 - y
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
  const box = (x0: number, z0: number, w: number, d: number, h: number, y0: number, stroke: string, a: number, lw = 1) => {
    const x1 = x0 + w
    const z1 = z0 + d
    const y1 = y0 + h
    poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], C.bg, stroke, a, lw)
    poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], C.bg, stroke, a, lw)
    poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], C.panel, stroke, a, lw)
  }
  const label = (t: string, x: number, y: number, size: number, col: string, align: CanvasTextAlign = 'left', weight = 400) => {
    g.font = `${weight} ${size}px ${MONO}`
    g.fillStyle = col
    g.textAlign = align
    g.textBaseline = 'alphabetic'
    g.fillText(t, x, y)
  }
  const line = (a: Pt, b: Pt) => {
    g.beginPath()
    g.moveTo(a[0], a[1])
    g.lineTo(b[0], b[1])
    g.stroke()
  }

  /** The drafting grid around the slab, fading out on all sides. */
  function drawGround(A: number, ext: Pt, m: number, th: number) {
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
    const n = 34
    const xa = -m - n * sp
    const xb = ext[0] + m + n * sp
    const za = -m - n * sp
    const zb = ext[1] + m + n * sp
    const y = -th
    const lines = (major: boolean) => {
      q.beginPath()
      for (let j = -n; j <= Math.round((ext[0] + 2 * m) / sp) + n; j++) {
        if ((j % 4 === 0) !== major) continue
        const x = -m + j * sp
        q.moveTo(...P(x, y, za))
        q.lineTo(...P(x, y, zb))
      }
      for (let j = -n; j <= Math.round((ext[1] + 2 * m) / sp) + n; j++) {
        if ((j % 4 === 0) !== major) continue
        const z = -m + j * sp
        q.moveTo(...P(xa, y, z))
        q.lineTo(...P(xb, y, z))
      }
      q.stroke()
    }
    q.strokeStyle = C.ruleHi
    q.lineWidth = 0.5
    q.globalAlpha = 0.55
    lines(false)
    q.lineWidth = 0.8
    q.globalAlpha = 0.9
    lines(true)
    const c = P(ext[0] / 2, y, ext[1] / 2)
    const rx = Math.min(W * 0.48, 7.2 * V.s * V.zoom)
    q.globalCompositeOperation = 'destination-in'
    q.globalAlpha = 1
    q.save()
    q.translate(c[0], c[1])
    q.scale(1, 0.58)
    const gr = q.createRadialGradient(0, 0, rx * 0.3, 0, 0, rx)
    gr.addColorStop(0, 'rgba(0,0,0,1)')
    gr.addColorStop(0.55, 'rgba(0,0,0,.55)')
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

  /** The operating log, running as a ticker along the slab's front edge. */
  function drawTicker(k: number, A: number, c2: number[], c3: number[], th: number) {
    const a = P(c3[0], 0, c3[2])
    const b = P(c2[0], 0, c2[2])
    const a2 = P(c3[0], -th, c3[2])
    const b2 = P(c2[0], -th, c2[2])
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    const ux = (b[0] - a[0]) / len
    const uy = (b[1] - a[1]) / len
    const fh = a2[1] - a[1]
    const items = LOGS.filter((l) => T >= l.t)
      .slice(-6)
      .map((l) => `${up(l.who === 'model' ? campus.model : campus.departments[l.who].name)} · ${l.text}`)
    if (!items.length) return
    const str = `${items.join('     /     ')}     /     `
    g.save()
    trace([a, b, b2, a2])
    g.clip()
    g.setTransform(DPR * ux, DPR * uy, 0, DPR, DPR * a[0], DPR * a[1])
    const fs = Math.max(7, Math.min(fh * 0.5, 10 * k))
    g.font = `400 ${fs}px ${MONO}`
    const sw = g.measureText(str).width
    const off = (T * 38) % sw
    g.globalAlpha = A * 0.85
    g.fillStyle = C.muted
    g.textBaseline = 'middle'
    g.textAlign = 'left'
    for (let x = -off; x < len; x += sw) g.fillText(str, x, fh / 2)
    g.restore()
    g.setTransform(DPR, 0, 0, DPR, 0, 0)
    g.textBaseline = 'alphabetic'
  }

  /** MRR as a sales counter on a step at the slab's front corner, with an odometer sign. */
  function drawCounter(k: number, A: number, ext: Pt, m: number, th: number) {
    const X0 = ext[0] + m + 0.12
    const X1 = X0 + 1.55
    const Z0 = ext[1] - 0.95
    const Z1 = ext[1] + m
    const sy = -0.1
    poly([P(X1, sy, Z0), P(X1, sy, Z1), P(X1, -th, Z1), P(X1, -th, Z0)], C.bg, C.ruleHi, A * 0.8)
    poly([P(X0, sy, Z1), P(X1, sy, Z1), P(X1, -th, Z1), P(X0, -th, Z1)], C.bg, C.ruleHi, A * 0.8)
    poly([P(X0, sy, Z0), P(X1, sy, Z0), P(X1, sy, Z1), P(X0, sy, Z1)], C.panel, C.ruleHi, A)
    // money flowing in from sales and finance while revenue books
    const booking = (T >= 24.2 && T < 26.6) || (T >= 35 && T < 37.6)
    const dc: Pt = [X0 + 0.65, Z1 - 0.42]
    ;(['sales', 'finance'] as DeptKey[]).forEach((key, ki) => {
      const c = tc(key)
      const a = P(c[0], 0.04, c[1])
      const b = P(dc[0], sy + 0.04, dc[1])
      g.globalAlpha = A * (booking ? 0.5 : 0.12)
      g.strokeStyle = booking ? C.lift : C.ruleHi
      g.lineWidth = 1
      g.setLineDash([2, 4])
      line(a, b)
      g.setLineDash([])
      if (booking) {
        for (let i = 0; i < 4; i++) {
          const f = (T * 0.9 + i / 4 + ki * 0.12) % 1
          g.globalAlpha = A
          g.fillStyle = C.lift
          g.font = `500 ${Math.max(8, 9 * k)}px ${MONO}`
          g.textAlign = 'center'
          g.fillText('$', lerp(a[0], b[0], f), lerp(a[1], b[1], f))
        }
      }
    })
    box(X0 + 0.12, Z1 - 0.62, 1.32, 0.36, 0.2, sy, booking ? C.lift : C.paper, A * 0.9, 1)
    // the sign standing on the desk, facing the viewer
    const sx0 = X0 + 0.08
    const sx1 = X0 + 1.48
    const sz = Z1 - 0.26
    const y0 = sy + 0.2
    const y1 = y0 + 0.46
    const q = [P(sx0, y1, sz), P(sx1, y1, sz), P(sx1, y0, sz), P(sx0, y0, sz)]
    poly(q, C.carbon, C.lift, A, 1.2)
    const ux = q[1][0] - q[0][0]
    const uy = q[1][1] - q[0][1]
    const len = Math.hypot(ux, uy)
    const hpx = q[3][1] - q[0][1]
    g.save()
    trace(q)
    g.clip()
    g.setTransform((DPR * ux) / len, (DPR * uy) / len, 0, DPR, DPR * q[0][0], DPR * q[0][1])
    const v = mrr(T) * 1e6
    const digits = odo(v / 1000, 4)
    const fs = Math.min(hpx * 0.52, len / 7.6)
    const cw = fs * 0.66
    label(up(campus.labels.mrr), 6, fs * 0.55 + 3, Math.max(6, fs * 0.42), C.lift, 'left', 500)
    // $ d , d d d , 0 0 0  : the thousands roll, the last three digits are fixed zeros
    const chars: (string | { d: number; f: number })[] = ['$', digits[0], ',', digits[1], digits[2], digits[3], ',', '0', '0', '0']
    let x = (len - chars.length * cw) / 2
    const by = hpx * 0.5 + fs * 0.62
    g.font = `500 ${fs}px ${MONO}`
    g.textAlign = 'left'
    g.textBaseline = 'alphabetic'
    for (const ch of chars) {
      if (typeof ch === 'string') {
        g.globalAlpha = A
        g.fillStyle = C.paper
        g.fillText(ch, x, by)
      } else {
        g.globalAlpha = A * 0.6
        g.fillStyle = C.bg
        g.fillRect(x - 1, by - fs * 0.92, cw - 1, fs * 1.18)
        g.save()
        g.beginPath()
        g.rect(x - 1, by - fs * 0.92, cw - 1, fs * 1.18)
        g.clip()
        const off = ch.f * fs * 1.15
        g.globalAlpha = A
        g.fillStyle = ch.f > 0 ? C.lift : C.paper
        g.fillText(String(ch.d), x, by - off)
        g.fillText(String((ch.d + 1) % 10), x, by - off + fs * 1.15)
        g.restore()
      }
      x += cw
    }
    g.restore()
    g.setTransform(DPR, 0, 0, DPR, 0, 0)
    // the figure and its change, under the step
    const dv = mrr(T) - 1.2
    const lf = Math.max(8, 9 * k)
    g.globalAlpha = A
    const bl = P(X0, -th, Z1)
    const big = Math.max(20, 24 * k)
    const tip: Pt = narrow ? [16, P(X1, -th, Z1)[1] + lf * 3.2] : [bl[0] - 16, bl[1] + lf * 2.2]
    const AL: CanvasTextAlign = narrow ? 'left' : 'right'
    g.font = `500 ${big}px ${SANS}`
    g.fillStyle = C.paper
    g.textAlign = AL
    g.fillText(`$${Math.round(v).toLocaleString('en-US')}`, tip[0], tip[1] + lf * 1.5 + big + 6)
    label(up(campus.labels.counter), tip[0], tip[1], lf, C.muted, AL, 500)
    label(up(dv > 0.0001 ? `+$${Math.round(dv * 1000)}K ${campus.labels.booked}` : campus.labels.flat), tip[0], tip[1] + lf * 1.5, lf, dv > 0 ? C.lift : C.muted, AL)
    // imagined futures: three ghost readouts under the figure
    const gA = ease(seg(T, 6, 7.2)) * (1 - ease(seg(T, 10.8, 12)))
    if (gA > 0) {
      const top = tip[1] + lf * 1.5 + big + lf * 2.2
      campus.futures.forEach((f, i) => {
        g.globalAlpha = A * gA * (f.key === 'A' ? 1 : 0.7)
        label(`${up(f.name)}  $${(f.mrr * 1e6).toLocaleString('en-US')}`, tip[0], top + i * lf * 1.4, Math.max(8, 9 * k), f.key === 'A' && T >= 10.8 ? C.lift : f.key === 'A' ? C.paper : C.muted, AL)
      })
    }
  }

  /** A small card above whoever is acting, carrying the latest log line. */
  function drawCallouts(k: number, A: number, oc: Pt, R: number) {
    const live = LOGS.filter((l) => T >= l.t && T - l.t < 2.6).slice(-2)
    const rects: { x: number; y: number; w: number; h: number }[] = []
    for (const l of live) {
      const age = T - l.t
      const a = ease(cl(age / 0.3)) * (1 - ease(seg(age, 2.2, 2.6)))
      const fs = Math.max(8, (narrow ? 9 : 10.5) * k)
      const w = Math.min(narrow ? 170 : 230 * k, W - 16)
      const lh = fs * 1.3
      let ax: number
      let ay: number
      if (l.who === 'model') {
        ax = oc[0]
        ay = oc[1] - R - 14
      } else {
        const c = tc(l.who)
        const top = Math.max(...GEO[l.who].b.map((b) => b[4]))
        ;[ax, ay] = P(c[0], top + 0.2, c[1])
      }
      g.font = `400 ${fs}px ${SANS}`
      const lines = ['']
      for (const wd of l.text.split(' ')) {
        const t2 = `${lines[lines.length - 1]} ${wd}`.trim()
        if (g.measureText(t2).width > w - 20 && lines[lines.length - 1]) lines.push(wd)
        else lines[lines.length - 1] = t2
      }
      const h = fs + 10 + lines.length * lh + 6
      let x = cl(ax + 12, 8, W - w - 8)
      let y = cl(ay - h - 14, narrow ? 8 : 58, H - h - 8)
      for (const r of rects) if (x < r.x + r.w && x + w > r.x && y < r.y + r.h + 6 && y + h + 6 > r.y) y = r.y + r.h + 6
      x = cl(x, 8, W - w - 8)
      rects.push({ x, y, w, h })
      g.globalAlpha = A * a * 0.9
      g.strokeStyle = C.lift
      g.lineWidth = 1
      line([ax, ay], [x, y + h])
      g.globalAlpha = A * a
      g.fillStyle = C.carbon
      g.fillRect(x, y, w, h)
      g.strokeStyle = l.key ? C.lift : C.ruleHi
      g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
      label(up(l.who === 'model' ? campus.model : campus.departments[l.who].name), x + 10, y + fs + 6, fs * 0.85, C.lift, 'left', 500)
      g.font = `400 ${fs}px ${SANS}`
      g.fillStyle = C.paper
      g.textAlign = 'left'
      lines.forEach((ln, j) => g.fillText(ln, x + 10, y + fs + 8 + (j + 1) * lh))
    }
  }

  function drawCampus(k: number, A: number) {
    const ext: Pt = [3 * GAP + 1, GAP + 1]
    const m = 0.35
    const th = 0.28
    drawGround(A, ext, m, th)
    const c0 = [-m, 0, -m]
    const c1 = [ext[0] + m, 0, -m]
    const c2 = [ext[0] + m, 0, ext[1] + m]
    const c3 = [-m, 0, ext[1] + m]
    // slab
    poly([P(c1[0], 0, c1[2]), P(c2[0], 0, c2[2]), P(c2[0], -th, c2[2]), P(c1[0], -th, c1[2])], C.bg, C.ruleHi, A * 0.8)
    poly([P(c3[0], 0, c3[2]), P(c2[0], 0, c2[2]), P(c2[0], -th, c2[2]), P(c3[0], -th, c3[2])], C.bg, C.ruleHi, A * 0.8)
    poly([P(c0[0], 0, c0[2]), P(c1[0], 0, c1[2]), P(c2[0], 0, c2[2]), P(c3[0], 0, c3[2])], C.carbon, C.ruleHi, A)
    drawTicker(k, A, c2, c3, th)
    drawCounter(k, A, ext, m, th)
    // fine grid on the slab
    g.globalAlpha = A * 0.18
    g.strokeStyle = C.ruleHi
    g.lineWidth = 0.5
    g.beginPath()
    for (let x = -m; x <= ext[0] + m + 0.01; x += 0.35) {
      g.moveTo(...P(x, 0, -m))
      g.lineTo(...P(x, 0, ext[1] + m))
    }
    for (let z = -m; z <= ext[1] + m + 0.01; z += 0.35) {
      g.moveTo(...P(-m, 0, z))
      g.lineTo(...P(ext[0] + m, 0, z))
    }
    g.stroke()
    // roads
    for (const [a, b] of ROADS) {
      const p = tc(a)
      const q = tc(b)
      g.globalAlpha = A * 0.55
      g.strokeStyle = C.ruleHi
      g.lineWidth = 1
      g.setLineDash([3, 4])
      line(P(p[0], 0, p[1]), P(q[0], 0, q[1]))
      g.setLineDash([])
    }
    // ambient agents on the roads
    for (let i = 0; i < 46; i++) {
      const r = ROADS[i % ROADS.length]
      const f = (rnd(i) + T * (0.05 + 0.06 * rnd(i + 3))) % 1
      const dir = i % 2
      const p = tc(r[dir])
      const q = tc(r[1 - dir])
      const s = P(lerp(p[0], q[0], f), 0.02, lerp(p[1], q[1], f))
      g.globalAlpha = A * 0.45
      g.fillStyle = C.paper
      g.fillRect(s[0] - 1, s[1] - 1, 2, 2)
    }
    // hover
    hover = null
    if (mouse.in) {
      for (const key of KEYS) {
        const x0 = GEO[key].g[0] * GAP
        const z0 = GEO[key].g[1] * GAP
        if (inPoly([P(x0, 0, z0), P(x0 + 1, 0, z0), P(x0 + 1, 0, z0 + 1), P(x0, 0, z0 + 1)], mouse.x, mouse.y)) hover = key
      }
    }
    cv.style.cursor = hover ? 'pointer' : 'default'
    const act = activeKey(T)
    // tiles and buildings, back to front
    const order = KEYS.slice().sort((a, b) => GEO[a].g[0] + GEO[a].g[1] - (GEO[b].g[0] + GEO[b].g[1]))
    for (const key of order) {
      const d = GEO[key]
      const x0 = d.g[0] * GAP
      const z0 = d.g[1] * GAP
      const on = key === act
      const glow = on ? 1 : key === hover ? 0.7 : 0
      const lit = litAmount(key, T)
      const tile: Pt[] = [P(x0, 0, z0), P(x0 + 1, 0, z0), P(x0 + 1, 0, z0 + 1), P(x0, 0, z0 + 1)]
      poly(tile, C.panel, glow ? C.lift : C.rule, A * (glow ? 1 : 0.9), glow ? 1.3 : 1)
      if (lit > 0) {
        g.globalAlpha = A * lit * 0.18
        g.fillStyle = C.blue
        trace(tile)
        g.fill()
      }
      const blocks = d.b.slice().sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
      for (const b of blocks) {
        let h = b[4]
        if (key === 'engineering' && T > 15.2 && T < 26) h += 0.12 * ease(seg(T, 15.2, 16))
        if (key === 'operations') h += 0.1 * ease(seg(T, 23.2, 24))
        box(x0 + b[0], z0 + b[1], b[2], b[3], h, 0, on || lit > 0.5 ? C.lift : C.paper, A * (on ? 0.95 : 0.62 + 0.25 * glow), on ? 1.2 : 1)
      }
      if (d.mast) {
        const top = P(x0 + 0.66, 1.1, z0 + 0.29)
        for (let r = 1; r < 4; r++) {
          const ph = (T * 0.8 + r / 3) % 1
          g.globalAlpha = A * (1 - ph) * (on || (T > 16.4 && T < 19) ? 0.9 : 0.35)
          g.strokeStyle = C.lift
          g.lineWidth = 1
          g.beginPath()
          g.ellipse(top[0], top[1], ph * 36 * k * V.zoom, ph * 18 * k * V.zoom, 0, 0, 7)
          g.stroke()
        }
      }
    }
    for (const key of order) {
      const x0 = GEO[key].g[0] * GAP
      const z0 = GEO[key].g[1] * GAP
      const name = up(campus.departments[key].name)
      const lp = P(x0 + 0.5, 0, z0 + 1)
      const fs = Math.max(8, (narrow ? 8 : 10) * k * Math.min(1.3, V.zoom))
      g.font = `500 ${fs}px ${MONO}`
      const tw = g.measureText(name).width
      g.globalAlpha = A * 0.85
      g.fillStyle = C.bg
      g.fillRect(lp[0] - tw / 2 - 4, lp[1] + 5, tw + 8, fs + 5)
      g.globalAlpha = A
      label(name, lp[0], lp[1] + fs + 6, fs, key === act || key === hover ? C.lift : C.muted, 'center', 500)
    }
    // the world model: a turning sphere of points above the campus
    const oc = P(ext[0] / 2, 1.6, ext[1] / 2)
    const imag = (T >= 6 && T < 10.8) || (T >= 28.7 && T < 29.4)
    const pulse = 1 + 0.06 * Math.sin(T * 2.2) + (imag ? 0.12 * Math.max(0, Math.sin(T * Math.PI * 2.4)) ** 6 : 0)
    const R = (narrow ? 0.3 : 0.26) * V.s * pulse * Math.min(1.25, V.zoom)
    const gr = g.createRadialGradient(oc[0], oc[1], 0, oc[0], oc[1], R * 1.9)
    gr.addColorStop(0, 'rgba(62,87,218,.25)')
    gr.addColorStop(1, 'rgba(62,87,218,0)')
    g.globalAlpha = A
    g.fillStyle = gr
    g.beginPath()
    g.arc(oc[0], oc[1], R * 1.9, 0, 7)
    g.fill()
    KEYS.forEach((key, i) => {
      const c = tc(key)
      const p = P(c[0], 0.05, c[1])
      const on = imag || key === act
      g.globalAlpha = A * (on ? 0.45 : 0.08)
      g.strokeStyle = on ? C.lift : C.paper
      g.lineWidth = 1
      line([oc[0], oc[1] + R * 0.6], p)
      if (imag) {
        const f = (T * 1.3 + i * 0.13) % 1
        g.globalAlpha = A
        g.fillStyle = C.lift
        g.beginPath()
        g.arc(lerp(oc[0], p[0], f), lerp(oc[1] + R * 0.6, p[1], f), 2, 0, 7)
        g.fill()
      }
    })
    for (let i = 0; i < 260; i++) {
      const y = 1 - ((i + 0.5) / 260) * 2
      const rr = Math.sqrt(1 - y * y)
      const th2 = i * 2.3999 + T * 0.4
      const f = 3 / (3 + Math.sin(th2) * rr)
      g.globalAlpha = A * (0.3 + 0.5 * rnd(i))
      g.fillStyle = i % 17 ? C.paper : C.lift
      g.fillRect(oc[0] + Math.cos(th2) * rr * R * f, oc[1] - y * R * f * 0.95, 1.3, 1.3)
    }
    label(up(campus.model), oc[0], oc[1] - R - 8, Math.max(8, 9 * k), C.muted, 'center')
    // hops: work travelling between departments
    for (const h of HOPS) {
      if (T < h.t0 || T > h.t1 + 0.15) continue
      const p = tc(h.from as DeptKey)
      const q = tc(h.to as DeptKey)
      let f = seg(T, h.t0, h.t1)
      if (h.bounce) f = f < 0.45 ? ease(f / 0.45) * 0.42 : f < 0.6 ? 0.42 : 0.42 * (1 - ease((f - 0.6) / 0.4))
      else f = ease(f)
      const x = lerp(p[0], q[0], f)
      const z = lerp(p[1], q[1], f)
      const s = P(x, 0.1, z)
      g.globalAlpha = A * 0.8
      g.strokeStyle = C.lift
      g.lineWidth = 2
      line(P(p[0], 0.02, p[1]), P(x, 0.02, z))
      g.fillStyle = C.lift
      g.globalAlpha = A
      g.fillRect(s[0] - 5, s[1] - 4, 10, 8)
      label(up(h.artefact), s[0], s[1] - 9, Math.max(8, 9 * k), C.paper, 'center', 500)
      if (h.bounce) {
        // the guardrail: a gate across the road, halfway to finance
        const gx = lerp(p[0], q[0], 0.5)
        const gz = lerp(p[1], q[1], 0.5)
        const ga = ease(seg(T, h.t0 + 0.4, h.t0 + 0.7)) * (1 - seg(T, h.t1 - 0.1, h.t1 + 0.15))
        const a1 = P(gx, 0, gz - 0.32)
        const a2 = P(gx, 0, gz + 0.32)
        const b1 = P(gx, 0.45, gz - 0.32)
        const b2 = P(gx, 0.45, gz + 0.32)
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
          const y = (0.45 * n) / 4
          g.moveTo(...P(gx, y, gz - 0.32))
          g.lineTo(...P(gx, y, gz + 0.32))
        }
        g.stroke()
        g.fillStyle = C.lift
        g.globalAlpha = A * ga * 0.12
        trace([a1, b1, b2, a2])
        g.fill()
        g.globalAlpha = A * ga
        label(up(campus.labels.guardrail), b1[0], b1[1] - 24, Math.max(8, 9.5 * k), C.lift, 'center', 500)
      }
    }
    // a ping where each loop starts
    for (const [t, key] of [[3, 'support'], [28, 'sales']] as [number, DeptKey][]) {
      if (T < t || T > t + 3) continue
      const c = tc(key)
      const s = P(c[0], 0, c[1])
      for (let r = 0; r < 3; r++) {
        const ph = ((T - t) * 0.9 + r / 3) % 1
        g.globalAlpha = A * (1 - ph) * 0.9
        g.strokeStyle = C.lift
        g.lineWidth = 1.2
        g.beginPath()
        g.ellipse(s[0], s[1], ph * 70 * k * V.zoom, ph * 35 * k * V.zoom, 0, 0, 7)
        g.stroke()
      }
    }
    drawCallouts(k, A, oc, R / pulse)
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
      label(up(`${d.name} · ${campus.labels.live}`), x + 10, y + fs + 8, fs, C.lift, 'left', 500)
      label(d.stat[0], x + 10, y + fs * 2 + 14, fs, C.paper)
      label(d.stat[1], x + 10, y + fs * 3 + 19, fs, C.muted)
    }
    g.globalAlpha = A
  }

  function frame(now: number) {
    raf = 0
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000))
    last = now
    if (!still) {
      T += dt
      if (T > LOOP) T = 0
    }
    if (W > 0 && H > 0) {
      const k = narrow ? Math.min(1, W / 390) : Math.min(W / 1440, H / 920)
      g.setTransform(DPR, 0, 0, DPR, 0, 0)
      g.globalAlpha = 1
      g.clearRect(0, 0, W, H)
      g.fillStyle = C.bg
      g.fillRect(0, 0, W, H)
      const fade = still ? 1 : seg(T, 0, 0.6) * (1 - seg(T, LOOP - 1.2, LOOP))
      const si = campus.states.reduce((s, st, i) => (T >= st.t ? i : s), 0)
      if (si !== stateIndex) {
        stateIndex = si
        onState(si)
      }
      // layout: the campus takes the space the copy leaves free
      if (narrow) {
        V.s = W / 9.6
        V.cx = W / 2 - 0.45 * V.s
        V.cy = Math.min(H - 3.3 * V.s - 20, 170 + 2.9 * V.s)
      } else {
        const top = 84
        const bot = H - 96
        const l = textRight() + 24
        const r = W - 24
        V.s = 0.8 * Math.min((r - l) / 7.9, (bot - top) / 5.6)
        V.cx = (l + r) / 2 - 0.05 * V.s
        V.cy = (top + bot) / 2 + 0.05 * V.s
      }
      // click a department to fly in for a few seconds
      const zt = performance.now() / 1000 - zoomT
      const zf = zoomKey && zt < 4.2 ? ease(seg(zt, 0, 0.6)) * (1 - ease(seg(zt, 3.4, 4.2))) : 0
      const ctr: Pt = [(3 * GAP + 1) / 2, (GAP + 1) / 2]
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
