// WelcomeScreen.js — auth flow entry point.
// Light lavender background, thread curves with X stitch markers, logo, tagline, Log In + Create Account.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import Svg, { Path, Text as SvgText, G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from './HomeScreen';
import COLORS from '../styles/colors';

const { width: SW, height: SH } = Dimensions.get('window');

const PLUM    = COLORS.DEEP_PLUM;   // #5B2D8E
const MINT    = COLORS.MINT;        // #4EC9A0
const THREAD  = 'rgba(124,75,215,0.55)';
const MINT_X  = MINT;

// X stitch marker at a point along a path
function XMark({ cx, cy, size = 9 }) {
  const h = size / 2;
  return (
    <G>
      <Path
        d={`M ${cx - h} ${cy - h} L ${cx + h} ${cy + h}`}
        stroke={MINT_X} strokeWidth={1.8} strokeLinecap="round"
      />
      <Path
        d={`M ${cx + h} ${cy - h} L ${cx - h} ${cy + h}`}
        stroke={MINT_X} strokeWidth={1.8} strokeLinecap="round"
      />
    </G>
  );
}

// Upper thread curve — enters from right, sweeps across upper portion of screen
function UpperThreadCurve() {
  return (
    <Svg
      style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
      width={SW}
      height={240}
      pointerEvents="none"
    >
      {/* Main dashed curve */}
      <Path
        d={`M ${SW + 10} 80 C ${SW * 0.75} 60, ${SW * 0.55} 100, ${SW * 0.35} 75 C ${SW * 0.15} 50, -10 90, -20 130`}
        fill="none"
        stroke={THREAD}
        strokeWidth={1.6}
        strokeDasharray="5 7"
        strokeLinecap="round"
      />
      {/* X markers along the curve */}
      <XMark cx={SW * 0.82} cy={68} />
      <XMark cx={SW * 0.55} cy={96} />
      <XMark cx={SW * 0.28} cy={72} />
    </Svg>
  );
}

// Lower thread curve — sweeps across the lower-middle of screen
function LowerThreadCurve() {
  const y = SH * 0.58;
  return (
    <Svg
      style={{ position: 'absolute', top: y - 60, left: 0, right: 0 }}
      width={SW}
      height={120}
      pointerEvents="none"
    >
      <Path
        d={`M -20 80 C ${SW * 0.15} 50, ${SW * 0.38} 100, ${SW * 0.6} 65 C ${SW * 0.78} 38, ${SW + 10} 70, ${SW + 20} 85`}
        fill="none"
        stroke={THREAD}
        strokeWidth={1.6}
        strokeDasharray="5 7"
        strokeLinecap="round"
      />
      <XMark cx={SW * 0.15} cy={54} />
      <XMark cx={SW * 0.55} cy={70} />
      <XMark cx={SW * 0.82} cy={44} />
    </Svg>
  );
}

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      {/* Decorative thread curves */}
      <UpperThreadCurve />
      <LowerThreadCurve />

      {/* Logo + brand name + tagline */}
      <View style={s.brandArea}>
        <AppLogo size={90} />
        <Text style={s.brandName}>Nimble{'\n'}Needle</Text>
        <Text style={s.tagline}>Your creative projects,{'\n'}all in one place.</Text>
      </View>

      {/* CTA buttons */}
      <View style={s.btnArea}>
        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={s.btnPrimaryText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnSecondary}
          onPress={() => navigation.navigate('CreateAccount')}
          activeOpacity={0.85}
        >
          <Text style={s.btnSecondaryText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5EFFE',
    justifyContent: 'space-between',
  },

  brandArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  brandName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 46,
    fontWeight: '700',
    color: PLUM,
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 52,
    marginTop: 4,
  },
  tagline: {
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 17,
    color: MINT,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.1,
  },

  btnArea: {
    paddingHorizontal: 24,
    gap: 14,
  },
  btnPrimary: {
    backgroundColor: MINT,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: MINT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  btnSecondary: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PLUM,
    backgroundColor: '#fff',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: PLUM,
    letterSpacing: 0.2,
  },
});
