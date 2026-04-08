// src/components/NoteCard.js
// Swipeable note card with coloured left border.
// Swipe left → red Delete button. No confirmation dialog per spec.

import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

// Border colours paired to each tint
export const NOTE_COLORS = [
  { tint: '#F5F0FA', border: '#C084FC', label: 'Lavender' },
  { tint: '#D4F5EB', border: '#4EC9A0', label: 'Mint' },
  { tint: '#EED9FF', border: '#5B2D8E', label: 'Plum' },
  { tint: '#FFF4D9', border: '#F59E0B', label: 'Amber' },
  { tint: '#FFE0E0', border: '#F87171', label: 'Rose' },
];

function borderForTint(tint) {
  return NOTE_COLORS.find(c => c.tint === tint)?.border || '#C084FC';
}

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }) + ' · ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
  });
}

/**
 * NoteCard
 *
 * Props:
 *   note          { id, text, color, projectName, createdAt }
 *   onDelete      () => void
 *   openSwipeRef  ref — set to this Swipeable so parent can close others
 *   onSwipeOpen   (ref) => void — called when this card opens, parent closes others
 */
export function NoteCard({ note, onDelete, onSwipeOpen }) {
  const swipeRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-76, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity style={styles.deleteAction} onPress={onDelete} activeOpacity={0.85}>
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      rightThreshold={38}
      overshootRight={false}
      onSwipeableOpen={() => onSwipeOpen && onSwipeOpen(swipeRef)}
    >
      <View style={[
        styles.card,
        { backgroundColor: note.color || '#F5F0FA' },
      ]}>
        {/* Coloured left border */}
        <View style={[styles.leftBorder, { backgroundColor: borderForTint(note.color) }]} />

        <View style={styles.body}>
          <Text style={styles.text}>{note.text}</Text>
          <View style={styles.footer}>
            {note.projectName ? (
              <Text style={styles.projectTag}>{note.projectName}</Text>
            ) : (
              <View />
            )}
            <Text style={styles.timestamp}>{formatTimestamp(note.createdAt)}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginVertical: 5,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#2D1B4E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  leftBorder: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: 12,
    paddingLeft: 12,
  },
  text: {
    fontSize: 14,
    color: '#2D1B4E',
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B2D8E',
  },
  timestamp: {
    fontSize: 11,
    color: '#aaaabc',
  },

  // Swipe delete
  deleteAction: {
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    marginVertical: 5,
    marginRight: 14,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
