// src/components/SavedPaletteCard.js
// N2 — Color Wheel Intelligence
// Displays a saved palette inside the project workspace
// with Resume editing and Remove actions

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND = {
  plum: '#5B2D8E',
  card: '#f7f7f7',
  lt: '#1a1a2e',
  mu: '#6b6b8a',
  di: '#aaaabc',
  bo: 'rgba(0,0,0,0.09)',
};

/**
 * SavedPaletteCard
 *
 * Props:
 *   palette       {object}   The saved palette object
 *     .colors     {string[]} Array of hex strings
 *     .type       {string}   Palette type label e.g. 'Fabric Sisters'
 *     .savedAt    {Date}
 *     .updatedAt  {Date|null}
 *   onResumeEdit  {() => void}   Navigate back to ColorWheelScreen with palette
 *   onRemove      {() => void}   Remove this palette from the project
 */
export function SavedPaletteCard({ palette, onResumeEdit, onRemove }) {
  const dateLabel = palette.updatedAt
    ? `Updated ${formatDate(palette.updatedAt)}`
    : `Saved ${formatDate(palette.savedAt)}`;

  return (
    <View style={styles.card}>
      {/* Top: swatches + meta */}
      <View style={styles.top}>
        <View style={styles.swatches}>
          {palette.colors.map((hex, i) => (
            <View
              key={i}
              style={[styles.swatch, { backgroundColor: hex }]}
            />
          ))}
        </View>
        <View style={styles.meta}>
          <Text style={styles.typeLabel}>{palette.type}</Text>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.action, styles.actionLeft]}
          onPress={onResumeEdit}
          activeOpacity={0.8}
        >
          <Ionicons name="pencil" size={11} color={BRAND.plum} />
          <Text style={styles.actionTextPrimary}>Resume editing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={11} color="#dc2626" />
          <Text style={styles.actionTextDanger}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: BRAND.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND.bo,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    paddingHorizontal: 12,
  },
  swatches: {
    flexDirection: 'row',
    gap: 3,
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  meta: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: BRAND.lt,
  },
  dateLabel: {
    fontSize: 9,
    color: BRAND.di,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: BRAND.bo,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
  },
  actionLeft: {
    borderRightWidth: 1,
    borderRightColor: BRAND.bo,
  },
  actionTextPrimary: {
    fontSize: 10,
    fontWeight: '500',
    color: BRAND.plum,
  },
  actionTextDanger: {
    fontSize: 10,
    fontWeight: '500',
    color: '#dc2626',
  },
});
