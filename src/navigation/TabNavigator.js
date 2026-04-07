// TabNavigator.js
// 6-tab bottom navigator for Nimble Needle.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen    from '../screens/HomeScreen';
import StashScreen   from '../screens/StashScreen';
import ProjectsStack from './ProjectsStack';
import ColorStack    from './ColorStack';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen  from '../screens/ProfileScreen';

import COLORS from '../styles/colors';

const Tab = createBottomTabNavigator();

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
        tabBarStyle: {
          backgroundColor: COLORS.MIDNIGHT,
          borderTopColor: COLORS.DEEP_PLUM,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor:   COLORS.MINT,
        tabBarInactiveTintColor: COLORS.SOFT_LAVENDER,
        headerStyle:      { backgroundColor: COLORS.DEEP_PLUM },
        headerTintColor:  COLORS.LAVENDER_WHITE,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Stash"
        component={StashScreen}
        options={{
          title: 'Stash',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🧵" focused={focused} />,
        }}
      />

      {/* Projects tab — ProjectsStack owns its own header */}
      <Tab.Screen
        name="Projects"
        component={ProjectsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />

      {/* Color Wheel tab — ColorStack owns its own header */}
      <Tab.Screen
        name="Colors"
        component={ColorStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Colors',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎨" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
