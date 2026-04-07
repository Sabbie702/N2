// src/hooks/useColorWheel.js
// N2 — Color Wheel Intelligence
// Manages anchor color state. Visual rendering is in ColorWheelPicker (SVG).

import { useState, useCallback } from 'react';
import { hslToHex, getColorName } from '../utils/colorUtils';

const DEFAULT_HUE = 250;
const DEFAULT_SAT = 65;
const DEFAULT_LIT = 50;
const MIN_SAT = 8;

export function useColorWheel() {
  const [anchorH, setAnchorH] = useState(DEFAULT_HUE);
  const [anchorS, setAnchorS] = useState(DEFAULT_SAT);
  const anchorL = DEFAULT_LIT; // Lightness is fixed at 50 for the wheel

  const anchorHex  = hslToHex(anchorH, anchorS, anchorL);
  const anchorName = getColorName(anchorH, anchorS, anchorL);

  // Called by ColorWheelPicker when the user taps or drags
  const handleColorChange = useCallback(({ h, s }) => {
    setAnchorH(h);
    setAnchorS(Math.max(MIN_SAT, s));
  }, []);

  return {
    anchorH,
    anchorS,
    anchorL,
    anchorHex,
    anchorName,
    handleColorChange,
  };
}
