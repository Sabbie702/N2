import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WelcomeSplashBackground } from '../../components/auth/AuthAssets';
import COLORS from '../../styles/colors';

const LOGO = require('../../../assets/images/logo.png');

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <View style={StyleSheet.absoluteFill}>
        <WelcomeSplashBackground />
        <View style={s.overlay} />
      </View>

      <View style={[s.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
        <View style={s.brandSection}>
          <View style={s.logoWrap}>
            <Image source={LOGO} style={s.logo} resizeMode="cover" />
          </View>
          <Text style={s.appName}>Nimble Needle</Text>
          <Text style={s.tagline}>Your creative projects,{'\n'}all in one place</Text>
        </View>

        <View style={s.buttonSection}>
          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={s.primaryBtnText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.secondaryBtn}
            onPress={() => navigation.navigate('CreateAccount')}
            activeOpacity={0.85}
          >
            <Text style={s.secondaryBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.DEEP_PLUM },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45, 27, 78, 0.12)' },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  brandSection: { alignItems: 'center', marginTop: 44 },
  logoWrap: {
    width: 122,
    height: 122,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },
  logo: { width: 132, height: 132, transform: [{ scale: 1.03 }] },
  appName: {
    fontSize: 35,
    fontFamily: 'PlayfairDisplay_900Black',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: COLORS.MINT,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonSection: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.MINT,
    borderRadius: 14,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: COLORS.MIDNIGHT,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.68)',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
});
