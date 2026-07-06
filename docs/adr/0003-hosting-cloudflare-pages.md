# ADR 0003 — Hosting: GitHub Pages at launch, Cloudflare Pages as upgrade path

Date: 2026-07-06 · Status: accepted (amended 2026-07-06)

## Context

The repo is named `ainaive.github.io` (a GitHub Pages org site), but the audience is bilingual EN/中文 and GitHub Pages is slow or unreliable from mainland China. The domain is `ainaive.com`; `mercury.ainaive.com` already resolves, so the zone lives on a DNS provider we control.

The original decision (same day, never enacted) made Cloudflare Pages primary for mainland-China reachability. Before the first deploy, this was reversed in favor of launching where the repo already lives.

## Decision

- **Primary: GitHub Pages**, deployed by `.github/workflows/pages.yml` on every push to `main` (plus manual `workflow_dispatch`). Zero new accounts or platform config; the repo name is purpose-built for it. Custom domain `ainaive.com` set on the Pages site; GitHub redirects `www` ↔ apex automatically; HTTPS enforced once the certificate is issued.
- **Upgrade path: Cloudflare Pages**, documented in the README. Revisit when any of these bite: reachability complaints from mainland China, wanting per-branch preview deploys, or needing `_headers` (CSP/cache) to actually apply.
- The build stays platform-agnostic: plain static `dist/`, and `public/_headers` stays in the repo — served inert by GitHub Pages, effective the day the site moves to Cloudflare.

## Consequences

- Accepted degradations on GitHub Pages: no custom response headers (the CSP is defense-in-depth anyway — the site ships zero JS), no preview deploys, weaker mainland-China performance.
- Migration to Cloudflare later is: connect the repo, set build `bun run build` / output `dist`, flip DNS, and demote the Pages workflow back to `workflow_dispatch`-only.
- CI (`ci.yml`) and the deploy workflow both run on push to `main`; the deploy builds independently, so a red verify gate does not block a deploy — the gate before merging is what protects `main`.
