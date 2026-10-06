# SKY 001 Website

Mobile-first marketing/product site. Vite + React + TypeScript + Tailwind v4.

- Write styles mobile-first: unprefixed Tailwind classes target phones; add `sm:`, `md:`, `lg:` for larger screens. Keep tap targets at least 44px (`min-h-11`).
- Brand tokens live in `@theme` in `src/index.css`.
- Before pushing: `npm run lint && npm test && npm run build`.
