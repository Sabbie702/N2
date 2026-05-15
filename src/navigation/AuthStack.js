// AuthStack.js — auth flow: Welcome → Login/CreateAccount → Onboarding → Success.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen              from '../screens/WelcomeScreen';
import LoginScreen                from '../screens/LoginScreen';
import CreateAccountScreen        from '../screens/CreateAccountScreen';
import OnboardingPreferencesScreen from '../screens/OnboardingPreferencesScreen';
import SuccessScreen              from '../screens/SuccessScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({ onComplete }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        initialParams={{ onComplete }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        initialParams={{ onComplete }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingPreferencesScreen}
        initialParams={{ onComplete }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        initialParams={{ onComplete }}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
