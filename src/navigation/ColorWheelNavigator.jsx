/**
 * N2 — Nimble Needle
 * ColorWheelNavigator
 *
 * Stack navigator for the Color Corner feature.
 * Registered as the 'ColorWheel' screen in ProjectsStack.
 *
 * Navigation from Stash or Project screens:
 *   navigation.navigate('Projects', {
 *     screen: 'ColorWheel',
 *     params: {
 *       screen: 'HarmonyResults',
 *       params: { sourceHex: fabric.hex, sourceName: fabric.name, sourceType: 'stash' }
 *     }
 *   });
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ColorWheelScreen     from '../screens/colorwheel/ColorWheelScreen';
import HarmonyResultsScreen from '../screens/colorwheel/HarmonyResultsScreen';
import PhotoExtractScreen   from '../screens/colorwheel/PhotoExtractScreen';

const Stack = createNativeStackNavigator();

export default function ColorWheelNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:  false,
        animation:    'slide_from_right',
        contentStyle: { backgroundColor: '#F5F0FA' },
      }}
    >
      <Stack.Screen name="ColorWheelMain"   component={ColorWheelScreen}     />
      <Stack.Screen name="HarmonyResults"   component={HarmonyResultsScreen} />
      <Stack.Screen name="PhotoExtract"     component={PhotoExtractScreen}   />
    </Stack.Navigator>
  );
}
