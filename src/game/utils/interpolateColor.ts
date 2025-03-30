/**
 * Interpolate between two colors
 *
 * https://stackoverflow.com/q/66123016 and GitHub Copilot
 */

const is = {
  hex: (a: string): boolean => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a),
  rgb: (a: string): boolean => /^rgb/.test(a),
  hsl: (a: string): boolean => /^hsl/.test(a),
  col: (a: string): boolean => is.hex(a) || is.rgb(a) || is.hsl(a),
};

const convertToRgba = (color: string): string => {
  return is.hex(color)
    ? hexToRgba(color)
    : is.rgb(color)
    ? rgbToRgba(color)
    : is.hsl(color)
    ? hslToRgba(color)
    : color;
};

const hexToRgba = (color: string, alpha: number = 1): string => {
  const [r, g, b] = color.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

const rgbToRgba = (color: string, alpha: number = 1): string => {
  const [r, g, b] = color
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);
  return `rgba(${r},${g},${b},${alpha})`;
};

const hslToRgba = (color: string): string => {
  const [h, s, l] = color
    .replace(/hsl\(|\s|%\)/g, "")
    .split(",")
    .map(Number);
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const aValue = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * aValue);
  };
  return `rgba(${f(0)},${f(8)},${f(4)},1)`;
};

const deconstructRgba = (rgba: string): number[] => {
  return rgba
    .replace(/[^\d,]/g, "")
    .split(",")
    .map((x) => parseInt(x));
};

const formatRgba = (color: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string => {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
};

const interpolateColor = (
  colorA: string,
  colorB: string,
  progress: number
): string => {
  const [r1, g1, b1, a1] = deconstructRgba(convertToRgba(colorA));
  const [r2, g2, b2, a2] = deconstructRgba(convertToRgba(colorB));
  return formatRgba({
    r: Math.round(r1 + (r2 - r1) * progress),
    g: Math.round(g1 + (g2 - g1) * progress),
    b: Math.round(b1 + (b2 - b1) * progress),
    a: a1 + (a2 - a1) * progress,
  });
};

export {
  convertToRgba,
  deconstructRgba,
  hexToRgba,
  interpolateColor,
  rgbToRgba,
};
