// ColorStack.js — Color Corner palette builder tab.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ColorWheelScreen from '../screens/ColorWheelScreen';
import COLORS from '../styles/colors';

const Stack = createNativeStackNavigator();

const sharedHeader = {
  headerStyle:      { backgroundColor: COLORS.DEEP_PLUM },
  headerTintColor:  COLORS.LAVENDER_WHITE,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function ColorStack() {
  return (
    <Stack.Navigator screenOptions={sharedHeader}>
      <Stack.Screen
        name="ColorWheelMain"
        component={ColorWheelScreen}
        options={({ navigation }) => ({
          title: 'Color Corner',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="menu" size={24} color={COLORS.LAVENDER_WHITE} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
