// 🗃️ src/store/useQuranStore.ts
import { create } from 'zustand';
import type { Surah, SurahDetail, Bookmark } from '../types';
import { quranApi } from '../services/api/quranApi';

interface QuranState {
  // Data
  surahs: Surah[];
  currentSurah: SurahDetail | null;
  bookmarks: Bookmark[];
  
  // Loading states
  isLoading: boolean;
  isLoadingSurah: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  fetchSurahs: () => Promise<void>;
  fetchSurahDetail: (surahNumber: number, edition?: string) => Promise<void>;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  clearError: () => void;
}

export const useQuranStore = create<QuranState>((set, get) => ({
  // Initial state
  surahs: [],
  currentSurah: null,
  bookmarks: [],
  isLoading: false,
  isLoadingSurah: false,
  error: null,

  // Actions
  fetchSurahs: async () => {
    set({ isLoading: true, error: null });
    try {
      const surahs = await quranApi.getSurahs();
      set({ surahs, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSurahDetail: async (surahNumber: number, edition = 'quran-uthmani') => {
    set({ isLoadingSurah: true, error: null });
    try {
      const surahDetail = await quranApi.getSurahDetail(surahNumber, edition);
      set({ currentSurah: surahDetail, isLoadingSurah: false });
    } catch (error: any) {
      set({ error: error.message, isLoadingSurah: false });
    }
  },

  addBookmark: (bookmark) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      bookmarks: [...state.bookmarks, newBookmark],
    }));
  },

  removeBookmark: (bookmarkId) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
    }));
  },

  clearError: () => set({ error: null }),
}));