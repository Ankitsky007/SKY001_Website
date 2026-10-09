# Skyfall AI website

Three design versions of the Skyfall AI company page, each in its own folder with its own dev server, sharing one content and motion core. Once a version is picked, it becomes the production site.

| Version | Folder | Dev server |
| --- | --- | --- |
| v1 · Black (line-diagram hero) | `apps/v1-black` | http://localhost:5171 |
| v2 · aeye style (light) | `apps/v2-aeye` | http://localhost:5172 |
| v3 · Captain style (blue) | `apps/v3-captain` | http://localhost:5173 |

## Run it

Requires Node 22+.

```bash
npm install
npm run dev        # all three versions at once (ports 5171, 5172, 5173)
npm run dev:v1     # or just one version
npm run dev:v2
npm run dev:v3
```

While running locally, a small pill in the bottom-right corner jumps between the three versions.

## Layout

```
apps/
  v1-black/        # each version owns its layout, sections and scenes
    src/sections/  # page sections (hero, research, team, backers, footer)
    src/scenes/    # WebGL / canvas scenes for this version
  v2-aeye/
  v3-captain/
packages/
  core/            # @skyfall/core, shared by every version
    src/content.ts # ALL site copy (from the content doc). Edit copy here, once.
    src/styles/    # real Geist, Geist Mono and Geist Pixel fonts + brand tokens
    src/motion/    # GSAP (ScrollTrigger, SplitText), Lenis smooth scroll, Reveal, SplitReveal
    src/webgl/     # WebGLStage (three.js / R3F) and ShaderStage (WebGPU shaders) with fallbacks
    public/        # favicon and shared static files
vite.shared.ts     # one Vite config for every version
```

To add a new version, copy an app folder, rename it in its `package.json`, give it a new port in `vite.config.ts`, and add a `dev:` script in the root `package.json`.

## Animation stack

| Need | Library |
| --- | --- |
| Timelines, scroll-driven animation, text splitting | `gsap` with ScrollTrigger and SplitText (all plugins free since 3.13), `@gsap/react` |
| Smooth scrolling | `lenis`, synced to GSAP's ticker |
| 3D and WebGL | `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` |
| GPU shader effects | `shaders` (WebGPU; static fallback where unsupported) |
| UI micro-interactions | `motion` |

Rules every effect follows:

- Respect `prefers-reduced-motion` (the core helpers already do).
- Provide a static fallback for WebGL and WebGPU (`WebGLStage` / `ShaderStage` take a `fallback`).
- Pause GPU work off screen and cap pixel ratio on phones.
- Mobile first: unprefixed Tailwind classes target phones; `sm:`, `md:`, `lg:` scale up.

## Checks

```bash
npm run lint       # oxlint
npm test           # vitest across all versions and core
npm run typecheck
npm run build      # builds all three versions to apps/*/dist
npm run preview    # serves the builds (ports 4171, 4172, 4173)
```

## Hosting (Vercel)

Each version is its own Vercel project pointing at the same GitHub repo:

1. vercel.com/new → import `Ankitsky007/SKY001_Website`.
2. Set **Root Directory** to `apps/v1-black` (then repeat for `apps/v2-aeye` and `apps/v3-captain`). Leave "Include files outside the root directory" on.
3. Everything else comes from each app's `vercel.json`. Every push then gets a preview URL per version; `main` is production.

## Content status

- Copy comes from the content doc "New Website <> Skyfall AI" (front page tab).
- The founder story (Maluuba, Bengio, Sutton) is not yet cleared for public use.
- Logos are placeholders. Founder photos are AI-generated round-1 portraits (option A) in `packages/core/src/assets/team/`, pending the final pick and founder consent.
