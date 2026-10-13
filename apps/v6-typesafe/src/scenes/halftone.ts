// Shared constants for the halftone field, kept apart from the three.js chunk so the static
// fallback and the lazy scene agree without importing three.

export type FieldTone = 'light' | 'blue' | 'night'

/** [background, dot] as linear 0–1 RGB. Background alpha is 0: the section's own ground shows through. */
export const FIELD_DOT: Record<FieldTone, [number, number, number]> = {
  light: [0.2431, 0.3412, 0.8549], // logo blue on white / studio
  blue: [1, 1, 1], // white on the blue band
  night: [0.4353, 0.5137, 0.9412], // lifted blue on the dark grid
}

export const FIELD_CSS: Record<FieldTone, string> = {
  light: 'rgba(62, 87, 218, 0.5)',
  blue: 'rgba(255, 255, 255, 0.55)',
  night: 'rgba(111, 131, 240, 0.5)',
}
