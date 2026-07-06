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

### Primary: GitHub Pages

Every push to `main` deploys via `.github/workflows/pages.yml` (see [docs/adr/0003](docs/adr/0003-hosting-cloudflare-pages.md)). One-time setup:

1. Repo Settings → Pages → Source: **GitHub Actions** (or `gh api -X POST repos/ainaive/ainaive.github.io/pages -f build_type=workflow`).
2. Custom domain: set `ainaive.com` in the Pages settings (or `gh api -X PUT repos/ainaive/ainaive.github.io/pages -f cname=ainaive.com`).
3. DNS, at the zone for `ainaive.com` (if the zone is on Cloudflare, create these **DNS-only / grey-cloud** so GitHub can verify and issue TLS):
   - apex `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - apex `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www` `CNAME` → `ainaive.github.io` (GitHub redirects `www` ↔ apex automatically)
4. Once the certificate is issued: enable **Enforce HTTPS** (or `gh api -X PUT repos/ainaive/ainaive.github.io/pages -F https_enforced=true`).

Note: GitHub Pages serves `public/_headers` as an inert file — the CSP/cache headers there only take effect on Cloudflare.

### Upgrade path: Cloudflare Pages

Worth the move if mainland-China reachability, per-branch preview deploys, or real `_headers` support start to matter:

1. Cloudflare dashboard → Workers & Pages → connect `ainaive/ainaive.github.io`, production branch `main`, build `bun run build`, output `dist`.
2. Custom domains: `ainaive.com` + `www.ainaive.com` with a bulk redirect `www` → apex (301).
3. Flip DNS to Cloudflare Pages and demote `pages.yml` back to `workflow_dispatch`-only so the two hosts never race.

## Regenerating brand assets

- **OG images** (`public/og/og-{en,zh}.png`): open `tools/og-template.html?locale=en` (and `?locale=zh`) in a browser at exactly 1200×630 and screenshot — or drive it headlessly with Playwright/Chrome against the `file://` URL.
- **apple-touch-icon.png**: rasterize the seal (see `public/favicon.svg`) on a `#f7f3eb` background at 180×180.
- **Font** (`public/fonts/newsreader-latin.woff2`): the latin-subset variable woff2 (wght 400–700, opsz 6–72) as served by Google Fonts for [Newsreader](https://github.com/productiontype/Newsreader); license in `public/fonts/OFL.txt`.
