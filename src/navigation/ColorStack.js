// ColorStack.js
// Stack for the Color Wheel tab — standalone palette creation.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ColorWheelScreen from '../screens/ColorWheelScreen';

const Stack = createNativeStackNavigator();

export default function ColorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ColorWheel"
        component={ColorWheelScreen}
        options={{ headerShown: false }} // Screen manages its own header
      />
    </Stack.Navigator>
  );
}
