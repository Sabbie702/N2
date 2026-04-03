// StashScreen.js
// Where users manage their fabric stash — scan barcodes, log yardage,
// add photos, and keep track of what they have on hand.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../styles/colors';

export default function StashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Stash</Text>
      <Text style={styles.subtitle}>Track your fabrics, notions, and supplies</Text>
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
