// YardageCalculatorScreen.js
// Calculates fabric yardage for a given number of identical cut pieces.

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { calcYardage } from '../utils/calculatorMath';
import COLORS from '../styles/colors';

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

export default function YardageCalculatorScreen() {
  const [pieceW,  setPieceW]  = useState('');
  const [pieceH,  setPieceH]  = useState('');
  const [pieces,  setPieces]  = useState('');
  const [fabW,    setFabW]    = useState('44');
  const [seam,    setSeam]    = useState('0.25');
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');

  function calculate() {
    setError('');
    const pw = parseFloat(pieceW);
    const ph = parseFloat(pieceH);
    const n  = parseInt(pieces);
    const fw = parseFloat(fabW) || 44;
    const s  = parseFloat(seam) || 0.25;
    if (!pw || !ph || !n || n <= 0) return;
    const res = calcYardage({ pieceWidth: pw, pieceHeight: ph, numPieces: n, fabricWidth: fw, seamAllowance: s });
    if (!res) {
      setError('Piece is wider than the fabric — check your measurements.');
      setResult(null);
    } else {
      setResult(res);
    }
  }

  return (
    <SafeAreaView style={s.outer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          <Text style={s.sectionLabel}>PIECE DIMENSIONS (INCHES, UNFINISHED)</Text>
          <View style={s.card}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Field label="Piece Width" value={pieceW} onChangeText={v => { setPieceW(v); setResult(null); }} hint="e.g. 4.5" />
              </View>
              <View style={s.rowGap} />
              <View style={{ flex: 1 }}>
                <Field label="Piece Height" value={pieceH} onChangeText={v => { setPieceH(v); setResult(null); }} hint="e.g. 4.5" />
              </View>
            </View>
            <Field label="Number of Pieces" value={pieces} onChangeText={v => { setPieces(v); setResult(null); }} hint="e.g. 80" />
          </View>

          <Text style={s.sectionLabel}>FABRIC OPTIONS</Text>
          <View style={s.card}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Field label="Fabric Width (in)" value={fabW} onChangeText={v => { setFabW(v); setResult(null); }} hint="44" />
              </View>
              <View style={s.rowGap} />
              <View style={{ flex: 1 }}>
                <Field label="Seam Allowance" value={seam} onChangeText={v => { setSeam(v); setResult(null); }} hint="0.25" />
              </View>
            </View>
          </View>

          {!!error && <Text style={s.error}>{error}</Text>}

          <TouchableOpacity style={s.btn} onPress={calculate} activeOpacity={0.85}>
            <Text style={s.btnText}>Calculate</Text>
          </TouchableOpacity>

          {result && (
            <View style={s.result}>
              <Text style={s.resultTitle}>Fabric Needed</Text>
              <View style={s.resultRow}>
                <Text style={s.resultLabel}>Pieces per row</Text>
                <Text style={s.resultVal}>{result.piecesPerRow}</Text>
              </View>
              <View style={s.resultRow}>
                <Text style={s.resultLabel}>Rows to cut</Text>
                <Text style={s.resultVal}>{result.rowsNeeded}</Text>
              </View>
              <View style={[s.resultRow, s.resultHighlight]}>
                <Text style={s.resultLabel}>Buy at least</Text>
                <Text style={[s.resultVal, { color: COLORS.MINT, fontSize: 22 }]}>
                  {result.yards} yds
                </Text>
              </View>
              <Text style={s.note}>Includes a 10% cutting buffer.</Text>
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
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
  },
  row:    { flexDirection: 'row' },
  rowGap: { width: 12 },

  error: { color: '#ef4444', fontSize: 13, marginBottom: 12 },

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
  note:        { fontSize: 11, color: 'rgba(45,27,78,0.45)', marginTop: 10 },
});
