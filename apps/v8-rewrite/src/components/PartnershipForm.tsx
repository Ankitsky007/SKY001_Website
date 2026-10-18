import { partnership } from '@skyfall/core/v8'
import { PARTNERSHIP_HREF } from '../lib/partnership'
import { EnquiryForm } from './EnquiryForm'

/** Partnership enquiry pop-up. Opens from any link to #partnership. */
export function PartnershipForm() {
  return <EnquiryForm href={PARTNERSHIP_HREF} form="partnership" copy={partnership} />
}
