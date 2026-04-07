// ProjectsStack.js
// Stack for the Projects tab:
//   ProjectsList → NewProject
//   ProjectsList → ProjectWorkspace → ColorWheel (resume editing)

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProjectsScreen         from '../screens/ProjectsScreen';
import NewProjectScreen       from '../screens/NewProjectScreen';
import ProjectWorkspaceScreen from '../screens/ProjectWorkspaceScreen';
import ColorWheelScreen       from '../screens/ColorWheelScreen';
import COLORS from '../styles/colors';

const Stack = createNativeStackNavigator();

const sharedHeader = {
  headerStyle:      { backgroundColor: COLORS.DEEP_PLUM },
  headerTintColor:  COLORS.LAVENDER_WHITE,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function ProjectsStack() {
  return (
    <Stack.Navigator screenOptions={sharedHeader}>

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
              <Text style={{ fontSize: 28, color: COLORS.LAVENDER_WHITE, lineHeight: 32, fontWeight: '300' }}>
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

      <Stack.Screen
        name="ProjectWorkspace"
        component={ProjectWorkspaceScreen}
        options={({ route }) => ({ title: route.params?.projectName || 'Project' })}
      />

      {/* ColorWheel pushed from ProjectWorkspace when resuming palette editing */}
      <Stack.Screen
        name="ColorWheel"
        component={ColorWheelScreen}
        options={{ headerShown: false }} // Screen manages its own header
      />

    </Stack.Navigator>
  );
}
