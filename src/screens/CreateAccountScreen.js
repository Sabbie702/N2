// CreateAccountScreen.js — sign-up form.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../styles/colors';

const PLUM     = COLORS.DEEP_PLUM;
const MIDNIGHT = COLORS.MIDNIGHT;
const MINT     = COLORS.MINT;
const THREAD   = 'rgba(124,75,215,0.55)';

function ThreadCurveTopRight() {
  return (
    <Svg
      viewBox="0 0 160 200"
      style={{ position: 'absolute', top: 88, right: -2, width: 160, height: 200, zIndex: 0 }}
      pointerEvents="none"
    >
      <Path
        d="M 165 5 C 100 25, 80 90, 110 130 C 130 160, 150 175, 170 195"
        fill="none"
        stroke={THREAD}
        strokeWidth={1.6}
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function InputField({ label, icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.fieldWrap}>
      <Text style={f.label}>{label}</Text>
      <View style={[f.inputRow, focused && f.inputRowFocused]}>
        {icon && <Ionicons name={icon} size={18} color="rgba(91,45,142,0.6)" style={f.icon} />}
        <TextInput
          style={f.input}
          placeholder={placeholder}
          placeholderTextColor="#B0A8C4"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

function SocialButton({ label }) {
  return (
    <TouchableOpacity style={f.socialBtn} activeOpacity={0.8}>
      <Text style={f.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function CreateAccountScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { onComplete } = route.params || {};
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');

  const reqs = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'One uppercase letter',  ok: /[A-Z]/.test(pw) },
    { label: 'One number or symbol',  ok: /[\d\W]/.test(pw) },
  ];
  const allMet = reqs.every(r => r.ok);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[s.root, { paddingTop: insets.top }]}>
        <ThreadCurveTopRight />

        <TouchableOpacity
          style={[s.backBtn, { top: insets.top + 12 }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color={MIDNIGHT} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.heading}>Create Account</Text>
          <Text style={s.sub}>Let's get started!</Text>

          <View style={s.form}>
            <InputField
              label="Full Name"
              icon="person-outline"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <InputField
              label="Email Address"
              icon="mail-outline"
              placeholder="you@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              value={pw}
              onChangeText={setPw}
              secureTextEntry
            />

            {pw.length > 0 && (
              <View style={s.reqsBox}>
                {reqs.map(r => (
                  <View key={r.label} style={s.reqRow}>
                    <Ionicons
                      name={r.ok ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={16}
                      color={r.ok ? MINT : 'rgba(45,27,78,0.35)'}
                    />
                    <Text style={[s.reqText, r.ok && s.reqTextOk]}>{r.label}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[s.primaryBtn, !allMet && s.primaryBtnDisabled]}
              onPress={() => navigation.navigate('Onboarding', { onComplete })}
              activeOpacity={0.85}
            >
              <Text style={s.primaryBtnText}>Create Account</Text>
            </TouchableOpacity>

            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerLabel}>or continue with</Text>
              <View style={s.dividerLine} />
            </View>

            <View style={s.socialRow}>
              <SocialButton label="Apple" />
              <SocialButton label="Google" />
              <SocialButton label="Facebook" />
            </View>

            <View style={s.switchRow}>
              <Text style={s.switchText}>Already have an account?{'  '}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login', { onComplete })}>
                <Text style={s.switchLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FBF8FE' },
  backBtn: {
    position: 'absolute', left: 18,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(91,45,142,0.08)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  scroll: { paddingHorizontal: 24, paddingTop: 58, paddingBottom: 40 },
  heading: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32, fontWeight: '700',
    color: MIDNIGHT,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  sub: { fontSize: 14, color: 'rgba(45,27,78,0.55)', textAlign: 'center', marginBottom: 24 },
  form: { gap: 14 },

  reqsBox: { gap: 6, marginTop: -2 },
  reqRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqText: { fontSize: 13, color: 'rgba(45,27,78,0.4)' },
  reqTextOk: { color: MINT },

  primaryBtn: {
    backgroundColor: PLUM,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: PLUM,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(45,27,78,0.10)' },
  dividerLabel: { fontSize: 12, color: 'rgba(45,27,78,0.4)' },

  socialRow: { flexDirection: 'row', gap: 12 },

  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  switchText: { fontSize: 13, color: 'rgba(45,27,78,0.55)' },
  switchLink: { fontSize: 13, fontWeight: '700', color: PLUM, textDecorationLine: 'underline' },
});

const f = StyleSheet.create({
  fieldWrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: MIDNIGHT },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#E5DCEF',
    paddingHorizontal: 14, height: 52,
  },
  inputRowFocused: { borderWidth: 1.5, borderColor: PLUM },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: MIDNIGHT },
  socialBtn: {
    flex: 1, height: 50,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#E5DCEF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2D1B4E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
  },
  socialLabel: { fontSize: 13, fontWeight: '600', color: MIDNIGHT },
});
