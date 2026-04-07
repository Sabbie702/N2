// src/components/PaletteStrip.js
// N2 — Color Wheel Intelligence
// Row of color swatches with lock toggle and re-stitch visual feedback

import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, Text, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND = {
  plum: '#5B2D8E',
  mint: '#4EC9A0',
  muted: '#6b6b8a',
  dimmed: '#aaaabc',
  card: '#f7f7f7',
};

/**
 * PaletteStrip
 *
 * Props:
 *   colors       {string[]}   Array of hex color strings
 *   locks        {boolean[]}  Which positions are locked
 *   changedFlags {boolean[]}  Which positions just changed (shows mint border)
 *   onToggleLock {(index) => void}
 */
export function PaletteStrip({ colors, locks, changedFlags, onToggleLock }) {
  return (
    <View style={styles.row}>
      {colors.map((hex, i) => {
        const isLocked = locks[i];
        const isChanged = changedFlags[i];

        return (
          <TouchableOpacity
            key={i}
            style={styles.swatchWrap}
            onPress={() => onToggleLock(i)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.swatch,
                { backgroundColor: hex },
                isLocked  && styles.swatchLocked,
                isChanged && styles.swatchChanged,
              ]}
            >
              {/* Lock badge */}
              {isLocked && (
                <View style={[styles.badge, styles.lockBadge]}>
                  <Ionicons name="lock-closed" size={8} color="#fff" />
                </View>
              )}
              {/* Re-stitched checkmark badge */}
              {isChanged && !isLocked && (
                <View style={[styles.badge, styles.changedBadge]}>
                  <Ionicons name="checkmark" size={8} color="#fff" />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.hexLabel,
                isLocked  && styles.hexLocked,
                isChanged && styles.hexChanged,
              ]}
              numberOfLines={1}
            >
              {hex}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  swatchWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  swatch: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: 'transparent',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 3,
  },
  swatchLocked: {
    borderColor: BRAND.plum,
    shadowColor: BRAND.plum,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  swatchChanged: {
    borderColor: BRAND.mint,
    shadowColor: BRAND.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    width: 14,
    height: 14,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    backgroundColor: BRAND.plum,
  },
  changedBadge: {
    backgroundColor: BRAND.mint,
    position: 'absolute',
    top: 3,
    right: 3,
  },
  hexLabel: {
    fontSize: 7.5,
    fontFamily: 'monospace',
    color: BRAND.dimmed,
  },
  hexLocked: {
    color: BRAND.plum,
    fontWeight: '600',
  },
  hexChanged: {
    color: '#0a6e4a',
    fontWeight: '600',
  },
});
