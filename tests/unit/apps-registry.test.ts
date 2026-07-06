import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { appSchema } from "../../src/lib/schema";

const APPS_DIR = join(import.meta.dir, "../../src/content/apps");

describe("the shipped app registry", () => {
  const files = readdirSync(APPS_DIR).filter((f) => f.endsWith(".yaml"));

  test("has at least the five launch apps", () => {
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  for (const file of files) {
    test(`${file} is valid and fully bilingual`, async () => {
      const raw = await Bun.file(join(APPS_DIR, file)).text();
      const parsed = Bun.YAML.parse(raw);
      const result = appSchema.safeParse(parsed);
      if (!result.success) {
        throw new Error(`${file}: ${result.error.message}`);
      }
      expect(result.success).toBe(true);
    });
  }

  test("shelf positions are unique and sequential from 1", async () => {
    const orders: number[] = [];
    for (const file of files) {
      const raw = await Bun.file(join(APPS_DIR, file)).text();
      const parsed = appSchema.parse(Bun.YAML.parse(raw));
      orders.push(parsed.order);
    }
    orders.sort((a, b) => a - b);
    expect(orders).toEqual(orders.map((_, i) => i + 1));
  });
});
