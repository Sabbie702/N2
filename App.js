// App.js — Nimble Needle
// Root: GestureHandlerRootView (required for swipe gestures + drawer)
// wraps NavigationContainer → DrawerNavigator.

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import DrawerNavigator from './src/navigation/DrawerNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <DrawerNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
