// src/screens/SettingsScreen.js — placeholder for V1

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../styles/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚙️</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sub}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.DEEP_PLUM, marginBottom: 6 },
  sub: { fontSize: 14, color: '#6b6b8a' },
});
