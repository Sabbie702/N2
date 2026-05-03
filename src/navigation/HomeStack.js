// HomeStack.js
// Stack for the Home tab: HomeScreen + drawer sub-screens (Notes, Profile, Settings).
// These screens live here so the bottom tab bar stays visible on all of them.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen      from '../screens/HomeScreen';
import NotesScreen     from '../screens/NotesScreen';
import ProfileScreen   from '../screens/ProfileScreen';
import SettingsScreen  from '../screens/SettingsScreen';
import ScrapbookScreen from '../screens/ScrapbookScreen';
import COLORS from '../styles/colors';

const Stack = createNativeStackNavigator();

const sharedHeader = {
  headerStyle:      { backgroundColor: COLORS.DEEP_PLUM },
  headerTintColor:  COLORS.LAVENDER_WHITE,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function HomeStack({ navigation }) {
  const HamburgerRight = () => (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ marginRight: 4 }}
    >
      <Ionicons name="menu" size={24} color={COLORS.LAVENDER_WHITE} />
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator screenOptions={sharedHeader}>
      {/* Home — custom header built into HomeScreen; native header hidden */}
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* Notes — keeps its own search-toggle custom header; native header hidden */}
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{ headerShown: false }}
      />

      {/* Profile & Settings — standard Deep Plum header with auto back arrow */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Scrapbook"
        component={ScrapbookScreen}
        options={{ title: 'Scrapbook' }}
      />
    </Stack.Navigator>
  );
}
