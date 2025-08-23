// 🗃️ src/store/useUserStore.ts
import { create } from 'zustand';
import type { UserPreferences, UserStats, HistoryEntry } from '../types';

interface UserState {
  preferences: UserPreferences;
  stats: UserStats;
  history: HistoryEntry[];
  isFirstLaunch: boolean;
  
  // Actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id'>) => void;
  clearHistory: () => void;
  setFirstLaunchComplete: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  defaultReciter: 'ar.alafasy',
  audioQuality: '128kbps',
  arabicTextSize: 'medium',
  translationTextSize: 'medium',
  notifications: {
    dailyReminder: true,
    reminderTime: '08:00',
  },
};

const defaultStats: UserStats = {
  totalListeningTime: 0,
  surahsCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  favoriteReciter: 'ar.alafasy',
  mostListenedSurah: 1,
};

export const useUserStore = create<UserState>((set, get) => ({
  preferences: defaultPreferences,
  stats: defaultStats,
  history: [],
  isFirstLaunch: true,

  updatePreferences: (newPreferences) => {
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    }));
  },

  updateStats: (newStats) => {
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    }));
  },

  addHistoryEntry: (entry) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    set((state) => ({
      history: [newEntry, ...state.history].slice(0, 100), // Keep last 100 entries
    }));
  },

  clearHistory: () => set({ history: [] }),

  setFirstLaunchComplete: () => set({ isFirstLaunch: false }),
}));
