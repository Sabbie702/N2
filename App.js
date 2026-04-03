// App.js — Nimble Needle
// This is the root of the app. It wraps everything in a NavigationContainer
// (required by React Navigation) and loads our TabNavigator.

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

// Our custom bottom-tab navigator with all 5 screens
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    // NavigationContainer manages the navigation state for the whole app.
    // Every app using React Navigation must have exactly one of these at the top.
    <NavigationContainer>
      {/* Use a light status bar so it's visible against our deep plum header */}
      <StatusBar style="light" />

      {/* Render the 5-tab navigator */}
      <TabNavigator />
    </NavigationContainer>
  );
}
