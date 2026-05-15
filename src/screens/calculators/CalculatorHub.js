import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../../styles/colors';

const CALCS = [
  {
    key: 'BackingBatting',
    icon: 'layers-outline',
    title: 'Backing & Batting',
    subtitle: 'How much fabric for the back + what batting size to buy',
    iconBg: COLORS.DEEP_PLUM,
    ready: true,
  },
  {
    key: 'Binding',
    icon: 'git-commit-outline',
    title: 'Binding',
    subtitle: 'Exactly how much fabric to make binding strips',
    iconBg: COLORS.MINT,
    ready: true,
  },
  {
    key: 'BorderYardage',
    icon: 'crop-outline',
    title: 'Border Yardage',
    subtitle: 'Fabric needed for inner and outer borders',
    iconBg: COLORS.SOFT_LAVENDER,
    ready: true,
  },
  {
    key: 'BedQuiltSizes',
    icon: 'bed-outline',
    title: 'Bed Quilt Sizes',
    subtitle: 'Standard mattress sizes + recommended quilt sizes',
    iconBg: '#F4C542',
    ready: true,
  },
];

export default function CalculatorHub({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.MIDNIGHT} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Quilting Calculators</Text>
      </View>

      <Text style={s.intro}>
        Quick answers to the calculations every quilter needs — no project or stash connection required.
      </Text>

      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
      >
        {CALCS.map((calc) => (
          <TouchableOpacity
            key={calc.key}
            style={[s.card, !calc.ready && s.cardDisabled]}
            activeOpacity={calc.ready ? 0.85 : 1}
            onPress={() => calc.ready && navigation.navigate(calc.key)}
          >
            <View style={[s.iconCircle, { backgroundColor: calc.iconBg }]}>
              <Ionicons name={calc.icon} size={24} color="#fff" />
            </View>
            <View style={s.cardText}>
              <Text style={s.cardTitle}>{calc.title}</Text>
              <Text style={s.cardSub}>{calc.subtitle}</Text>
            </View>
            {calc.ready ? (
              <Ionicons name="chevron-forward" size={20} color={COLORS.DEEP_PLUM} />
            ) : (
              <Text style={s.comingSoon}>Soon</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(192,132,252,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22, fontFamily: 'PlayfairDisplay_800ExtraBold',
    color: COLORS.MIDNIGHT,
  },
  intro: {
    fontSize: 16, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.6)',
    paddingHorizontal: 20, marginBottom: 16, lineHeight: 24,
  },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    padding: 16, gap: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardDisabled: { opacity: 0.5 },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 16, fontFamily: 'Inter_600SemiBold',
    color: COLORS.MIDNIGHT, marginBottom: 2,
  },
  cardSub: {
    fontSize: 13, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.55)', lineHeight: 18,
  },
  comingSoon: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold',
    color: COLORS.SOFT_LAVENDER,
    backgroundColor: 'rgba(192,132,252,0.12)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
});
