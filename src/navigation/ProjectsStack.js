// ProjectsStack.js
// Stack for the Projects tab:
//   ProjectsList → NewProject
//   ProjectsList → ProjectWorkspace → ColorWheel (resume editing)

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ProjectsScreen         from '../screens/ProjectsScreen';
import NewProjectScreen       from '../screens/NewProjectScreen';
import ProjectWorkspaceScreen from '../screens/ProjectWorkspaceScreen';
import EditProjectScreen      from '../screens/EditProjectScreen';
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NewProject')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 28, color: COLORS.LAVENDER_WHITE, lineHeight: 32, fontWeight: '300' }}>
                  +
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="menu" size={24} color={COLORS.LAVENDER_WHITE} />
              </TouchableOpacity>
            </View>
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

      <Stack.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={{ title: 'Edit Project' }}
      />

      {/* ColorWheel — owns its own WizardHeader; native header hidden */}
      <Stack.Screen
        name="ColorWheel"
        component={ColorWheelScreen}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}
