import { waitlistForm } from '@skyfall/core'
import { WAITLIST_HREF } from '../lib/routes'
import { EnquiryForm } from './EnquiryForm'

/** Waitlist sign-up pop-up, with the partnership form's fields (Ankit, 2026-10-17). Opens from any link to #join-waitlist. */
export function WaitlistForm() {
  return <EnquiryForm href={WAITLIST_HREF} form="waitlist" copy={waitlistForm} scene="queue" />
}
