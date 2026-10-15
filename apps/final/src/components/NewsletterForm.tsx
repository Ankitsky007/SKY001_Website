import { blogPage, partnership } from '@skyfall/core'
import { useId, useState, type FormEvent } from 'react'
import { ERROR_TEXT, inputClass } from '../lib/formStyles'
import { isEmail } from '../lib/partnership'
import { sendToSheet } from '../lib/sheet'
import { LABEL } from '../lib/ui'
import { Trap } from './Modal'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

/** The blog's newsletter sign-up: one work email, sent to the "Newsletter" tab of the forms sheet. */
export function NewsletterForm() {
  const N = blogPage.newsletter
  const uid = useId()
  const id = `${uid}-email`
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [trap, setTrap] = useState('')

  const error = !email.trim() ? partnership.errors.required : !isEmail(email) ? partnership.errors.email : undefined
  const shown = tried || touched ? error : undefined

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    setTried(true)
    if (error) {
      e.currentTarget.querySelector<HTMLElement>('[name="email"]')?.focus()
      return
    }
    setStatus('sending')
    try {
      await sendToSheet('newsletter', { email: email.trim() }, trap)
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent')
    return (
      <p role="status" className="flex items-start gap-3 border border-brand bg-tint px-4 py-4 text-[17px] leading-[1.4] tracking-[-0.02em]">
        <span aria-hidden="true" className="mt-2 block size-2 shrink-0 bg-brand" />
        {N.success}
      </p>
    )

  return (
    <form noValidate onSubmit={submit} className="relative flex flex-col gap-3">
      <label htmlFor={id} className={`${LABEL} text-body`}>
        {N.email}
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={N.placeholder}
          required
          aria-required="true"
          aria-invalid={!!shown}
          aria-describedby={shown ? `${id}-err` : `${id}-note`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'failed') setStatus('idle')
          }}
          onBlur={() => setTouched(true)}
          className={`${inputClass(!!shown)} mt-0! h-[52px] flex-1`}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
          className="group relative inline-flex h-[52px] cursor-pointer items-center justify-between gap-8 overflow-hidden bg-ink px-5 font-mono text-[15px] font-semibold tracking-[-0.02em] text-white uppercase transition-[scale] duration-300 active:scale-[0.99] disabled:cursor-wait sm:min-w-[180px]"
        >
          <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-300 ease-out-expo group-hover:translate-x-0 group-disabled:translate-x-0" />
          {status === 'sending' ? <span aria-hidden="true" className="relative block size-3 animate-spin border-2 border-white border-t-transparent" /> : <span aria-hidden="true" className="relative block size-2 bg-white transition-[rotate] duration-300 group-hover:-rotate-180" />}
          <span className="relative">{status === 'sending' ? N.sending : N.submit}</span>
        </button>
      </div>
      {shown && (
        <p id={`${id}-err`} className={ERROR_TEXT}>
          {shown}
        </p>
      )}
      {status === 'failed' && (
        <p role="alert" className="border border-[#C2362F] bg-[#C2362F]/5 px-3.5 py-3 text-[14px] tracking-[-0.01em] text-[#C2362F]">
          {partnership.errors.failed}
        </p>
      )}
      <p id={`${id}-note`} className="text-xs text-muted">
        {N.note}
      </p>
      <Trap value={trap} onChange={setTrap} />
    </form>
  )
}
