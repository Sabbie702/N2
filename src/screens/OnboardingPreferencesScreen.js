// OnboardingPreferencesScreen.js — "What are you most excited to use Nimble Needle for?"
// 2×2 multi-select card grid.

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../styles/colors';

const PLUM     = COLORS.DEEP_PLUM;
const MIDNIGHT = COLORS.MIDNIGHT;
const MINT     = COLORS.MINT;
const THREAD   = 'rgba(124,75,215,0.55)';
const { width: SW } = Dimensions.get('window');

const PREFS = [
  { id: 'quilt',    label: 'Track Quilt\nProjects',  icon: 'grid-outline',   iconFill: 'grid' },
  { id: 'bag',      label: 'Track Bag\nProjects',    icon: 'bag-outline',    iconFill: 'bag' },
  { id: 'stash',    label: 'Manage My\nStash',       icon: 'layers-outline', iconFill: 'layers' },
  { id: 'inspired', label: 'Get\nInspired',          icon: 'sparkles-outline', iconFill: 'sparkles' },
];

function ThreadCurveBottomLeft() {
  return (
    <Svg
      viewBox="0 0 220 260"
      style={{ position: 'absolute', bottom: -10, left: 50, width: 220, height: 260, zIndex: 0 }}
      pointerEvents="none"
    >
      <Path
        d="M 100 -10 C 90 50, 50 90, 20 140 C -5 180, 30 220, 90 260"
        fill="none"
        stroke={THREAD}
        strokeWidth={1.6}
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const CARD_SIZE = (SW - 24 * 2 - 14) / 2;

export default function OnboardingPreferencesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { onComplete } = route.params || {};
  const [selected, setSelected] = useState({ quilt: true, bag: true, stash: true, inspired: false });
  const toggle = id => setSelected(s => ({ ...s, [id]: !s[id] }));
  const anySelected = Object.values(selected).some(Boolean);

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      <ThreadCurveBottomLeft />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.heading}>What are you most{'\n'}excited to use Nimble{'\n'}Needle for?</Text>
        <Text style={s.sub}>Choose all that apply</Text>

        <View style={s.grid}>
          {PREFS.map(p => {
            const on = selected[p.id];
            return (
              <TouchableOpacity
                key={p.id}
                style={[s.card, { width: CARD_SIZE, height: CARD_SIZE * 1.02 }, on && s.cardSelected]}
                onPress={() => toggle(p.id)}
                activeOpacity={0.85}
              >
                {/* Checkbox top-right */}
                <View style={[s.checkbox, on && s.checkboxOn]}>
                  {on && (
                    <Svg width={16} height={16} viewBox="0 0 18 18">
                      <Path
                        d="M3.5 9.5l3.5 3.5L14.5 5.5"
                        stroke="#fff"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </View>

                {/* Icon centred */}
                <View style={s.cardIcon}>
                  <Ionicons
                    name={on ? p.iconFill : p.icon}
                    size={40}
                    color={on ? PLUM : 'rgba(91,45,142,0.4)'}
                  />
                </View>

                {/* Label pinned to bottom */}
                <Text style={[s.cardLabel, on && s.cardLabelOn]}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[s.primaryBtn, !anySelected && s.primaryBtnDisabled]}
          onPress={() => navigation.navigate('Success', { onComplete })}
          activeOpacity={0.85}
        >
          <Text style={s.primaryBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FBF8FE' },
  scroll: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 },

  heading: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28, fontWeight: '700', lineHeight: 36,
    color: MIDNIGHT,
    textAlign: 'center', letterSpacing: -0.5,
    marginBottom: 10,
  },
  sub: { fontSize: 14, color: 'rgba(45,27,78,0.55)', textAlign: 'center', marginBottom: 26 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    marginBottom: 26,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(91,45,142,0.18)',
    padding: 14,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2D1B4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardSelected: {
    borderColor: PLUM,
    shadowOpacity: 0.16, shadowRadius: 18, elevation: 5,
  },

  checkbox: {
    position: 'absolute', top: 10, right: 10,
    width: 28, height: 28, borderRadius: 6,
    borderWidth: 1.5, borderColor: 'rgba(124,75,215,0.45)',
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: PLUM,
    borderWidth: 0,
  },

  cardIcon: {
    flex: 1,
    alignItems: 'center', justifyContent: 'center',
    width: '100%',
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 14, fontWeight: '700',
    color: MIDNIGHT,
    textAlign: 'center', lineHeight: 20,
    letterSpacing: -0.2,
    paddingBottom: 4,
  },
  cardLabelOn: { color: PLUM },

  primaryBtn: {
    backgroundColor: PLUM,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: PLUM,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
});
