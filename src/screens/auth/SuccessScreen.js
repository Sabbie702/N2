import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { SuccessCheckHero } from '../../components/auth/AuthAssets';
import COLORS from '../../styles/colors';

const THREAD_BG = require('../../../assets/images/thread_flow_bg.png');
const FABRIC_HERO = require('../../../assets/images/fabric_stack_hero.png');

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const { finishOnboarding } = useAuth();

  return (
    <View style={[s.container, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }]}>
      <Image source={THREAD_BG} style={s.threadBg} resizeMode="cover" />
      <View style={s.center}>
        <SuccessCheckHero size={132} />
        <Text style={s.title}>You're All Set!</Text>
        <Text style={s.body}>Welcome to Nimble Needle.{'\n'}Let's create something beautiful.</Text>
      </View>

      <View style={s.buttonSection}>
        <TouchableOpacity style={s.homeBtn} onPress={finishOnboarding} activeOpacity={0.85}>
          <Text style={s.homeBtnText}>Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.tourBtn}
          onPress={() => Alert.alert('Coming Soon', 'The guided tour will be available in a future update.')}
          activeOpacity={0.85}
        >
          <Text style={s.tourBtnText}>Take a Quick Tour</Text>
        </TouchableOpacity>
      </View>

      <Image source={FABRIC_HERO} style={s.heroArt} resizeMode="contain" pointerEvents="none" />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.LAVENDER_WHITE,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  threadBg: {
    position: 'absolute',
    top: -24,
    left: -72,
    width: 460,
    height: 180,
    opacity: 0.35,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 30, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.5, marginTop: 26, marginBottom: 14,
    textAlign: 'center',
  },
  body: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.65)', textAlign: 'center',
    lineHeight: 24, maxWidth: 290,
  },
  buttonSection: { width: '100%', gap: 10, zIndex: 2 },
  homeBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 14, minHeight: 54,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#5B2D8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 4,
  },
  homeBtnText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff',
  },
  tourBtn: { alignItems: 'center', paddingVertical: 8 },
  tourBtnText: {
    fontSize: 15, fontFamily: 'Inter_600SemiBold',
    color: COLORS.DEEP_PLUM,
    textDecorationLine: 'underline',
  },
  heroArt: {
    position: 'absolute',
    left: -4,
    right: -4,
    bottom: -6,
    height: 182,
    zIndex: 0,
  },
});
