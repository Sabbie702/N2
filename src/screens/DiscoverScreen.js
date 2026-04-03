// DiscoverScreen.js
// Browse patterns, tutorials, and inspiration from the quilting and
// bag-making community. Find new techniques and project ideas.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../styles/colors';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Explore patterns, tutorials, and inspiration</Text>
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
