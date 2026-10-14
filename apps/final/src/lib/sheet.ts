// Form submissions go to a Google Sheet through a Google Apps Script web app (see
// docs/partnership-form.md); each form writes to its own tab. The URL is set with
// VITE_PARTNERSHIP_ENDPOINT. Without it, the dev server pretends the send worked so every state can
// be reviewed; a build without it reports failure, unless it is a demo build (VITE_FORMS_DEMO=1,
// the shareable artifact) that pretends too.
const ENDPOINT = (import.meta.env.VITE_PARTNERSHIP_ENDPOINT as string | undefined) ?? ''

export type SheetForm = 'partnership' | 'waitlist'

export async function sendToSheet(form: SheetForm, fields: Record<string, string>, trap: string) {
  if (!ENDPOINT) {
    if (import.meta.env.DEV || import.meta.env.VITE_FORMS_DEMO === '1') {
      console.warn(`[${form}] VITE_PARTNERSHIP_ENDPOINT is not set; pretending the send worked.`)
      await new Promise((r) => setTimeout(r, 900))
      return
    }
    throw new Error('No endpoint')
  }
  // text/plain keeps this a simple request, which Apps Script accepts without a CORS preflight
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ form, ...fields, company_fax: trap, page: window.location.href }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const out = (await res.json().catch(() => null)) as { ok?: boolean } | null
  if (!out?.ok) throw new Error('Rejected')
}
