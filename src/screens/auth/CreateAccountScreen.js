import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import COLORS from '../../styles/colors';

const THREAD_BG = require('../../../assets/images/thread_flow_bg.png');
const SOCIAL_APPLE = require('../../../assets/images/social_apple.png');
const SOCIAL_GOOGLE = require('../../../assets/images/social_google.png');
const SOCIAL_FACEBOOK = require('../../../assets/images/social_facebook.png');

function PasswordCheck({ met, label }) {
  return (
    <View style={s.checkRow}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={met ? COLORS.MINT : 'rgba(45,27,78,0.3)'}
      />
      <Text style={[s.checkLabel, met && s.checkLabelMet]}>{label}</Text>
    </View>
  );
}

export default function CreateAccountScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);

  const allChecksMet = checks.length && checks.upper && checks.number && checks.special;
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && allChecksMet;

  const handleCreate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      navigation.replace('Preferences');
    } catch (err) {
      let msg = 'Something went wrong. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please make it stronger.';
      }
      Alert.alert('Account Creation Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const comingSoon = (provider) => Alert.alert('Coming Soon', `${provider} sign-up will be available in a future update.`);

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.container}>
        <Image source={THREAD_BG} style={s.threadBg} resizeMode="cover" />
        <ScrollView
          style={[s.scrollShell, { paddingTop: insets.top }]}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.MIDNIGHT} />
          </TouchableOpacity>

          <View style={s.headerBlock}>
            <Text style={s.title}>Create Account</Text>
            <Text style={s.subtitle}>Let's get started!</Text>
          </View>

          {/* Name */}
          <Text style={s.label}>Full Name</Text>
          <View style={s.inputWrap}>
            <Ionicons name="person-outline" size={20} color={COLORS.SOFT_LAVENDER} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Enter your name"
              placeholderTextColor="rgba(45,27,78,0.35)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          {/* Email */}
          <Text style={s.label}>Email Address</Text>
          <View style={s.inputWrap}>
            <Ionicons name="mail-outline" size={20} color={COLORS.SOFT_LAVENDER} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="you@email.com"
              placeholderTextColor="rgba(45,27,78,0.35)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password */}
          <Text style={s.label}>Password</Text>
          <View style={s.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.SOFT_LAVENDER} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Password"
              placeholderTextColor="rgba(45,27,78,0.35)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={COLORS.SOFT_LAVENDER} />
            </TouchableOpacity>
          </View>

          {/* Password requirements */}
          <View style={s.checksWrap}>
            <PasswordCheck met={checks.length} label="At least 8 characters" />
            <PasswordCheck met={checks.upper} label="One uppercase letter" />
            <PasswordCheck met={checks.number} label="One number or symbol" />
          </View>

          {/* Create button */}
          <TouchableOpacity
            style={[s.primaryBtn, !canSubmit && s.primaryBtnDisabled]}
            onPress={handleCreate}
            disabled={loading || !canSubmit}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.primaryBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or continue with</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={s.socialRow}>
            <TouchableOpacity style={s.socialBtn} onPress={() => comingSoon('Apple')} activeOpacity={0.85}>
              <Image source={SOCIAL_APPLE} style={s.socialIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={s.socialBtn} onPress={() => comingSoon('Google')} activeOpacity={0.85}>
              <Image source={SOCIAL_GOOGLE} style={s.socialIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={s.socialBtn} onPress={() => comingSoon('Facebook')} activeOpacity={0.85}>
              <Image source={SOCIAL_FACEBOOK} style={s.socialIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View style={s.footerRow}>
            <Text style={s.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={s.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  scrollShell: { flex: 1 },
  threadBg: {
    position: 'absolute',
    top: 0,
    right: -58,
    width: 260,
    height: 520,
    opacity: 0.45,
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(192,132,252,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 12, marginBottom: 20,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 26,
    paddingHorizontal: 8,
  },

  title: {
    fontSize: 28, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.5, marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.6)', textAlign: 'center',
  },

  label: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    color: COLORS.MIDNIGHT, marginBottom: 8, marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14, borderWidth: 1,
    borderColor: '#E5DCEF',
    marginBottom: 16, paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1, height: 52,
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: COLORS.MIDNIGHT,
  },
  eyeBtn: { padding: 6 },

  checksWrap: { marginBottom: 24, marginLeft: 4, gap: 6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkLabel: {
    fontSize: 13, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.45)',
  },
  checkLabelMet: { color: COLORS.MINT },

  primaryBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 14, minHeight: 54,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 4,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff',
  },

  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1, height: 1,
    backgroundColor: 'rgba(192,132,252,0.2)',
  },
  dividerText: {
    fontSize: 13, fontFamily: 'Inter_500Medium',
    color: 'rgba(45,27,78,0.4)', marginHorizontal: 14,
  },

  socialRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 20, marginBottom: 32,
  },
  socialBtn: {
    width: 60, height: 60, borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E5DCEF',
    alignItems: 'center', justifyContent: 'center',
  },
  socialIcon: { width: 28, height: 28 },

  footerRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.6)',
  },
  footerLink: {
    fontSize: 14, fontFamily: 'Inter_700Bold',
    color: COLORS.DEEP_PLUM,
  },
});
