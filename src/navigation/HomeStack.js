// HomeStack.js
// Stack for the Home tab: HomeScreen + drawer sub-screens (Notes, Profile, Settings).
// These screens live here so the bottom tab bar stays visible on all of them.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen     from '../screens/HomeScreen';
import NotesScreen    from '../screens/NotesScreen';
import ProfileScreen  from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import COLORS from '../styles/colors';

const Stack = createNativeStackNavigator();

export default function HomeStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:      { backgroundColor: COLORS.DEEP_PLUM },
        headerTintColor:  COLORS.LAVENDER_WHITE,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Home — uses its own custom header, native header hidden */}
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* Notes — uses its own custom header (search toggle); native header hidden */}
      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{ headerShown: false }}
      />

      {/* Profile & Settings — use the standard Deep Plum native header (back arrow auto-added) */}
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
    </Stack.Navigator>
  );
}
