// App.js — Nimble Needle
// Loads custom fonts then mounts the navigator.

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

import DrawerNavigator from './src/navigation/DrawerNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular':        require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold':           require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-SemiBold':       require('./assets/fonts/PlayfairDisplay-SemiBold.ttf'),
    'PlayfairDisplay-Italic':         require('./assets/fonts/PlayfairDisplay-Italic.ttf'),
    'PlayfairDisplay-BoldItalic':     require('./assets/fonts/PlayfairDisplay-BoldItalic.ttf'),
    'PlayfairDisplay-SemiBoldItalic': require('./assets/fonts/PlayfairDisplay-SemiBoldItalic.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <DrawerNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
