import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import DiscoverScreen        from '../screens/DiscoverScreen';
import PatternListScreen     from '../screens/Patterns/PatternListScreen';
import PatternDetailsScreen  from '../screens/Patterns/PatternDetailsScreen';
import COLORS from '../styles/colors';

const Stack = createNativeStackNavigator();

const sharedHeader = {
  headerStyle:      { backgroundColor: COLORS.DEEP_PLUM },
  headerTintColor:  COLORS.LAVENDER_WHITE,
  headerTitleStyle: { fontFamily: 'Inter_700Bold' },
};

export default function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={sharedHeader}>
      <Stack.Screen
        name="DiscoverMain"
        component={DiscoverScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatternList"
        component={PatternListScreen}
        options={({ navigation }) => ({
          title: 'My Patterns',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PatternDetails', { mode: 'add' })}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginRight: 4 }}
            >
              <Ionicons name="add-circle-outline" size={26} color={COLORS.MINT} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PatternDetails"
        component={PatternDetailsScreen}
        options={{ title: 'Pattern Details' }}
      />
    </Stack.Navigator>
  );
}
