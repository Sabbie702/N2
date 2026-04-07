// src/utils/colorHarmony.js
// N2 — Color Wheel Intelligence
// Palette generation for all 4 harmony types + Anthropic API advisor

import { hslToHex, rnd } from './colorUtils';

// ─────────────────────────────────────────────
// Palette type definitions
// ─────────────────────────────────────────────

export const PALETTE_TYPES = {
  tone: {
    id: 'tone',
    label: 'Tone on Tone',
    tag: 'always works',
    description: 'Same color, lighter and deeper — classic quilting elegance',
    colorCount: 5,
  },
  sisters: {
    id: 'sisters',
    label: 'Fabric Sisters',
    tag: 'flowing',
    description: 'Neighbors on the wheel — they naturally want to be together',
    colorCount: 5,
  },
  contrast: {
    id: 'contrast',
    label: 'Bold Contrast',
    tag: 'dramatic',
    description: 'The color directly opposite — your quilt will stop people in their tracks',
    colorCount: 4,
  },
  trio: {
    id: 'trio',
    label: 'Lively Trio',
    tag: 'balanced',
    description: 'Three perfectly spaced colors — a timeless combination quilters reach for again and again',
    colorCount: 5,
  },
};

// ─────────────────────────────────────────────
// Base color generators
// Each returns an array of [h, s, l] triplets
// Wide ranges are INTENTIONAL — Re-stitch must
// produce visually distinct results every time
// ─────────────────────────────────────────────

function toneBase(h, s, l) {
  return [
    [h, rnd(4, 20),                           rnd(83, 94)],
    [h, rnd(18, 42),                          rnd(66, 80)],
    [h, s,                                    l],
    [h, Math.min(100, s * 1.05),              Math.max(10, l - rnd(12, 24))],
    [h, Math.min(100, s * 1.1),               Math.max(8,  l - rnd(24, 38))],
  ];
}

function sistersBase(h, s, l) {
  return [
    [h + rnd(-50, -28), s, l + rnd(-4, 6)],
    [h + rnd(-26, -10), s, l + rnd(-4, 6)],
    [h,                 s, l],
    [h + rnd(10,  26),  s, l + rnd(-4, 6)],
    [h + rnd(28,  50),  s, l + rnd(-4, 6)],
  ];
}

function contrastBase(h, s, l) {
  return [
    [h,           rnd(12, 38), rnd(68, 86)],
    [h,           s,           l],
    [(h + 180) % 360, rnd(12, 38), rnd(68, 86)],
    [(h + 180) % 360, s,           l],
  ];
}

function trioBase(h, s, l) {
  return [
    [h,                         s,           l],
    [h,                         rnd(10, 28), rnd(72, 88)],
    [(h + rnd(108, 132)) % 360, s,           l],
    [(h + rnd(108, 132)) % 360, rnd(10, 28), rnd(72, 88)],
    [(h + rnd(228, 252)) % 360, s,           l],
  ];
}

const BASE_GENERATORS = {
  tone:     toneBase,
  sisters:  sistersBase,
  contrast: contrastBase,
  trio:     trioBase,
};

// ─────────────────────────────────────────────
// Main palette generation function
// ─────────────────────────────────────────────

export function generatePalette(typeId, h, s, l, locks = [], current = []) {
  const generator = BASE_GENERATORS[typeId];
  if (!generator) throw new Error(`Unknown palette type: ${typeId}`);
  const bases = generator(h, s, l);
  return bases.map((base, i) => {
    if (locks[i] && current[i]) return current[i];
    return hslToHex(base[0], base[1], base[2]);
  });
}

export function generateFreshPalette(typeId, h, s, l) {
  return generatePalette(typeId, h, s, l, [], []);
}

// ─────────────────────────────────────────────
// Re-stitch: regenerate only unlocked positions
// ─────────────────────────────────────────────

export function reStitch(typeId, h, s, l, locks, current) {
  const prev = [...current];
  const colors = generatePalette(typeId, h, s, l, locks, current);
  const changedFlags = colors.map((c, i) => !locks[i] && c !== prev[i]);
  return { colors, changedFlags };
}

// ─────────────────────────────────────────────
// Anthropic API — Palette Advisor
//
// API key must come from a secure config — never hardcode it.
// Add to app.json: { "extra": { "anthropicApiKey": "sk-ant-..." } }
// then read via: import Constants from 'expo-constants';
//                const key = Constants.expoConfig?.extra?.anthropicApiKey;
// ─────────────────────────────────────────────

export function buildAdvisorPrompt(paletteTypeLabel, anchorHex, colors) {
  return `You are the AI advisor inside Nimble Needle (N2), a mobile app built for quilters and bag makers.

A quilter has chosen the "${paletteTypeLabel}" palette with anchor fabric color ${anchorHex}.
The full suggested palette is: ${colors.join(', ')}.

Give warm, practical advice for how to use this palette in a quilt.
Write exactly 3 short tips. Each tip must be 1-2 sentences max.
Write for quilters who are not color theory experts — plain everyday language only, no jargon.

Respond ONLY with a JSON array of exactly 3 objects, each with keys:
- "heading": 3-5 words, no punctuation
- "body": 1-2 plain sentences

No preamble, no markdown, no backticks, no extra text outside the JSON array.`;
}

export async function fetchPaletteAdvice(paletteTypeLabel, anchorHex, colors, apiKey) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY_MISSING');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: buildAdvisorPrompt(paletteTypeLabel, anchorHex, colors) }],
    }),
  });

  const data = await response.json();
  const raw = data.content
    .map(b => b.text || '')
    .join('')
    .replace(/```json|```/g, '')
    .trim();

  return JSON.parse(raw);
}
