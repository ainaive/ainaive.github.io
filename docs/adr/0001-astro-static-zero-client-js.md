# ADR 0001 — Astro static output, zero client JavaScript

Date: 2026-07-06 · Status: accepted

## Context

The site is a personal storefront: one crafted landing page ×2 locales, five app entries, growing over time. Requirements: fully static, bilingual, fast, accessible, minimal dependencies, deployable to Cloudflare Pages or GitHub Pages, and it must not look or feel like a templated landing page.

Considered:

1. **Zero-dependency hand-rolled build** (one TypeScript script, template literals) — maximally on-brand, nothing to upgrade; but every capability (content validation, dev server, i18n plumbing) is bespoke code we own, and growth (per-app pages, feeds) means growing the script.
2. **Astro** — static-first, typed content collections with Zod validation, scoped styles, i18n routing, zero client JS by default; cost: a framework dependency tree and a yearly major-version treadmill.
3. **Next.js** — what the showcased apps use, but massively oversized for a static brochure; static export fights the framework's defaults.

## Decision

Astro with strict TypeScript, static output, and exactly **two runtime dependencies**: `astro` and `@astrojs/sitemap`. No UI framework, no Tailwind, no component library — hand-written CSS. The built site ships **zero client-side JavaScript**; a post-build test asserts no `<script>` tag is emitted.

## Consequences

- Typed content collections give us build-time translation parity and accent-contrast gates nearly for free.
- Growth path (per-app pages, changelog, RSS) is adding files, not migrating.
- We accept the dependency tree and pin quality behind `bun run verify`; adding a third runtime dependency requires a new ADR.
- If interactivity is ever added, it must be an island with a stated reason — the zero-JS default stands.
