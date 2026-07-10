# DESIGN.md — the Paper & Seal brand book

This document drives the CSS, not the other way around. If a visual decision isn't recorded here, it isn't a decision yet. Read this before touching `src/styles/global.css` or adding a component.

## The brand in one paragraph

**AI Naive** is "AI Native" with the T — the Technology — fallen out. It is part self-deprecation, part stance: no grand AI narrative, no pitch deck; an ordinary developer using AI tools to quietly ship one real thing after another. The visual language borrows from naïve/folk art the way a careful bookbinder would: honest materials (paper, ink), one seal-red stamp, small handmade irregularities — and everything else set with restraint. The result must read as _refined_, never cute.

## The wordmark and the seal

- **Wordmark:** `AI NATIVE` set in Newsreader (display optical size, uppercase), with the **T struck through in seal red**. The strike is the entire brand story told in one glance: what remains is _naive_. Screen readers must hear "AI Naive" (`aria-label`), never "AI Native".
- **Seal (印章):** a small, slightly irregular hand-cut square filled in seal red, with lowercase `ai` knocked out in paper color. It is the favicon, the footer signature, and the only filled-red surface on the page. Its edges are deliberately not perfectly straight — that irregularity is drawn once in the SVG paths, not simulated with filters.
- **Hand-drawn underline:** one irregular SVG path used under the hero heading (and nowhere else). One handmade gesture per screen is enough.

## Color tokens

Single source of truth: `src/lib/palette.ts`. The CSS in `global.css` uses the same hex values via `light-dark()`; a unit test keeps the two in sync. All values below are verified ≥ 4.5:1 (WCAG AA, text) against their paper background — the build fails otherwise.

| Token          | Light (`#` on `--paper` light) | Dark (`#` on `--paper` dark) | Role                                           |
| -------------- | ------------------------------ | ---------------------------- | ---------------------------------------------- |
| `--paper`      | `#F7F3EB`                      | `#201D18`                    | page background (warm ivory / warm near-black) |
| `--paper-deep` | `#EFEAE0`                      | `#191713`                    | recessed surfaces (chips, 404 halves)          |
| `--ink`        | `#2B2620` (13.6:1)             | `#E8E2D6` (13.0:1)           | text                                           |
| `--ink-muted`  | `#6B6257` (5.4:1)              | `#A89F90` (6.4:1)            | secondary text, meta facts                     |
| `--seal`       | `#A93E26` (5.6:1)              | `#E08063` (6.0:1)            | the cinnabar; strike, seal, focus rings        |
| `--rule`       | `--ink` at 18% alpha           | same                         | hairlines                                      |
| `--accent`     | per app, see below             | per app                      | one accent per app tile                        |

### Per-app accents

Each app tile carries the app's **own** accent, taken from its real product identity — the shelf reads as a sheet of distinct handmade objects. Contrast is enforced at build time by the content schema.

| App       | Light     | Dark      | Provenance                                                                      |
| --------- | --------- | --------- | ------------------------------------------------------------------------------- |
| Mercury   | `#A93E26` | `#E08063` | its cinnabar seal red (= `--seal`; Mercury is where the house color comes from) |
| Amytis    | `#047857` | `#34D399` | its emerald (darkened for AA on light paper)                                    |
| Ovid      | `#9A5827` | `#D9975B` | its editorial copper                                                            |
| Monecraft | `#7A5E16` | `#F0BE3C` | its gold (darkened for AA on light paper; bright gold lives in dark mode)       |
| Janus     | `#1565C0` | `#64B5F6` | its dashboard "running" blue                                                    |

Rules: an accent colors _small things_ — index numerals, status chips, link underlines/hovers, the tile's hover rule. Never large fills, never body text.

## Typography

- **Latin:** Newsreader (SIL OFL), self-hosted variable woff2, **latin subset only**, weights 400–700 with the full optical-size axis (opsz 6–72 — it's what makes the display cuts elegant, and worth its bytes). Measured 129 KB; budget ≤ 140 KB. `font-display: swap` with a metrics-adjusted Georgia fallback to avoid layout shift.
- **Chinese: system serif fonts only.** No CJK webfont, ever (they are megabytes). Stack falls through: `"Newsreader", Georgia, "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", serif`. Latin glyphs (app names, the wordmark) render in Newsreader on both locales.
- **Mono** (version numbers, status chips, meta facts): system mono — `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.
- **Fluid scale** (`clamp()`), rem-based: `--step--1` ≈ 0.83–0.94, `--step-0` ≈ 1–1.125 (body), `--step-1`, `--step-2`, `--step-3`, and `--step-4` ≈ 2.5–4.75 (hero wordmark only).
- Chinese text: slightly looser `line-height` (1.9 vs 1.7 for Latin body); never letter-space CJK; punctuation stays full-width.

## Layout

- Single column, `max-inline-size: 72rem` shell, prose capped at `65ch` (Latin) / ~`38em` effect for zh.
- **The app shelf is a stamp sheet** (this deliberately supersedes the v1 "ledger, not a card grid" decision — the ledger read as a wall of text and didn't scale past a handful of apps): tiles in an `<ol>` grid sharing 1px `--rule` hairlines with **zero gaps**, like a sheet of stamps — a nod to the seal. 3 columns, 2 at ≤ 64rem, 1 at ≤ 40rem. Tile anatomy: accent index numeral `01` · name + status chip · tagline · a native `<details name>` disclosure holding description + meta facts (exclusive accordion — one open at a time) · links pinned at the tile's block-end, always visible. A quiet colophon tile ("More in the works.") closes the sheet.
- `border-radius: 0` everywhere. No shadows. Depth comes from paper tones (`--paper-deep`) and hairlines.
- Sections separated by hairline rules, generous block spacing (fluid `clamp()` gaps).

## Motion & interaction

- Default state is still. Permitted motion: the tile hover rule (2px accent line sliding across the top edge), link underline transitions, and the tile disclosure (`::details-content` + `interpolate-size: allow-keywords` height transition — pure CSS; browsers without support toggle instantly, which is fine) — all inside `@media (prefers-reduced-motion: no-preference)`.
- Focus: `:focus-visible { outline: 2px solid var(--accent, var(--seal)); outline-offset: 3px; }`. Never remove outlines.
- External links: trailing ↗ glyph, `rel="noopener"`, no `target="_blank"`.

## Dark mode

`color-scheme: light dark` + `light-dark()` on every token — no JS, no duplicated blocks, follows the system. Both modes are first-class: check every change in both before committing.

## Voice

Honest, plain, a little wry. No hype words (revolutionary, powerful, seamless, 赋能, 极致). Chinese copy is written, not translated — it should read as if it were the original. Both languages state what a thing _is_ and what it _does_, then stop.
