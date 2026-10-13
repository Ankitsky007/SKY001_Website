import { benchmarks } from '@skyfall/core'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@skyfall/core/motion'
import { useRef, useState } from 'react'
import { Toggle } from '../../components/ui'
import { Hub } from './Hub'

// "World Models vs. LLMs": the same part built by three models on one shared clock, using the
// benchmark's per-part times (3D Construction, 20 cases). Real time by default; 10× to see the end.
const PICK = ['3D Construction WM', 'GPT-6 Astra', 'Opus 5.5'] as const
const RUNNERS = PICK.map((m) => {
  const row = benchmarks.cad.rows.find((r) => r.model === m)!
  return {
    model: row.ours ? 'SKY-001' : row.model,
    ours: row.ours,
    seconds: row.seconds,
    iou: row.iou,
  }
})
const PARTS = ['flange', 'bolts-back', 'barrel', 'bolts-front'] as const

function Column({ r, i }: { r: (typeof RUNNERS)[number]; i: number }) {
  return (
    <li data-runner={i} className={`flex flex-col border-r border-b border-line bg-white ${r.ours ? '' : ''}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px]">
        <span className={`flex items-center gap-2 ${r.ours ? 'text-brand' : 'text-ink'}`}>
          <span aria-hidden="true" className={`block size-2 ${r.ours ? 'bg-brand' : 'rounded-full border border-ink'}`} />
          {r.model}
        </span>
        <span className="text-muted">{r.seconds} s / part</span>
      </div>
      <div className="dots-sm relative grid place-items-center px-4 py-2 md:py-4">
        <svg viewBox="150 196 260 196" className="h-auto w-full max-w-[150px] md:max-w-[300px]" aria-hidden="true">
          <Hub cx={280} base={330} tone="light" ghost />
        </svg>
        <span data-done className="absolute top-3 right-3 bg-brand px-2 py-1 font-mono text-[11px] font-semibold tracking-[-0.02em] text-white uppercase opacity-0">
          Done
        </span>
      </div>
      <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
        <div className="flex items-baseline justify-between font-mono tracking-[-0.04em]">
          <span data-clock className={`text-[32px] font-medium md:text-[40px] ${r.ours ? 'text-brand' : 'text-ink'}`}>
            0.0 s
          </span>
          <span data-pct className="text-[13px] text-muted">
            0%
          </span>
        </div>
        <div className="h-1.5 w-full bg-line">
          <div data-bar className={`h-full w-0 ${r.ours ? 'bg-brand' : 'bg-ink'}`} />
        </div>
      </div>
    </li>
  )
}

/** Three columns race on one clock; each hub fills in part by part as its run progresses. */
export function Race() {
  const root = useRef<HTMLDivElement>(null)
  const [fast, setFast] = useState(false)
  const state = useRef({ t: 0, speed: 1, playing: false })
  const api = useRef<{ restart: () => void } | null>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const cols = gsap.utils.toArray<HTMLElement>('[data-runner]', el)
      const summary = el.querySelector<HTMLElement>('[data-summary]')
      const longest = Math.max(...RUNNERS.map((r) => r.seconds))

      const render = () => {
        const t = state.current.t
        cols.forEach((col, i) => {
          const r = RUNNERS[i]
          const p = Math.min(1, t / r.seconds)
          const clock = col.querySelector<HTMLElement>('[data-clock]')!
          clock.textContent = `${Math.min(t, r.seconds).toFixed(t < 10 ? 1 : 0)} s`
          col.querySelector<HTMLElement>('[data-pct]')!.textContent = p >= 1 ? `${r.iou}% IoU` : `${Math.floor(p * 100)}%`
          col.querySelector<HTMLElement>('[data-bar]')!.style.width = `${p * 100}%`
          ;(col.querySelector('[data-done]') as HTMLElement).style.opacity = p >= 1 ? '1' : '0'
          PARTS.forEach((name, k) => {
            const local = gsap.utils.clamp(0, 1, p * PARTS.length - k)
            col.querySelectorAll<SVGElement>(`[data-part="${name}"] [data-solid]`).forEach((s) => (s.style.opacity = String(local)))
            col.querySelectorAll<SVGElement>(`[data-part="${name}"] [data-ghost]`).forEach((s) => (s.style.opacity = String(1 - local)))
          })
        })
        if (summary) {
          const done = RUNNERS.filter((r) => t >= r.seconds).length
          summary.textContent =
            done === 0
              ? 'Running · one part, three models, one clock'
              : done < RUNNERS.length
                ? `SKY-001 done in ${RUNNERS[0].seconds} s · GPT-6 Astra still running`
                : `All done · SKY-001 ${benchmarks.headline[0].value} faster than GPT-6 Astra`
        }
      }

      const tick = (_time: number, dt: number) => {
        const s = state.current
        if (!s.playing) return
        s.t = Math.min(longest, s.t + (dt / 1000) * s.speed)
        render()
        if (s.t >= longest) s.playing = false
      }

      if (prefersReducedMotion()) {
        state.current.t = longest
        render()
        api.current = { restart: () => {} }
        return
      }

      render()
      gsap.ticker.add(tick)
      let inView = false
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 70%',
        end: 'bottom top',
        onToggle: (self) => {
          inView = self.isActive
          state.current.playing = inView && state.current.t < longest
        },
      })
      api.current = {
        restart: () => {
          state.current.t = 0
          state.current.playing = inView
          render()
        },
      }
      return () => {
        gsap.ticker.remove(tick)
        st.kill()
      }
    },
    { scope: root },
  )

  const onSpeed = (next: boolean) => {
    setFast(next)
    state.current.speed = next ? 10 : 1
  }

  return (
    <div ref={root} className="dots flex flex-col gap-3 border border-line p-3 [background-size:12px_12px] md:gap-4 md:p-5 md:[background-size:14px_14px]">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px] font-medium tracking-[-0.02em] uppercase md:text-[13px]">
        <span className="text-muted">Fig.06 · same part, shared clock</span>
        <div className="flex items-center gap-2 md:gap-4">
          <Toggle on={fast} onChange={onSpeed} offLabel="Real time" onLabel="10×" label="Play the race ten times faster" />
          <button
            type="button"
            onClick={() => api.current?.restart()}
            className="flex min-h-11 cursor-pointer items-center gap-2 border border-line bg-white px-3 text-ink uppercase transition-colors hover:border-brand hover:text-brand"
          >
            ↻ Replay
          </button>
        </div>
      </div>
      <ol className="grid border-t border-l border-line md:grid-cols-3">
        {RUNNERS.map((r, i) => (
          <Column key={r.model} r={r} i={i} />
        ))}
      </ol>
      <p data-summary aria-live="polite" className="font-mono text-[11px] font-medium tracking-[-0.02em] text-ink uppercase md:text-[13px]">
        Running · one part, three models, one clock
      </p>
    </div>
  )
}
