// 🗺️ src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

// Navigators
import TabNavigator from './TabNavigator';

// Screens
import SurahDetailScreen from '../screens/SurahDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
      />
      <Stack.Screen 
        name="SurahDetail" 
        component={SurahDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AudioPlayer" 
        component={AudioPlayerScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
