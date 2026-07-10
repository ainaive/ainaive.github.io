# CONTENT.md — adding and editing content

## Adding an app

One app = one YAML file in `src/content/apps/`. Copy an existing file and edit. The schema (enforced at build; see `src/content.config.ts`):

```yaml
name: Mercury # Latin product name; rendered with lang="en" on zh pages
order: 1 # position on the shelf (1 = top)
status: live # live | soon | v0  (labels localized in src/i18n/ui.ts)
tagline:
  en: "Start with the exam. End with the career."
  zh: "考试为始，职场为终"
description:
  en: "One or two plain sentences: what it is, what it does."
  zh: "一两句平实的话：它是什么，它能做什么。"
meta: # exactly the small facts worth knowing, 2–4 items
  en: [Web app, Six study modes, AI-graded writing & speaking]
  zh: [网页应用, 六种学习模式, AI 批改写作与口语]
accent:
  light: "#A93E26" # used on light paper #F7F3EB — must be ≥ 4.5:1
  dark: "#E08063" # used on dark paper #201D18 — must be ≥ 4.5:1
links:
  live: https://mercury.ainaive.com # optional
  github: https://github.com/hutusi/mercury # optional
```

Rules the build enforces:

- Every localized field needs **both** `en` and `zh`, non-empty. There is no fallback; a missing translation fails the build.
- Both accent values must hit **4.5:1** contrast against their paper background. If the app's real brand color fails on light paper, darken it until it passes and keep the true color for dark mode (see Monecraft in `docs/DESIGN.md`).
- `status` must be one of `live`, `soon`, `v0`.

Pick the accent from the app's own identity (its logo, its primary UI color) — never invent a new color for variety's sake.

## Editing UI copy

All non-app strings (headings, manifesto, about, footer, status labels, meta descriptions) live in `src/i18n/ui.ts`. The `en` object defines the shape; `zh` is typed against it, so a missing key is a compile error. Add strings in pairs, always.

## Writing in two languages

- Parity of **quality**, not word-for-word translation. Write the Chinese as if it were the original (it may be). Idiom over fidelity.
- Voice (both languages): honest, plain, a little wry. Say what the thing is and does; no hype vocabulary (revolutionary / seamless / 赋能 / 极致 / 重磅).
- Chinese punctuation: full-width （，。「」）; keep Latin product names in Latin with `lang="en"` handled by components.
- Descriptions: 1–2 sentences. Taglines: one line. Meta facts: 2–4 short noun phrases.
- On the shelf, the tagline is always visible; description and meta facts sit behind the tile's "More" disclosure — so the tagline must stand on its own, and the description shouldn't repeat it.
