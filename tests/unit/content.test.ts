import { describe, expect, test } from "bun:test";

import { appSchema } from "../../src/lib/schema";

const valid = {
  name: "Example",
  order: 1,
  status: "live",
  tagline: { en: "A thing.", zh: "一个东西。" },
  description: { en: "It does a thing.", zh: "它做一件事。" },
  meta: { en: ["Web app", "Fast"], zh: ["网页应用", "很快"] },
  accent: { light: "#A93E26", dark: "#E08063" },
  links: { live: "https://example.com" },
};

describe("appSchema", () => {
  test("accepts a fully bilingual entry", () => {
    expect(appSchema.safeParse(valid).success).toBe(true);
  });

  test("rejects a missing Chinese translation — no fallback, ever", () => {
    const missingZh = {
      ...valid,
      description: { en: "English only." },
    };
    const result = appSchema.safeParse(missingZh);
    expect(result.success).toBe(false);
  });

  test("rejects an empty translation string", () => {
    const emptyZh = { ...valid, tagline: { en: "A thing.", zh: "" } };
    expect(appSchema.safeParse(emptyZh).success).toBe(false);
  });

  test("rejects an accent that fails AA on light paper", () => {
    // Monecraft's real bright gold — readable on dark paper, not on light.
    const badAccent = {
      ...valid,
      accent: { light: "#F0BE3C", dark: "#F0BE3C" },
    };
    const result = appSchema.safeParse(badAccent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("4.5:1");
    }
  });

  test("rejects mismatched meta fact counts between languages", () => {
    const lopsided = {
      ...valid,
      meta: { en: ["One", "Two", "Three"], zh: ["一", "二"] },
    };
    expect(appSchema.safeParse(lopsided).success).toBe(false);
  });

  test("rejects an unknown status", () => {
    const badStatus = { ...valid, status: "beta" };
    expect(appSchema.safeParse(badStatus).success).toBe(false);
  });

  test("rejects non-https links", () => {
    const httpLink = { ...valid, links: { live: "http://example.com" } };
    expect(appSchema.safeParse(httpLink).success).toBe(false);
  });
});
