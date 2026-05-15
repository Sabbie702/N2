import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calcBorders } from '../../utils/calculatorMath';
import COLORS from '../../styles/colors';

export default function BorderCalc({ navigation }) {
  const insets = useSafeAreaInsets();
  const [centerW, setCenterW] = useState('');
  const [centerH, setCenterH] = useState('');
  const [border1, setBorder1] = useState('');
  const [border2, setBorder2] = useState('');
  const [mitered, setMitered] = useState(false);
  const [result, setResult] = useState(null);

  function calculate() {
    const cw = parseFloat(centerW);
    const ch = parseFloat(centerH);
    const b1 = parseFloat(border1);
    if (!cw || !ch || cw <= 0 || ch <= 0 || !b1 || b1 <= 0) {
      alert('Please enter valid quilt center dimensions and at least Border 1 width.');
      return;
    }
    const borders = [b1];
    const b2 = parseFloat(border2);
    if (b2 && b2 > 0) borders.push(b2);
    setResult(calcBorders(cw, ch, borders, mitered));
  }

  function reset() {
    setCenterW('');
    setCenterH('');
    setBorder1('');
    setBorder2('');
    setMitered(false);
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
          <Text style={s.headerTitle}>Border Yardage</Text>
          <Text style={s.headerSub}>Quilts Only</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.card}>
          <Text style={s.sectionHead}>Quilt Center (before borders)</Text>

          <Text style={s.label}>Center Width (inches)</Text>
          <TextInput
            style={s.input}
            value={centerW}
            onChangeText={setCenterW}
            placeholder="e.g. 48"
            placeholderTextColor="rgba(45,27,78,0.3)"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={s.label}>Center Length (inches)</Text>
          <TextInput
            style={s.input}
            value={centerH}
            onChangeText={setCenterH}
            placeholder="e.g. 60"
            placeholderTextColor="rgba(45,27,78,0.3)"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <View style={s.dividerLight} />
          <Text style={s.sectionHead}>Border Widths</Text>

          <Text style={s.label}>Border 1 — Inner (inches)</Text>
          <TextInput
            style={s.input}
            value={border1}
            onChangeText={setBorder1}
            placeholder="e.g. 3"
            placeholderTextColor="rgba(45,27,78,0.3)"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={s.label}>Border 2 — Outer (inches, optional)</Text>
          <TextInput
            style={s.input}
            value={border2}
            onChangeText={setBorder2}
            placeholder="Leave blank for 1 border"
            placeholderTextColor="rgba(45,27,78,0.3)"
            keyboardType="numeric"
            returnKeyType="done"
          />

          <View style={s.toggleRow}>
            <View>
              <Text style={s.toggleLabel}>Mitered corners?</Text>
              <Text style={s.toggleHint}>Uses more fabric than butted corners</Text>
            </View>
            <Switch
              value={mitered}
              onValueChange={setMitered}
              trackColor={{ false: '#E5DCEF', true: COLORS.MINT }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity style={s.btn} onPress={calculate} activeOpacity={0.85}>
          <Ionicons name="calculator-outline" size={20} color="#fff" />
          <Text style={s.btnTxt}>Calculate</Text>
        </TouchableOpacity>

        {result && (
          <View style={s.resultCard}>
            <Text style={s.resultTitle}>Your Results</Text>
            <Text style={s.resultNote}>
              Each border calculated separately — use different fabrics if you like
            </Text>

            {result.map((r, i) => (
              <View key={i} style={s.resultRow}>
                <View style={[
                  s.resultIcon,
                  { backgroundColor: i === 0 ? COLORS.DEEP_PLUM : COLORS.SOFT_LAVENDER },
                ]}>
                  <Ionicons name="crop-outline" size={18} color="#fff" />
                </View>
                <View style={s.resultTextWrap}>
                  <Text style={s.resultLabel}>
                    Border {i + 1} — {r.borderWidth}″ wide
                    {mitered ? ' (mitered)' : ' (butted)'}
                  </Text>
                  <Text style={s.resultValue}>{r.yardsNeeded} yards</Text>
                </View>
              </View>
            ))}

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

  sectionHead: {
    fontSize: 11, fontFamily: 'Inter_700Bold',
    color: COLORS.DEEP_PLUM, marginBottom: 12,
    letterSpacing: 0.5, textTransform: 'uppercase',
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
    color: COLORS.MIDNIGHT, marginBottom: 4,
  },
  resultNote: {
    fontSize: 12, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.45)', marginBottom: 16, lineHeight: 17,
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
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 8, paddingVertical: 10,
  },
  resetTxt: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    color: COLORS.DEEP_PLUM,
  },
});
