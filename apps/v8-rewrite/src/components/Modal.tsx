import { type ReactNode } from 'react'
import { LABEL } from '../lib/ui'
import type { useHrefDialog } from '../lib/useHrefDialog'

const SIZES = {
  form: 'sm:w-[min(calc(100vw-3rem),560px)]',
  video: 'sm:w-[min(calc(100vw-3rem),1040px)]',
} as const

/** The dialog frame: a centred box on tablet and desktop, a full-screen sheet on phones. */
export function ModalShell({ dialog, title, titleId, size = 'form', tone = 'light', children }: { dialog: ReturnType<typeof useHrefDialog>; title: ReactNode; titleId: string; size?: keyof typeof SIZES; tone?: 'light' | 'dark'; children: ReactNode }) {
  const dark = tone === 'dark'
  // Passing the ref object (not reading .current) is fine; the lint rule misreads the hook's return.
  return (
    <dialog
      // oxlint-disable-next-line react/refs
      ref={dialog.ref}
      aria-labelledby={titleId}
      data-lenis-prevent
      onClick={(e) => e.target === e.currentTarget && dialog.close()}
      className={`m-0 h-dvh max-h-none w-full max-w-none p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] sm:m-auto sm:h-fit sm:max-h-[min(90dvh,860px)] sm:border ${SIZES[size]} ${dark ? 'bg-ink text-white sm:border-night-mid' : 'bg-paper text-ink sm:border-ink'}`}
    >
      <div className="flex min-h-full flex-col sm:min-h-0">
        <header className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b pr-3 pl-6 sm:pl-8 ${dark ? 'border-night-mid bg-ink' : 'border-line bg-paper'}`}>
          <h2 id={titleId} className={`${LABEL} ${dark ? 'text-brand-lift' : 'text-brand'}`}>
            [ {title} ]
          </h2>
          <button type="button" onClick={() => dialog.close()} aria-label="Close" className={`grid size-11 cursor-pointer place-items-center ${dark ? 'text-white hover:text-brand-lift' : 'text-ink hover:text-brand'}`}>
            <span aria-hidden="true" className="relative block size-5">
              <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}

/** The "sent" panel shared by the forms. */
export function SuccessPanel({ title, body, closeLabel, onClose }: { title: string; body: string; closeLabel: string; onClose: () => void }) {
  return (
    <div role="status" className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-8">
      <span aria-hidden="true" className="grid size-12 place-items-center bg-brand text-white">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <p className="mt-6 text-[32px] leading-none font-medium tracking-[-0.045em]">{title}</p>
      <p className="mt-4 max-w-[36ch] text-[17px] leading-normal tracking-[-0.02em] text-body">{body}</p>
      <button type="button" onClick={onClose} className="mt-8 inline-flex h-[52px] w-fit cursor-pointer items-center gap-8 bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-colors hover:bg-brand">
        <span aria-hidden="true" className="block size-2 bg-white" />
        {closeLabel}
      </button>
    </div>
  )
}

/** The submit button, in a bar pinned to the bottom of the form while the fields scroll. */
export function SubmitBar({ sending, label, sendingLabel }: { sending: boolean; label: string; sendingLabel: string }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-auto border-t border-line bg-paper px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:-mx-8 sm:mt-0 sm:px-8">
      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className="group relative inline-flex h-[52px] w-full cursor-pointer items-center justify-between gap-8 overflow-hidden bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-[scale] duration-300 active:scale-[0.99] disabled:cursor-wait sm:w-auto sm:min-w-[220px]"
      >
        <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-disabled:translate-x-0" />
        {sending ? <span aria-hidden="true" className="relative block size-3 animate-spin border-2 border-white border-t-transparent" /> : <span aria-hidden="true" className="relative block size-2 bg-white transition-[rotate] duration-300 group-hover:-rotate-180" />}
        <span className="relative">{sending ? sendingLabel : label}</span>
      </button>
    </div>
  )
}

/** A hidden field bots fill in and people never see; a filled one marks the submission as spam. */
export function Trap({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company fax
        <input tabIndex={-1} autoComplete="off" name="company_fax" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}
