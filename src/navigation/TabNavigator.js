// TabNavigator.js
// 4-tab bottom navigator: Stash, Projects, Colors, Discover.
// Home and Notes live in the drawer (hamburger).

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeStack     from './HomeStack';
import StashScreen    from '../screens/StashScreen';
import ProjectsStack  from './ProjectsStack';
import ColorStack     from './ColorStack';
import DiscoverScreen from '../screens/DiscoverScreen';
import COLORS from '../styles/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

// Hamburger button for tab screen headers
function HamburgerButton({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{ marginLeft: 14 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="menu" size={24} color={COLORS.LAVENDER_WHITE} />
    </TouchableOpacity>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
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
        headerLeft: () => <HamburgerButton navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
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

      <Tab.Screen
        name="Projects"
        component={ProjectsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />

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
    </Tab.Navigator>
  );
}
