// SuccessScreen.js — "You're All Set!" auth completion screen.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../styles/colors';

const PLUM     = COLORS.DEEP_PLUM;
const MIDNIGHT = COLORS.MIDNIGHT;
const MINT     = COLORS.MINT;
const THREAD   = 'rgba(124,75,215,0.55)';
const { width: SW, height: SH } = Dimensions.get('window');

function ThreadCurveSuccessTop() {
  return (
    <Svg
      viewBox="0 0 420 200"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', top: 60, left: 0, right: 0, width: '100%', height: 200, zIndex: 0 }}
      pointerEvents="none"
    >
      <Path
        d={`
          M -10 130
          C 5 110, 25 95, 50 100
          C 75 105, 80 140, 55 145
          C 30 150, 25 120, 55 105
          C 110 80, 165 75, 220 60
          C 270 47, 320 40, 360 55
          C 395 68, 405 95, 380 100
          C 360 104, 355 80, 385 75
          C 405 72, 425 85, 435 100
        `}
        fill="none"
        stroke={THREAD}
        strokeWidth={1.6}
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Bottom quilt illustration using SVG
function BottomIllustration() {
  const cellW = SW / 6;
  const cellH = cellW;
  const rows = 4;
  const cols = 7;
  const colors = [
    MINT + '55',
    'rgba(192,132,252,0.3)',
    'rgba(91,45,142,0.18)',
    MINT + '30',
    'rgba(255,247,233,0.8)',
    'rgba(192,132,252,0.2)',
    MINT + '40',
  ];
  return (
    <View style={{ width: '100%', overflow: 'hidden' }}>
      <Svg width={SW} height={rows * cellH + 20}>
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const x = (c - 0.5) * cellW + (r % 2 === 0 ? 0 : cellW / 2);
            const y = r * cellH + 10;
            const col = colors[(r * cols + c) % colors.length];
            return (
              <Path
                key={`${r}-${c}`}
                d={`M ${x} ${y - cellH * 0.48} L ${x + cellW * 0.48} ${y} L ${x} ${y + cellH * 0.48} L ${x - cellW * 0.48} ${y} Z`}
                fill={col}
                stroke="rgba(91,45,142,0.12)"
                strokeWidth={1}
              />
            );
          })
        )}
      </Svg>
    </View>
  );
}

export default function SuccessScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { onComplete } = route.params || {};

  const handleGoHome = async () => {
    await AsyncStorage.setItem('@onboarding_complete', 'true');
    if (onComplete) onComplete();
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <ThreadCurveSuccessTop />

      <View style={[s.content, { paddingBottom: insets.bottom + 16 }]}>
        {/* Check circle */}
        <View style={s.checkCircle}>
          <Svg width={40} height={40} viewBox="0 0 40 40">
            <Path
              d="M10 20.5l6.5 6.5L30 12"
              stroke="#fff"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Text style={s.heading}>You're All Set!</Text>
        <Text style={s.sub}>
          Welcome to Nimble Needle.{'\n'}Let's create something beautiful.
        </Text>

        <View style={s.btnArea}>
          <TouchableOpacity style={s.primaryBtn} onPress={handleGoHome} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>Go to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
            <Text style={s.tourLink}>Take a Quick Tour</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomIllustration />
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FBF8FE',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    gap: 0,
  },

  checkCircle: {
    width: 78, height: 78, borderRadius: 39,
    backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: MINT,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32, shadowRadius: 28, elevation: 10,
    marginBottom: 20,
  },

  heading: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32, fontWeight: '700',
    color: MIDNIGHT,
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: 12,
  },
  sub: {
    fontSize: 15,
    color: 'rgba(45,27,78,0.55)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 36,
  },

  btnArea: { width: '100%', gap: 16, alignItems: 'center' },
  primaryBtn: {
    width: '100%',
    backgroundColor: PLUM,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: PLUM,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },

  tourLink: {
    fontSize: 14, fontWeight: '600',
    color: PLUM,
    textDecorationLine: 'underline',
  },
});
