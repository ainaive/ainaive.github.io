import { beforeAll, describe, expect, test } from "bun:test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Post-build assertions over dist/ — the contract the published site must
 * honor. Run via `bun run test:dist` after `bun run build`.
 */
const DIST = join(import.meta.dir, "../../dist");

const read = (path: string) => Bun.file(join(DIST, path)).text();

let enHtml: string;
let zhHtml: string;
let notFoundHtml: string;

beforeAll(async () => {
  if (!existsSync(DIST)) {
    throw new Error("dist/ not found — run `bun run build` first");
  }
  enHtml = await read("index.html");
  zhHtml = await read("zh/index.html");
  notFoundHtml = await read("404.html");
});

const APP_NAMES = ["Mercury", "Amytis", "Ovid", "Monecraft", "Janus"];

describe("pages and platform assets exist", () => {
  test.each([
    "index.html",
    "zh/index.html",
    "404.html",
    "favicon.svg",
    "apple-touch-icon.png",
    "fonts/newsreader-latin.woff2",
    "sitemap-index.xml",
    "robots.txt",
    "_headers",
    "og/og-en.png",
    "og/og-zh.png",
  ])("dist/%s", (file) => {
    expect(existsSync(join(DIST, file))).toBe(true);
  });
});

describe("zero client JavaScript", () => {
  test("no <script> tag in any built page", () => {
    for (const html of [enHtml, zhHtml, notFoundHtml]) {
      expect(html).not.toMatch(/<script/i);
    }
  });
});

describe("locales and language plumbing", () => {
  test("en page declares lang and canonical", () => {
    expect(enHtml).toContain('<html lang="en"');
    expect(enHtml).toContain('rel="canonical" href="https://ainaive.com/"');
  });

  test("zh page declares lang and canonical", () => {
    expect(zhHtml).toContain('<html lang="zh-Hans"');
    expect(zhHtml).toContain('rel="canonical" href="https://ainaive.com/zh/"');
  });

  test("hreflang triple on both pages", () => {
    for (const html of [enHtml, zhHtml]) {
      expect(html).toContain('hreflang="en" href="https://ainaive.com/"');
      expect(html).toContain('hreflang="zh-Hans" href="https://ainaive.com/zh/"');
      expect(html).toContain('hreflang="x-default" href="https://ainaive.com/"');
    }
  });

  test("zh page marks embedded Latin with lang=\"en\"", () => {
    expect(zhHtml).toContain('lang="en"');
  });

  test("OG locale and image per locale", () => {
    expect(enHtml).toContain('property="og:locale" content="en_US"');
    expect(enHtml).toContain("https://ainaive.com/og/og-en.png");
    expect(zhHtml).toContain('property="og:locale" content="zh_CN"');
    expect(zhHtml).toContain("https://ainaive.com/og/og-zh.png");
  });
});

describe("the shelf", () => {
  test.each(APP_NAMES)("%s appears on both locales", (name) => {
    expect(enHtml).toContain(name);
    expect(zhHtml).toContain(name);
  });

  test("tiles disclose details natively, none pre-opened", () => {
    for (const html of [enHtml, zhHtml]) {
      expect(html).toContain("<details");
      expect(html).toContain("<summary");
      // with name= grouping, a pre-opened tile would break the accordion
      expect(html).not.toMatch(/<details[^>]*\bopen\b/);
    }
  });

  test("colophon note closes the sheet on both locales", () => {
    expect(enHtml).toContain("More in the works.");
    expect(zhHtml).toContain("更多在路上。");
  });
});

describe("links", () => {
  const hrefs = (html: string) =>
    [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]!);

  test("internal links resolve to files in dist", () => {
    for (const html of [enHtml, zhHtml, notFoundHtml]) {
      for (const href of hrefs(html)) {
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        const path = href.split(/[?#]/)[0]!;
        const candidates = [
          join(DIST, path),
          join(DIST, path, "index.html"),
          join(DIST, `${path}.html`),
        ];
        expect(
          candidates.some((c) => existsSync(c)),
          `unresolved internal link: ${href}`,
        ).toBe(true);
      }
    }
  });

  test("external links are https and carry noopener", () => {
    for (const html of [enHtml, zhHtml]) {
      for (const href of hrefs(html)) {
        if (!/^[a-z]+:\/\//.test(href)) continue;
        expect(href.startsWith("https://"), `non-https link: ${href}`).toBe(
          true,
        );
      }
      const externalAnchors = [
        ...html.matchAll(/<a\s[^>]*href="https:\/\/[^"]*"[^>]*>/g),
      ].map((m) => m[0]);
      for (const anchor of externalAnchors) {
        expect(anchor, `missing rel=noopener: ${anchor}`).toContain("noopener");
      }
    }
  });
});

describe("sitemap", () => {
  test("lists both locale URLs with alternates", async () => {
    const indexXml = await read("sitemap-index.xml");
    const [, sitemapFile] = /<loc>https:\/\/ainaive\.com\/(.*?)<\/loc>/.exec(
      indexXml,
    )!;
    const xml = await read(sitemapFile!);
    expect(xml).toContain("<loc>https://ainaive.com/</loc>");
    expect(xml).toContain("<loc>https://ainaive.com/zh/</loc>");
    expect(xml).toContain('hreflang="zh-Hans"');
  });
});

describe("weight budget", () => {
  test("HTML + CSS + font stays under 250 KB per locale", async () => {
    const htmlBytes = Buffer.byteLength(enHtml);
    const fontBytes = Bun.file(
      join(DIST, "fonts/newsreader-latin.woff2"),
    ).size;
    let cssBytes = 0;
    const astroDir = join(DIST, "_astro");
    if (existsSync(astroDir)) {
      for (const f of readdirSync(astroDir)) {
        if (f.endsWith(".css")) {
          cssBytes += Bun.file(join(astroDir, f)).size;
        }
      }
    }
    expect(htmlBytes + fontBytes + cssBytes).toBeLessThan(250 * 1024);
  });
});
