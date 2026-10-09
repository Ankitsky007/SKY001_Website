import { VERSIONS, type VersionId } from './versions'

/**
 * Links to the other versions of each page, read from VITE_SHARE_LINKS
 * (JSON like {"v1":"https://…","v2":"…","v3":"…"}). Set only for shareable preview builds.
 */
function shareLinks(): Partial<Record<VersionId, string>> | null {
  const raw = import.meta.env.VITE_SHARE_LINKS as string | undefined
  if (!raw) return null
  try {
    return JSON.parse(raw) as Partial<Record<VersionId, string>>
  } catch {
    return null
  }
}

/**
 * Small pill for jumping between the three versions while reviewing. Links to the local dev
 * servers in dev, or to the shared previews when VITE_SHARE_LINKS is set. Otherwise it renders
 * nothing, so it never ships in a production build.
 */
export function VersionSwitcher({ current }: { current: VersionId }) {
  const shared = shareLinks()
  if (!import.meta.env.DEV && !shared) return null
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

  return (
    <nav
      aria-label="Site versions"
      className="fixed right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-[1000] flex items-center gap-1 rounded-full border border-black/10 bg-white/90 p-1 font-mono text-[11px] text-neutral-900 shadow-lg backdrop-blur"
    >
      {shared && <span className="hidden px-2 text-neutral-500 uppercase sm:inline">Design preview</span>}
      {VERSIONS.map((v) => {
        const href = shared ? shared[v.id] : `http://${host}:${v.port}/`
        if (!href) return null
        return (
          <a
            key={v.id}
            href={href}
            target={shared ? '_blank' : undefined}
            rel={shared ? 'noreferrer' : undefined}
            aria-current={v.id === current ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-3 sm:min-h-8 ${
              v.id === current ? 'bg-brand text-white' : 'hover:bg-black/5'
            }`}
          >
            {v.name}
          </a>
        )
      })}
    </nav>
  )
}
