import { partnership as P } from '@skyfall/core'
import { useId, useState, type FormEvent } from 'react'
import { ERROR_TEXT, inputClass } from '../lib/formStyles'
import { capWords, countWords, EMPTY, MAX_WORDS, PARTNERSHIP_HREF, validate, type Field, type Values } from '../lib/partnership'
import { sendToSheet } from '../lib/sheet'
import { LABEL } from '../lib/ui'
import { useHrefDialog } from '../lib/useHrefDialog'
import { ModalShell, SubmitBar, SuccessPanel, Trap } from './Modal'
import { PartnershipArt } from './PartnershipArt'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

/**
 * Partnership enquiry form in a dialog: a box centred on the screen on tablet and desktop, a
 * full-screen sheet on phones. Opens from any link to #partnership. Fields check themselves when left, all of them on
 * submit; a failed send keeps what was typed.
 */
export function PartnershipForm() {
  const uid = useId()
  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [trap, setTrap] = useState('')
  // a fresh form each time it opens after a successful send
  const dialog = useHrefDialog(PARTNERSHIP_HREF, () => {
    if (status !== 'sent') return
    setValues(EMPTY)
    setTouched({})
    setTried(false)
    setStatus('idle')
  })

  const errors = validate(values)
  const shown = (f: Field) => (tried || touched[f] ? errors[f] : undefined)
  const words = countWords(values.message)

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
      await sendToSheet('partnership', { ...values, website: values.website.trim() }, trap)
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const input = (f: Field) => inputClass(!!shown(f))

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
          <p id={`${id}-err`} className={`mt-1.5 ${ERROR_TEXT}`}>
            {err}
          </p>
        )}
      </div>
    )
  }

  const msgId = `${uid}-message`
  const msgErr = shown('message')

  return (
    <ModalShell dialog={dialog} title={P.title} titleId={`${uid}-title`}>
        <PartnershipArt active={dialog.isOpen} />
        {status === 'sent' ? (
          <SuccessPanel title={P.success.title} body={P.success.body} closeLabel={P.success.close} onClose={() => dialog.close()} />
        ) : (
          <form noValidate onSubmit={submit} className="flex flex-1 flex-col gap-6 px-6 pt-8 sm:px-8">
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
                  <p id={`${msgId}-err`} className={ERROR_TEXT}>
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

            <Trap value={trap} onChange={setTrap} />

            {status === 'failed' && (
              <p role="alert" className="border border-[#C2362F] bg-[#C2362F]/5 px-3.5 py-3 text-[14px] tracking-[-0.01em] text-[#C2362F]">
                {P.errors.failed}
              </p>
            )}

            <SubmitBar sending={status === 'sending'} label={P.submit} sendingLabel={P.sending} />
          </form>
        )}
    </ModalShell>
  )
}
