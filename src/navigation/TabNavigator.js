// TabNavigator.js
// 4-tab bottom navigator: Projects, Stash, Discover (+ hidden Home as initial route).
// Color Wheel is accessible from Home Quick Actions and from within Projects.

import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StashScreen    from '../screens/StashScreen';
import ProjectsStack  from './ProjectsStack';
import DiscoverScreen from '../screens/DiscoverScreen';
import HomeStack      from './HomeStack';
import COLORS from '../styles/colors';

const Tab = createBottomTabNavigator();

// Active indicator dot + icon
function TabIcon({ icon, iconFocused, focused }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 2 }}>
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
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 10,
        },
        tabBarActiveTintColor:   COLORS.MINT,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.9)',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: -2 },
        headerStyle:      { backgroundColor: COLORS.DEEP_PLUM },
        headerTintColor:  COLORS.LAVENDER_WHITE,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="home-outline" iconFocused="home" focused={focused} />
          ),
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
        name="Stash"
        component={StashScreen}
        options={{
          title: 'Stash',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="layers-outline" iconFocused="layers" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="sparkles-outline" iconFocused="sparkles" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
