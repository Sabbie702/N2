// WelcomeScreen.js — auth flow entry point.
// Deep Plum quilted background, logo, tagline, Log In + Create Account buttons.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import Svg, { Path, Rect, Line, Defs, LinearGradient as SvgLinearGradient, Stop, G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../styles/colors';

const { width: SW, height: SH } = Dimensions.get('window');

// Quilted diamond grid background
function QuiltedBackground() {
  const spacing = 36;
  const rows = Math.ceil(SH / spacing) + 2;
  const cols = Math.ceil(SW / spacing) + 2;
  const paths = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * spacing + (r % 2 === 0 ? 0 : spacing / 2) - spacing;
      const cy = r * spacing - spacing;
      const h = spacing * 0.52;
      const w = spacing * 0.52;
      paths.push(
        `M ${cx} ${cy - h} L ${cx + w} ${cy} L ${cx} ${cy + h} L ${cx - w} ${cy} Z`
      );
    }
  }
  return (
    <Svg style={StyleSheet.absoluteFill} width={SW} height={SH}>
      {paths.map((d, i) => (
        <Path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      ))}
      {/* Horizontal stitch lines */}
      {Array.from({ length: Math.ceil(SH / 72) + 1 }, (_, i) => (
        <Path
          key={`h${i}`}
          d={`M 0 ${i * 72} H ${SW}`}
          fill="none"
          stroke="rgba(78,201,160,0.12)"
          strokeWidth={1}
          strokeDasharray="6 10"
        />
      ))}
    </Svg>
  );
}

function AppLogoLarge({ size = 80 }) {
  const br = Math.round(size * 0.259);
  const sc = size / 58;
  return (
    <View style={{
      width: size, height: size, borderRadius: br,
      backgroundColor: 'rgba(255,255,255,0.12)',
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.25)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35, shadowRadius: 24, elevation: 12,
    }}>
      <View style={{ ...StyleSheet.absoluteFillObject, padding: 5 * sc, opacity: 0.5 }}>
        {[0, 1, 2, 3].map(row => (
          <View key={row} style={{ flex: 1, flexDirection: 'row' }}>
            {[0, 1, 2, 3].map(col => (
              <View key={col} style={{
                flex: 1, margin: sc,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 4 * sc,
              }} />
            ))}
          </View>
        ))}
      </View>
      <Svg style={StyleSheet.absoluteFill} width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="ndl_w" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%"   stopColor="white"   stopOpacity="1" />
            <Stop offset="50%"  stopColor="#C5BBDB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#8B7FAB" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Rect
          x={1.5} y={1.5} width={size - 3} height={size - 3}
          rx={br - 1} ry={br - 1}
          fill="none" stroke={COLORS.MINT}
          strokeWidth={2.5 * sc} strokeDasharray={`${5 * sc} ${4 * sc}`}
        />
        <Line
          x1={9 * sc} y1={31 * sc} x2={57 * sc} y2={31 * sc}
          stroke="url(#ndl_w)" strokeWidth={3 * sc} strokeLinecap="round"
          transform={`rotate(-20, ${33 * sc}, ${31 * sc})`}
        />
        <Path
          d={`M ${20 * sc} ${23 * sc} C ${26 * sc} ${14 * sc} ${40 * sc} ${14 * sc} ${46 * sc} ${23 * sc} C ${52 * sc} ${32 * sc} ${46 * sc} ${41 * sc} ${33 * sc} ${45 * sc} C ${20 * sc} ${41 * sc} ${14 * sc} ${32 * sc} ${20 * sc} ${23 * sc} Z`}
          fill="none" stroke="url(#ndl_w)" strokeWidth={2.2 * sc}
        />
        <Path
          d={`M ${29 * sc} ${22 * sc} L ${37 * sc} ${22 * sc} L ${33 * sc} ${34 * sc} Z`}
          fill="url(#ndl_w)"
        />
      </Svg>
    </View>
  );
}

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar barStyle="light-content" />
      <QuiltedBackground />

      {/* Glow radials */}
      <View style={s.glowTop} pointerEvents="none" />
      <View style={s.glowBottom} pointerEvents="none" />

      {/* Thread accent curve */}
      <Svg style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]} width={SW} height={SH}>
        <Path
          d={`M ${SW + 20} 80 C ${SW - 60} 110, ${SW - 80} 200, ${SW - 30} 270 C ${SW + 20} 340, ${SW + 30} 400, ${SW - 20} 460`}
          fill="none"
          stroke={COLORS.MINT}
          strokeWidth={1.4}
          strokeDasharray="6 9"
          opacity={0.28}
        />
        <Path
          d={`M -20 ${SH - 300} C 60 ${SH - 270}, 80 ${SH - 160}, 30 ${SH - 90} C -10 ${SH - 30}, 20 ${SH - 10}, 60 ${SH}`}
          fill="none"
          stroke="rgba(192,132,252,0.5)"
          strokeWidth={1.4}
          strokeDasharray="5 8"
        />
      </Svg>

      {/* Logo + brand */}
      <View style={s.brandArea}>
        <AppLogoLarge size={88} />
        <Text style={s.brandName}>Nimble{'\n'}Needle</Text>
        <Text style={s.tagline}>Your crafting companion</Text>
      </View>

      {/* Buttons */}
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

        <Text style={s.termsText}>
          By continuing you agree to our{' '}
          <Text style={s.termsLink}>Terms</Text>
          {' & '}
          <Text style={s.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.MIDNIGHT,
    justifyContent: 'space-between',
  },
  glowTop: {
    position: 'absolute', top: -80, left: SW * 0.1,
    width: SW * 0.8, height: 320,
    borderRadius: 200,
    backgroundColor: 'rgba(91,45,142,0.35)',
    transform: [{ scaleX: 1.5 }],
  },
  glowBottom: {
    position: 'absolute', bottom: -60, right: SW * 0.1,
    width: SW * 0.7, height: 240,
    borderRadius: 160,
    backgroundColor: 'rgba(78,201,160,0.12)',
    transform: [{ scaleX: 1.6 }],
  },

  brandArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 18,
  },
  brandName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 44,
    fontWeight: '700',
    color: '#FFF7E9',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 50,
    marginTop: 6,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(192,132,252,0.85)',
    fontWeight: '500',
    letterSpacing: 0.4,
  },

  btnArea: {
    paddingHorizontal: 24,
    gap: 14,
    paddingBottom: 8,
  },
  btnPrimary: {
    backgroundColor: COLORS.MINT,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: COLORS.MINT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
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
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF7E9',
    letterSpacing: 0.2,
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255,247,233,0.38)',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 2,
  },
  termsLink: {
    color: 'rgba(192,132,252,0.6)',
    fontWeight: '600',
  },
});
