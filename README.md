# SKY 001 Website

Interactive, mobile-first, responsive website for the SKY 001 product.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (mobile-first: base styles for phones, `sm`/`md`/`lg` scale up to tablet and desktop)
- Vitest + Testing Library
- oxlint

## Commands

```bash
npm install
npm run dev        # local dev server
npm run lint       # oxlint
npm test           # vitest (single run)
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
```

## Claude Code on the web

`.claude/hooks/session-start.sh` runs `npm install` at the start of each cloud session, so lint, tests and build work immediately.
