// Showcase media (reels, frame sequences, renders, the 3D explorer) is served by the research
// team's showcase bucket. Override with VITE_MEDIA_BASE once it moves to a production host.
const DEFAULT_BASE = 'https://pub-911937f44c474bb0bbc394f23b6bce46.r2.dev/apple'

export const MEDIA_BASE = ((import.meta.env.VITE_MEDIA_BASE as string | undefined) ?? DEFAULT_BASE).replace(/\/$/, '')

// The interactive 3D explorer is its own site. Viewers that cannot embed other sites (the Claude
// artifact build) set VITE_EXPLORER_EXTERNAL=1 to link out to it instead of opening it in a dialog.
const EXPLORER_BASE = ((import.meta.env.VITE_EXPLORER_BASE as string | undefined) ?? MEDIA_BASE).replace(/\/$/, '')
export const EXPLORER_EXTERNAL = import.meta.env.VITE_EXPLORER_EXTERNAL === '1'

export type ModelId = 'jaguar' | 'jet' | 'arcmate' | 'tractor'

export const media = {
  reel: (id: ModelId) => `${MEDIA_BASE}/reel/${id}.mp4`,
  poster: (id: ModelId) => `${MEDIA_BASE}/seq/${id}_poster.webp`,
  final: (id: ModelId) => `${MEDIA_BASE}/seq/${id}_final.webp`,
  input: (id: ModelId) => `${MEDIA_BASE}/img/in_${id}.webp`,
  seqMeta: (id: ModelId) => `${MEDIA_BASE}/seq/${id}.json`,
  seqFrames: (id: ModelId) => `${MEDIA_BASE}/seq/${id}.bin`,
  explorer: (id: ModelId) => `${EXPLORER_BASE}/index.html?intro=0#${id}/3d`,
}
