import { showcase, sky001 } from '@skyfall/core'
import { ScrollTrigger, useGSAP, useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef, useState } from 'react'
import { FrameSequence } from '../lib/frames'
import { ReelVideo } from './Reel'
import { media, type ModelId } from '../lib/media'
import { BODY, GUTTER, H3, LABEL, WRAP } from '../lib/ui'
import { useMedia } from '../lib/useMedia'

const STAGES = sky001.stages.items
const STUDIO = '#f6f6f6'

// Showcase timeline stage → index of the content-doc stage it illustrates.
const STAGE_OF: Record<string, number> = { clay: 0, color: 1, explode: 1, exploded: 1, level2: 1, leaves: 1, refine: 2, assemble: 3, hold: 3 }

function StageText({ i, active }: { i: number; active: boolean }) {
  const s = STAGES[i]
  return (
    <li aria-current={active ? 'step' : undefined} className={`border px-4 py-4 backdrop-blur-sm transition-colors duration-300 lg:px-5 lg:py-5 ${active ? 'border-ink bg-paper' : 'border-line bg-studio/90'}`}>
      <span className={`${LABEL} flex items-center gap-2 ${active ? 'text-brand' : 'text-faint'}`}>
        <span aria-hidden="true" className={`block size-2 ${active ? 'bg-brand' : 'bg-line'}`} />
        {s.label}
      </span>
      <h3 className={`${H3} mt-1 transition-colors duration-300 ${active ? 'text-ink' : 'text-faint'}`}>{s.title}</h3>
      <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <p className="overflow-hidden text-[15px] leading-[1.45] text-body">
          <span className="block pt-2">{s.body}</span>
        </p>
      </div>
    </li>
  )
}

/** Phones and reduced motion: no pinning. The reel film (or final render) sits above the four stages, all open. */
function StageList({ model }: { model: ModelId }) {
  return (
    <div className={`${GUTTER} pb-16`}>
      <div className={WRAP}>
        <ReelVideo model={model} className="aspect-[8/5] w-full" />
        <ol className="mt-8 grid gap-5 md:grid-cols-2">
          {STAGES.map((s) => (
            <li key={s.key} className="border border-line bg-paper p-5 pb-6">
              <span className={`${LABEL} text-brand`}>{s.label}</span>
              <h3 className={`${H3} mt-1`}>{s.title}</h3>
              <p className={`${BODY} mt-2`}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/**
 * Pinned scroll chapter: one model scrubs from clay shape to parts to refined assembly as the
 * visitor scrolls, and the matching stage text lights up. The 20 MB frame file starts loading
 * only when the chapter is near; the poster shows until then.
 */
function PinnedScrub({ model }: { model: ModelId }) {
  const info = showcase.models.find((m) => m.id === model)!
  const track = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [failed, setFailed] = useState(false)
  const state = useRef({ seq: null as FrameSequence | null, poster: null as HTMLImageElement | null, progress: 0, last: -1 })

  const draw = () => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const st = state.current
    const rect = c.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = Math.round(rect.width * dpr)
    const H = Math.round(rect.height * dpr)
    if (c.width !== W || c.height !== H) {
      c.width = W
      c.height = H
    }
    let img: ImageBitmap | HTMLImageElement | null = st.poster
    const meta = st.seq?.meta
    if (st.seq && meta) {
      const f = Math.round(st.progress * (meta.n - 1))
      img = st.seq.get(f, f >= st.last ? 1 : -1) ?? st.poster
      st.last = f
      setActive(STAGE_OF[st.seq.stageAt(f)] ?? 3)
    }
    ctx.fillStyle = STUDIO
    ctx.fillRect(0, 0, W, H)
    if (!img) return
    // Fit the whole frame into the space the stage list leaves free, so no part of the model ever
    // plays behind the text: right of the list on wide screens, above it on tablets.
    const l = list.current?.getBoundingClientRect()
    const wide = rect.width >= 1024
    const pad = 24
    const free = {
      left: wide && l ? l.right - rect.left + pad : pad,
      top: 72,
      right: rect.width - pad,
      bottom: !wide && l ? l.top - rect.top - pad : rect.height - 88,
    }
    const fw = Math.max(1, free.right - free.left) * dpr
    const fh = Math.max(1, free.bottom - free.top) * dpr
    // The frames carry empty margin around the model, so a little overscan still stays clear of the list.
    const s = Math.min(fw / img.width, fh / img.height) * 1.08
    ctx.imageSmoothingQuality = 'high'
    const dw = img.width * s
    const dh = img.height * s
    // Wide screens: the model's middle sits level with the middle of the stage list. The model
    // rides a little low inside its frame (room for the shadow), so the frame is nudged up to match.
    const middle = wide && l ? l.top - rect.top + l.height / 2 : (free.top + free.bottom) / 2
    const top = Math.max(56 * dpr, middle * dpr - dh / 2 - (wide ? dh * 0.045 : 0))
    ctx.drawImage(img, free.left * dpr + (fw - dw) / 2, top, dw, dh)
  }

  useEffect(() => {
    const st = state.current
    const seq = new FrameSequence(model)
    st.seq = seq
    seq.onReady = draw
    const poster = new Image()
    poster.src = media.poster(model)
    poster.onload = () => {
      st.poster = poster
      draw()
    }
    const el = track.current
    const io =
      el && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              if (!entries.some((e) => e.isIntersecting)) return
              io?.disconnect()
              seq.load(setLoaded).then(draw, () => setFailed(true))
            },
            { rootMargin: '100% 0px' },
          )
        : null
    if (el) io?.observe(el)
    window.addEventListener('resize', draw)
    // The open stage block grows and shrinks; follow it so the model stays level with the list.
    const ro = typeof ResizeObserver !== 'undefined' && list.current ? new ResizeObserver(draw) : null
    if (ro && list.current) ro.observe(list.current)
    return () => {
      io?.disconnect()
      ro?.disconnect()
      window.removeEventListener('resize', draw)
      seq.dispose()
      st.seq = null
    }
    // draw only reads refs, so it is stable for the life of this effect.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [model])

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: track.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          state.current.progress = self.progress
          draw()
        },
      })
    },
    { scope: track },
  )

  return (
    <div ref={track} className="h-[420vh]">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-16">
        <canvas ref={canvas} role="img" aria-label={`${info.title}: scroll to watch one image become ${info.leaves} parts and a finished assembly`} className="absolute inset-0 size-full" />
        <div className={`${GUTTER} relative flex min-h-0 flex-1 items-center`}>
          <div className={`${WRAP} flex h-full items-end pb-3 lg:items-center lg:pb-0`}>
            <ol ref={list} className="flex w-full max-w-[340px] flex-col gap-3 lg:max-w-[380px] lg:gap-4">
              {STAGES.map((s, i) => (
                <StageText key={s.key} i={i} active={i === active} />
              ))}
            </ol>
          </div>
        </div>
        <div className={`${GUTTER} relative pb-5`}>
          <div className={`${WRAP} flex items-end justify-between gap-4 lg:justify-end lg:gap-8`}>
            <p className={`${LABEL} text-muted`} aria-live="polite">
              {failed ? 'Frames failed to load. Reload to try again.' : loaded > 0 && loaded < 1 ? `Loading frames · ${Math.round(loaded * 100)}%` : `${info.title} · ${info.leaves} parts · depth ${info.depth}`}
            </p>
            <figure className="flex items-center gap-3">
              <figcaption className={`${LABEL} text-muted`}>Input image</figcaption>
              <img src={media.input(model)} alt={`Input image of the ${info.title}`} className="size-16 border border-ink object-cover lg:size-20" />
            </figure>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StageScrub({ model }: { model: ModelId }) {
  const reduced = useReducedMotion()
  const wide = useMedia('(min-width: 768px)')
  return wide && !reduced ? <PinnedScrub model={model} /> : <StageList model={model} />
}
