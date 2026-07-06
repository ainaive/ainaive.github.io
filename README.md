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

### Primary: Cloudflare Pages

Git-connected to `main` (see [docs/adr/0003](docs/adr/0003-hosting-cloudflare-pages.md)):

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect `ainaive/ainaive.github.io`, production branch `main`.
2. Build command `bun run build`, output directory `dist`, no framework preset needed (Bun and Node are preinstalled; Node is pinned by `.node-version`).
3. Custom domains: add `ainaive.com` (apex) and `www.ainaive.com`, then a bulk redirect from `www` → apex (301). TLS is automatic.

`public/_headers` carries the cache and security headers (strict CSP with no `script-src` — the zero-JS rule enforced at the edge). Every branch gets a preview deploy for free.

### Fallback: GitHub Pages (dormant)

`.github/workflows/pages.yml` is `workflow_dispatch`-only so it never races Cloudflare. Failover recipe:

1. Repo Settings → Pages → Source: GitHub Actions; run the "Deploy to GitHub Pages (fallback)" workflow.
2. Point DNS at GitHub Pages (apex A/AAAA records or `www` CNAME to `ainaive.github.io`).
3. For a long-lived failover, set the custom domain in the Pages settings so TLS is issued.

## Regenerating brand assets

- **OG images** (`public/og/og-{en,zh}.png`): open `tools/og-template.html?locale=en` (and `?locale=zh`) in a browser at exactly 1200×630 and screenshot — or drive it headlessly with Playwright/Chrome against the `file://` URL.
- **apple-touch-icon.png**: rasterize the seal (see `public/favicon.svg`) on a `#f7f3eb` background at 180×180.
- **Font** (`public/fonts/newsreader-latin.woff2`): the latin-subset variable woff2 (wght 400–700, opsz 6–72) as served by Google Fonts for [Newsreader](https://github.com/productiontype/Newsreader); license in `public/fonts/OFL.txt`.
