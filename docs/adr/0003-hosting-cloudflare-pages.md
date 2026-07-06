# ADR 0003 — Hosting: Cloudflare Pages primary, dormant GitHub Pages fallback

Date: 2026-07-06 · Status: accepted

## Context

The repo is named `ainaive.github.io` (a GitHub Pages org site), but the audience is bilingual EN/中文 and GitHub Pages is slow or unreliable from mainland China. The domain is `ainaive.com`; `mercury.ainaive.com` already resolves, so the zone likely lives on a DNS provider we control.

## Decision

- **Primary: Cloudflare Pages**, git-connected to `main`. Build `bun run build`, output `dist`, custom domains `ainaive.com` + `www` (301 → apex). Better reachability from mainland China; automatic TLS; per-branch preview deploys.
- **Fallback: GitHub Pages**, kept dormant — a `workflow_dispatch`-only Actions workflow builds and deploys the same `dist/` artifact. No `CNAME` file in the repo (it belongs to GH Pages custom-domain mode and would fight Cloudflare); the failover recipe lives in the README.
- The build stays platform-agnostic: plain static output, `_headers` for Cloudflare extras that GH Pages silently ignores.

## Consequences

- Two-step failover if Cloudflare is ever unavailable: flip DNS, run the workflow (plus add a CNAME if the outage is long-lived).
- `_headers` (cache immutability for fonts/OG images, security headers) only applies on Cloudflare; GH Pages serves sane defaults.
- Preview deploys for future branches come free once the Pages project is connected.
