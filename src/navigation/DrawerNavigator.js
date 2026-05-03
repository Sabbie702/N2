// src/navigation/DrawerNavigator.js
// Right-side drawer — light lavender theme, two-section menu.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import TabNavigator from './TabNavigator';
import { AppLogo } from '../screens/HomeScreen';
import COLORS from '../styles/colors';

const Drawer = createDrawerNavigator();

// ─── Menu row ─────────────────────────────────────────────────────────────────
function MenuRow({ icon, label, variant = 'default', onPress }) {
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      style={dr.menuRow}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={dr.menuLeft}>
        <View style={[dr.menuIcon, isDanger && dr.menuIconDanger]}>
          <Ionicons
            name={icon}
            size={22}
            color={isDanger ? '#ef4444' : COLORS.DEEP_PLUM}
          />
        </View>
        <Text style={[dr.menuLabel, isDanger && dr.menuLabelDanger]}>{label}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDanger ? '#ef4444' : 'rgba(45,27,78,0.4)'}
      />
    </TouchableOpacity>
  );
}

// ─── Drawer content ───────────────────────────────────────────────────────────
function CustomDrawerContent({ navigation }) {
  const go = (screen) => {
    navigation.navigate('MainTabs', { screen: 'Home', params: { screen } });
    navigation.closeDrawer();
  };
  const close = () => navigation.closeDrawer();

  return (
    <SafeAreaView style={dr.container}>
      {/* Close button */}
      <TouchableOpacity style={dr.closeBtn} onPress={close} activeOpacity={0.8}>
        <Ionicons name="close" size={22} color={COLORS.MIDNIGHT} />
      </TouchableOpacity>

      {/* Decorative dashed curves in header region */}
      <View style={dr.headerDecor} pointerEvents="none">
        <Svg width="100%" height="180">
          <Path
            d="M-20 52 C62 10 92 118 170 60 C245 4 270 122 350 50"
            fill="none" stroke="#C084FC" strokeWidth="2"
            strokeDasharray="8 8" opacity="0.5"
          />
          <Path
            d="M-10 145 C72 100 120 174 205 112 C270 68 302 154 350 118"
            fill="none" stroke="#C084FC" strokeWidth="2"
            strokeDasharray="8 8" opacity="0.5"
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
            <AppLogo size={56} />
            <Text style={dr.brandName}>Nimble{'\n'}Needle</Text>
          </View>
          <View style={dr.welcomeRow}>
            <Text style={dr.welcomeText}>Welcome, Sabbie!</Text>
            <Text style={{ fontSize: 22 }}>💚</Text>
          </View>
        </View>

        {/* ── MAIN MENU ── */}
        <Text style={dr.sectionLabel}>MAIN MENU</Text>
        <View style={dr.section}>
          <MenuRow icon="person-outline"   label="Profile"              onPress={() => go('Profile')}  />
          <MenuRow icon="settings-outline" label="App Settings"         onPress={() => go('Settings')} />
          <MenuRow icon="archive-outline"  label="Storage Spots"        onPress={close} />
          <MenuRow icon="book-outline"     label="App Help & Tutorials" onPress={close} />
        </View>

        <View style={dr.divider} />

        {/* ── ACCOUNT & UTILITY ── */}
        <Text style={dr.sectionLabel}>ACCOUNT & UTILITY</Text>
        <View style={dr.section}>
          <MenuRow icon="book-outline"   label="Scrapbook"       onPress={() => go('Scrapbook')} />
          <MenuRow icon="trophy-outline"  label="Subscription"    onPress={close} />
          <MenuRow icon="gift-outline"    label="Invite a Friend" onPress={close} />
          <MenuRow icon="headset-outline" label="Contact Support" onPress={close} />
        </View>

        <View style={dr.divider} />

        <View style={dr.section}>
          <MenuRow icon="shield-checkmark-outline" label="Privacy & Terms" onPress={close} />
          <MenuRow icon="log-out-outline"          label="Log Out" variant="danger" onPress={close} />
        </View>
      </ScrollView>

      <View style={dr.footer}>
        <Text style={dr.footerText}>N2 Nimble Needle · V1.1</Text>
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
          backgroundColor: COLORS.LAVENDER_WHITE,
          width: 310,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const dr = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.LAVENDER_WHITE },

  headerDecor: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 180,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 62,   // clears decorative curves
    paddingBottom: 20,
  },
  brand: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, marginBottom: 16,
  },
  brandName: {
    fontSize: 26, fontWeight: '900',
    color: COLORS.MIDNIGHT, letterSpacing: -0.8, lineHeight: 30,
  },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  welcomeText: { fontSize: 16, fontWeight: '600', color: 'rgba(45,27,78,0.8)' },

  sectionLabel: {
    fontSize: 11, fontWeight: '800',
    color: 'rgba(91,45,142,0.65)',
    letterSpacing: 1.5,
    paddingHorizontal: 22, marginBottom: 10, marginTop: 4,
  },
  section: { paddingHorizontal: 12, gap: 10, marginBottom: 6 },

  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 22, paddingHorizontal: 14, paddingVertical: 13,
    shadowColor: COLORS.MIDNIGHT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07, shadowRadius: 20, elevation: 2,
  },
  menuLeft:       { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon:       {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.LAVENDER_WHITE,
    alignItems: 'center', justifyContent: 'center',
  },
  menuIconDanger: { backgroundColor: '#fef2f2' },
  menuLabel:      { fontSize: 15, fontWeight: '600', color: COLORS.MIDNIGHT },
  menuLabelDanger:{ color: '#ef4444' },

  divider: {
    height: 1,
    backgroundColor: 'rgba(192,132,252,0.3)',
    marginHorizontal: 22, marginVertical: 14,
  },

  closeBtn: {
    position: 'absolute', top: 52, right: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(192,132,252,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  footer:     { padding: 20, paddingBottom: 12, alignItems: 'center' },
  footerText: { fontSize: 11, color: 'rgba(45,27,78,0.3)' },
});
