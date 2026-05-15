// src/navigation/DrawerNavigator.js
// Right-side drawer — dark Midnight theme, 270px wide.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import TabNavigator from './TabNavigator';
import { AppLogo } from '../screens/HomeScreen';
import COLORS from '../styles/colors';

const Drawer = createDrawerNavigator();

const CREAM       = '#FFF7E9';
const CREAM_DIM   = 'rgba(255,247,233,0.72)';
const CREAM_FAINT = 'rgba(255,247,233,0.28)';

function MenuRow({ icon, label, variant = 'default', onPress }) {
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity style={dr.menuRow} onPress={onPress} activeOpacity={0.75}>
      <View style={dr.menuLeft}>
        <View style={[dr.menuIcon, isDanger && dr.menuIconDanger]}>
          <Ionicons name={icon} size={22} color={isDanger ? '#f87171' : COLORS.SOFT_LAVENDER} />
        </View>
        <Text style={[dr.menuLabel, isDanger && dr.menuLabelDanger]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={isDanger ? '#f87171' : CREAM_FAINT} />
    </TouchableOpacity>
  );
}

function CustomDrawerContent({ navigation }) {
  const go = (screen) => {
    navigation.navigate('MainTabs', { screen: 'Home', params: { screen } });
    navigation.closeDrawer();
  };
  const goCalc = () => {
    navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'Calculator' } });
    navigation.closeDrawer();
  };
  const close = () => navigation.closeDrawer();

  return (
    <SafeAreaView style={dr.container}>
      <View style={dr.headerDecor} pointerEvents="none">
        <Svg width="100%" height="180">
          <Path d="M-20 52 C62 10 92 118 170 60 C245 4 270 122 350 50"
            fill="none" stroke={COLORS.SOFT_LAVENDER} strokeWidth="2"
            strokeDasharray="8 8" opacity="0.2" />
          <Path d="M-10 145 C72 100 120 174 205 112 C270 68 302 154 350 118"
            fill="none" stroke={COLORS.SOFT_LAVENDER} strokeWidth="2"
            strokeDasharray="8 8" opacity="0.2" />
        </Svg>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={dr.header}>
          <View style={dr.brand}>
            <AppLogo size={52} />
            <Text style={dr.brandName}>Nimble{'\n'}Needle</Text>
          </View>
          <View style={dr.welcomeRow}>
            <Text style={dr.welcomeText}>Welcome, Sabbie!</Text>
            <Text style={{ fontSize: 20 }}>💚</Text>
          </View>
        </View>

        <Text style={dr.sectionLabel}>MAIN MENU</Text>
        <View style={dr.section}>
          <MenuRow icon="person-outline"     label="Profile"              onPress={() => go('Profile')}  />
          <MenuRow icon="settings-outline"   label="App Settings"         onPress={() => go('Settings')} />
          <MenuRow icon="calculator-outline" label="Quilt Calculator"     onPress={goCalc}               />
          <MenuRow icon="archive-outline"    label="Storage Spots"        onPress={close}                />
          <MenuRow icon="book-outline"       label="App Help & Tutorials" onPress={close}                />
        </View>

        <View style={dr.divider} />

        <Text style={dr.sectionLabel}>ACCOUNT & UTILITY</Text>
        <View style={dr.section}>
          <MenuRow icon="trophy-outline"           label="Subscription"    onPress={close} />
          <MenuRow icon="headset-outline"          label="Contact Support" onPress={close} />
          <MenuRow icon="shield-checkmark-outline" label="Privacy & Terms" onPress={close} />
          <MenuRow icon="log-out-outline"          label="Log Out" variant="danger" onPress={close} />
        </View>
      </ScrollView>

      <View style={dr.footer}>
        <Text style={dr.footerText}>N2 Nimble Needle · V1.2</Text>
      </View>
    </SafeAreaView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: COLORS.MIDNIGHT,
          width: 270,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

const dr = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.MIDNIGHT },

  headerDecor: { position: 'absolute', top: 0, left: 0, right: 0, height: 180 },

  header: { paddingHorizontal: 22, paddingTop: 58, paddingBottom: 20 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  brandName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24, fontWeight: '700',
    color: CREAM, letterSpacing: -0.8, lineHeight: 28,
  },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  welcomeText: { fontSize: 15, fontWeight: '600', color: CREAM_DIM },

  sectionLabel: {
    fontSize: 11, fontWeight: '800',
    color: 'rgba(192,132,252,0.65)',
    letterSpacing: 1.5,
    paddingHorizontal: 22, marginBottom: 10, marginTop: 4,
  },
  section: { paddingHorizontal: 12, gap: 8, marginBottom: 6 },

  menuRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12,
  },
  menuLeft:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon:        {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  menuIconDanger:  { backgroundColor: 'rgba(248,113,113,0.15)' },
  menuLabel:       { fontSize: 14, fontWeight: '600', color: CREAM },
  menuLabelDanger: { color: '#f87171' },

  divider: {
    height: 1, backgroundColor: 'rgba(192,132,252,0.18)',
    marginHorizontal: 22, marginVertical: 12,
  },

  footer:     { padding: 20, paddingBottom: 12, alignItems: 'center' },
  footerText: { fontSize: 11, color: CREAM_FAINT },
});
