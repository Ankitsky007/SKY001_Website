# Partnership, waitlist and newsletter forms → Google Sheet

The Partnership, waitlist and blog newsletter forms post each submission as JSON to a Google Apps Script web app, which appends a
row to a Google Sheet. The site reads the web app's URL from `VITE_PARTNERSHIP_ENDPOINT` at build
time. Without it, the dev server pretends each send worked (so the states can be reviewed) and a
production build shows the "could not be sent" error.

## One-time setup (about 5 minutes)

1. Create a Google Sheet, e.g. "Skyfall website: partnership enquiries".
2. In the sheet: **Extensions → Apps Script**. Replace the code with the script below and save.
3. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and
   authorise. Copy the web app URL (ends in `/exec`).
4. Put the URL in `apps/final/.env.local` (dev) and in the hosting provider's environment settings
   (production):

       VITE_PARTNERSHIP_ENDPOINT=https://script.google.com/macros/s/…/exec

5. Rebuild or restart the dev server.

Submissions with the hidden anti-spam field filled in are dropped.

## Apps Script

Each form writes to its own tab: "Partnership" (time, name, work email, website, message, page)
"Waitlist" (time, name, work email, website, message, page) and "Newsletter" (time, work email, page) for the blog sign-up.
If the script is already deployed, update the `waitlist` line (it now takes the partnership form's fields, 2026-10-17), add the `newsletter` line and redeploy (Deploy → Manage deployments → Edit → New version).

```js
const TABS = {
  partnership: { name: 'Partnership', header: ['Submitted at', 'Full name', 'Work email', 'Company website', 'Message', 'Page'], fields: ['name', 'email', 'website', 'message'] },
  waitlist: { name: 'Waitlist', header: ['Submitted at', 'Full name', 'Work email', 'Company website', 'Message', 'Page'], fields: ['name', 'email', 'website', 'message'] },
  newsletter: { name: 'Newsletter', header: ['Submitted at', 'Work email', 'Page'], fields: ['email'] },
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents)
    if (d.company_fax) return reply({ ok: true }) // a bot filled the hidden field
    const tab = TABS[d.form]
    if (!tab) return reply({ ok: false, error: 'unknown form' })
    const values = tab.fields.map((f) => clean(d[f], f === 'message' ? 5000 : 500))
    if (values.some((v) => !v)) return reply({ ok: false, error: 'missing' })
    const book = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = book.getSheetByName(tab.name) || book.insertSheet(tab.name)
    if (sheet.getLastRow() === 0) sheet.appendRow(tab.header)
    sheet.appendRow([new Date(), ...values, clean(d.page, 500)])
    return reply({ ok: true })
  } catch (err) {
    return reply({ ok: false, error: String(err) })
  }
}

// Trim, cap the length, and stop text that starts with = + - @ being read as a formula.
function clean(v, max) {
  const s = String(v || '').trim().slice(0, max)
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

function reply(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)
}
```
