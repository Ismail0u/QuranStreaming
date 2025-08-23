// 📝 src/types/user.ts
import { AudioQuality } from "./audio";

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar' | 'fr';
  defaultReciter: string;
  audioQuality: AudioQuality;
  arabicTextSize: 'small' | 'medium' | 'large';
  translationTextSize: 'small' | 'medium' | 'large';
  notifications: {
    dailyReminder: boolean;
    reminderTime: string;
  };
}

export interface UserStats {
  totalListeningTime: number; // in minutes
  surahsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  favoriteReciter: string;
  mostListenedSurah: number;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  surahNumber: number;
  ayahNumber?: number;
  timestamp: string;
  duration: number; // listening duration in seconds
  completed: boolean;
}