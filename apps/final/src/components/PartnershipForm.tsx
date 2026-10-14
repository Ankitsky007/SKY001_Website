import { partnership as P } from '@skyfall/core'
import { useLenis } from '@skyfall/core/motion'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { capWords, countWords, EMPTY, MAX_WORDS, PARTNERSHIP_HREF, validate, type Field, type Values } from '../lib/partnership'
import { LABEL } from '../lib/ui'
import { PartnershipArt } from './PartnershipArt'

// Submissions go to a Google Sheet through a Google Apps Script web app (see
// docs/partnership-form.md). Its URL is set with VITE_PARTNERSHIP_ENDPOINT. Without it, the dev
// server pretends the send worked so every state can be reviewed; a build without it reports failure.
const ENDPOINT = (import.meta.env.VITE_PARTNERSHIP_ENDPOINT as string | undefined) ?? ''

type Status = 'idle' | 'sending' | 'sent' | 'failed'

async function send(v: Values, trap: string) {
  if (!ENDPOINT) {
    if (import.meta.env.DEV) {
      console.warn('[partnership] VITE_PARTNERSHIP_ENDPOINT is not set; pretending the send worked.')
      await new Promise((r) => setTimeout(r, 900))
      return
    }
    throw new Error('No endpoint')
  }
  // text/plain keeps this a simple request, which Apps Script accepts without a CORS preflight
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...v, website: v.website.trim(), company_fax: trap, page: window.location.href }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const out = (await res.json().catch(() => null)) as { ok?: boolean } | null
  if (!out?.ok) throw new Error('Rejected')
}

/**
 * Partnership enquiry form in a dialog: a box centred on the screen on tablet and desktop, a
 * full-screen sheet on phones. Opens from any link to #partnership. Fields check themselves when left, all of them on
 * submit; a failed send keeps what was typed.
 */
export function PartnershipForm() {
  const dialog = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [trap, setTrap] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const errors = validate(values)
  const shown = (f: Field) => (tried || touched[f] ? errors[f] : undefined)
  const words = countWords(values.message)

  const open = () => {
    const d = dialog.current
    if (!d || d.open) return
    if (status === 'sent') {
      setValues(EMPTY)
      setTouched({})
      setTried(false)
      setStatus('idle')
    }
    d.showModal()
    setIsOpen(true)
    lenis?.stop()
  }
  const close = () => dialog.current?.close()

  // open from any #partnership link, and from a URL that already carries it
  const openRef = useRef(open)
  useEffect(() => {
    openRef.current = open
  })
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.(`a[href="${PARTNERSHIP_HREF}"]`)
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey) return
      e.preventDefault()
      openRef.current()
    }
    const onHash = () => window.location.hash === PARTNERSHIP_HREF && openRef.current()
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const onClose = () => {
      lenis?.start()
      setIsOpen(false)
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [lenis])

  const set = (f: Field) => (e: { target: { value: string } }) => {
    const v = f === 'message' ? capWords(e.target.value, MAX_WORDS) : e.target.value
    setValues((s) => ({ ...s, [f]: v }))
    if (status === 'failed') setStatus('idle')
  }
  const leave = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }))

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    setTried(true)
    const bad = (Object.keys(EMPTY) as Field[]).find((f) => errors[f])
    if (bad) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${bad}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await send(values, trap)
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const input = (f: Field) =>
    `mt-2 block w-full border bg-paper px-3.5 text-[16px] tracking-[-0.02em] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand focus:ring-1 focus:ring-brand ${
      shown(f) ? 'border-[#C2362F]' : 'border-ink/25 hover:border-ink/50'
    }`

  const fieldBlock = (f: Exclude<Field, 'message'>, type: string, autoComplete: string) => {
    const id = `${uid}-${f}`
    const err = shown(f)
    return (
      <div>
        <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[15px] font-medium tracking-[-0.02em]">
          <span>
            {P.fields[f].label}
            <span aria-hidden="true" className="text-brand">
              {' '}
              *
            </span>
          </span>
          <span className={`${LABEL} text-faint`}>{P.required}</span>
        </label>
        <input
          id={id}
          name={f}
          type={type}
          inputMode={f === 'website' ? 'url' : undefined}
          autoComplete={autoComplete}
          required
          aria-required="true"
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          value={values[f]}
          onChange={set(f)}
          onBlur={leave(f)}
          className={`${input(f)} h-12`}
        />
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-[13px] tracking-[-0.01em] text-[#C2362F]">
            {err}
          </p>
        )}
      </div>
    )
  }

  const msgId = `${uid}-message`
  const msgErr = shown('message')

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${uid}-title`}
      data-lenis-prevent
      onClick={(e) => e.target === dialog.current && close()}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] sm:m-auto sm:h-auto sm:max-h-[min(90dvh,860px)] sm:w-[min(calc(100vw-3rem),560px)] sm:border sm:border-ink"
    >
      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-paper pr-3 pl-6 sm:pl-8">
          <h2 id={`${uid}-title`} className={`${LABEL} text-brand`}>
            [ {P.title} ]
          </h2>
          <button type="button" onClick={close} aria-label="Close" className="grid size-11 cursor-pointer place-items-center text-ink hover:text-brand">
            <span aria-hidden="true" className="relative block size-5">
              <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </header>
        <PartnershipArt active={isOpen} />


        {status === 'sent' ? (
          <div role="status" className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-8">
            <span aria-hidden="true" className="grid size-12 place-items-center bg-brand text-white">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <p className="mt-6 text-[32px] leading-none font-medium tracking-[-0.045em]">{P.success.title}</p>
            <p className="mt-4 max-w-[36ch] text-[17px] leading-normal tracking-[-0.02em] text-body">{P.success.body}</p>
            <button type="button" onClick={close} className="mt-8 inline-flex h-[52px] w-fit cursor-pointer items-center gap-8 bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-colors hover:bg-brand">
              <span aria-hidden="true" className="block size-2 bg-white" />
              {P.success.close}
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="flex flex-1 flex-col gap-6 px-6 py-8 sm:px-8">
            {fieldBlock('name', 'text', 'name')}
            {fieldBlock('email', 'email', 'email')}
            {fieldBlock('website', 'text', 'url')}
            <div>
              <label htmlFor={msgId} className="flex items-baseline justify-between gap-3 text-[15px] font-medium tracking-[-0.02em]">
                <span>
                  {P.fields.message.label}
                  <span aria-hidden="true" className="text-brand">
                    {' '}
                    *
                  </span>
                </span>
                <span className={`${LABEL} text-faint`}>{P.required}</span>
              </label>
              <textarea
                id={msgId}
                name="message"
                rows={7}
                required
                aria-required="true"
                aria-invalid={!!msgErr}
                aria-describedby={`${msgId}-count${msgErr ? ` ${msgId}-err` : ''}`}
                placeholder={P.fields.message.placeholder}
                value={values.message}
                onChange={set('message')}
                onBlur={leave('message')}
                className={`${input('message')} resize-y py-3 leading-normal`}
              />
              <div className="mt-1.5 flex items-start justify-between gap-4">
                {msgErr ? (
                  <p id={`${msgId}-err`} className="text-[13px] tracking-[-0.01em] text-[#C2362F]">
                    {msgErr}
                  </p>
                ) : (
                  <span />
                )}
                <p id={`${msgId}-count`} aria-live="polite" className={`${LABEL} shrink-0 ${words >= MAX_WORDS ? 'text-brand' : 'text-faint'}`}>
                  {words} / {MAX_WORDS} words
                </p>
              </div>
            </div>

            {/* bots fill every field; people never see this one */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Company fax
                <input tabIndex={-1} autoComplete="off" name="company_fax" value={trap} onChange={(e) => setTrap(e.target.value)} />
              </label>
            </div>

            {status === 'failed' && (
              <p role="alert" className="border border-[#C2362F] bg-[#C2362F]/5 px-3.5 py-3 text-[14px] tracking-[-0.01em] text-[#C2362F]">
                {P.errors.failed}
              </p>
            )}

            <div className="mt-auto pt-2 sm:mt-0">
              <button
                type="submit"
                disabled={status === 'sending'}
                aria-busy={status === 'sending'}
                className="group relative inline-flex h-[52px] w-full cursor-pointer items-center justify-between gap-8 overflow-hidden bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-[scale] duration-300 active:scale-[0.99] disabled:cursor-wait sm:w-auto sm:min-w-[220px]"
              >
                <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-disabled:translate-x-0" />
                {status === 'sending' ? (
                  <span aria-hidden="true" className="relative block size-3 animate-spin border-2 border-white border-t-transparent" />
                ) : (
                  <span aria-hidden="true" className="relative block size-2 bg-white transition-[rotate] duration-300 group-hover:-rotate-180" />
                )}
                <span className="relative">{status === 'sending' ? P.sending : P.submit}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
