/**
 * The tiniest slice of Markdown: inline `[label](https://…)` links, and nothing
 * else. The About copy is the only place that needs a link, and pulling in a
 * Markdown dependency for one anchor would break the two-dependency ceiling.
 *
 * The whole string is HTML-escaped first, so any `<`, `&`, or `"` in the copy is
 * inert before we splice in anchors — safe to hand to `set:html`. Only `https://`
 * URLs become links (matching the site's external-link policy); anything else is
 * left as literal text.
 */

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const INLINE_LINK = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g;

export const renderInlineLinks = (text: string): string =>
  escapeHtml(text).replace(
    INLINE_LINK,
    (_match, label: string, href: string) =>
      `<a href="${href}" rel="noopener">${label}</a>`,
  );
