// 📱 App.tsx (production-ready startup: fonts, splash, initial fetch, react-query)
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Stores
import { useSettingsStore } from './src/store/useSettingsStore';
import { useQuranStore } from './src/store/useQuranStore';

// Styles (NativeWind global styles)
import './src/styles/global.css';

// Prevent splash screen from auto-hiding until we explicitly hide it
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore if already prevented in some environments */
});

const queryClient = new QueryClient();

export default function App(): JSX.Element {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const fetchSurahs = useQuranStore((state) => state.fetchSurahs);

  // app readiness / error states
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);

  /**
   * loadFonts: load Uthmani (Arabic) + any other fonts you need.
   * Place the font file(s) in ./assets/fonts/ and update the require path accordingly.
   */
  const loadFonts = async () => {
    await Font.loadAsync({
    Uthmani: require('./src/assets/fonts/AmiriQuran-Regular.ttf'), // ou le nom que tu as choisi
    //Inter: require('./assets/fonts/Inter-Regular.ttf'),
    });
  };

  /**
   * initializeApp: load fonts + initial data
   * We keep the splash screen visible until everything is ready.
   */
  const initializeApp = useCallback(async () => {
    try {
      setInitError(null);
      // 1. load fonts
      await loadFonts();

      // 2. any other async startup tasks can go here (analytics init, Sentry, etc.)

      // 3. fetch minimal data (surah list)
      //    note: keep fetchSurahs simple and idempotent in the store
      await fetchSurahs();

      // 4. mark ready and hide splash
      setIsReady(true);
      await SplashScreen.hideAsync();
    } catch (error: any) {
      console.error('App initialization failed:', error);
      setInitError(error instanceof Error ? error : new Error(String(error)));
      // keep splash visible — show an error UI overlay below
      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignore
      }
    }
  }, [fetchSurahs]);

  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retry handler for init errors
  const handleRetry = async () => {
    setInitError(null);
    setIsReady(false);
    await SplashScreen.preventAutoHideAsync().catch(() => {});
    initializeApp();
  };

  // If not ready, render a minimal error/loader UI (splash is hidden only if an error occurred)
  if (!isReady) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <View style={[styles.center, { backgroundColor: isDarkMode ? '#0b1220' : '#fff' }]}>
              {initError ? (
                <View style={styles.errorBox}>
                  <Text style={[styles.errorTitle, { color: isDarkMode ? '#fff' : '#111' }]}>
                    Erreur au démarrage
                  </Text>
                  <Text style={[styles.errorMessage, { color: isDarkMode ? '#cbd5e1' : '#444' }]}>
                    {initError.message || 'Une erreur est survenue lors de l\'initialisation de l\'application.'}
                  </Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
                    <Text style={styles.retryText}>Réessayer</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // nothing (splash still visible) — keep a fallback spinner if splash hiding fails
                <View style={styles.centerContent}>
                  <Text style={{ color: isDarkMode ? '#fff' : '#111' }}>Préparation...</Text>
                </View>
              )}
            </View>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // When ready: normal app render with react-query provider
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <AppNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContent: { padding: 12, alignItems: 'center' },
  errorBox: {
    width: '90%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  errorTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  errorMessage: { fontSize: 14, textAlign: 'center', marginBottom: 12 },
  retryBtn: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '700' },
});
