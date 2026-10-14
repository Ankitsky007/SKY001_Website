import { partnership as P } from '@skyfall/core'

// Field rules for the partnership form, kept apart from the component so they can be tested.

/** The link that opens the form, wherever it appears (nav tab, phone menu, a shared URL). */
export const PARTNERSHIP_HREF = '#partnership'

export type Field = 'name' | 'email' | 'website' | 'message'
export type Values = Record<Field, string>
export type Errors = Partial<Record<Field, string>>

export const EMPTY: Values = { name: '', email: '', website: '', message: '' }
export const MAX_WORDS = P.fields.message.maxWords

export const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

/** The text cut down to its first `max` words, keeping the spacing the person typed. */
export function capWords(s: string, max: number) {
  const m = s.match(new RegExp(`^\\s*(?:\\S+\\s+){${max - 1}}\\S+`))
  return countWords(s) > max && m ? m[0] : s
}

export function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(s.trim())
}

/** A web address, with or without https://, whose host has a dot and a real-looking top-level domain. */
export function isWebsite(s: string) {
  const v = s.trim()
  if (!v || /\s/.test(v)) return false
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
    return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(u.hostname)
  } catch {
    return false
  }
}

export function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = P.errors.required
  if (!v.email.trim()) e.email = P.errors.required
  else if (!isEmail(v.email)) e.email = P.errors.email
  if (!v.website.trim()) e.website = P.errors.required
  else if (!isWebsite(v.website)) e.website = P.errors.website
  if (!v.message.trim()) e.message = P.errors.required
  else if (countWords(v.message) > MAX_WORDS) e.message = P.errors.words
  return e
}

