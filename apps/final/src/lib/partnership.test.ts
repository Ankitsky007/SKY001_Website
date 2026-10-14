import { partnership as P } from '@skyfall/core'
import { describe, expect, it } from 'vitest'
import { capWords, countWords, isEmail, isWebsite, validate } from './partnership'

const ok = { name: 'Ada Lovelace', email: 'ada@company.com', website: 'company.com', message: 'Hello there.' }

describe('partnership form rules', () => {
  it('needs every field', () => {
    expect(validate({ name: '', email: '', website: '', message: '' })).toEqual({ name: P.errors.required, email: P.errors.required, website: P.errors.required, message: P.errors.required })
    expect(validate(ok)).toEqual({})
  })

  it('checks the email', () => {
    expect(isEmail('ada@company.com')).toBe(true)
    for (const bad of ['ada@company', 'ada company.com', '@company.com', 'ada@.com']) expect(isEmail(bad)).toBe(false)
  })

  it('checks the website, with or without https://', () => {
    for (const good of ['company.com', 'https://www.company.co.uk/about', 'http://sub.company.ai']) expect(isWebsite(good)).toBe(true)
    for (const bad of ['not a site', 'company', 'https://', 'company.c']) expect(isWebsite(bad)).toBe(false)
  })

  it('caps the message at 250 words', () => {
    const long = Array.from({ length: 300 }, (_, i) => `w${i}`).join(' ')
    expect(countWords(capWords(long, 250))).toBe(250)
    expect(capWords('a few words', 250)).toBe('a few words')
    expect(validate({ ...ok, message: long }).message).toBe(P.errors.words)
  })
})
