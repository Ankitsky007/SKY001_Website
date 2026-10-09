/** Split copy around an accent word so it can be set in Geist Pixel: [before, word, after]. */
export function splitAccent(text: string, word: string): [string, string, string] {
  const i = text.indexOf(word)
  if (i < 0) return [text, '', '']
  return [text.slice(0, i), word, text.slice(i + word.length)]
}

/** Typeset placeholder for a partner wordmark: short names set heavier and larger, like the boards. */
export function wordmarkClass(name: string) {
  return name.length <= 8 ? 'font-semibold tracking-[-0.04em] text-[1.15em]' : 'font-medium tracking-[-0.03em]'
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
