// src/navigation/DrawerNavigator.js
// Right-side drawer with correct PNG logo, Playfair Display / Inter typography,
// stitched heart SVG, colored icon circles matching mockup.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import TabNavigator from './TabNavigator';
import { AppLogo, StitchedHeart } from '../screens/HomeScreen';
import { useAuth } from '../contexts/AuthContext';
import COLORS from '../styles/colors';

const Drawer = createDrawerNavigator();

// ─── Menu row with colored icon circle ───────────────────────────────────────
function MenuRow({ icon, label, iconBg, variant = 'default', onPress }) {
  const isDanger = variant === 'danger';
  const bg = isDanger ? '#fef2f2' : (iconBg || COLORS.LAVENDER_WHITE);
  const iconColor = isDanger ? '#ef4444' : '#fff';
  return (
    <TouchableOpacity
      style={dr.menuRow}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={label}
    >
      <View style={dr.menuLeft}>
        <View style={[dr.menuIcon, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[dr.menuLabel, isDanger && dr.menuLabelDanger]}>{label}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDanger ? '#ef4444' : 'rgba(45,27,78,0.3)'}
      />
    </TouchableOpacity>
  );
}

// ─── Drawer content ───────────────────────────────────────────────────────────
function CustomDrawerContent({ navigation }) {
  const { displayName, signOut } = useAuth();
  const go = (screen) => {
    navigation.navigate('MainTabs', { screen: 'Home', params: { screen } });
    navigation.closeDrawer();
  };
  const close = () => navigation.closeDrawer();

  return (
    <SafeAreaView style={dr.container}>
      {/* Close button */}
      <TouchableOpacity
        style={dr.closeBtn}
        onPress={close}
        activeOpacity={0.8}
        accessibilityLabel="Close menu"
      >
        <Ionicons name="close" size={22} color={COLORS.MIDNIGHT} />
      </TouchableOpacity>

      {/* Decorative dashed curves */}
      <View style={dr.headerDecor} pointerEvents="none">
        <Svg width="100%" height="180">
          <Path
            d="M-20 52 C62 10 92 118 170 60 C245 4 270 122 350 50"
            fill="none" stroke="#C084FC" strokeWidth="2"
            strokeDasharray="8 8" opacity="0.4"
          />
          <Path
            d="M-10 145 C72 100 120 174 205 112 C270 68 302 154 350 118"
            fill="none" stroke="#C084FC" strokeWidth="2"
            strokeDasharray="8 8" opacity="0.4"
          />
        </Svg>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Brand header */}
        <View style={dr.header}>
          <View style={dr.brand}>
            <AppLogo size={58} />
            <Text style={dr.brandName}>Nimble{'\n'}Needle</Text>
          </View>
          <View style={dr.welcomeRow}>
            <Text style={dr.welcomeText}>Welcome, {displayName || 'Friend'}!</Text>
            <View style={{ marginLeft: 8 }}>
              <StitchedHeart size={26} />
            </View>
          </View>
        </View>

        {/* ── MAIN MENU ── */}
        <Text style={dr.sectionLabel}>MAIN MENU</Text>
        <View style={dr.section}>
          <MenuRow icon="person"      iconBg={COLORS.SOFT_LAVENDER} label="Profile"              onPress={() => go('Profile')}  />
          <MenuRow icon="settings"    iconBg={COLORS.DEEP_PLUM}     label="App Settings"         onPress={() => go('Settings')} />
          <MenuRow icon="cube"        iconBg="#4EC9A0"               label="Storage Spots"        onPress={close} />
          <MenuRow icon="book"        iconBg={COLORS.DEEP_PLUM}     label="App Help & Tutorials" onPress={close} />
        </View>

        <View style={dr.divider} />

        {/* ── ACCOUNT & UTILITY ── */}
        <Text style={dr.sectionLabel}>ACCOUNT & UTILITY</Text>
        <View style={dr.section}>
          <MenuRow icon="book"        iconBg={COLORS.DEEP_PLUM}     label="Scrapbook"       onPress={() => go('Scrapbook')} />
          <MenuRow icon="trophy"      iconBg="#F4C542"               label="Subscription"    onPress={close} />
          <MenuRow icon="gift"        iconBg="#4EC9A0"               label="Invite a Friend" onPress={close} />
          <MenuRow icon="headset"     iconBg={COLORS.DEEP_PLUM}     label="Contact Support" onPress={close} />
        </View>

        <View style={dr.divider} />

        <View style={dr.section}>
          <MenuRow icon="shield-checkmark" iconBg="#4EC9A0"   label="Privacy & Terms" onPress={close} />
          <MenuRow icon="log-out-outline"                      label="Log Out" variant="danger" onPress={signOut} />
        </View>
      </ScrollView>

      <View style={dr.footer}>
        <Text style={dr.footerText}>N2 Nimble Needle · V1.5.1</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Navigator ────────────────────────────────────────────────────────────────
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: 'transparent',
          width: 330,
        },
        overlayColor: 'rgba(45, 27, 78, 0.45)',
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const dr = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 34,
    borderBottomLeftRadius: 34,
    backgroundColor: '#F5F0FA',
    overflow: 'hidden',
  },

  headerDecor: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 180,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 62,
    paddingBottom: 20,
  },
  brand: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, marginBottom: 16,
  },
  brandName: {
    fontSize: 22, fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.MIDNIGHT, lineHeight: 28,
  },
  welcomeRow: { flexDirection: 'row', alignItems: 'center' },
  welcomeText: {
    fontSize: 16, fontFamily: 'Inter_500Medium',
    color: COLORS.MIDNIGHT,
  },

  sectionLabel: {
    fontSize: 12, fontFamily: 'Inter_800ExtraBold',
    color: 'rgba(91,45,142,0.55)',
    letterSpacing: 1.5,
    paddingHorizontal: 24, marginBottom: 10, marginTop: 4,
  },
  section: { paddingHorizontal: 14, gap: 8, marginBottom: 6 },

  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 18, paddingHorizontal: 12, paddingVertical: 12,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 1,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15, fontFamily: 'Inter_600SemiBold',
    color: COLORS.MIDNIGHT,
  },
  menuLabelDanger: { color: '#ef4444' },

  divider: {
    height: 1,
    backgroundColor: 'rgba(192,132,252,0.2)',
    marginHorizontal: 24, marginVertical: 12,
  },

  closeBtn: {
    position: 'absolute', top: 52, right: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(192,132,252,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  footer: { padding: 20, paddingBottom: 12, alignItems: 'center' },
  footerText: {
    fontSize: 11, fontFamily: 'Inter_400Regular',
    color: 'rgba(45,27,78,0.3)',
  },
});
