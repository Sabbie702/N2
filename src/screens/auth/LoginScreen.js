import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import COLORS from '../../styles/colors';

const SOCIAL_APPLE = require('../../../assets/images/social_apple.png');
const SOCIAL_GOOGLE = require('../../../assets/images/social_google.png');
const SOCIAL_FACEBOOK = require('../../../assets/images/social_facebook.png');

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      let msg = 'Something went wrong. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      }
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert('Reset Password', 'Please enter your email address first, then tap Forgot Password.');
      return;
    }
    Alert.alert(
      'Reset Password',
      `Send password reset email to ${email.trim()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              await resetPassword(email.trim());
              Alert.alert('Email Sent', 'Check your inbox for password reset instructions.');
            } catch {
              Alert.alert('Error', 'Could not send reset email. Please check your email address.');
            }
          },
        },
      ],
    );
  };

  const comingSoon = (provider) => Alert.alert('Coming Soon', `${provider} login will be available in a future update.`);

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[s.container, { paddingTop: insets.top }]}
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

        <Text style={s.title}>Welcome Back!</Text>
        <Text style={s.subtitle}>Log in to continue your creative journey</Text>

        {/* Email */}
        <Text style={s.label}>Email</Text>
        <View style={s.inputWrap}>
          <Ionicons name="mail-outline" size={20} color={COLORS.SOFT_LAVENDER} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder="your@email.com"
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
            placeholder="Enter your password"
            placeholderTextColor="rgba(45,27,78,0.35)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={COLORS.SOFT_LAVENDER} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleForgotPassword} style={s.forgotRow}>
          <Text style={s.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login button */}
        <TouchableOpacity
          style={[s.primaryBtn, !canSubmit && s.primaryBtnDisabled]}
          onPress={handleLogin}
          disabled={loading || !canSubmit}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.primaryBtnText}>Log In</Text>
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

        {/* Create account link */}
        <View style={s.footerRow}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('CreateAccount')}>
            <Text style={s.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(192,132,252,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 12, marginBottom: 20,
  },

  title: {
    fontSize: 28, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.5, marginBottom: 8,
  },
  subtitle: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.6)', marginBottom: 32,
  },

  label: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    color: COLORS.MIDNIGHT, marginBottom: 8, marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16, borderWidth: 1.5,
    borderColor: 'rgba(192,132,252,0.25)',
    marginBottom: 16, paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1, height: 52,
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: COLORS.MIDNIGHT,
  },
  eyeBtn: { padding: 6 },

  forgotRow: { alignSelf: 'flex-end', marginBottom: 28, marginTop: -4 },
  forgotText: {
    fontSize: 14, fontFamily: 'Inter_600SemiBold',
    color: COLORS.DEEP_PLUM,
  },

  primaryBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 28, paddingVertical: 16,
    alignItems: 'center', marginBottom: 28,
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
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: 'rgba(192,132,252,0.2)',
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
