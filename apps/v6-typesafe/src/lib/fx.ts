import { useSyncExternalStore } from 'react'

/** The WebGL backgrounds on offer. Pick one with `?fx=<id>` or the review picker. */
export const FX = [
  { id: 'dots', label: 'Dots', mode: 0 },
  { id: 'contours', label: 'Contours', mode: 1 },
  { id: 'cells', label: 'Grid cells', mode: 2 },
  { id: 'floor', label: 'Floor grid', mode: 3 },
  { id: 'dither', label: 'Dither cloud', mode: 4 },
] as const

export type FxId = (typeof FX)[number]['id']

const DEFAULT: FxId = 'contours'
const listeners = new Set<() => void>()

function read(): FxId {
  if (typeof window === 'undefined') return DEFAULT
  const q = new URLSearchParams(window.location.search).get('fx')
  return FX.some((f) => f.id === q) ? (q as FxId) : DEFAULT
}

/** Switch the background and keep the choice in the URL so the link can be shared. */
export function setFx(id: FxId) {
  const url = new URL(window.location.href)
  url.searchParams.set('fx', id)
  window.history.replaceState(null, '', url)
  listeners.forEach((l) => l())
}

export function useFx() {
  const id = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    read,
    () => DEFAULT,
  )
  return FX.find((f) => f.id === id)!
}
