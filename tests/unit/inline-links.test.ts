import { describe, expect, test } from "bun:test";

import { renderInlineLinks } from "../../src/lib/inline-links";

describe("renderInlineLinks", () => {
  test("turns [label](https://…) into a same-tab anchor with noopener", () => {
    expect(
      renderInlineLinks("the label of [hutusi](https://hutusi.com) — done"),
    ).toBe(
      'the label of <a href="https://hutusi.com" rel="noopener">hutusi</a> — done',
    );
  });

  test("leaves plain text untouched", () => {
    expect(renderInlineLinks("small software, honestly made")).toBe(
      "small software, honestly made",
    );
  });

  test("escapes HTML so copy can never inject markup", () => {
    expect(renderInlineLinks('a <b> & "quote"')).toBe(
      "a &lt;b&gt; &amp; &quot;quote&quot;",
    );
  });

  test("does not linkify non-https URLs", () => {
    const insecure = "[x](http://x.test) [y](ftp://y.test)";
    const rendered = renderInlineLinks(insecure);
    expect(rendered).not.toContain("<a");
    expect(rendered).toBe("[x](http://x.test) [y](ftp://y.test)");
  });
});
