import { launchVideo as V } from '@skyfall/core/v8'
import { useEffect, useId, useRef } from 'react'
import heroClip from '../assets/media/hero.mp4'
import heroPoster from '../assets/media/s-hero.jpg'
import { VIDEO_HREF } from '../lib/routes'
import { LABEL } from '../lib/ui'
import { useHrefDialog } from '../lib/useHrefDialog'
import { ModalShell } from './Modal'

// Until the launch video exists, a SKY-001 output clip stands in so the flow can be tested.
const VIDEO = { src: heroClip, poster: heroPoster }

/** The launch video in a pop-up. Opens from any link to #launch-video; plays on open, stops on close. */
export function VideoModal() {
  const uid = useId()
  const video = useRef<HTMLVideoElement>(null)
  const dialog = useHrefDialog(VIDEO_HREF)

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (dialog.isOpen) v.play().catch(() => {})
    else {
      v.pause()
      v.currentTime = 0
    }
  }, [dialog.isOpen])

  return (
    <ModalShell dialog={dialog} title={V.title} titleId={`${uid}-title`} size="video" tone="dark">
      <div className="flex flex-1 flex-col justify-center bg-black">
        <video ref={video} src={VIDEO.src} poster={VIDEO.poster} controls playsInline preload="none" aria-label={V.title} className="aspect-video w-full bg-black" />
      </div>
      <p className={`${LABEL} border-t border-night-mid px-6 py-3 text-white/60 sm:px-8`}>{V.note}</p>
    </ModalShell>
  )
}
