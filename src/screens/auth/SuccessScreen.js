import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import COLORS from '../../styles/colors';

const SUCCESS_CHECK = require('../../../assets/images/success_check.png');

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const { displayName, finishOnboarding } = useAuth();

  return (
    <View style={[s.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
      <View style={s.center}>
        <Image source={SUCCESS_CHECK} style={s.checkImg} resizeMode="contain" />
        <Text style={s.title}>You're All Set!</Text>
        <Text style={s.body}>
          Welcome to Nimble Needle, {displayName || 'friend'}! Your creative workspace is ready.
          Let's start organizing your projects and bringing your ideas to life.
        </Text>
      </View>

      <View style={s.buttonSection}>
        <TouchableOpacity style={s.homeBtn} onPress={finishOnboarding} activeOpacity={0.9}>
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
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.LAVENDER_WHITE,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  checkImg: { width: 120, height: 120, marginBottom: 32 },
  title: {
    fontSize: 30, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.5, marginBottom: 16,
  },
  body: {
    fontSize: 15, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.65)', textAlign: 'center',
    lineHeight: 24, maxWidth: 300,
  },
  buttonSection: { width: '100%', gap: 14 },
  homeBtn: {
    backgroundColor: COLORS.DEEP_PLUM,
    borderRadius: 28, paddingVertical: 16,
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff',
  },
  tourBtn: { alignItems: 'center', paddingVertical: 10 },
  tourBtnText: {
    fontSize: 15, fontFamily: 'Inter_600SemiBold',
    color: COLORS.DEEP_PLUM,
  },
});
