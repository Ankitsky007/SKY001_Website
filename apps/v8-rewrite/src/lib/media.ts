// Showcase media (reels, posters, renders) is served by the research
// team's showcase bucket. Override with VITE_MEDIA_BASE once it moves to a production host.
const DEFAULT_BASE = 'https://pub-911937f44c474bb0bbc394f23b6bce46.r2.dev/apple'

export const MEDIA_BASE = ((import.meta.env.VITE_MEDIA_BASE as string | undefined) ?? DEFAULT_BASE).replace(/\/$/, '')

export type ModelId = 'jaguar' | 'jet' | 'arcmate' | 'tractor'

export const media = {
  reel: (id: ModelId) => `${MEDIA_BASE}/reel/${id}.mp4`,
  poster: (id: ModelId) => `${MEDIA_BASE}/seq/${id}_poster.webp`,
  final: (id: ModelId) => `${MEDIA_BASE}/seq/${id}_final.webp`,
  input: (id: ModelId) => `${MEDIA_BASE}/img/in_${id}.webp`,
}
