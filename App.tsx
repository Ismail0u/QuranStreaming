// 📱 App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Stores
import { useSettingsStore } from './src/store/useSettingsStore';
import { useQuranStore } from './src/store/useQuranStore';

// Styles
import './src/styles/global.css'; // NativeWind global styles

export default function App() {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const fetchSurahs = useQuranStore((state) => state.fetchSurahs);

  useEffect(() => {
    // Charger les données initiales
    const initializeApp = async () => {
      try {
        await fetchSurahs();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [fetchSurahs]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
