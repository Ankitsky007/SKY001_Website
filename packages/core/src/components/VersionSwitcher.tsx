import { VERSIONS, type VersionId } from './versions'

/**
 * Small pill for jumping between the three local dev servers while reviewing.
 * Only rendered in dev, so it never ships in a production build.
 */
export function VersionSwitcher({ current }: { current: VersionId }) {
  if (!import.meta.env.DEV) return null
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

  return (
    <nav
      aria-label="Site versions"
      className="fixed right-3 bottom-3 z-[1000] flex gap-1 rounded-full border border-black/10 bg-white/90 p-1 font-mono text-[11px] text-neutral-900 shadow-lg backdrop-blur"
    >
      {VERSIONS.map((v) => (
        <a
          key={v.id}
          href={`http://${host}:${v.port}/`}
          aria-current={v.id === current ? 'page' : undefined}
          className={`inline-flex min-h-11 items-center rounded-full px-3 sm:min-h-8 ${
            v.id === current ? 'bg-brand text-white' : 'hover:bg-black/5'
          }`}
        >
          {v.name}
        </a>
      ))}
    </nav>
  )
}
