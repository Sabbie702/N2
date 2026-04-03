// ProfileScreen.js
// User profile, settings, and preferences — skill level, favorite styles,
// notification settings, and account management.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../styles/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your account, settings, and preferences</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LAVENDER_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.DEEP_PLUM,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.MIDNIGHT,
    textAlign: 'center',
  },
});
