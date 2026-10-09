# Skyfall AI website

npm workspaces monorepo. Vite + React 19 + TypeScript + Tailwind v4. Three design versions, one shared core.

- `apps/v1-black` (port 5171), `apps/v2-aeye` (5172), `apps/v3-captain` (5173). Edit one version without touching the others.
- `packages/core` (`@skyfall/core`): all copy lives in `src/content.ts`. Never hard-code site copy inside an app; never invent copy or numbers.
- Motion: import GSAP from `@skyfall/core/motion` (plugins already registered), not from `gsap` directly. WebGL scenes go inside `WebGLStage`, WebGPU shaders inside `ShaderStage`, always with a static fallback.
- Write styles mobile-first: unprefixed Tailwind classes target phones; add `sm:`, `md:`, `lg:` for larger screens. Keep tap targets at least 44px (`min-h-11`).
- Brand: logo blue `#3E57DA` (`--color-brand`) is the only accent. Fonts: Geist, Geist Mono, Geist Pixel (`font-sans`, `font-mono`, `font-pixel`).
- Before pushing: `npm run lint && npm test && npm run build`.
