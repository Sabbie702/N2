// HomeScreen.js — Nimble Needle dashboard.
// Projects hero card, Stash/Discover feature cards, Quick Actions 2×2 grid.

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import Svg, { Path, Rect, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../styles/colors';

const USER_NAME = 'Sabbie';

// ─── App Logo ──────────────────────────────────────────────────────────────────
export function AppLogo({ size = 58 }) {
  const br = Math.round(size * 0.259);
  const sc = size / 58;

  return (
    <View style={{
      width: size, height: size, borderRadius: br,
      backgroundColor: COLORS.DEEP_PLUM, overflow: 'hidden',
      shadowColor: COLORS.MIDNIGHT,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22, shadowRadius: 20, elevation: 8,
    }}>
      <View style={{ ...StyleSheet.absoluteFillObject, padding: 4 * sc, opacity: 0.45 }}>
        {[0, 1, 2, 3].map(row => (
          <View key={row} style={{ flex: 1, flexDirection: 'row' }}>
            {[0, 1, 2, 3].map(col => (
              <View key={col} style={{
                flex: 1, margin: sc,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 4 * sc,
              }} />
            ))}
          </View>
        ))}
      </View>

      <Svg style={StyleSheet.absoluteFill} width={size} height={size}>
        <Defs>
          <LinearGradient id="ndl" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%"   stopColor="white"   stopOpacity="1" />
            <Stop offset="50%"  stopColor="#B9AACB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#6B5C86" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x={1.5} y={1.5} width={size - 3} height={size - 3}
          rx={br - 1} ry={br - 1}
          fill="none" stroke={COLORS.MINT}
          strokeWidth={2.5 * sc} strokeDasharray={`${5 * sc} ${4 * sc}`}
        />
        <Line
          x1={9 * sc} y1={31 * sc} x2={57 * sc} y2={31 * sc}
          stroke={COLORS.MINT} strokeWidth={3 * sc} strokeLinecap="round"
          transform={`rotate(-20, ${33 * sc}, ${31 * sc})`}
        />
        <Rect
          x={26 * sc} y={9 * sc} width={5 * sc} height={44 * sc} rx={2.5 * sc}
          fill="url(#ndl)"
          transform={`rotate(36, ${28.5 * sc}, ${31 * sc})`}
        />
      </Svg>

      <Text style={{
        position: 'absolute', fontWeight: '900', color: '#FFF7E9',
        fontSize: 42 * sc, left: 15 * sc, top: 2 * sc, includeFontPadding: false,
      }}>N</Text>
    </View>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────
const FABRIC_LAYERS = [
  { bottom: 0,   right: -12, width: 158, color: '#476E57' },
  { bottom: 27,  right: -6,  width: 162, color: '#D9A94F' },
  { bottom: 54,  right: 4,   width: 166, color: '#FFF7E9' },
  { bottom: 81,  right: 14,  width: 170, color: '#8E69C8' },
  { bottom: 108, right: 25,  width: 174, color: '#6D3995' },
];

const ACCENT_DOTS = [0, 1, 2, 3, 4].map(i => ({
  right: 48 + i * 21, top: 14 + (i % 2 ? 7 : 0),
}));

function HeroCard({ onPress }) {
  return (
    <TouchableOpacity style={s.heroCard} onPress={onPress} activeOpacity={0.97}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%"   stopColor="#E8D4F6" stopOpacity="1" />
            <Stop offset="55%"  stopColor="#EADAF8" stopOpacity="1" />
            <Stop offset="100%" stopColor="#C084FC" stopOpacity="0.55" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#hg)" />
        <Path d="M-10 70 C80 15 140 135 230 82 C330 28 380 138 520 62"
          fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="8 8" opacity="0.45" />
        <Path d="M0 155 C90 105 155 185 260 128 C355 80 400 168 520 122"
          fill="none" stroke="white" strokeWidth="2.5" strokeDasharray="8 8" opacity="0.45" />
      </Svg>

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {FABRIC_LAYERS.map((l, i) => (
          <View key={i} style={[s.fabricLayer, {
            bottom: l.bottom, right: l.right,
            width: l.width, backgroundColor: l.color,
          }]} />
        ))}
        {ACCENT_DOTS.map((d, i) => (
          <View key={i} style={[s.accentDot, { right: d.right, top: d.top }]} />
        ))}
      </View>

      <View style={s.heroContent}>
        <Text style={s.heroTitle}>Projects</Text>
        <Text style={s.heroSubtitle}>Organize & Love{'\n'}Your Fabric</Text>
        <View style={s.heroChevron}>
          <Ionicons name="chevron-forward" size={26} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────
function StashIllustration() {
  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
      <View style={{ position: 'absolute', bottom: 4, right: 20, height: 48, width: 84, borderRadius: 16, backgroundColor: '#E7DAD5' }} />
      <View style={{ position: 'absolute', bottom: 30, right: 16, height: 40, width: 56, borderRadius: 12, backgroundColor: '#4EC9A0' }} />
      <View style={{ position: 'absolute', bottom: 50, right: 40, height: 40, width: 56, borderRadius: 12, backgroundColor: '#5B2D8E' }} />
      <View style={{ position: 'absolute', bottom: 68, right: 10, height: 40, width: 56, borderRadius: 12, backgroundColor: '#C084FC' }} />
      <View style={{ position: 'absolute', bottom: 60, right: 100, height: 42, width: 9, borderRadius: 5, backgroundColor: '#D6AA66' }} />
      <View style={{ position: 'absolute', bottom: 52, right: 114, height: 44, width: 9, borderRadius: 5, backgroundColor: '#B77C54' }} />
      <View style={{ position: 'absolute', bottom: 94, right: 62, width: 26, height: 26, borderRadius: 13, borderWidth: 5, borderColor: '#8E69C8' }} />
      <View style={{ position: 'absolute', bottom: 94, right: 37, width: 26, height: 26, borderRadius: 13, borderWidth: 5, borderColor: '#8E69C8' }} />
    </View>
  );
}

function DiscoverIllustration() {
  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
      <View style={{
        position: 'absolute', bottom: 8, right: 8,
        width: 82, height: 82, borderRadius: 41,
        borderWidth: 8, borderColor: COLORS.MIDNIGHT,
        backgroundColor: 'white', overflow: 'hidden',
      }}>
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#F5F0FA', borderRadius: 41 }} />
        <View style={{ position: 'absolute', top: '12%', left: '28%', width: '44%', height: '58%', backgroundColor: COLORS.SOFT_LAVENDER, opacity: 0.82, transform: [{ rotate: '-45deg' }] }} />
        <View style={{ position: 'absolute', top: '28%', left: '12%', width: '58%', height: '44%', backgroundColor: COLORS.MINT, opacity: 0.65, transform: [{ rotate: '-45deg' }] }} />
      </View>
      <View style={{ position: 'absolute', bottom: 0, right: 4, width: 14, height: 42, borderRadius: 7, backgroundColor: COLORS.MIDNIGHT, transform: [{ rotate: '-45deg' }] }} />
      <Ionicons name="sparkles" size={15} color={COLORS.SOFT_LAVENDER} style={{ position: 'absolute', right: 6, top: 10 }} />
      <Ionicons name="sparkles" size={12} color={COLORS.SOFT_LAVENDER} style={{ position: 'absolute', left: 8, top: 50 }} />
    </View>
  );
}

function FeatureCard({ title, subtitle, tone, illustration, onPress }) {
  const bg       = tone === 'mint' ? '#EAF8F2' : '#F3E9FB';
  const btnColor = tone === 'mint' ? COLORS.MINT : COLORS.DEEP_PLUM;
  return (
    <TouchableOpacity style={[s.featureCard, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.95}>
      <Text style={s.featureTitle}>{title}</Text>
      <Text style={s.featureSub}>{subtitle}</Text>
      <View style={[s.featureChevron, { backgroundColor: btnColor }]}>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </View>
      {illustration}
    </TouchableOpacity>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────
function QuickAction({ iconName, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={s.qaCard} onPress={onPress} activeOpacity={0.9}>
      <View style={s.qaIconWrap}>
        <Ionicons name={iconName} size={28} color={COLORS.DEEP_PLUM} />
      </View>
      <Text style={s.qaTitle}>{title}</Text>
      <Text style={s.qaSub}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <AppLogo size={52} />
            <Text style={s.headerTitle}>Nimble Needle</Text>
          </View>
          <TouchableOpacity
            style={s.menuBtn}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            activeOpacity={0.85}
          >
            <Ionicons name="menu" size={26} color={COLORS.DEEP_PLUM} />
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <View style={s.welcomeSection}>
          <Text style={s.welcomeTitle}>Welcome, {USER_NAME}!</Text>
          <View style={s.welcomeRow}>
            <Text style={{ fontSize: 22 }}>💚</Text>
            <Text style={s.welcomeText}>
              One stitch at a time, you're creating{'\n'}something beautiful.
            </Text>
          </View>
        </View>

        <HeroCard onPress={() => navigation.navigate('Projects')} />

        <View style={s.featureRow}>
          <View style={{ flex: 1 }}>
            <FeatureCard title="Stash" subtitle={`Everything you\ncreate with`} tone="mint"
              illustration={<StashIllustration />} onPress={() => navigation.navigate('Stash')} />
          </View>
          <View style={{ flex: 1 }}>
            <FeatureCard title="Discover" subtitle={`Browse, save &\nget inspired`} tone="lavender"
              illustration={<DiscoverIllustration />} onPress={() => navigation.navigate('Discover')} />
          </View>
        </View>

        {/* Quick Actions — 2×2 grid */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.qaGrid}>
          <QuickAction
            iconName="grid-outline"
            title="New Project"
            subtitle="Start a new quilt or bag"
            onPress={() => navigation.navigate('Projects', { screen: 'NewProject' })}
          />
          <QuickAction
            iconName="create-outline"
            title="Notes"
            subtitle="Jot down ideas & thoughts"
            onPress={() => navigation.navigate('Notes')}
          />
          <QuickAction
            iconName="color-palette-outline"
            title="Color Corner"
            subtitle="Pick your perfect palette"
            onPress={() => navigation.navigate('Colors')}
          />
          <QuickAction
            iconName="calculator-outline"
            title="Quilt Calculator"
            subtitle="Calculate fabric needs"
            onPress={() => navigation.navigate('Calculator')}
          />
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  scroll:    { paddingBottom: 40 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 16, paddingBottom: 10,
  },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24, fontWeight: '700', color: COLORS.MIDNIGHT, letterSpacing: -0.6,
  },
  menuBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.LAVENDER_WHITE,
    borderWidth: 1.5, borderColor: '#E5DCEF',
    alignItems: 'center', justifyContent: 'center',
  },

  welcomeSection: { paddingHorizontal: 18, marginBottom: 16 },
  welcomeTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28, fontWeight: '700', color: COLORS.MIDNIGHT,
    letterSpacing: -0.7, marginBottom: 8,
  },
  welcomeRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  welcomeText: { flex: 1, fontSize: 15, color: 'rgba(45,27,78,0.72)', lineHeight: 22 },

  heroCard: {
    height: 196, marginHorizontal: 14, borderRadius: 24,
    overflow: 'hidden', marginBottom: 14,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12, shadowRadius: 28, elevation: 6,
  },
  fabricLayer: {
    position: 'absolute', height: 38, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, elevation: 2,
  },
  accentDot: {
    position: 'absolute', width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#F6C5D8',
  },
  heroContent: {
    position: 'absolute', left: 20, top: 0, bottom: 0,
    justifyContent: 'center', maxWidth: 185,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 38, fontWeight: '700', color: COLORS.MIDNIGHT, letterSpacing: -1.2,
  },
  heroSubtitle: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 17, color: COLORS.DEEP_PLUM, lineHeight: 23, marginTop: 8,
  },
  heroChevron: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.DEEP_PLUM,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 14,
    shadowColor: COLORS.DEEP_PLUM,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },

  featureRow: {
    flexDirection: 'row', gap: 12, marginHorizontal: 14, marginBottom: 24,
  },
  featureCard: {
    height: 182, borderRadius: 24, padding: 16, overflow: 'hidden',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09, shadowRadius: 28, elevation: 4,
  },
  featureTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26, fontWeight: '700', color: COLORS.MIDNIGHT, letterSpacing: -0.7,
  },
  featureSub: { fontSize: 13, color: 'rgba(45,27,78,0.8)', lineHeight: 19, marginTop: 5 },
  featureChevron: {
    position: 'absolute', bottom: 16, left: 16,
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
  },

  sectionTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22, fontWeight: '700', color: COLORS.MIDNIGHT,
    paddingHorizontal: 18, marginBottom: 12, letterSpacing: -0.3,
  },

  qaGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 14,
  },
  qaCard: {
    width: '47%', minHeight: 128, backgroundColor: '#fff',
    borderRadius: 20, padding: 12, alignItems: 'center',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07, shadowRadius: 16, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
  qaIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.SOFT_LAVENDER,
    backgroundColor: 'rgba(245,240,250,0.6)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  qaTitle: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 13, fontWeight: '600', color: COLORS.MIDNIGHT,
    textAlign: 'center', lineHeight: 17,
  },
  qaSub: {
    fontSize: 11, color: 'rgba(45,27,78,0.62)',
    textAlign: 'center', lineHeight: 15, marginTop: 3,
  },
});
