import { describe, expect, test } from "bun:test";

import {
  AA_TEXT,
  contrastRatio,
  relativeLuminance,
} from "../../src/lib/contrast";
import { palette } from "../../src/lib/palette";

describe("relativeLuminance", () => {
  test("black is 0 and white is 1", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
  });

  test("matches the WCAG worked example for mid grey", () => {
    // #767676 is the canonical 4.54:1-on-white grey.
    expect(contrastRatio("#767676", "#FFFFFF")).toBeGreaterThan(4.5);
    expect(contrastRatio("#777777", "#FFFFFF")).toBeLessThan(4.7);
  });
});

describe("contrastRatio", () => {
  test("black on white is 21:1, symmetric", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 1);
  });

  test("a color against itself is 1:1", () => {
    expect(contrastRatio("#A93E26", "#A93E26")).toBeCloseTo(1, 5);
  });
});

describe("the Paper & Seal palette meets AA on its own paper", () => {
  const onPaper: Array<[string, string, string]> = [
    ["ink", palette.ink.light, palette.paper.light],
    ["ink", palette.ink.dark, palette.paper.dark],
    ["ink-muted", palette.inkMuted.light, palette.paper.light],
    ["ink-muted", palette.inkMuted.dark, palette.paper.dark],
    ["seal", palette.seal.light, palette.paper.light],
    ["seal", palette.seal.dark, palette.paper.dark],
  ];

  test.each(onPaper)("%s meets AA", (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
