export const VERSIONS = [
  { id: 'v1', name: 'v1 · Black', port: 5171 },
  { id: 'v2', name: 'v2 · aeye', port: 5172 },
  { id: 'v3', name: 'v3 · Captain', port: 5173 },
  { id: 'v4', name: 'v4 · Light', port: 5174 },
  { id: 'v5', name: 'v5 · Hybrid', port: 5175 },
  { id: 'v6', name: 'v6 · TypeSafe', port: 5176 },
] as const

export type VersionId = (typeof VERSIONS)[number]['id']
