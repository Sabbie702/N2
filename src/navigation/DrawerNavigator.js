// src/navigation/DrawerNavigator.js
// Right-side hamburger drawer. Drawer items navigate to HomeStack (Home/Notes/Profile/Settings)
// or to the main tab navigator. HomeStack lives here as a drawer screen so the 4 bottom
// tabs remain clean and evenly spaced.

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image,
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import TabNavigator from './TabNavigator';
import COLORS from '../styles/colors';

const Drawer = createDrawerNavigator();

const DRAWER_ITEMS = [
  { name: 'Home',     label: 'Home',     icon: 'home-outline',          screen: 'HomeMain' },
  { name: 'Notes',    label: 'Notes',    icon: 'document-text-outline', screen: 'Notes' },
  { name: 'Profile',  label: 'Profile',  icon: 'person-outline',        screen: 'Profile' },
  { name: 'Settings', label: 'Settings', icon: 'settings-outline',      screen: 'Settings' },
];

function CustomDrawerContent(props) {
  const { navigation, state } = props;
  const activeRoute = state.routeNames[state.index];

  return (
    <SafeAreaView style={drawer.container}>
      {/* Brand header */}
      <View style={drawer.header}>
        <Image source={require('../../assets/logo.png')} style={drawer.logoImg} resizeMode="contain" />
        <View>
          <Text style={drawer.appName}>Nimble Needle</Text>
          <Text style={drawer.tagline}>From Stash to Stitch.</Text>
        </View>
      </View>

      <View style={drawer.divider} />

      <DrawerContentScrollView {...props} scrollEnabled={false}>
        {DRAWER_ITEMS.map((item) => {
          const isActive = activeRoute === 'HomeNav' &&
            (item.name === 'Home' || item.name === activeRoute);
          return (
            <TouchableOpacity
              key={item.name}
              style={[drawer.item, isActive && drawer.itemActive]}
              onPress={() => {
                navigation.navigate('MainTabs', { screen: 'Home', params: { screen: item.screen } });
                navigation.closeDrawer();
              }}
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
        <Text style={drawer.footerText}>N2 Nimble Needle · V1.1</Text>
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
      {/* Main tab navigator — Home is the initial tab inside */}
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

const drawer = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.MIDNIGHT },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
  },
  logoImg: { width: 44, height: 44, borderRadius: 10 },
  appName:  { fontSize: 15, fontWeight: '700', color: COLORS.LAVENDER_WHITE },
  tagline:  { fontSize: 11, color: COLORS.SOFT_LAVENDER, marginTop: 1 },
  divider:  { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16, marginBottom: 8 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 13, paddingHorizontal: 20,
    borderRadius: 10, marginHorizontal: 8, marginVertical: 2,
  },
  itemActive:      { backgroundColor: 'rgba(78,201,160,0.12)' },
  itemLabel:       { fontSize: 15, color: COLORS.SOFT_LAVENDER },
  itemLabelActive: { color: COLORS.MINT, fontWeight: '600' },
  footer:     { padding: 20, paddingBottom: 10 },
  footerText: { fontSize: 11, color: 'rgba(255,255,255,0.25)' },
});
