// The mission globe: a glossy logo-blue sphere on a 2D canvas, wrapped in a dotted surface and a
// graticule, with the eight campus departments as stations on it. Scroll turns the globe; the
// station nearest the front lights up and is named, and work arcs from one station to the next,
// in the same order as the hero's hand-offs. Department names come from `campus` in @skyfall/core.
import { campus, campusFlow } from '@skyfall/core'

type DeptKey = keyof typeof campus.departments
type V3 = [number, number, number]

const MONO = "'Geist Mono',ui-monospace,Menlo,monospace"
const BLUE = '#3E57DA'
const KEYS = Object.keys(campus.departments) as DeptKey[]
const DEG = Math.PI / 180

// stations: evenly round the globe, alternating a little north and south of the equator
const STATIONS = KEYS.map((key, i) => ({ key, lon: i * 45 * DEG, lat: (i % 2 ? -18 : 22) * DEG }))
const HOPS = campusFlow.handoffs.map((h) => [KEYS.indexOf(h.from as DeptKey), KEYS.indexOf(h.to as DeptKey)] as const)
const HOP_TIME = 1.7 // seconds between arcs

const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const unit = (lat: number, lon: number): V3 => [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]

export type GlobeOptions = {
  /** Scroll progress through the section, 0 to 1; one full turn of the globe. */
  progress: () => number
  /** Draw one frame per scroll change, with no idle drift or arcs (reduced motion). */
  still: boolean
}

/** Starts the globe on a canvas and returns a function that stops it. */
export function startGlobe(cv: HTMLCanvasElement, { progress, still }: GlobeOptions) {
  const context = cv.getContext('2d')
  if (!context) return () => {}
  const g: CanvasRenderingContext2D = context
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  let W = 0
  let H = 0
  let raf = 0
  let visible = true
  let clock = 0
  let last = performance.now()
  let lastP = -1

  const resize = () => {
    const r = cv.getBoundingClientRect()
    W = r.width
    H = r.height
    cv.width = Math.round(W * DPR)
    cv.height = Math.round(H * DPR)
    draw()
  }

  function draw() {
    if (!W || !H) return
    g.setTransform(DPR, 0, 0, DPR, 0, 0)
    g.clearRect(0, 0, W, H)
    const R = Math.min(W, H) * 0.33
    const cx = W / 2
    const cy = H / 2
    const yaw = -progress() * Math.PI * 2 + (still ? 0 : clock * 0.04)
    const tilt = 0.32
    const cy0 = Math.cos(yaw)
    const sy0 = Math.sin(yaw)
    const ct = Math.cos(tilt)
    const st = Math.sin(tilt)
    /** Turn a point on the unit sphere by the globe's yaw and tilt; z > 0 faces the viewer. */
    const rot = ([x, y, z]: V3): V3 => {
      const x1 = x * cy0 + z * sy0
      const z1 = -x * sy0 + z * cy0
      return [x1, y * ct - z1 * st, y * st + z1 * ct]
    }
    const scr = (p: V3, alt = 1): [number, number] => [cx + p[0] * R * alt, cy - p[1] * R * alt]

    // shadow on the ground below
    g.save()
    g.translate(cx, cy + R * 1.28)
    g.scale(1, 0.18)
    const sh = g.createRadialGradient(0, 0, 0, 0, 0, R * 0.95)
    sh.addColorStop(0, 'rgba(30,40,90,.22)')
    sh.addColorStop(1, 'rgba(30,40,90,0)')
    g.fillStyle = sh
    g.beginPath()
    g.arc(0, 0, R * 0.95, 0, 7)
    g.fill()
    g.restore()

    // halo
    const halo = g.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.42)
    halo.addColorStop(0, 'rgba(62,87,218,.22)')
    halo.addColorStop(1, 'rgba(62,87,218,0)')
    g.fillStyle = halo
    g.beginPath()
    g.arc(cx, cy, R * 1.42, 0, 7)
    g.fill()

    // the far half of the orbit ring passes behind the globe
    const ring = (front: boolean) => {
      g.strokeStyle = BLUE
      g.globalAlpha = front ? 0.55 : 0.2
      g.lineWidth = 1
      g.beginPath()
      g.ellipse(cx, cy, R * 1.22, R * 0.3, -0.18, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2)
      g.stroke()
      g.globalAlpha = 1
    }
    ring(false)

    // the glossy sphere: lit from the top left, darker toward the bottom right rim
    const body = g.createRadialGradient(cx - R * 0.38, cy - R * 0.42, R * 0.05, cx, cy, R)
    body.addColorStop(0, '#8C9CF5')
    body.addColorStop(0.35, '#5369E3')
    body.addColorStop(0.8, BLUE)
    body.addColorStop(1, '#2C3FA8')
    g.fillStyle = body
    g.beginPath()
    g.arc(cx, cy, R, 0, 7)
    g.fill()

    // graticule on the near side
    g.strokeStyle = '#FFFFFF'
    g.lineWidth = 0.7
    const path = (pts: V3[]) => {
      let open = false
      g.beginPath()
      for (const p of pts) {
        const q = rot(p)
        if (q[2] > 0) {
          const [x, y] = scr(q)
          if (open) g.lineTo(x, y)
          else g.moveTo(x, y)
          open = true
        } else open = false
      }
      g.stroke()
    }
    g.globalAlpha = 0.16
    for (let lat = -60; lat <= 60; lat += 30) path(Array.from({ length: 73 }, (_, i) => unit(lat * DEG, i * 5 * DEG)))
    for (let lon = 0; lon < 360; lon += 30) path(Array.from({ length: 37 }, (_, i) => unit((-90 + i * 5) * DEG, lon * DEG)))

    // dotted surface
    const N = 520
    for (let i = 0; i < N; i++) {
      const y = 1 - ((i + 0.5) / N) * 2
      const r = Math.sqrt(1 - y * y)
      const th = i * 2.39996
      const q = rot([r * Math.sin(th), y, r * Math.cos(th)])
      if (q[2] <= 0) continue
      const [x, yy] = scr(q)
      const s = 0.8 + 1.1 * q[2]
      g.globalAlpha = 0.18 + 0.5 * q[2]
      g.fillStyle = '#FFFFFF'
      g.fillRect(x - s / 2, yy - s / 2, s, s)
    }

    // gloss: a soft highlight and a thin bright rim
    g.globalAlpha = 1
    const gloss = g.createRadialGradient(cx - R * 0.42, cy - R * 0.48, 0, cx - R * 0.42, cy - R * 0.48, R * 0.62)
    gloss.addColorStop(0, 'rgba(255,255,255,.55)')
    gloss.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = gloss
    g.beginPath()
    g.arc(cx, cy, R, 0, 7)
    g.fill()
    g.strokeStyle = 'rgba(255,255,255,.5)'
    g.lineWidth = 1.2
    g.beginPath()
    g.arc(cx, cy, R - 0.6, Math.PI * 0.95, Math.PI * 1.6)
    g.stroke()

    // the near half of the orbit ring, in front
    ring(true)

    // stations: the one nearest the front is lit and named
    const pos = STATIONS.map((s) => rot(unit(s.lat, s.lon)))
    let lead = 0
    pos.forEach((p, i) => {
      if (p[2] > pos[lead][2]) lead = i
    })
    const fs = Math.max(10, Math.min(13, R * 0.085))
    pos.forEach((p, i) => {
      if (p[2] <= 0.02) return
      const [x, y] = scr(p)
      const on = i === lead
      const a = cl(p[2] * 3)
      g.globalAlpha = a
      g.fillStyle = '#FFFFFF'
      g.beginPath()
      g.arc(x, y, on ? 4 : 2.6, 0, 7)
      g.fill()
      g.strokeStyle = '#FFFFFF'
      g.lineWidth = 1
      g.beginPath()
      g.arc(x, y, on ? 9 : 6, 0, 7)
      g.stroke()
      if (on && !still) {
        const ph = (clock * 0.9) % 1
        g.globalAlpha = (1 - ph) * 0.8
        g.beginPath()
        g.arc(x, y, 9 + ph * 18, 0, 7)
        g.stroke()
      }
      // name: a white tag for the lead station, plain small type for the others
      const name = campus.departments[STATIONS[i].key].name.toUpperCase()
      g.font = `500 ${on ? fs : fs * 0.82}px ${MONO}`
      g.textBaseline = 'middle'
      const tw = g.measureText(name).width
      const right = x < cx + R * 0.35
      const tx = right ? x + (on ? 15 : 11) : x - (on ? 15 : 11) - tw
      g.globalAlpha = a
      if (on) {
        g.fillStyle = '#FFFFFF'
        g.fillRect(tx - 6, y - fs * 0.8, tw + 12, fs * 1.6)
        g.fillStyle = BLUE
      } else g.fillStyle = 'rgba(255,255,255,.85)'
      g.textAlign = 'left'
      g.fillText(name, tx, y + 0.5)
    })
    g.globalAlpha = 1

    // work arcing from one station to the next, lifted off the surface
    if (!still) {
      const n = Math.floor(clock / HOP_TIME)
      for (const k of [n - 1, n]) {
        if (k < 0) continue
        const [a, b] = HOPS[k % HOPS.length]
        const f = cl((clock - k * HOP_TIME) / (HOP_TIME * 1.1))
        if (f >= 1) continue
        const A = unit(STATIONS[a].lat, STATIONS[a].lon)
        const B = unit(STATIONS[b].lat, STATIONS[b].lon)
        const head = ease(cl(f / 0.75))
        const tail = ease(cl((f - 0.25) / 0.75))
        const pts: [number, number, boolean][] = []
        const steps = 40
        for (let i = 0; i <= steps; i++) {
          const t = tail + ((head - tail) * i) / steps
          const m: V3 = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]
          const len = Math.hypot(...m) || 1
          const alt = 1 + 0.28 * Math.sin(Math.PI * t)
          const q = rot([m[0] / len, m[1] / len, m[2] / len])
          const [x, y] = scr(q, alt)
          // hidden only where it passes behind the sphere
          const hidden = q[2] < 0 && Math.hypot(x - cx, y - cy) < R
          pts.push([x, y, hidden])
        }
        g.strokeStyle = '#FFFFFF'
        g.lineWidth = 1.8
        g.lineCap = 'round'
        for (let i = 1; i < pts.length; i++) {
          if (pts[i][2] || pts[i - 1][2]) continue
          g.globalAlpha = 0.25 + 0.75 * (i / pts.length)
          g.beginPath()
          g.moveTo(pts[i - 1][0], pts[i - 1][1])
          g.lineTo(pts[i][0], pts[i][1])
          g.stroke()
        }
        const h = pts[pts.length - 1]
        if (!h[2] && f < 0.8) {
          g.globalAlpha = 1
          g.fillStyle = '#FFFFFF'
          g.beginPath()
          g.arc(h[0], h[1], 3, 0, 7)
          g.fill()
        }
        g.lineCap = 'butt'
      }
    }
    g.globalAlpha = 1
  }

  function frame(now: number) {
    raf = 0
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
    last = now
    clock += dt
    draw()
    if (visible) raf = requestAnimationFrame(frame)
  }

  // reduced motion: redraw only when the scroll position changes
  const onScroll = () => {
    const p = progress()
    if (p !== lastP) {
      lastP = p
      draw()
    }
  }

  const ro = new ResizeObserver(resize)
  ro.observe(cv)
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true
    if (visible && !still && !raf) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  })
  if (still) window.addEventListener('scroll', onScroll, { passive: true })
  else io.observe(cv)
  resize()
  document.fonts?.ready.then(draw).catch(() => {})

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    window.removeEventListener('scroll', onScroll)
  }
}
