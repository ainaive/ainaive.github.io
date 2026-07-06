import { describe, expect, test } from "bun:test";
import { join } from "node:path";

import { palette } from "../../src/lib/palette";

/**
 * docs/DESIGN.md declares src/lib/palette.ts the single source of truth and
 * promises the CSS uses the same values. This keeps that promise honest.
 */
describe("global.css matches palette.ts", () => {
  const cssPath = join(import.meta.dir, "../../src/styles/global.css");

  test.each(Object.entries(palette))(
    "token %s appears as light-dark(light, dark)",
    async (_name, pair) => {
      const css = (await Bun.file(cssPath).text()).toLowerCase();
      const expected = `light-dark(${pair.light.toLowerCase()}, ${pair.dark.toLowerCase()})`;
      expect(css).toContain(expected);
    },
  );
});
