// src/components/ReStitchButton.js
// N2 — Color Wheel Intelligence
// The Re-stitch CTA button + lock counter

import React, { useRef } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND = { mint: '#4EC9A0', plum: '#5B2D8E', dimmed: '#aaaabc' };

/**
 * ReStitchButton
 *
 * Props:
 *   lockedCount  {number}    How many colors are locked
 *   allLocked    {boolean}   True if every color is locked (button disabled)
 *   onPress      {() => void}
 */
export function ReStitchButton({ lockedCount, allLocked, onPress }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Spin the icon during re-stitch
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Lock counter */}
      <View style={styles.lockStat}>
        <Text style={styles.lockNum}>{lockedCount}</Text>
        <Text style={styles.lockLbl}>locked</Text>
      </View>

      {/* Re-stitch button */}
      <TouchableOpacity
        style={[styles.button, allLocked && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={allLocked}
        activeOpacity={0.85}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="refresh" size={15} color="#0a3d2b" />
        </Animated.View>
        <Text style={styles.buttonText}>Re-stitch</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(91,45,142,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(91,45,142,0.1)',
  },
  lockStat: {
    alignItems: 'center',
    gap: 1,
    minWidth: 32,
  },
  lockNum: {
    fontSize: 18,
    fontWeight: '600',
    color: BRAND.plum,
    lineHeight: 20,
  },
  lockLbl: {
    fontSize: 8,
    color: BRAND.dimmed,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: BRAND.mint,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0a3d2b',
  },
});


// ─────────────────────────────────────────────────────────────────────────────
// PaletteTypeSelector
// Horizontal scrolling pill selector for the 4 palette types
// ─────────────────────────────────────────────────────────────────────────────

// src/components/PaletteTypeSelector.js

import { ScrollView } from 'react-native';
import { PALETTE_TYPES } from '../utils/colorHarmony';

/**
 * PaletteTypeSelector
 *
 * Props:
 *   activeTypeId  {string}              Current palette type id
 *   onSelect      {(typeId) => void}    Called when user taps a type
 */
export function PaletteTypeSelector({ activeTypeId, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={pillStyles.container}
    >
      {Object.values(PALETTE_TYPES).map((type) => {
        const isActive = type.id === activeTypeId;
        return (
          <TouchableOpacity
            key={type.id}
            style={[pillStyles.pill, isActive && pillStyles.pillActive]}
            onPress={() => onSelect(type.id)}
            activeOpacity={0.8}
          >
            <Text style={[pillStyles.label, isActive && pillStyles.labelActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const pillStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    backgroundColor: '#f7f7f7',
  },
  pillActive: {
    backgroundColor: BRAND.plum,
    borderColor: BRAND.plum,
  },
  label: {
    fontSize: 10,
    color: '#6b6b8a',
  },
  labelActive: {
    color: '#fff',
  },
});
