// src/components/QuiltBlockSVG.js
// N2 — Color Wheel Intelligence
// SVG renderers for the three quilt block preview types.
// All blocks use ALL palette colors — do not hardcode to colors[0..2] only.

import React from 'react';
import Svg, { Rect, Polygon, Circle } from 'react-native-svg';

/**
 * QuiltBlockSVG
 *
 * Props:
 *   blockId  {string}    'carpenters_star' | 'ohio_star' | 'hst'
 *   colors   {string[]}  Array of hex color strings
 *   size     {number}    Width/height in dp (default 78)
 */
export function QuiltBlockSVG({ blockId, colors, size = 78 }) {
  if (!colors || colors.length === 0) return null;
  switch (blockId) {
    case 'carpenters_star': return <CarpentersStar colors={colors} size={size} />;
    case 'ohio_star':       return <OhioStar colors={colors} size={size} />;
    case 'hst':             return <HST colors={colors} size={size} />;
    default:                return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Carpenter's Star
//
// Color usage:
//   8 points cycle through colors[0..n-2] (alternating on each point)
//   colors[n-1] = background + center gap ring
//   colors[0]   = small center dot
// ─────────────────────────────────────────────────────────────────────────────

function CarpentersStar({ colors, size }) {
  const cx = size / 2, cy = size / 2;
  const n  = colors.length;
  const R  = size * 0.47;
  const Rm = size * 0.22;
  const Ri = size * 0.09;
  const span = 22.5 * Math.PI / 180;
  const nc = Math.max(1, n - 1);

  const points = Array.from({ length: 8 }, (_, i) => {
    const a = i * Math.PI / 4;
    const tip  = [cx + Math.cos(a) * R,        cy + Math.sin(a) * R];
    const mid1 = [cx + Math.cos(a + span) * Rm, cy + Math.sin(a + span) * Rm];
    const inner = [cx + Math.cos(a) * Ri,      cy + Math.sin(a) * Ri];
    const mid2 = [cx + Math.cos(a - span) * Rm, cy + Math.sin(a - span) * Rm];
    return {
      pts:  [...tip, ...mid1, ...inner, ...mid2].join(' '),
      fill: colors[i % nc],
    };
  });

  return (
    <Svg width={size} height={size}>
      <Rect x={0} y={0} width={size} height={size} fill={colors[n - 1]} />
      {points.map((p, i) => (
        <Polygon key={i} points={p.pts} fill={p.fill} />
      ))}
      <Circle cx={cx} cy={cy} r={Ri * 0.85} fill={colors[n - 1]} />
      <Circle cx={cx} cy={cy} r={Ri * 0.4}  fill={colors[0]} />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ohio Star
//
// Color usage (3×3 nine-patch):
//   colors[0]   = center square
//   colors[1]   = corner diamond points (even corners)
//   colors[2]   = corner diamond points (odd corners)
//   colors[3]   = 4 side squares
//   colors[n-1] = background (4 corner triangles)
// ─────────────────────────────────────────────────────────────────────────────

function OhioStar({ colors, size }) {
  const t = size / 3;
  const n = colors.length;
  const c = (i) => colors[Math.min(i, n - 1)];

  const corners = [[0, 0], [2, 0], [0, 2], [2, 2]];

  // Diamond polygon points for each corner cell
  const diamonds = corners.map(([col, row], idx) => {
    const x = col * t, y = row * t;
    return {
      pts:  [x + t / 2, y, x + t, y + t / 2, x + t / 2, y + t, x, y + t / 2].join(' '),
      fill: c(idx % 2 === 0 ? 1 : 2),
    };
  });

  // Background triangles punched over each diamond (4 per corner)
  const bgTris = [];
  corners.forEach(([col, row]) => {
    const x = col * t, y = row * t;
    bgTris.push(
      [x,     y,     x + t / 2, y,     x,     y + t / 2].join(' '),
      [x + t, y,     x + t / 2, y,     x + t, y + t / 2].join(' '),
      [x,     y + t, x + t / 2, y + t, x,     y + t / 2].join(' '),
      [x + t, y + t, x + t / 2, y + t, x + t, y + t / 2].join(' '),
    );
  });

  return (
    <Svg width={size} height={size}>
      {/* Background */}
      <Rect x={0} y={0} width={size} height={size} fill={c(n - 1)} />

      {/* 4 side squares */}
      <Rect x={t}     y={0} width={t} height={t} fill={c(3)} />
      <Rect x={0}     y={t} width={t} height={t} fill={c(3)} />
      <Rect x={2 * t} y={t} width={t} height={t} fill={c(3)} />
      <Rect x={t}     y={2 * t} width={t} height={t} fill={c(3)} />

      {/* Corner diamonds */}
      {diamonds.map((d, i) => (
        <Polygon key={`d${i}`} points={d.pts} fill={d.fill} />
      ))}

      {/* Background triangles over diamond corners */}
      {bgTris.map((pts, i) => (
        <Polygon key={`bt${i}`} points={pts} fill={c(n - 1)} />
      ))}

      {/* Center square on top */}
      <Rect x={t} y={t} width={t} height={t} fill={c(0)} />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Half-Square Triangles (HST)
//
// Color usage:
//   4×4 grid, each cell split diagonally
//   cycles all colors via colors[i % n] naturally
// ─────────────────────────────────────────────────────────────────────────────

function HST({ colors, size }) {
  const GRID = 4;
  const cell = size / GRID;
  const n = colors.length;
  const cells = [];

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const x  = col * cell, y = row * cell;
      const c1 = colors[(row + col) % n];
      const c2 = colors[(row + col + 2) % n];
      const flip = (row + col) % 2 === 0;

      cells.push(
        <Rect key={`r${row}${col}`} x={x} y={y} width={cell} height={cell} fill={c1} />
      );

      const triPts = flip
        ? [x, y + cell, x + cell, y, x + cell, y + cell].join(' ')
        : [x, y, x + cell, y, x, y + cell].join(' ');

      cells.push(
        <Polygon key={`t${row}${col}`} points={triPts} fill={c2} />
      );
    }
  }

  return <Svg width={size} height={size}>{cells}</Svg>;
}
