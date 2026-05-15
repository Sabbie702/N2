import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calcBedQuiltSize } from '../../utils/calculatorMath';
import COLORS from '../../styles/colors';

const BED_KEYS  = ['crib', 'twin', 'full', 'queen', 'king', 'calkng'];
const BED_NAMES = ['Crib', 'Twin', 'Full', 'Queen', 'King', 'Cal King'];
const DROP_OPTS = [8, 12, 21];
const DROP_LBLS = ['8″ Decorative', '12″ Standard', '21″ Floor Length'];

export default function BedQuiltSizes({ navigation }) {
  const insets = useSafeAreaInsets();
  const [bedIdx, setBedIdx] = useState(3);
  const [dropIdx, setDropIdx] = useState(1);
  const [pillow, setPillow] = useState(false);

  const result = calcBedQuiltSize(BED_KEYS[bedIdx], DROP_OPTS[dropIdx], pillow);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.MIDNIGHT} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>Bed Quilt Sizes</Text>
          <Text style={s.headerSub}>Quilts Only</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Bed Size Picker */}
        <View style={s.card}>
          <Text style={s.sectionHead}>Bed Size</Text>
          <View style={s.chipRow}>
            {BED_NAMES.map((nm, i) => (
              <TouchableOpacity
                key={nm}
                style={[s.chip, i === bedIdx && s.chipActive]}
                onPress={() => setBedIdx(i)}
                activeOpacity={0.8}
              >
                <Text style={[s.chipTxt, i === bedIdx && s.chipTxtActive]}>
                  {nm}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.dividerLight} />

          <Text style={s.sectionHead}>Drop Length</Text>
          <View style={s.chipRow}>
            {DROP_LBLS.map((lbl, i) => (
              <TouchableOpacity
                key={lbl}
                style={[s.chip, i === dropIdx && s.chipActive]}
                onPress={() => setDropIdx(i)}
                activeOpacity={0.8}
              >
                <Text style={[s.chipTxt, i === dropIdx && s.chipTxtActive]}>
                  {lbl}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.dividerLight} />

          <View style={s.toggleRow}>
            <View>
              <Text style={s.toggleLabel}>Add pillow tuck at top (+10″)?</Text>
              <Text style={s.toggleHint}>Extends quilt to fold over pillows</Text>
            </View>
            <Switch
              value={pillow}
              onValueChange={setPillow}
              trackColor={{ false: '#E5DCEF', true: COLORS.MINT }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Live Result */}
        {result && (
          <View style={s.resultCard}>
            <Text style={s.resultBed}>
              {result.bedName} — {DROP_OPTS[dropIdx]}″ Drop
            </Text>

            <View style={s.bigResult}>
              <Text style={s.bigLabel}>Make your quilt</Text>
              <Text style={s.bigValue}>
                {result.quiltWidth}″ × {result.quiltLength}″
              </Text>
            </View>

            <View style={s.divider} />

            <View style={s.detailRow}>
              <View style={[s.detailIcon, { backgroundColor: COLORS.SOFT_LAVENDER }]}>
                <Ionicons name="bed-outline" size={16} color="#fff" />
              </View>
              <Text style={s.detailTxt}>
                Mattress: {result.mattressW}″ × {result.mattressH}″
              </Text>
            </View>

            <View style={s.detailRow}>
              <View style={[s.detailIcon, { backgroundColor: COLORS.DEEP_PLUM }]}>
                <Ionicons name="arrow-expand-outline" size={16} color="#fff" />
              </View>
              <Text style={s.detailTxt}>
                Drop: {DROP_OPTS[dropIdx]}″ on each side + foot
              </Text>
            </View>

            {pillow && (
              <View style={s.detailRow}>
                <View style={[s.detailIcon, { backgroundColor: COLORS.MINT }]}>
                  <Ionicons name="add-outline" size={16} color="#fff" />
                </View>
                <Text style={s.detailTxt}>Includes 10″ pillow tuck at top</Text>
              </View>
            )}
          </View>
        )}

        {/* How it works */}
        <View style={s.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.SOFT_LAVENDER} />
          <Text style={s.infoTxt}>
            Drop is added to both sides and the foot. The top rests at the pillow line — no drop at the head.
          </Text>
        </View>
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
  headerSub: {
    fontSize: 11, fontFamily: 'Inter_700Bold',
    color: COLORS.SOFT_LAVENDER, marginTop: 2,
    letterSpacing: 0.5,
  },

  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },

  sectionHead: {
    fontSize: 11, fontFamily: 'Inter_700Bold',
    color: COLORS.DEEP_PLUM, marginBottom: 12,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },

  chipRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, backgroundColor: COLORS.LAVENDER_WHITE,
    borderWidth: 1, borderColor: '#E5DCEF',
  },
  chipActive: {
    backgroundColor: COLORS.DEEP_PLUM, borderColor: COLORS.DEEP_PLUM,
  },
  chipTxt: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    color: COLORS.MIDNIGHT,
  },
  chipTxtActive: { color: '#fff' },

  dividerLight: {
    height: 1, backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 12,
  },

  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 14, fontFamily: 'Inter_500Medium',
    color: COLORS.MIDNIGHT,
  },
  toggleHint: {
    fontSize: 12, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.45)', marginTop: 2,
  },

  resultCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginTop: 16,
    borderLeftWidth: 4, borderLeftColor: COLORS.MINT,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  resultBed: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    color: COLORS.DEEP_PLUM, marginBottom: 12,
  },
  bigResult: { alignItems: 'center', marginBottom: 16 },
  bigLabel: {
    fontSize: 13, fontFamily: 'Inter_500Medium',
    color: 'rgba(45,27,78,0.5)', marginBottom: 4,
  },
  bigValue: {
    fontSize: 30, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.5,
  },
  divider: {
    height: 1, backgroundColor: 'rgba(0,0,0,0.06)',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 10,
  },
  detailIcon: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  detailTxt: {
    fontSize: 14, fontFamily: 'Inter_400Regular',
    color: COLORS.MIDNIGHT,
  },

  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 8, marginTop: 16, padding: 14,
    backgroundColor: 'rgba(192,132,252,0.08)', borderRadius: 14,
  },
  infoTxt: {
    flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.6)', lineHeight: 18,
  },
});
