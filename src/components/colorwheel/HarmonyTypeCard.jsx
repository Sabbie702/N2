/**
 * N2 — Nimble Needle
 * HarmonyTypeCard Component
 *
 * Collapsible card for one harmony type (e.g. "Bold Contrast").
 * Shows: icon, quilter name, technical name, description, fabric matches.
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { FabricMatchChip } from './ColorWheelComponents';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const N2 = {
  deepPlum:     '#5B2D8E',
  midnight:     '#2D1B4E',
  mint:         '#4EC9A0',
  softLavender: '#C084FC',
  lavWhite:     '#F5F0FA',
  white:        '#FFFFFF',
  darkText:     '#1A1A2E',
  midGray:      '#6B6B8A',
  lightBorder:  '#DDD6F0',
};

const QUILTER_DESCRIPTIONS = {
  tone_on_tone:   'Different depths of the same color family — creates a calm, layered look',
  fabric_sisters: 'Colors that sit side-by-side on the wheel — they naturally belong together',
  bold_contrast:  'Colors directly opposite each other — maximum pop and drama',
  lively_trio:    'Three colors equally spaced around the wheel — vibrant and balanced',
  split_contrast: 'The complement\'s two neighbors — softer than Bold Contrast, still exciting',
};

export default function HarmonyTypeCard({
  harmonyResult,
  defaultExpanded = false,
  onFabricPress,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { type, fabricMatches } = harmonyResult;

  if (!type || !fabricMatches) return null;

  // Quick preview: top match from each group (max 5 chips)
  const previewChips = fabricMatches
    .map(group => group.matches?.[0])
    .filter(Boolean)
    .slice(0, 5);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(e => !e);
  };

  return (
    <View style={styles.card}>

      {/* ── Header ── */}
      <TouchableOpacity onPress={toggle} activeOpacity={0.75} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>{type.icon}</Text>
          <View>
            <Text style={styles.label}>{type.label}</Text>
            <Text style={styles.technical}>{type.technicalName}</Text>
          </View>
        </View>

        {/* Preview chips (collapsed) */}
        {!expanded && (
          <View style={styles.previewStrip}>
            {previewChips.map((match, i) => (
              <View key={i}
                style={[styles.previewChip, { backgroundColor: match.hex }]}
              />
            ))}
          </View>
        )}

        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* ── Description ── */}
      <Text style={styles.description}>
        {QUILTER_DESCRIPTIONS[type.id] || type.quilterDescription}
      </Text>

      {/* ── Expanded: Fabric Matches ── */}
      {expanded && (
        <View style={styles.matchesContainer}>
          <View style={styles.divider}/>
          {fabricMatches.map((group, gi) => (
            <View key={gi} style={styles.matchGroup}>
              <Text style={styles.groupLabel}>{group.label}</Text>

              {/* Ideal color swatch */}
              <View style={styles.idealRow}>
                <View style={[styles.idealChip, { backgroundColor: group.idealHex }]}/>
                <Text style={styles.idealLabel}>Ideal: {group.idealHex.toUpperCase()}</Text>
              </View>

              {/* Fabric matches */}
              <View style={styles.chipsRow}>
                {(group.matches || []).slice(0, 3).map((match, mi) => (
                  <FabricMatchChip
                    key={mi}
                    color={match}
                    onPress={() => onFabricPress && onFabricPress(match)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: N2.white,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: N2.lightBorder,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: N2.darkText,
  },
  technical: {
    fontSize: 11,
    color: N2.midGray,
    marginTop: 1,
  },
  previewStrip: {
    flexDirection: 'row',
    gap: 3,
  },
  previewChip: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  chevron: {
    fontSize: 11,
    color: N2.midGray,
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    color: N2.midGray,
    fontStyle: 'italic',
    lineHeight: 17,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 0.5,
    borderTopColor: N2.lightBorder,
    paddingTop: 10,
  },
  divider: {
    height: 0.5,
    backgroundColor: N2.lightBorder,
    marginBottom: 12,
  },
  matchesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  matchGroup: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: N2.deepPlum,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  idealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  idealChip: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  idealLabel: {
    fontSize: 11,
    color: N2.midGray,
    fontFamily: 'monospace',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
