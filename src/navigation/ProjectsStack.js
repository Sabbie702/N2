// ProjectsStack.js
// Stack navigator for the Projects tab.
// ProjectsScreen (list) → NewProjectScreen (form)

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProjectsScreen from '../screens/ProjectsScreen';
import NewProjectScreen from '../screens/NewProjectScreen';
import COLORS from '../styles/colors';

const Stack = createNativeStackNavigator();

// Shared header options to match the rest of the app
const sharedHeaderOptions = {
  headerStyle: { backgroundColor: COLORS.DEEP_PLUM },
  headerTintColor: COLORS.LAVENDER_WHITE,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function ProjectsStack() {
  return (
    <Stack.Navigator screenOptions={sharedHeaderOptions}>
      <Stack.Screen
        name="ProjectsList"
        component={ProjectsScreen}
        options={({ navigation }) => ({
          title: 'Projects',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('NewProject')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                style={{
                  fontSize: 28,
                  color: COLORS.LAVENDER_WHITE,
                  lineHeight: 32,
                  fontWeight: '300',
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="NewProject"
        component={NewProjectScreen}
        options={{ title: 'New Project' }}
      />
    </Stack.Navigator>
  );
}
