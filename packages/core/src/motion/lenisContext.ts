import type Lenis from 'lenis'
import { createContext, useContext } from 'react'

export const LenisContext = createContext<Lenis | null>(null)

/** The active Lenis instance, or null when smooth scroll is off (reduced motion, tests). */
export function useLenis() {
  return useContext(LenisContext)
}
