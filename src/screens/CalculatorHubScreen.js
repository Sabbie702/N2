// CalculatorHubScreen.js — Quilt Calculator entry point.
// Lists the four calculators; tapping one navigates into it.

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../styles/colors';

const CALCS = [
  {
    screen: 'BlockCalculator',
    icon:   'grid-outline',
    color:  COLORS.DEEP_PLUM,
    title:  'Block Calculator',
    sub:    'How many blocks for your quilt size',
  },
  {
    screen: 'YardageCalculator',
    icon:   'layers-outline',
    color:  '#7C3ABF',
    title:  'Yardage Calculator',
    sub:    'Fabric needed for identical cut pieces',
  },
  {
    screen: 'BackingCalculator',
    icon:   'expand-outline',
    color:  '#4aad85',
    title:  'Backing Calculator',
    sub:    'Yardage for quilt backing with overlap',
  },
  {
    screen: 'BindingCalculator',
    icon:   'git-commit-outline',
    color:  '#a78bfa',
    title:  'Binding Calculator',
    sub:    'Double-fold straight-grain binding yardage',
  },
];

export default function CalculatorHubScreen({ navigation }) {
  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.intro}>
          Enter your measurements and get accurate yardage every time.
        </Text>

        {CALCS.map(c => (
          <TouchableOpacity
            key={c.screen}
            style={s.card}
            onPress={() => navigation.navigate(c.screen)}
            activeOpacity={0.85}
          >
            <View style={[s.iconWrap, { backgroundColor: c.color + '1A' }]}>
              <Ionicons name={c.icon} size={28} color={c.color} />
            </View>
            <View style={s.cardText}>
              <Text style={s.cardTitle}>{c.title}</Text>
              <Text style={s.cardSub}>{c.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(45,27,78,0.3)" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  scroll:    { padding: 16, paddingBottom: 40 },

  intro: {
    fontSize: 14, color: 'rgba(45,27,78,0.65)',
    lineHeight: 20, marginBottom: 20,
  },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 12,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  cardText:  { flex: 1 },
  cardTitle: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 16, fontWeight: '600',
    color: COLORS.MIDNIGHT, marginBottom: 3,
  },
  cardSub: {
    fontSize: 12, color: 'rgba(45,27,78,0.6)', lineHeight: 17,
  },
});
