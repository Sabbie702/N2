// src/hooks/usePalette.js
// N2 — Color Wheel Intelligence
// Manages palette state: colors, locks, re-stitch, changed flags

import { useState, useCallback, useRef } from 'react';
import { generateFreshPalette, reStitch } from '../utils/colorHarmony';

const CHANGED_FLAG_DURATION_MS = 2500;

export function usePalette(initialTypeId = 'sisters') {
  const [paletteTypeId, setPaletteTypeId] = useState(initialTypeId);
  const [colors, setColors] = useState([]);
  const [locks, setLocks] = useState([]);
  const [changedFlags, setChangedFlags] = useState([]);
  const [stitchedCount, setStitchedCount] = useState(0);
  const [keptCount, setKeptCount] = useState(0);
  const [showPill, setShowPill] = useState(false);
  const pillTimerRef = useRef(null);

  // ─── Initialize a fresh palette from anchor color ───
  const initPalette = useCallback((typeId, anchorH, anchorS, anchorL) => {
    const newColors = generateFreshPalette(typeId, anchorH, anchorS, anchorL);
    setPaletteTypeId(typeId);
    setColors(newColors);
    setLocks(new Array(newColors.length).fill(false));
    setChangedFlags(new Array(newColors.length).fill(false));
    setShowPill(false);
  }, []);

  // ─── Load a saved palette (for resume editing) ───
  const loadSavedPalette = useCallback((savedColors, typeId) => {
    setPaletteTypeId(typeId);
    setColors([...savedColors]);
    setLocks(new Array(savedColors.length).fill(false));
    setChangedFlags(new Array(savedColors.length).fill(false));
    setShowPill(false);
  }, []);

  // ─── Change palette type (resets locks) ───
  const changePaletteType = useCallback((newTypeId, anchorH, anchorS, anchorL) => {
    const newColors = generateFreshPalette(newTypeId, anchorH, anchorS, anchorL);
    setPaletteTypeId(newTypeId);
    setColors(newColors);
    setLocks(new Array(newColors.length).fill(false));
    setChangedFlags(new Array(newColors.length).fill(false));
    setShowPill(false);
  }, []);

  // ─── Update palette when anchor color changes ───
  const updateAnchor = useCallback((anchorH, anchorS, anchorL, currentLocks, currentColors) => {
    const newColors = generateFreshPalette(paletteTypeId, anchorH, anchorS, anchorL);
    // Preserve locked colors
    const merged = newColors.map((c, i) =>
      currentLocks[i] && currentColors[i] ? currentColors[i] : c
    );
    setColors(merged);
    setChangedFlags(new Array(merged.length).fill(false));
    setShowPill(false);
  }, [paletteTypeId]);

  // ─── Toggle lock on a single swatch ───
  const toggleLock = useCallback((index) => {
    setLocks(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
    // Clear changed flag when user interacts with a swatch
    setChangedFlags(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }, []);

  // ─── Re-stitch: regenerate all unlocked colors ───
  // IMPORTANT: locks determine what stays, everything else gets fresh colors
  // Wide randomization ranges ensure visually distinct results every time
  const doReStitch = useCallback((anchorH, anchorS, anchorL) => {
    setColors(prev => {
      const { colors: newColors, changedFlags: newChanged } =
        reStitch(paletteTypeId, anchorH, anchorS, anchorL, locks, prev);

      const nChanged = newChanged.filter(Boolean).length;
      const nKept = locks.filter(Boolean).length;

      setChangedFlags(newChanged);
      setStitchedCount(nChanged);
      setKeptCount(nKept);
      setShowPill(true);

      // Auto-dismiss changed state after timeout
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
      pillTimerRef.current = setTimeout(() => {
        setChangedFlags(f => f.map(() => false));
        setShowPill(false);
      }, CHANGED_FLAG_DURATION_MS);

      return newColors;
    });
  }, [paletteTypeId, locks]);

  // ─── Derived state ───
  const lockedCount = locks.filter(Boolean).length;
  const allLocked = locks.length > 0 && locks.every(Boolean);
  const pillText = `${stitchedCount} color${stitchedCount !== 1 ? 's' : ''} re-stitched · ${keptCount} kept`;

  return {
    // State
    paletteTypeId,
    colors,
    locks,
    changedFlags,
    lockedCount,
    allLocked,
    showPill,
    pillText,

    // Actions
    initPalette,
    loadSavedPalette,
    changePaletteType,
    updateAnchor,
    toggleLock,
    doReStitch,
  };
}
