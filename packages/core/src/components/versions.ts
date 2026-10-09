export const VERSIONS = [
  { id: 'v1', name: 'v1 · Black', port: 5171 },
  { id: 'v2', name: 'v2 · aeye', port: 5172 },
  { id: 'v3', name: 'v3 · Captain', port: 5173 },
] as const

export type VersionId = (typeof VERSIONS)[number]['id']
