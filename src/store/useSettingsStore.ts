// 🗃️ src/store/useSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // App Settings
  isDarkMode: boolean;
  fontSize: number;
  language: 'en' | 'ar' | 'fr';
  
  // Audio Settings
  autoPlay: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
  wifiOnlyDownload: boolean;
  
  // Notification Settings
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  reminderDays: boolean[];
  
  // Privacy Settings
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  
  // Actions
  toggleDarkMode: () => void;
  setFontSize: (size: number) => void;
  setLanguage: (lang: 'en' | 'ar' | 'fr') => void;
  updateAudioSettings: (settings: Partial<Pick<SettingsState, 'autoPlay' | 'downloadQuality' | 'wifiOnlyDownload'>>) => void;
  updateNotificationSettings: (settings: Partial<Pick<SettingsState, 'notificationsEnabled' | 'dailyReminderTime' | 'reminderDays'>>) => void;
  updatePrivacySettings: (settings: Partial<Pick<SettingsState, 'analyticsEnabled' | 'crashReportingEnabled'>>) => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default values
      isDarkMode: false,
      fontSize: 16,
      language: 'en',
      autoPlay: false,
      downloadQuality: 'medium',
      wifiOnlyDownload: true,
      notificationsEnabled: true,
      dailyReminderTime: '08:00',
      reminderDays: [true, true, true, true, true, true, true], // All days enabled
      analyticsEnabled: true,
      crashReportingEnabled: true,

      // Actions
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      setFontSize: (fontSize) => set({ fontSize }),
      
      setLanguage: (language) => set({ language }),
      
      updateAudioSettings: (settings) => set((state) => ({ ...state, ...settings })),
      
      updateNotificationSettings: (settings) => set((state) => ({ ...state, ...settings })),
      
      updatePrivacySettings: (settings) => set((state) => ({ ...state, ...settings })),
      
      resetToDefaults: () => set({
        isDarkMode: false,
        fontSize: 16,
        language: 'en',
        autoPlay: false,
        downloadQuality: 'medium',
        wifiOnlyDownload: true,
        notificationsEnabled: true,
        dailyReminderTime: '08:00',
        reminderDays: [true, true, true, true, true, true, true],
        analyticsEnabled: true,
        crashReportingEnabled: true,
      }),
    }),
    {
      name: 'settings-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 