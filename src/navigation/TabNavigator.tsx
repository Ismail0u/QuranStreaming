// 🗺️ src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import type { TabParamList } from '../types/navigation';

// Screens
import HomeScreen from '../screens/HomeScreen';
import QuranScreen from '../screens/QuranScreen';
import AudioScreen from '../screens/AudioScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Stores
import { useSettingsStore } from '../store/useSettingsStore';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  
  const tabBarStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderTopColor: isDarkMode ? '#374151' : '#e5e7eb',
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  };

  const activeColor = '#0ea5e9';
  const inactiveColor = isDarkMode ? '#64748b' : '#9ca3af';

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Quran':
              iconName = 'book-open';
              break;
            case 'Audio':
              iconName = 'headphones';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Quran" 
        component={QuranScreen}
        options={{ tabBarLabel: 'Quran' }}
      />
      <Tab.Screen 
        name="Audio" 
        component={AudioScreen}
        options={{ tabBarLabel: 'Listen' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}