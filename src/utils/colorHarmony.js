/**
 * N2 — Nimble Needle
 * Color Harmony Engine  v1.0
 *
 * Converts HEX → HSL, calculates all 5 harmony types,
 * matches ideal harmony colors back to real fabric names.
 */

import { findClosestColors, hexToRgb } from '../data/fabricColors';

export const HARMONY_TYPES = {
  tone_on_tone:   { id:'tone_on_tone',   label:'Tone on Tone',   icon:'🌊', technicalName:'Monochromatic',      quilterDescription:'Different depths of the same color family — creates a calm, layered look' },
  fabric_sisters: { id:'fabric_sisters', label:'Fabric Sisters',  icon:'🌸', technicalName:'Analogous',          quilterDescription:'Colors that sit side-by-side on the wheel — they naturally belong together' },
  bold_contrast:  { id:'bold_contrast',  label:'Bold Contrast',   icon:'⚡', technicalName:'Complementary',      quilterDescription:'Colors directly opposite each other — maximum pop and drama' },
  lively_trio:    { id:'lively_trio',    label:'Lively Trio',     icon:'✨', technicalName:'Triadic',            quilterDescription:'Three colors equally spaced around the wheel — vibrant and balanced' },
  split_contrast: { id:'split_contrast', label:'Split Contrast',  icon:'🎨', technicalName:'Split Complementary',quilterDescription:"The complement's two neighbors — softer than Bold Contrast, still exciting" },
};

export function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let { r, g, b } = rgb;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r)      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / delta + 2) / 6;
    else                h = ((r - g) / delta + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toH = x => Math.round(Math.max(0, Math.min(255, x * 255))).toString(16).padStart(2, '0');
  return `#${toH(f(0))}${toH(f(8))}${toH(f(4))}`;
}

function rot(h, deg) { return (h + deg + 360) % 360; }

function getToneOnTone({ h, s, l }) {
  return [
    { hex: hslToHex(h, s, Math.min(l + 20, 90)), label:'Light shade' },
    { hex: hslToHex(h, s, l),                     label:'Source color' },
    { hex: hslToHex(h, s, Math.max(l - 20, 10)), label:'Dark shade' },
    { hex: hslToHex(h, Math.max(s - 20, 0), l),  label:'Muted tone' },
  ];
}

function getFabricSisters({ h, s, l }) {
  return [
    { hex: hslToHex(rot(h, -30), s, l), label:'Sister left' },
    { hex: hslToHex(h, s, l),            label:'Source color' },
    { hex: hslToHex(rot(h,  30), s, l), label:'Sister right' },
    { hex: hslToHex(rot(h,  60), s, l), label:'Far sister' },
  ];
}

function getBoldContrast({ h, s, l }) {
  const c = rot(h, 180);
  return [
    { hex: hslToHex(h, s, l),              label:'Source color' },
    { hex: hslToHex(c, s, l),              label:'Complement' },
    { hex: hslToHex(c, s, Math.min(l+15,90)), label:'Light complement' },
    { hex: hslToHex(c, s, Math.max(l-15,10)), label:'Dark complement' },
  ];
}

function getLivelyTrio({ h, s, l }) {
  return [
    { hex: hslToHex(h,            s, l), label:'Source color' },
    { hex: hslToHex(rot(h, 120), s, l), label:'Trio partner 1' },
    { hex: hslToHex(rot(h, 240), s, l), label:'Trio partner 2' },
  ];
}

function getSplitContrast({ h, s, l }) {
  return [
    { hex: hslToHex(h,            s, l), label:'Source color' },
    { hex: hslToHex(rot(h, 150), s, l), label:'Split 1' },
    { hex: hslToHex(rot(h, 210), s, l), label:'Split 2' },
  ];
}

export function getHarmonies(sourceHex, brandId = null, matchCount = 3) {
  const hsl = hexToHsl(sourceHex);
  if (!hsl) return null;

  const calculators = {
    tone_on_tone:   getToneOnTone,
    fabric_sisters: getFabricSisters,
    bold_contrast:  getBoldContrast,
    lively_trio:    getLivelyTrio,
    split_contrast: getSplitContrast,
  };

  const harmonies = {};
  for (const [key, calc] of Object.entries(calculators)) {
    const idealColors = calc(hsl);
    const type = HARMONY_TYPES[key];
    const fabricMatches = idealColors.map(ideal => ({
      idealHex: ideal.hex,
      label:    ideal.label,
      matches:  findClosestColors(ideal.hex, matchCount, brandId),
    }));
    harmonies[key] = { type, idealColors, fabricMatches };
  }

  return { sourceHex, sourceHsl: hsl, harmonies };
}

export function getSingleHarmony(sourceHex, harmonyId, brandId = null, matchCount = 3) {
  const result = getHarmonies(sourceHex, brandId, matchCount);
  return result ? (result.harmonies[harmonyId] || null) : null;
}

export function describeColor(hex) {
  const hsl = hexToHsl(hex);
  if (!hsl) return '';
  const { h, s, l } = hsl;
  const hue = h < 15 || h >= 345 ? 'red'
    : h < 45  ? 'orange'      : h < 75  ? 'yellow'
    : h < 105 ? 'yellow-green': h < 150 ? 'green'
    : h < 180 ? 'teal'        : h < 210 ? 'cyan'
    : h < 240 ? 'blue'        : h < 270 ? 'blue-violet'
    : h < 300 ? 'violet'      : h < 330 ? 'magenta'
    : 'pink';
  const sat  = s < 20 ? 'very muted' : s < 50 ? 'softly saturated' : s < 80 ? 'vibrant' : 'intensely saturated';
  const val  = l < 25 ? 'dark'       : l < 50 ? 'mid-dark'         : l < 75 ? 'mid-light' : 'light';
  const warm = h < 180 ? 'warm' : 'cool';
  return `A ${warm}, ${sat} ${hue} in the ${val} value range`;
}
