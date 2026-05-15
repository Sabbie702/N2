import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calcBinding } from '../../utils/calculatorMath';
import COLORS from '../../styles/colors';

const STRIP_OPTS = ['2.0″', '2.25″', '2.5″', '2.75″', '3.0″'];
const STRIP_WIDTHS = [2.0, 2.25, 2.5, 2.75, 3.0];

export default function BindingCalc({ navigation }) {
  const insets = useSafeAreaInsets();
  const [quiltW, setQuiltW] = useState('');
  const [quiltH, setQuiltH] = useState('');
  const [stripIdx, setStripIdx] = useState(2);
  const [result, setResult] = useState(null);

  function calculate() {
    const w = parseFloat(quiltW);
    const h = parseFloat(quiltH);
    if (!w || !h || w <= 0 || h <= 0) {
      alert('Please enter valid quilt dimensions.');
      return;
    }
    setResult(calcBinding(w, h, STRIP_WIDTHS[stripIdx]));
  }

  function reset() {
    setQuiltW('');
    setQuiltH('');
    setStripIdx(2);
    setResult(null);
  }

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
          <Text style={s.headerTitle}>Binding Calculator</Text>
          <Text style={s.headerSub}>Quilts + Bags</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.card}>
          <Text style={s.label}>Finished Quilt Width (inches)</Text>
          <TextInput
            style={s.input}
            value={quiltW}
            onChangeText={setQuiltW}
            placeholder="e.g. 60"
            placeholderTextColor="rgba(45,27,78,0.3)"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={s.label}>Finished Quilt Length (inches)</Text>
          <TextInput
            style={s.input}
            value={quiltH}
            onChangeText={setQuiltH}
            placeholder="e.g. 72"
            placeholderTextColor="rgba(45,27,78,0.3)"
            keyboardType="numeric"
            returnKeyType="done"
          />

          <Text style={s.label}>Binding Strip Cut Width</Text>
          <View style={s.chipRow}>
            {STRIP_OPTS.map((opt, i) => (
              <TouchableOpacity
                key={opt}
                style={[s.chip, i === stripIdx && s.chipActive]}
                onPress={() => setStripIdx(i)}
                activeOpacity={0.8}
              >
                <Text style={[s.chipTxt, i === stripIdx && s.chipTxtActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.hint}>Most quilters use 2.5″ for double-fold binding</Text>
        </View>

        <TouchableOpacity style={s.btn} onPress={calculate} activeOpacity={0.85}>
          <Ionicons name="calculator-outline" size={20} color="#fff" />
          <Text style={s.btnTxt}>Calculate</Text>
        </TouchableOpacity>

        {result && (
          <View style={s.resultCard}>
            <Text style={s.resultTitle}>Your Results</Text>

            <View style={s.resultRow}>
              <View style={[s.resultIcon, { backgroundColor: COLORS.MINT }]}>
                <Ionicons name="swap-horizontal-outline" size={18} color="#fff" />
              </View>
              <View style={s.resultTextWrap}>
                <Text style={s.resultLabel}>Total binding needed</Text>
                <Text style={s.resultValue}>{result.totalLength}″</Text>
              </View>
            </View>

            <View style={s.resultRow}>
              <View style={[s.resultIcon, { backgroundColor: COLORS.SOFT_LAVENDER }]}>
                <Ionicons name="cut-outline" size={18} color="#fff" />
              </View>
              <View style={s.resultTextWrap}>
                <Text style={s.resultLabel}>Strips to cut</Text>
                <Text style={s.resultValue}>
                  {result.numStrips} strips × {STRIP_OPTS[stripIdx]}
                </Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.resultRow}>
              <View style={[s.resultIcon, { backgroundColor: COLORS.DEEP_PLUM }]}>
                <Ionicons name="cart-outline" size={18} color="#fff" />
              </View>
              <View style={s.resultTextWrap}>
                <Text style={s.resultLabel}>Buy</Text>
                <Text style={s.resultValue}>
                  {result.yardsNeeded} yards of binding fabric
                </Text>
              </View>
            </View>

            <TouchableOpacity style={s.resetBtn} onPress={reset} activeOpacity={0.8}>
              <Ionicons name="refresh-outline" size={16} color={COLORS.DEEP_PLUM} />
              <Text style={s.resetTxt}>Start Over</Text>
            </TouchableOpacity>
          </View>
        )}
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

  label: {
    fontSize: 13, fontFamily: 'Inter_600SemiBold',
    color: 'rgba(45,27,78,0.7)', marginBottom: 6, lineHeight: 18,
  },
  input: {
    backgroundColor: '#fff', height: 48,
    borderRadius: 14, borderWidth: 1, borderColor: '#E5DCEF',
    paddingHorizontal: 14,
    fontSize: 16, fontFamily: 'Inter_400Regular',
    color: COLORS.MIDNIGHT, marginBottom: 16,
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
  hint: {
    fontSize: 12, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.45)', marginTop: 4,
  },

  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 48,
    backgroundColor: COLORS.DEEP_PLUM, borderRadius: 14,
    marginTop: 16, marginBottom: 20,
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 4,
  },
  btnTxt: {
    fontSize: 16, fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },

  resultCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: COLORS.MINT,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  resultTitle: {
    fontSize: 19, fontFamily: 'PlayfairDisplay_800ExtraBold',
    color: COLORS.MIDNIGHT, marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 14,
  },
  resultIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  resultTextWrap: { flex: 1 },
  resultLabel: {
    fontSize: 12, fontFamily: 'Inter_500Medium',
    color: 'rgba(45,27,78,0.5)',
  },
  resultValue: {
    fontSize: 15, fontFamily: 'Inter_600SemiBold',
    color: COLORS.MIDNIGHT, marginTop: 1,
  },
  divider: {
    height: 1, backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 6,
  },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 8, paddingVertical: 10,
  },
  resetTxt: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    color: COLORS.DEEP_PLUM,
  },
});
