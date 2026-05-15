// App.js — Nimble Needle
// Loads fonts, checks onboarding state, then renders auth flow or main app.

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DrawerNavigator from './src/navigation/DrawerNavigator';
import AuthStack       from './src/navigation/AuthStack';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular':        require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold':           require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-SemiBold':       require('./assets/fonts/PlayfairDisplay-SemiBold.ttf'),
    'PlayfairDisplay-Italic':         require('./assets/fonts/PlayfairDisplay-Italic.ttf'),
    'PlayfairDisplay-BoldItalic':     require('./assets/fonts/PlayfairDisplay-BoldItalic.ttf'),
    'PlayfairDisplay-SemiBoldItalic': require('./assets/fonts/PlayfairDisplay-SemiBoldItalic.ttf'),
  });

  const [isOnboarded, setIsOnboarded] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('@onboarding_complete').then(val => {
      setIsOnboarded(val === 'true');
    });
  }, []);

  if (!fontsLoaded || isOnboarded === null) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style={isOnboarded ? 'light' : 'dark'} />
        {isOnboarded ? (
          <DrawerNavigator />
        ) : (
          <AuthStack onComplete={() => setIsOnboarded(true)} />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
