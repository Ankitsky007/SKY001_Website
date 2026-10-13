import { FX, setFx, useFx } from '../lib/fx'

/**
 * Review-only picker for the WebGL background. Shown on the dev server, or on any build once the
 * URL carries `?fx=`, so it never appears for ordinary visitors.
 */
export function FxPicker() {
  const current = useFx()
  const forced = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('fx')
  if (!import.meta.env.DEV && !forced) return null
  return (
    <div role="group" aria-label="WebGL background" className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-3 z-[1000] flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center border border-ink bg-white font-mono text-[11px] text-ink shadow-[3px_3px_0_0_rgba(26,26,26,0.18)]">
      <span className="bg-ink px-2 py-2 text-white">WebGL</span>
      {FX.map((f, i) => (
        <button key={f.id} type="button" aria-pressed={f.id === current.id} onClick={() => setFx(f.id)} className={`min-h-8 cursor-pointer px-2.5 ${f.id === current.id ? 'bg-brand text-white' : 'hover:bg-line'}`}>
          {i + 1} {f.label}
        </button>
      ))}
    </div>
  )
}
