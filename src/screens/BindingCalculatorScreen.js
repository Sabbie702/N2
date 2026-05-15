// BindingCalculatorScreen.js
// Calculates double-fold straight-grain binding yardage.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { calcBinding } from '../utils/calculatorMath';
import COLORS from '../styles/colors';

const PRESETS = [
  { label: 'Baby (36×46")',   w: 36,  h: 46  },
  { label: 'Throw (60×80")', w: 60,  h: 80  },
  { label: 'Queen (90×108")',w: 90,  h: 108 },
  { label: 'King (108×108")',w: 108, h: 108 },
];

function Field({ label, value, onChangeText, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <TextInput
        style={[f.input, focused && f.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder={hint}
        placeholderTextColor="rgba(45,27,78,0.3)"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

export default function BindingCalculatorScreen() {
  const [quiltW,     setQuiltW]     = useState('');
  const [quiltH,     setQuiltH]     = useState('');
  const [stripWidth, setStripWidth] = useState('2.5');
  const [fabW,       setFabW]       = useState('44');
  const [result,     setResult]     = useState(null);

  function calculate() {
    const w  = parseFloat(quiltW);
    const h  = parseFloat(quiltH);
    const sw = parseFloat(stripWidth) || 2.5;
    const fw = parseFloat(fabW) || 44;
    if (!w || !h) return;
    setResult(calcBinding({ quiltWidth: w, quiltHeight: h, stripWidth: sw, fabricWidth: fw }));
  }

  function applyPreset(p) {
    setQuiltW(String(p.w));
    setQuiltH(String(p.h));
    setResult(null);
  }

  return (
    <SafeAreaView style={s.outer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          <Text style={s.sectionLabel}>QUILT SIZE PRESETS</Text>
          <View style={s.presets}>
            {PRESETS.map(p => (
              <TouchableOpacity key={p.label} style={s.preset} onPress={() => applyPreset(p)} activeOpacity={0.75}>
                <Text style={s.presetText}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.sectionLabel}>MEASUREMENTS (INCHES)</Text>
          <View style={s.card}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Field label="Quilt Width" value={quiltW} onChangeText={v => { setQuiltW(v); setResult(null); }} hint="e.g. 60" />
              </View>
              <View style={s.rowGap} />
              <View style={{ flex: 1 }}>
                <Field label="Quilt Height" value={quiltH} onChangeText={v => { setQuiltH(v); setResult(null); }} hint="e.g. 80" />
              </View>
            </View>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Field label="Strip Width" value={stripWidth} onChangeText={v => { setStripWidth(v); setResult(null); }} hint="2.5" />
              </View>
              <View style={s.rowGap} />
              <View style={{ flex: 1 }}>
                <Field label="Fabric Width" value={fabW} onChangeText={v => { setFabW(v); setResult(null); }} hint="44" />
              </View>
            </View>
          </View>

          <TouchableOpacity style={s.btn} onPress={calculate} activeOpacity={0.85}>
            <Text style={s.btnText}>Calculate</Text>
          </TouchableOpacity>

          {result && (
            <View style={s.result}>
              <Text style={s.resultTitle}>Binding Plan</Text>
              <View style={s.resultRow}>
                <Text style={s.resultLabel}>Total binding length</Text>
                <Text style={s.resultVal}>{result.totalBinding}"</Text>
              </View>
              <View style={s.resultRow}>
                <Text style={s.resultLabel}>Strips to cut</Text>
                <Text style={s.resultVal}>{result.stripsNeeded}</Text>
              </View>
              <View style={[s.resultRow, s.resultHighlight]}>
                <Text style={s.resultLabel}>Total yardage</Text>
                <Text style={[s.resultVal, { color: COLORS.MINT, fontSize: 22 }]}>
                  {result.yards} yds
                </Text>
              </View>
              <Text style={s.note}>
                Based on double-fold binding, joined on the bias. Cut strips at {stripWidth}".
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const f = StyleSheet.create({
  wrap:         { marginBottom: 14 },
  label:        { fontSize: 12, fontWeight: '600', color: COLORS.DEEP_PLUM, marginBottom: 6, letterSpacing: 0.2 },
  input:        {
    borderWidth: 1.5, borderColor: '#E5DCEF',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: COLORS.MIDNIGHT, backgroundColor: '#fff',
  },
  inputFocused: { borderColor: COLORS.DEEP_PLUM },
});

const s = StyleSheet.create({
  outer:  { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  scroll: { padding: 16, paddingBottom: 48 },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: 'rgba(91,45,142,0.6)',
    letterSpacing: 1.2, marginBottom: 10, marginTop: 4,
  },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  preset: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#fff', borderRadius: 999,
    borderWidth: 1.5, borderColor: '#E5DCEF',
  },
  presetText: { fontSize: 12, fontWeight: '600', color: COLORS.DEEP_PLUM },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
  },
  row:    { flexDirection: 'row' },
  rowGap: { width: 12 },

  btn: {
    backgroundColor: COLORS.DEEP_PLUM, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 20,
    shadowColor: COLORS.DEEP_PLUM,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  result: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
  },
  resultTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18, fontWeight: '700', color: COLORS.MIDNIGHT, marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  resultHighlight: { marginTop: 4, borderBottomWidth: 0 },
  resultLabel: { fontSize: 14, color: 'rgba(45,27,78,0.7)' },
  resultVal:   { fontSize: 17, fontWeight: '700', color: COLORS.MIDNIGHT },
  note:        { fontSize: 11, color: 'rgba(45,27,78,0.45)', marginTop: 10, lineHeight: 16 },
});
