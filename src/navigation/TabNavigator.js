// TabNavigator.js
// 4 visible tabs: Stash, Projects, Colors, Discover.
// Home is hidden as the initial route so the tab bar renders on Home screens.

import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StashScreen    from '../screens/StashScreen';
import ProjectsStack  from './ProjectsStack';
import DiscoverScreen from '../screens/DiscoverScreen';
import HomeStack      from './HomeStack';
import ColorStack     from './ColorStack';
import COLORS from '../styles/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, iconFocused, focused }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 2 }}>
      {/* Mint pill indicator for active tab */}
      <View style={{
        width: 28, height: 4, borderRadius: 2,
        backgroundColor: focused ? COLORS.MINT : 'transparent',
        marginBottom: 4,
      }} />
      <Ionicons
        name={focused ? iconFocused : icon}
        size={24}
        color={focused ? COLORS.MINT : COLORS.SOFT_LAVENDER}
      />
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.MIDNIGHT,
          borderTopColor: 'transparent',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingBottom: 8,
          paddingTop: 4,
          height: 86,
          position: 'absolute',
          shadowColor: COLORS.MIDNIGHT,
          shadowOffset: { width: 0, height: -18 },
          shadowOpacity: 0.35,
          shadowRadius: 40,
          elevation: 10,
        },
        tabBarActiveTintColor: 'rgba(255,255,255,0.9)',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.9)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          marginTop: -2,
        },
        headerStyle: { backgroundColor: COLORS.DEEP_PLUM },
        headerTintColor: COLORS.LAVENDER_WHITE,
        headerTitleStyle: { fontFamily: 'Inter_700Bold' },
      }}
    >
      {/* Home — hidden; initial route so tab bar renders on Home screens */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="home-outline" iconFocused="home" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="Stash"
        component={StashScreen}
        options={{
          title: 'Stash',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="layers-outline" iconFocused="layers" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Stash',
        }}
      />

      <Tab.Screen
        name="Projects"
        component={ProjectsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="grid-outline" iconFocused="grid" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Colors"
        component={ColorStack}
        options={{
          headerShown: false,
          title: 'Colors',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="color-palette-outline" iconFocused="color-palette" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="compass-outline" iconFocused="compass" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Discover',
        }}
      />
    </Tab.Navigator>
  );
}
