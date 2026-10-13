// Grid pulse (after the component Ankit supplied, 2026-10-13): a fine grid that takes colour where
// the pointer passes and lets it go a moment later, with a few cells lighting on their own.
// Adapted for this site: the colour runs through the logo-blue family (sky blue at the top to
// indigo at the bottom) instead of the full spectrum, and the hairlines use the site's ink.
import { useEffect, useRef, type ComponentPropsWithoutRef, type CSSProperties } from 'react'
import { cn } from '../../lib/cn'

export type GridPulseProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Cell size in px. The hairlines and the lit cells share it. */
  cell?: number
  /** How far from the pointer a cell can still catch light, in cells. */
  reach?: number
  /** How many cells light on their own each beat, so the grid is never dead. */
  ambient?: number
  /** A lid, so a fast sweep cannot light the whole field at once. */
  maxLit?: number
  /** Elements whose lines of text the light holds back from, looked up inside the grid's parent. */
  avoid?: string
}

/** Hue at the top of the field and how far it turns by the bottom: sky blue to indigo. */
const HUE_TOP = 208
const HUE_SPAN = -40
/** Each cell takes one of these lightnesses, so a sweep reads as a field of tints rather than one flat colour. */
const TINTS_ON_DARK = [88, 80, 72, 64, 56]
/** Deeper on a light ground, where pale tints would wash out. */
const TINTS_ON_LIGHT = [78, 70, 62, 54, 46]
/** How faint a cell goes right behind a line of text. */
const FAINT = 0.13
/** How many cells it takes to come back up to full strength. */
const FADE = 2.2
/** Clearing kept around each line of text, in px. */
const PAD = 5
const FADE_IN = 160
const FADE_OUT = 750

type Cell = {
  col: number
  row: number
  colour: string
  /** How much of its colour the cell is allowed, 0 to 1. */
  dim: number
  born: number
  /** When it starts to fade out. */
  until: number
}

const easeOut = (t: number) => 1 - (1 - t) ** 2
const easeIn = (t: number) => t * t

/**
 * Place it inside a positioned container, under the content. It is decoration only: hidden from
 * assistive tech, transparent to the pointer, drawn on one canvas that sleeps whenever nothing is
 * lit, paused off screen, and still for readers who ask for reduced motion.
 */
export function GridPulse({ cell = 24, reach = 2.6, ambient = 2, maxLit = 180, avoid = '[data-grid-avoid]', className, style, ...props }: GridPulseProps) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = box.current
    const paper = canvas.current
    const ctx = paper?.getContext('2d')
    if (!el || !paper || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cols = 1
    let rows = 1
    let width = 0
    let height = 0
    let clear: DOMRect[] = []
    let tints = TINTS_ON_LIGHT
    const cells = new Map<string, Cell>()

    // Light or dark ground, read from the text colour the grid inherits. Resolved through a
    // pixel, since computed colours may be oklch.
    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    const readTheme = () => {
      if (!probe) return
      probe.clearRect(0, 0, 1, 1)
      probe.fillStyle = getComputedStyle(el).color
      probe.fillRect(0, 0, 1, 1)
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
      const lightText = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5
      tints = lightText ? TINTS_ON_DARK : TINTS_ON_LIGHT
    }

    // Protect the lines of text, not the boxes that hold them.
    const measureText = () => {
      const bounds = el.getBoundingClientRect()
      const scope = el.parentElement ?? document
      clear = [...scope.querySelectorAll(avoid)].flatMap((node) => {
        const range = document.createRange()
        range.selectNodeContents(node)
        const lines = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0)
        const boxes = lines.length > 0 ? lines : [node.getBoundingClientRect()]
        return boxes.map((r) => new DOMRect(r.left - bounds.left - PAD, r.top - bounds.top - PAD, r.width + PAD * 2, r.height + PAD * 2))
      })
    }

    // One loop draws every cell; it runs only while something is lit.
    let frame = 0
    const draw = (now: number) => {
      frame = 0
      ctx.clearRect(0, 0, width, height)
      for (const [key, c] of cells) {
        let alpha: number
        if (now < c.until) {
          alpha = easeOut(Math.min(1, (now - c.born) / FADE_IN))
        } else {
          const t = (now - c.until) / FADE_OUT
          if (t >= 1) {
            cells.delete(key)
            continue
          }
          alpha = 1 - easeIn(t)
        }
        ctx.globalAlpha = alpha * c.dim
        ctx.fillStyle = c.colour
        // Inset by the hairline, so the grid still shows between lit cells.
        ctx.fillRect(c.col * cell + 1, c.row * cell + 1, cell - 1, cell - 1)
      }
      ctx.globalAlpha = 1
      if (cells.size > 0) frame = requestAnimationFrame(draw)
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const measure = () => {
      width = el.clientWidth
      height = el.clientHeight
      cols = Math.max(1, Math.ceil(width / cell))
      rows = Math.max(1, Math.ceil(height / cell))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      paper.width = Math.round(width * dpr)
      paper.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      readTheme()
      measureText()
      wake()
    }

    /** How bright a cell may be, by its distance from the nearest line of text: faint behind words, never a hole. */
    const brightness = (col: number, row: number) => {
      const x = col * cell + cell / 2
      const y = row * cell + cell / 2
      let nearest = Number.POSITIVE_INFINITY
      for (const r of clear) {
        const dx = Math.max(r.left - x, 0, x - r.right)
        const dy = Math.max(r.top - y, 0, y - r.bottom)
        nearest = Math.min(nearest, Math.hypot(dx, dy))
        if (nearest === 0) break
      }
      if (nearest === Number.POSITIVE_INFINITY) return 1
      return FAINT + (1 - FAINT) * Math.min(1, nearest / (FADE * cell))
    }

    const ink = (row: number) => {
      const t = rows > 1 ? Math.min(1, row / (rows - 1)) : 0
      const hue = (((HUE_TOP - t * HUE_SPAN) % 360) + 360) % 360
      const tint = tints[Math.floor(Math.random() * tints.length)]
      return `hsl(${Math.round(hue)} 78% ${tint}%)`
    }

    /** Lights one cell, unless it is off the grid or already lit. */
    const light = (col: number, row: number, hold: number) => {
      if (col < 0 || row < 0 || col >= cols || row >= rows) return
      if (cells.size >= maxLit) return
      const key = `${col},${row}`
      const now = performance.now()
      const lit = cells.get(key)
      if (lit && now < lit.until) return
      // A cell caught again while fading picks up from where it had got to.
      let born = now
      if (lit) {
        const faded = 1 - easeIn(Math.min(1, (now - lit.until) / FADE_OUT))
        born = now - (1 - Math.sqrt(1 - faded)) * FADE_IN
      }
      cells.set(key, { col, row, colour: lit?.colour ?? ink(row), dim: brightness(col, row), born, until: now + hold })
      wake()
    }

    // The pointer paints. Cells further from it catch light less often, so the trail's edge breaks up.
    let pending = 0
    let at: { x: number; y: number } | null = null
    const paint = () => {
      pending = 0
      if (!at) return
      const cx = Math.floor(at.x / cell)
      const cy = Math.floor(at.y / cell)
      const span = Math.ceil(reach)
      for (let dy = -span; dy <= span; dy++) {
        for (let dx = -span; dx <= span; dx++) {
          const away = Math.hypot(dx, dy)
          if (away > reach) continue
          if (Math.random() > 1 - away / (reach + 0.6)) continue
          light(cx + dx, cy + dy, 260 + Math.random() * 900)
        }
      }
    }
    // Listened for on the window, because the grid sits under the content.
    const onMove = (event: PointerEvent) => {
      const bounds = el.getBoundingClientRect()
      at = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
      if (!pending) pending = requestAnimationFrame(paint)
    }

    // A few cells find their own way on, so the grid is alive with no pointer. Paused while out of sight.
    let visible = true
    let beat = 0
    const drift = () => {
      beat = window.setTimeout(drift, 1400 + Math.random() * 1800)
      if (!visible || document.hidden) return
      for (let i = 0; i < ambient; i++) light(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), 900 + Math.random() * 1600)
    }
    beat = window.setTimeout(drift, 500)

    const sight = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    sight.observe(el)
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    // Text added, removed or rewritten moves the lines to hold back from.
    let recheck = 0
    const copy = new MutationObserver(() => {
      if (!recheck) {
        recheck = requestAnimationFrame(() => {
          recheck = 0
          measureText()
        })
      }
    })
    copy.observe(el.parentElement ?? document.body, { childList: true, subtree: true, characterData: true })
    measure()
    // Lines of text move once the web fonts arrive.
    document.fonts?.ready.then(measureText).catch(() => {})
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      sight.disconnect()
      resize.disconnect()
      copy.disconnect()
      cancelAnimationFrame(recheck)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(pending)
      clearTimeout(beat)
      window.removeEventListener('pointermove', onMove)
    }
  }, [cell, reach, ambient, maxLit, avoid])

  return (
    <div
      ref={box}
      aria-hidden
      data-slot="grid-pulse"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        // The hairlines, faint on their own so the lit cells keep full ink.
        '[--grid-pulse-line:color-mix(in_oklab,var(--color-ink)_7%,transparent)]',
        // Fades out at the bottom, so whatever follows can climb over it.
        '[mask-image:linear-gradient(to_bottom,#000_82%,transparent)]',
        className,
      )}
      style={
        {
          '--grid-pulse-cell': `${cell}px`,
          backgroundImage: 'linear-gradient(to right, var(--grid-pulse-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-pulse-line) 1px, transparent 1px)',
          backgroundSize: 'var(--grid-pulse-cell) var(--grid-pulse-cell)',
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <canvas ref={canvas} className="absolute inset-0 size-full" />
    </div>
  )
}
