# Partnership form → Google Sheet

The Partnership form posts each submission as JSON to a Google Apps Script web app, which appends a
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

Each row records: submitted at, full name, work email, company website, message, and the page it
was sent from. Submissions with the hidden anti-spam field filled in are dropped.

## Apps Script

```js
const SHEET = 'Submissions'
const HEADER = ['Submitted at', 'Full name', 'Work email', 'Company website', 'Message', 'Page']

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents)
    if (d.company_fax) return reply({ ok: true }) // a bot filled the hidden field
    const name = clean(d.name, 200)
    const email = clean(d.email, 320)
    const website = clean(d.website, 500)
    const message = clean(d.message, 5000)
    if (!name || !email || !website || !message) return reply({ ok: false, error: 'missing' })
    const book = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = book.getSheetByName(SHEET) || book.insertSheet(SHEET)
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADER)
    sheet.appendRow([new Date(), name, email, website, message, clean(d.page, 500)])
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
