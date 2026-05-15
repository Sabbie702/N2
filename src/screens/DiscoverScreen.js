import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../styles/colors';

const FEATURES = [
  {
    key: 'patterns',
    icon: 'book-outline',
    label: 'My Patterns',
    subtitle: 'Store & manage your pattern collection',
    screen: 'PatternList',
    tint: COLORS.DEEP_PLUM,
  },
];

export default function DiscoverScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
    >
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>
        Explore patterns, tutorials, and inspiration
      </Text>

      <View style={styles.grid}>
        {FEATURES.map(f => (
          <TouchableOpacity
            key={f.key}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(f.screen)}
          >
            <View style={[styles.iconWrap, { borderColor: f.tint + '40' }]}>
              <Ionicons name={f.icon} size={26} color={f.tint} />
            </View>
            <Text style={styles.cardLabel}>{f.label}</Text>
            <Text style={styles.cardSub} numberOfLines={2}>{f.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LAVENDER_WHITE,
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay-Bold',
    color: COLORS.DEEP_PLUM,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.SOFT_LAVENDER,
    fontFamily: 'Inter_500Medium',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    minHeight: 128,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: COLORS.MIDNIGHT,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 11,
    color: COLORS.SOFT_LAVENDER,
    lineHeight: 16,
  },
});
