// src/utils/colorUtils.js
// N2 — Color Wheel Intelligence
// Core color conversion and naming utilities

/**
 * Convert HSL values to RGB array [r, g, b]
 * @param {number} h - Hue 0-360
 * @param {number} s - Saturation 0-100
 * @param {number} l - Lightness 0-100
 * @returns {number[]} [r, g, b] each 0-255
 */
export function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 0.5) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [
    Math.round(f(p, q, h + 1 / 3) * 255),
    Math.round(f(p, q, h) * 255),
    Math.round(f(p, q, h - 1 / 3) * 255),
  ];
}

/**
 * Convert HSL to hex string
 * Clamps all values to valid ranges
 * @param {number} h - Hue 0-360
 * @param {number} s - Saturation 0-100
 * @param {number} l - Lightness 0-100
 * @returns {string} hex color e.g. '#5B2D8E'
 */
export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.min(100, Math.max(0, s));
  l = Math.min(95, Math.max(5, l));
  const [r, g, b] = hslToRgb(h, s, l);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert hex string to HSL array [h, s, l]
 * @param {string} hex - e.g. '#5B2D8E'
 * @returns {number[]} [h, s, l]
 */
export function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Get a quilter-friendly color name from HSL values
 * Uses plain English — not color theory jargon
 * @param {number} h - Hue 0-360
 * @param {number} s - Saturation 0-100
 * @param {number} l - Lightness 0-100
 * @returns {string} e.g. 'Deep Purple', 'Light Teal', 'Vivid Orange'
 */
export function getColorName(h, s, l) {
  if (s < 12) {
    if (l > 75) return 'Soft White';
    if (l < 30) return 'Charcoal';
    return 'Neutral Gray';
  }
  const names = [
    [0,   'Red'],
    [22,  'Red-Orange'],
    [35,  'Orange'],
    [55,  'Golden Yellow'],
    [65,  'Yellow'],
    [95,  'Yellow-Green'],
    [135, 'Green'],
    [155, 'Mint Green'],
    [170, 'Teal'],
    [195, 'Sky Blue'],
    [225, 'Blue'],
    [255, 'Periwinkle'],
    [275, 'Violet'],
    [300, 'Purple'],
    [325, 'Magenta'],
    [345, 'Rose'],
    [360, 'Red'],
  ];
  let name = 'Color';
  for (let i = 0; i < names.length - 1; i++) {
    if (h >= names[i][0] && h < names[i + 1][0]) {
      name = names[i][1];
      break;
    }
  }
  const prefix = l > 72 ? 'Light ' : l < 32 ? 'Deep ' : s > 75 ? 'Vivid ' : '';
  return prefix + name;
}

/**
 * Random float between min and max
 */
export function rnd(min, max) {
  return min + Math.random() * (max - min);
}
