// src/navigation/DrawerNavigator.js
// Hamburger drawer: wraps the main tab navigator.
// Drawer items: Home, Notes, Profile, Settings.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import TabNavigator    from './TabNavigator';
import HomeScreen      from '../screens/HomeScreen';
import NotesScreen     from '../screens/NotesScreen';
import ProfileScreen   from '../screens/ProfileScreen';
import SettingsScreen  from '../screens/SettingsScreen';
import COLORS from '../styles/colors';

const Drawer = createDrawerNavigator();

const DRAWER_ITEMS = [
  { name: 'Home',     label: 'Home',     icon: 'home-outline' },
  { name: 'Notes',    label: 'Notes',    icon: 'document-text-outline' },
  { name: 'Profile',  label: 'Profile',  icon: 'person-outline' },
  { name: 'Settings', label: 'Settings', icon: 'settings-outline' },
];

function CustomDrawerContent(props) {
  const { navigation, state } = props;
  const activeRoute = state.routeNames[state.index];

  return (
    <SafeAreaView style={drawer.container}>
      {/* Brand header */}
      <View style={drawer.header}>
        <View style={drawer.logoMark}>
          <Text style={drawer.logoText}>N2</Text>
        </View>
        <View>
          <Text style={drawer.appName}>Nimble Needle</Text>
          <Text style={drawer.tagline}>From Stash to Stitch.</Text>
        </View>
      </View>

      <View style={drawer.divider} />

      <DrawerContentScrollView {...props} scrollEnabled={false}>
        {DRAWER_ITEMS.map((item) => {
          const isActive = activeRoute === item.name ||
            (activeRoute === 'MainTabs' && item.name === 'Home');
          return (
            <TouchableOpacity
              key={item.name}
              style={[drawer.item, isActive && drawer.itemActive]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? COLORS.MINT : COLORS.SOFT_LAVENDER}
              />
              <Text style={[drawer.itemLabel, isActive && drawer.itemLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={drawer.footer}>
        <Text style={drawer.footerText}>N2 Nimble Needle · V1</Text>
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
        drawerStyle: {
          backgroundColor: COLORS.MIDNIGHT,
          width: 270,
        },
      }}
    >
      {/* Main app — bottom tabs */}
      <Drawer.Screen name="MainTabs" component={TabNavigator} />

      {/* Drawer-only screens */}
      <Drawer.Screen name="Home"     component={HomeScreen} />
      <Drawer.Screen name="Notes"    component={NotesScreen} />
      <Drawer.Screen name="Profile"  component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const drawer = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.MIDNIGHT },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
  },
  logoMark: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: COLORS.DEEP_PLUM,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  appName:  { fontSize: 15, fontWeight: '700', color: COLORS.LAVENDER_WHITE },
  tagline:  { fontSize: 11, color: COLORS.SOFT_LAVENDER, marginTop: 1 },
  divider:  { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16, marginBottom: 8 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 13, paddingHorizontal: 20,
    borderRadius: 10, marginHorizontal: 8, marginVertical: 2,
  },
  itemActive: { backgroundColor: 'rgba(78,201,160,0.12)' },
  itemLabel:  { fontSize: 15, color: COLORS.SOFT_LAVENDER },
  itemLabelActive: { color: COLORS.MINT, fontWeight: '600' },
  footer: { padding: 20, paddingBottom: 10 },
  footerText: { fontSize: 11, color: 'rgba(255,255,255,0.25)' },
});
