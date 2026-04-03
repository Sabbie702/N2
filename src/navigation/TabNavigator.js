// TabNavigator.js
// Sets up the 5 main bottom tabs for Nimble Needle.
// Each tab icon uses Mint when inactive and Deep Plum when active.
// The active tab label and indicator use Deep Plum (our primary brand color).

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import each screen
import HomeScreen from '../screens/HomeScreen';
import StashScreen from '../screens/StashScreen';
import ProjectsStack from './ProjectsStack';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import brand colors
import COLORS from '../styles/colors';

// Create the bottom tab navigator instance
const Tab = createBottomTabNavigator();

// Simple emoji-based tab icons — swap these for an icon library later
// (e.g., @expo/vector-icons) when you're ready to polish the UI.
function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        // Style the bottom bar itself
        tabBarStyle: {
          backgroundColor: COLORS.MIDNIGHT,  // Dark bar background
          borderTopColor: COLORS.DEEP_PLUM,  // Subtle plum top border
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        // Active tab label color
        tabBarActiveTintColor: COLORS.MINT,
        // Inactive tab label color
        tabBarInactiveTintColor: COLORS.SOFT_LAVENDER,
        // Header style for every screen
        headerStyle: {
          backgroundColor: COLORS.DEEP_PLUM,
        },
        headerTintColor: COLORS.LAVENDER_WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* ── Home ── */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} />
          ),
        }}
      />

      {/* ── Stash ── */}
      <Tab.Screen
        name="Stash"
        component={StashScreen}
        options={{
          title: 'Stash',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🧵" focused={focused} />
          ),
        }}
      />

      {/* ── Projects ── */}
      {/* headerShown: false lets ProjectsStack own its own headers */}
      <Tab.Screen
        name="Projects"
        component={ProjectsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" focused={focused} />
          ),
        }}
      />

      {/* ── Discover ── */}
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔍" focused={focused} />
          ),
        }}
      />

      {/* ── Profile ── */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
