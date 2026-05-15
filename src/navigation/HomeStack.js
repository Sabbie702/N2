// HomeStack.js
// Home + drawer sub-screens + Quilt Calculator stack.
// Calculator lives here so the bottom tab bar stays visible on all calc screens.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen              from '../screens/HomeScreen';
import NotesScreen             from '../screens/NotesScreen';
import ProfileScreen           from '../screens/ProfileScreen';
import SettingsScreen          from '../screens/SettingsScreen';
import CalculatorHubScreen     from '../screens/CalculatorHubScreen';
import BlockCalculatorScreen   from '../screens/BlockCalculatorScreen';
import YardageCalculatorScreen from '../screens/YardageCalculatorScreen';
import BackingCalculatorScreen from '../screens/BackingCalculatorScreen';
import BindingCalculatorScreen from '../screens/BindingCalculatorScreen';
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
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Notes"
        component={NotesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Profile"  component={ProfileScreen}  options={{ title: 'Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />

      {/* Quilt Calculator */}
      <Stack.Screen
        name="Calculator"
        component={CalculatorHubScreen}
        options={({ navigation: nav }) => ({
          title: 'Quilt Calculator',
          headerRight: () => <HamburgerRight />,
        })}
      />
      <Stack.Screen
        name="BlockCalculator"
        component={BlockCalculatorScreen}
        options={{ title: 'Block Calculator' }}
      />
      <Stack.Screen
        name="YardageCalculator"
        component={YardageCalculatorScreen}
        options={{ title: 'Yardage Calculator' }}
      />
      <Stack.Screen
        name="BackingCalculator"
        component={BackingCalculatorScreen}
        options={{ title: 'Backing Calculator' }}
      />
      <Stack.Screen
        name="BindingCalculator"
        component={BindingCalculatorScreen}
        options={{ title: 'Binding Calculator' }}
      />
    </Stack.Navigator>
  );
}
