/** WCAG 2.x relative luminance and contrast ratio, for #rrggbb colors. */

const channel = (value: number): number => {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
};

export const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export const relativeLuminance = (hex: string): number => {
  if (!HEX_COLOR.test(hex)) {
    throw new Error(`expected #rrggbb color, got "${hex}"`);
  }
  const n = Number.parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 0xff) +
    0.7152 * channel((n >> 8) & 0xff) +
    0.0722 * channel(n & 0xff)
  );
};

export const contrastRatio = (a: string, b: string): number => {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lighter, darker] = la >= lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
};

/** WCAG AA for normal text. */
export const AA_TEXT = 4.5;
