// 🎯 src/utils/constants.ts
export const API_BASE_URL = 'https://api.alquran.cloud/v1';

export const QURAN_ENDPOINTS = {
  SURAHS: '/surah',
  SURAH_DETAIL: '/surah',
  EDITIONS: '/edition',
  SEARCH: '/search',
} as const;

export const AUDIO_QUALITY = {
  LOW: '64kbps',
  MEDIUM: '128kbps',
  HIGH: '192kbps',
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  BOOKMARKS: 'bookmarks',
  CACHE: 'cache',
} as const;

export const POPULAR_RECITERS = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    language: 'ar',
  },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdul Rahman Al-Sudais',
    language: 'ar',
  },
  {
    id: 'ar.mahermuaiqly',
    name: 'Maher Al Mueaqly',
    language: 'ar',
  },
] as const;