import { partnership, waitlistForm as W } from '@skyfall/core'
import { useId, useState, type FormEvent } from 'react'
import { ERROR_TEXT, inputClass } from '../lib/formStyles'
import { isEmail } from '../lib/partnership'
import { WAITLIST_HREF } from '../lib/routes'
import { sendToSheet } from '../lib/sheet'
import { LABEL } from '../lib/ui'
import { useHrefDialog } from '../lib/useHrefDialog'
import { ModalShell, SubmitBar, SuccessPanel, Trap } from './Modal'
import { PartnershipArt } from './PartnershipArt'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

/** Waitlist sign-up in a pop-up: one work email field. Opens from any link to #join-waitlist. */
export function WaitlistForm() {
  const uid = useId()
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [trap, setTrap] = useState('')
  const dialog = useHrefDialog(WAITLIST_HREF, () => {
    if (status !== 'sent') return
    setEmail('')
    setTouched(false)
    setTried(false)
    setStatus('idle')
  })

  const error = !email.trim() ? partnership.errors.required : !isEmail(email) ? partnership.errors.email : undefined
  const shown = tried || touched ? error : undefined
  const id = `${uid}-email`

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
      await sendToSheet('waitlist', { email: email.trim() }, trap)
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <ModalShell dialog={dialog} title={W.title} titleId={`${uid}-title`}>
      <PartnershipArt active={dialog.isOpen} scene="queue" />
      {status === 'sent' ? (
        <SuccessPanel title={W.success.title} body={W.success.body} closeLabel={W.success.close} onClose={() => dialog.close()} />
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-1 flex-col gap-6 px-6 pt-8 sm:px-8">
          <div>
            <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[15px] font-medium tracking-[-0.02em]">
              <span>
                {W.email}
                <span aria-hidden="true" className="text-brand">
                  {' '}
                  *
                </span>
              </span>
              <span className={`${LABEL} text-faint`}>{W.required}</span>
            </label>
            <input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={!!shown}
              aria-describedby={shown ? `${id}-err` : undefined}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'failed') setStatus('idle')
              }}
              onBlur={() => setTouched(true)}
              className={`${inputClass(!!shown)} h-12`}
            />
            {shown && (
              <p id={`${id}-err`} className={`mt-1.5 ${ERROR_TEXT}`}>
                {shown}
              </p>
            )}
          </div>
          <Trap value={trap} onChange={setTrap} />
          {status === 'failed' && (
            <p role="alert" className="border border-[#C2362F] bg-[#C2362F]/5 px-3.5 py-3 text-[14px] tracking-[-0.01em] text-[#C2362F]">
              {partnership.errors.failed}
            </p>
          )}
          <SubmitBar sending={status === 'sending'} label={W.submit} sendingLabel={W.sending} />
        </form>
      )}
    </ModalShell>
  )
}
