// Dithered illustration for the partnership form header: two half-cubes sliding together and
// locking into one, with a flash at the seam. Each frame the shape is painted in greys on a tiny
// canvas (one pixel per dot), then drawn as white dots on the brand blue with an ordered (Bayer)
// dither, so light faces are dense and dark faces sparse.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)
const DESIGN_W = 280
const DESIGN_H = 110

const easeInOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

const grey = (v: number) => {
  const c = Math.round(v * 255)
  return `rgb(${c},${c},${c})`
}

function ellipse(g: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot: number, v: number) {
  g.fillStyle = grey(v)
  g.beginPath()
  g.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
  g.fill()
}
function poly(g: CanvasRenderingContext2D, pts: number[], v: number) {
  g.fillStyle = grey(v)
  g.beginPath()
  for (let i = 0; i < pts.length; i += 2) (i ? g.lineTo : g.moveTo).call(g, pts[i], pts[i + 1])
  g.closePath()
  g.fill()
}

/** Two halves of an isometric cube, `gap` design units apart, plus a flash ring at the seam. */
function paintCubes(g: CanvasRenderingContext2D, gap: number, flash: number, bob: number) {
  const cx = DESIGN_W / 2
  const a = 40 // edge length
  const dx = a * 0.866
  const dy = a / 2
  const cy = 97 + bob // the cube's front-bottom corner
  const top = cy - a // its front-top corner; the back-top corner is 2 * dy above that
  // left half: the left face and the left half of the top
  const L = -gap / 2
  poly(g, [cx + L - dx, top - dy, cx + L, top, cx + L, top - 2 * dy], 0.98)
  poly(g, [cx + L - dx, top - dy, cx + L, top, cx + L, cy, cx + L - dx, cy - dy], 0.62)
  // right half: the right half of the top and the right face
  const R = gap / 2
  poly(g, [cx + R, top, cx + R + dx, top - dy, cx + R, top - 2 * dy], 0.84)
  poly(g, [cx + R, top, cx + R + dx, top - dy, cx + R + dx, cy - dy, cx + R, cy], 0.34)
  // the ground shadow, wider while apart
  ellipse(g, cx, cy + 9, 46 + gap * 0.5, 5, 0, 0.16)
  if (flash > 0) {
    // a ring and a bright point where the halves meet
    const fy = top - dy
    g.strokeStyle = grey(flash)
    g.lineWidth = 2.5
    const r = 6 + (1 - flash) * 70
    g.beginPath()
    g.ellipse(cx, fy, r, r * 0.55, 0, 0, Math.PI * 2)
    g.stroke()
    ellipse(g, cx, fy, 3 + 4 * flash, 3 + 4 * flash, 0, flash)
  }
}

/** Starts the illustration on a canvas; returns stop(). `still` draws the finished picture once. */
export function startDither(cv: HTMLCanvasElement, still: boolean) {
  const context = cv.getContext('2d')
  const off = document.createElement('canvas')
  const oc = off.getContext('2d', { willReadFrequently: true })
  if (!context || !oc) return () => {}
  const g: CanvasRenderingContext2D = context
  const o: CanvasRenderingContext2D = oc
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  const PITCH = 3 // css px between dots
  let W = 0
  let H = 0
  let cols = 0
  let rows = 0
  let raf = 0
  let t0 = performance.now()

  /** Paint the scene into the one-pixel-per-dot canvas and return its brightness per cell. */
  const sample = (paint: (c: CanvasRenderingContext2D) => void) => {
    o.setTransform(1, 0, 0, 1, 0, 0)
    o.fillStyle = '#000'
    o.fillRect(0, 0, cols, rows)
    const s = Math.min(cols / DESIGN_W, rows / DESIGN_H) * 0.96
    o.setTransform(s, 0, 0, s, (cols - DESIGN_W * s) / 2, (rows - DESIGN_H * s) / 2)
    paint(o)
    return o.getImageData(0, 0, cols, rows).data
  }

  /** Cells that the dither turns on, from a brightness map. */
  const lit = (data: Uint8ClampedArray, jitter = 0) => {
    const out: [number, number][] = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = data[(y * cols + x) * 4] / 255
        if (v <= 0.02) continue
        if (v + jitter * (Math.sin(x * 12.9 + y * 78.2) * 0.5) > BAYER[(y % 4) * 4 + (x % 4)]) out.push([x, y])
      }
    }
    return out
  }

  const resize = () => {
    const r = cv.getBoundingClientRect()
    W = r.width
    H = r.height
    cv.width = Math.round(W * DPR)
    cv.height = Math.round(H * DPR)
    cols = Math.max(1, Math.floor(W / PITCH))
    rows = Math.max(1, Math.floor(H / PITCH))
    off.width = cols
    off.height = rows
    t0 = performance.now()
    draw(still ? 99 : 0)
  }

  const dot = (x: number, y: number, size: number) => {
    g.fillRect((x + 0.5) * PITCH - size / 2, (y + 0.5) * PITCH - size / 2, size, size)
  }

  function draw(t: number) {
    g.setTransform(DPR, 0, 0, DPR, 0, 0)
    g.clearRect(0, 0, W, H)
    // the faint grid of every dot position, as on the rest of the site
    g.fillStyle = 'rgba(255,255,255,0.14)'
    for (let y = 0; y < rows; y += 2) for (let x = 0; x < cols; x += 2) dot(x, y, 1.2)
    g.fillStyle = '#FFFFFF'
    // apart, then sliding together, then a flash where they lock, then a slow float
    const join = easeInOut((t - 0.25) / 1.3)
    const gap = 70 * (1 - join)
    const flash = t > 1.55 ? Math.max(0, 1 - (t - 1.55) / 0.9) : 0
    const bob = t > 2.4 ? Math.sin((t - 2.4) * 1.6) * 1.5 : 0
    for (const [x, y] of lit(sample((c) => paintCubes(c, gap, flash, bob)))) dot(x, y, 1.9)
  }

  const frame = (now: number) => {
    const t = (now - t0) / 1000
    draw(t)
    raf = requestAnimationFrame(frame)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(cv)
  resize()
  if (!still) raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
  }
}
