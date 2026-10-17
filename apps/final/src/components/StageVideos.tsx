import { sky001 } from '@skyfall/core'
import { useReducedMotion } from '@skyfall/core/motion'
import { useEffect, useRef, useState } from 'react'
import constructClip from '../assets/media/stage-construct.mp4'
import decomposeClip from '../assets/media/stage-decompose.mp4'
import exploreClip from '../assets/media/stage-explore.mp4'
import sketchClip from '../assets/media/stage-sketch.mp4'
import constructPoster from '../assets/media/s-stage-construct.jpg'
import decomposePoster from '../assets/media/s-stage-decompose.jpg'
import explorePoster from '../assets/media/s-stage-explore.jpg'
import sketchPoster from '../assets/media/s-stage-sketch.jpg'
import { useInView } from '../lib/inView'
import { DISPLAY, LABEL } from '../lib/ui'

const STAGES = sky001.stages.items
// One film per stage, made by the team (Ankit, 2026-10-17); they replace the scroll-driven 3D model.
const CLIPS: Record<string, { src: string; poster: string }> = {
  explore: { src: exploreClip, poster: explorePoster },
  decompose: { src: decomposeClip, poster: decomposePoster },
  sketch: { src: sketchClip, poster: sketchPoster },
  construct: { src: constructClip, poster: constructPoster },
}

/**
 * How SKY-001 works, one stage at a time (option D's layout in option B's colours, Ankit,
 * 2026-10-17). The stage list sits beside the video, centred on it. While the section is on screen
 * each stage's film plays once, muted, and a blue rail down the list fills with it; at the end of a
 * film the next stage starts, and after the last one it goes back to the first. Tapping a stage
 * plays that film from the start. Reduced motion: nothing plays by itself, the film has controls.
 * Phones and tablets: the video on top, the list under it.
 */
export function StageVideos({ titleId }: { titleId: string }) {
  const reduced = useReducedMotion()
  const video = useRef<HTMLVideoElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, '0px')
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const clip = CLIPS[STAGES[active].key]

  // play while on screen, pause off it; a new stage starts from the beginning
  useEffect(() => {
    const v = video.current
    if (!v || reduced) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView, reduced, active])

  // the rail follows the film smoothly, not just on the browser's few timeupdate events
  const raf = useRef(0)
  const follow = () => {
    cancelAnimationFrame(raf.current)
    const tick = () => {
      const v = video.current
      if (v?.duration) setProgress(v.currentTime / v.duration)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  const unfollow = () => cancelAnimationFrame(raf.current)
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const choose = (i: number) => {
    setProgress(0)
    if (i === active) {
      const v = video.current
      if (!v) return
      v.currentTime = 0
      if (!reduced) v.play().catch(() => {})
      return
    }
    setActive(i)
  }

  const next = () => {
    unfollow()
    if (reduced) return
    setProgress(0)
    setActive((i) => (i + 1) % STAGES.length)
  }

  return (
    <>
      <h2 id={titleId} className={`${DISPLAY} text-[30px] leading-none sm:text-[40px] lg:text-[48px]`}>
        {sky001.stages.title}
      </h2>
      {/* side by side from 1280px, the video and the stage list exactly as tall as each other: the list's
          stages share out the video's height, and if the list is the taller one the video fills it */}
      <div ref={box} className="mt-10 grid gap-8 md:mt-12 xl:grid-cols-[minmax(0,330px)_minmax(0,1fr)] xl:gap-10">
        <figure className="relative overflow-hidden border border-ink bg-black xl:order-last">
          {/* holds the 16:9 shape; the video covers whatever height the row ends up */}
          <div aria-hidden="true" className="aspect-video" />
          <video
            key={clip.src}
            ref={video}
            src={inView || reduced ? clip.src : undefined}
            poster={clip.poster}
            aria-label={`${STAGES[active].label}: ${STAGES[active].title}`}
            muted
            playsInline
            preload="none"
            controls={reduced}
            onPlay={follow}
            onPause={unfollow}
            onEnded={next}
            className="absolute inset-0 size-full object-cover"
          />
        </figure>
        {/* below 1280px: four tabs under the video (Ankit, 2026-10-17); the playing one is the solid blue tab,
            with a bar along its bottom that fills as the film plays, and only its stage's text shows */}
        <div className="-mt-5 xl:hidden">
          <div className="flex border-t border-l border-line bg-paper">
            {STAGES.map((s, i) => {
              const on = i === active
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-current={on ? 'step' : undefined}
                  aria-label={`${s.label}: ${s.title}`}
                  onClick={() => choose(i)}
                  className={`relative flex min-h-11 flex-1 cursor-pointer items-center justify-center border-r border-b px-1 font-mono text-xs tracking-[-0.02em] uppercase transition-colors duration-300 sm:text-[13px] ${on ? 'border-brand bg-brand font-semibold text-white' : 'border-line font-medium text-muted hover:bg-studio'}`}
                >
                  {on ? `<${s.label}>` : s.label}
                  {on && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-white/35">
                      <span className="block h-full origin-left bg-white" style={{ transform: `scaleX(${progress})` }} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <h3 className="mt-6 text-[22px] leading-[1.15] font-medium tracking-[-0.03em] text-ink md:text-[26px]">{STAGES[active].title}</h3>
          <p className="mt-3 text-[15px] leading-[1.45] tracking-[-0.01em] text-body md:text-base">{STAGES[active].body}</p>
        </div>
        <ol className="hidden flex-col xl:flex">
          {STAGES.map((s, i) => {
            const on = i === active
            const fill = i < active ? 1 : on ? progress : 0
            return (
              <li key={s.key} className="relative xl:grow">
                {/* one rail down the list: each stage's piece fills blue as its film plays */}
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-line">
                  <span className="block w-full origin-top bg-brand" style={{ height: '100%', transform: `scaleY(${fill})` }} />
                </span>
                <p className={`${LABEL} flex items-center gap-2.5 pt-4 pl-6 md:pt-5 md:pl-7 xl:pt-0 ${on ? 'text-brand' : 'text-faint'}`}>
                  <span aria-hidden="true" className={`block size-2 ${on ? 'bg-brand' : 'bg-line'}`} />
                  {s.label}
                </p>
                <h3 className="pl-6 md:pl-7">
                  {/* the button's hit area stretches over the whole stage, label and text included */}
                  <button
                    type="button"
                    aria-current={on ? 'step' : undefined}
                    onClick={() => choose(i)}
                    className={`mt-2 block w-full xl:mt-1.5 cursor-pointer text-left font-medium tracking-[-0.03em] transition-colors duration-300 after:absolute after:inset-0 ${on ? 'text-[22px] leading-[1.15] text-ink md:text-[26px] xl:text-[22px]' : 'text-[19px] leading-[1.2] text-faint hover:text-muted md:text-[20px] xl:text-[17px]'}`}
                  >
                    {s.title}
                  </button>
                </h3>
                {/* every stage's text is in the page; only the current one is open */}
                <div className={`grid pb-4 pl-6 transition-[grid-template-rows] duration-500 ease-out-expo md:pb-5 md:pl-7 xl:pb-0 ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="pt-3 text-[15px] leading-[1.45] tracking-[-0.01em] text-body md:text-base xl:pt-2 xl:text-[15px] xl:leading-[1.4]">{s.body}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}
