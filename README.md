# AI Naive — ainaive.com

The storefront for **AI Naive**: "AI Native" with the T — the Technology — fallen out. An ordinary developer using AI tools to quietly ship one real thing after another. This repo is the static, bilingual (English / 简体中文) showcase that presents those apps.

Built with Astro + strict TypeScript and hand-written CSS. Two runtime dependencies. The published site ships **zero client-side JavaScript**.

## Quickstart

```sh
bun install
bun run dev       # http://localhost:4321  (English) and /zh/ (中文)
bun run verify    # the full quality gate — must be green before anything lands on main
```

## Scripts

| Script            | What it does                                                                            |
| ----------------- | --------------------------------------------------------------------------------------- |
| `bun run dev`     | dev server with hot reload                                                              |
| `bun run build`   | static build to `dist/`                                                                 |
| `bun run preview` | serve the built `dist/` locally                                                         |
| `bun run verify`  | format check → lint → `astro check` → unit tests → build → dist tests → HTML validation |
| `bun run format`  | apply Prettier                                                                          |

## Where things live

- **App entries** — `src/content/apps/*.yaml`, one file per app. To add an app, read [docs/CONTENT.md](docs/CONTENT.md).
- **All UI copy** — `src/i18n/ui.ts`, typed so English and Chinese cannot drift.
- **The design system** — [docs/DESIGN.md](docs/DESIGN.md), the Paper & Seal brand book. It drives the CSS.
- **Decisions** — [docs/adr/](docs/adr/).

## Deploy

Primary: Cloudflare Pages (git-connected, build `bun run build`, output `dist`, custom domain `ainaive.com`). Dormant fallback: GitHub Pages via a `workflow_dispatch`-only workflow. Full recipes to follow in this README once the site is wired up.
