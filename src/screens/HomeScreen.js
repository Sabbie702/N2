// HomeScreen.js
// Dashboard using PNG assets for logo, hero, card illustrations, and quick action icons.
// Stitched heart inline SVG (simple shape). Typography: Playfair Display + Inter.
// Quick Actions: 2×2 grid with horizontal card layout matching mockup.

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, StyleSheet,
} from 'react-native';
import Svg, { Path, Line, Rect as SvgRect, Circle as SvgCircle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import COLORS from '../styles/colors';

// ─── PNG Assets ───────────────────────────────────────────────────────────────
const IMG = {
  logo:            require('../../assets/images/logo.png'),
  fabricStackHero: require('../../assets/images/fabric_stack_hero.png'),
  stashIcon:       require('../../assets/images/stash_icon.png'),
  discoverIcon:    require('../../assets/images/discover_icon.png'),
  threadFlowBg:    require('../../assets/images/thread_flow_bg.png'),
};

// ─── App Logo (PNG) — exported for DrawerNavigator reuse ─────────────────────
export function AppLogo({ size = 58 }) {
  return (
    <Image
      source={IMG.logo}
      style={{ width: size, height: size, borderRadius: 15 }}
      resizeMode="cover"
      accessibilityLabel="Nimble Needle logo"
    />
  );
}

// ─── Stitched Teal Heart (inline SVG — simple shape) ─────────────────────────
export function StitchedHeart({ size = 22 }) {
  const h = Math.round(size * (20 / 22));
  return (
    <Svg width={size} height={h} viewBox="0 0 22 20" fill="none">
      <Path d="M11 18.5C11 18.5 1 12.5 1 6.5C1 3.5 3.5 1 6.5 1C8.5 1 10 2 11 3.5C12 2 13.5 1 15.5 1C18.5 1 21 3.5 21 6.5C21 12.5 11 18.5 11 18.5Z" fill="#4EC9A0" />
      <Path d="M4 7C6 5 8 8 11 6C14 4 16 7 18 5" stroke="#2D1B4E" strokeWidth="1.5" strokeDasharray="3 2.5" strokeLinecap="round" strokeOpacity="0.55" />
      <Line x1="7" y1="4.5" x2="9" y2="6.5" stroke="#2D1B4E" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
      <Line x1="9" y1="4.5" x2="7" y2="6.5" stroke="#2D1B4E" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
      <Line x1="13" y1="5" x2="15" y2="7" stroke="#2D1B4E" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
      <Line x1="15" y1="5" x2="13" y2="7" stroke="#2D1B4E" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
    </Svg>
  );
}

// ─── Notes Icon (inline SVG — no PNG provided) ──────────────────────────────
function NotesIconSvg() {
  return (
    <Svg width={36} height={36} viewBox="0 0 96 96" fill="none">
      <SvgRect x="22" y="14" width="52" height="68" rx="8" fill="#F5F0FA" stroke="#5B2D8E" strokeWidth="3" />
      <Path d="M34 32h28M34 44h28M34 56h20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" />
      <SvgCircle cx="66" cy="66" r="14" fill="#4EC9A0" stroke="#5B2D8E" strokeWidth="2" />
      <Path d="M62 66h8M66 62v8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Hero Card (Projects) ──────────────────────────────────────────────────────
function HeroCard({ onPress }) {
  return (
    <TouchableOpacity style={s.heroCard} onPress={onPress} activeOpacity={0.97}>
      <ImageBackground
        source={IMG.fabricStackHero}
        style={StyleSheet.absoluteFill}
        imageStyle={s.heroImage}
        resizeMode="cover"
      >
        <Image source={IMG.threadFlowBg} style={s.heroPattern} resizeMode="cover" />
      </ImageBackground>

      <View style={s.heroContent}>
        <Text style={s.heroTitle}>Projects</Text>
        <Text style={s.heroSubtitle}>Organize & Love{'\n'}Your Fabric</Text>
        <View style={s.heroCTA} accessibilityLabel="Go to Projects">
          <Ionicons name="arrow-forward" size={22} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Feature Card (Stash / Discover) ──────────────────────────────────────────
function FeatureCard({ title, subtitle, tone, iconSource, onPress }) {
  const isMint = tone === 'mint';
  const btnColor = isMint ? COLORS.MINT : COLORS.DEEP_PLUM;
  return (
    <TouchableOpacity
      style={[s.featureCard, {
        backgroundColor: isMint ? 'rgba(78,201,160,0.10)' : 'rgba(192,132,252,0.10)',
        borderWidth: 1,
        borderColor: isMint ? 'rgba(78,201,160,0.2)' : 'rgba(192,132,252,0.2)',
      }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <Text style={s.featureTitle}>{title}</Text>
      <Text style={s.featureSub}>{subtitle}</Text>

      {/* Arrow button bottom-left */}
      <View style={[s.featureArrow, { backgroundColor: btnColor }]}>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </View>

      {/* Illustration — fills right+bottom area */}
      <Image
        source={iconSource}
        style={s.featureIcon}
        resizeMode="contain"
        accessible={false}
      />
    </TouchableOpacity>
  );
}

// ─── Quick Action Card (horizontal: icon left, text right) ───────────────────
function QuickAction({ iconName, iconSvg, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={s.qaCard} onPress={onPress} activeOpacity={0.9}
      accessibilityLabel={title}>
      <View style={s.qaIconWrap}>
        {iconSvg || <Ionicons name={iconName} size={30} color={COLORS.DEEP_PLUM} />}
        {/* Small mint + badge */}
        <View style={s.qaBadge}>
          <Ionicons name="add" size={12} color="#fff" />
        </View>
      </View>
      <View style={s.qaTextWrap}>
        <Text style={s.qaTitle}>{title}</Text>
        <Text style={s.qaSub}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { displayName } = useAuth();
  const USER_NAME = displayName || 'Friend';

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      {/* Decorative thread flow PNG background */}
      <Image
        source={IMG.threadFlowBg}
        style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
        resizeMode="cover"
        accessible={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header: PNG logo + Playfair wordmark + hamburger */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <AppLogo size={58} />
            <Text style={s.headerTitle}>Nimble Needle</Text>
          </View>
          <TouchableOpacity
            style={s.menuBtn}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            activeOpacity={0.85}
            accessibilityLabel="Open menu"
          >
            <Ionicons name="menu" size={24} color={COLORS.MIDNIGHT} />
          </TouchableOpacity>
        </View>

        {/* Welcome block */}
        <View style={s.welcomeSection}>
          <Text style={s.welcomeTitle}>Welcome, {USER_NAME}!</Text>
          <View style={s.welcomeRow}>
            <StitchedHeart size={26} />
            <Text style={s.welcomeText}>
              One stitch at a time, you're creating something beautiful.
            </Text>
          </View>
        </View>

        {/* Projects hero card */}
        <HeroCard onPress={() => navigation.navigate('Projects')} />

        {/* Stash + Discover feature cards */}
        <View style={s.featureRow}>
          <View style={{ flex: 1 }}>
            <FeatureCard
              title="Stash"
              subtitle={"Everything you\ncreate with"}
              tone="mint"
              iconSource={IMG.stashIcon}
              onPress={() => navigation.navigate('Stash')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FeatureCard
              title="Discover"
              subtitle={"Browse, save &\nget inspired"}
              tone="lavender"
              iconSource={IMG.discoverIcon}
              onPress={() => navigation.navigate('Discover')}
            />
          </View>
        </View>

        {/* Quick Actions: 2×2 grid */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.qaGrid}>
          <View style={s.qaGridRow}>
            <QuickAction
              iconName="grid-outline"
              title="New Project"
              subtitle="Start a new quilt project"
              onPress={() => navigation.navigate('Projects', { screen: 'NewProject' })}
            />
            <QuickAction
              iconSvg={<NotesIconSvg />}
              title="Notes"
              subtitle="Jot down ideas & thoughts"
              onPress={() => navigation.navigate('Notes')}
            />
          </View>
          <View style={s.qaGridRow}>
            <QuickAction
              iconName="color-palette-outline"
              title="Color Corner"
              subtitle="Pick your perfect palette"
              onPress={() => navigation.navigate('Projects', { screen: 'ColorWheel' })}
            />
            <QuickAction
              iconName="calculator-outline"
              title="Quilt Calculator"
              subtitle="Calculate fabric needs"
              onPress={() => navigation.navigate('CalculatorHub')}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },
  scroll: { paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: {
    fontSize: 22, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.MIDNIGHT,
  },
  menuBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(192,132,252,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Welcome
  welcomeSection: { paddingHorizontal: 20, marginBottom: 20 },
  welcomeTitle: {
    fontSize: 28, fontFamily: 'PlayfairDisplay_800ExtraBold',
    color: COLORS.MIDNIGHT, letterSpacing: -0.8,
    lineHeight: 34, marginBottom: 8,
  },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  welcomeText: {
    flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.65)', lineHeight: 22,
  },

  // Hero card
  heroCard: {
    height: 232, marginHorizontal: 20, borderRadius: 26,
    overflow: 'hidden', marginBottom: 16,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12, shadowRadius: 32, elevation: 5,
  },
  heroImage: {
    borderRadius: 26,
  },
  heroPattern: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.42,
  },
  heroContent: {
    position: 'absolute', left: 24, top: 0, bottom: 0,
    justifyContent: 'center', maxWidth: 190,
  },
  heroTitle: {
    fontSize: 31, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT, letterSpacing: -0.8, lineHeight: 35,
  },
  heroSubtitle: {
    fontSize: 14, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.66)', marginTop: 6, lineHeight: 20,
  },
  heroCTA: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.DEEP_PLUM,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 14,
  },

  // Feature cards
  featureRow: {
    flexDirection: 'row', gap: 14,
    marginHorizontal: 20, marginBottom: 24,
  },
  featureCard: {
    height: 216, borderRadius: 24, padding: 20, overflow: 'hidden',
  },
  featureTitle: {
    fontSize: 21, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT,
  },
  featureSub: {
    fontSize: 13, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.55)', lineHeight: 18, marginTop: 6,
  },
  featureArrow: {
    position: 'absolute', bottom: 16, left: 16,
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  featureIcon: {
    position: 'absolute', bottom: 8, right: 8,
    width: 80, height: 80,
  },

  // Quick Actions — 2×2 grid
  sectionTitle: {
    fontSize: 20, fontFamily: 'PlayfairDisplay_900Black',
    color: COLORS.MIDNIGHT,
    paddingHorizontal: 20, marginBottom: 14,
  },
  qaGrid: {
    paddingHorizontal: 20, gap: 12,
  },
  qaGridRow: {
    flexDirection: 'row', gap: 12,
  },
  qaCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  qaIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.SOFT_LAVENDER,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  qaBadge: {
    position: 'absolute', bottom: -3, right: -3,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.MINT,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  qaTextWrap: { flex: 1 },
  qaTitle: {
    fontSize: 15, fontFamily: 'Inter_700Bold',
    color: COLORS.MIDNIGHT, lineHeight: 18,
  },
  qaSub: {
    fontSize: 12, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.5)',
    lineHeight: 15, marginTop: 2,
  },
});
