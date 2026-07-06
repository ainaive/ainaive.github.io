# ADR 0002 — Bilingual strategy: two page trees, typed parity, no fallback

Date: 2026-07-06 · Status: accepted

## Context

The site must be English + Simplified Chinese with **equal quality** — not an English site with translations bolted on. Options: client-side language switching (one page, JS swaps strings), server negotiation (not available on static hosts), or fully static per-locale page trees.

## Decision

- Two static trees: English at `/`, Chinese at `/zh/` (Astro i18n routing, `prefixDefaultLocale: false`). The language toggle is a plain link pair; no JS, no auto-redirect by `Accept-Language` (bad for SEO and surprise navigation).
- SEO plumbing on every page: `hreflang` triple (`en`, `zh-Hans`, `x-default` → `/`), per-locale canonical and OG locale/image; sitemap emits alternates.
- **Parity is enforced by types, not discipline.** App content: every localized field is `{ en, zh }`, both required by the Zod schema — a missing translation fails the build. UI strings: `const en` defines the shape, `const zh: typeof en` makes a missing key a compile error. There is deliberately **no fallback-to-English mechanism**.
- **Chinese uses system serif fonts only** — CJK webfonts are megabytes and violate the performance budget. Latin gets a subsetted self-hosted Newsreader; CJK falls through the font stack to platform serifs.

## Consequences

- Adding any string means adding it in both languages, immediately. This is a feature.
- zh pages must mark embedded Latin (product names, the wordmark) with `lang="en"` spans; a dist test checks this.
- Chinese rendering varies slightly across platforms (Songti / Noto Serif CJK / Source Han); accepted in exchange for zero font bytes.
