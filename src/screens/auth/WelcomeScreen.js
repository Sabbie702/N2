import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../../styles/colors';

const SPLASH_BG = require('../../../assets/images/splash_bg.png');
const LOGO = require('../../../assets/images/logo.png');

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <Image source={SPLASH_BG} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={[StyleSheet.absoluteFill, s.overlay]} />

      <View style={[s.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
        <View style={s.brandSection}>
          <Image source={LOGO} style={s.logo} resizeMode="contain" />
          <Text style={s.appName}>Nimble Needle</Text>
          <Text style={s.tagline}>Your creative projects,{'\n'}all in one place</Text>
        </View>

        <View style={s.buttonSection}>
          <TouchableOpacity
            style={s.loginBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.9}
          >
            <Text style={s.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.createBtn}
            onPress={() => navigation.navigate('CreateAccount')}
            activeOpacity={0.9}
          >
            <Text style={s.createBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DEEP_PLUM },
  overlay: { backgroundColor: 'rgba(91, 45, 142, 0.75)' },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  brandSection: { alignItems: 'center', marginTop: 60 },
  logo: { width: 120, height: 120, borderRadius: 30, marginBottom: 24 },
  appName: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_900Black',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: { width: '100%', gap: 14 },
  loginBtn: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginBtnText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: COLORS.DEEP_PLUM,
  },
  createBtn: {
    backgroundColor: 'transparent',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
});
