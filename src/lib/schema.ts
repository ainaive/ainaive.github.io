import { z } from "astro/zod";

import { AA_TEXT, contrastRatio } from "./contrast";
import { palette } from "./palette";

/** Every localized field carries both languages — there is no fallback. */
const l10n = z.object({
  en: z.string().min(1),
  zh: z.string().min(1),
});

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "expected #rrggbb");

const accentOn = (paper: string, mode: "light" | "dark") =>
  hexColor.refine((color) => contrastRatio(color, paper) >= AA_TEXT, {
    message: `accent.${mode} must be at least ${AA_TEXT}:1 against ${mode} paper ${paper} — darken or brighten it (see docs/CONTENT.md)`,
  });

export const appSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().positive(),
  status: z.enum(["live", "soon", "v0"]),
  tagline: l10n,
  description: l10n,
  meta: z
    .object({
      en: z.array(z.string().min(1)).min(2).max(4),
      zh: z.array(z.string().min(1)).min(2).max(4),
    })
    .refine((m) => m.en.length === m.zh.length, {
      message: "meta.en and meta.zh must list the same facts",
    }),
  accent: z.object({
    light: accentOn(palette.paper.light, "light"),
    dark: accentOn(palette.paper.dark, "dark"),
  }),
  links: z
    .object({
      live: z.url({ protocol: /^https$/ }).optional(),
      github: z.url({ protocol: /^https$/ }).optional(),
    })
    .default({}),
});

export type App = z.infer<typeof appSchema>;
