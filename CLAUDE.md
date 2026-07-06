# CLAUDE.md

The AI Naive storefront — a static, bilingual (EN/中文) showcase at ainaive.com. Astro + strict TypeScript, Bun, hand-written CSS. The built site ships **zero client-side JavaScript**; keep it that way.

## Verify gate

`bun run verify` must be green before anything lands on `main`. It runs format check, lint, `astro check`, unit tests, build, post-build dist tests, and HTML validation.

## Where things live

- App entries: `src/content/apps/*.yaml` — one file per app. Schema (with WCAG accent-contrast gate) in `src/content.config.ts` + `src/lib/`.
- All UI copy: `src/i18n/ui.ts` — `zh` is shape-typed against `en`; a missing translation is a compile error. Never add an English string without its Chinese counterpart.
- Design rules: `docs/DESIGN.md` (the Paper & Seal brand book) — read it before touching CSS or adding components. Tokens live in `src/styles/global.css` and must match `src/lib/palette.ts`.
- Adding an app: follow `docs/CONTENT.md`.

## Conventions

- Conventional Commits; body explains the why. No Co-Authored-By trailers; no AI-attribution lines in PRs.
- Two runtime dependencies (`astro`, `@astrojs/sitemap`) — adding a third needs a strong reason and an ADR.
- No client JS, no CJK webfonts, no screenshots/images in app rows (v1 decision — see docs/adr/).
