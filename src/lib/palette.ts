/**
 * The Paper & Seal palette — single source of truth.
 * The CSS custom properties in src/styles/global.css must use these exact
 * values (a unit test keeps them in sync), and the content schema checks
 * every app accent against the paper values here.
 * Documented in docs/DESIGN.md.
 */
export const palette = {
  paper: { light: "#F7F3EB", dark: "#201D18" },
  paperDeep: { light: "#EFEAE0", dark: "#191713" },
  ink: { light: "#2B2620", dark: "#E8E2D6" },
  inkMuted: { light: "#6B6257", dark: "#A89F90" },
  seal: { light: "#A93E26", dark: "#E08063" },
} as const;

export type ColorPair = { light: string; dark: string };
