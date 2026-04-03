// HomeScreen.js
// The landing screen — will show a dashboard with recent projects,
// quick-access buttons, and tips for quilters and bag makers.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../styles/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Nimble Needle</Text>
      <Text style={styles.subtitle}>Your quilting & bag-making companion</Text>
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
