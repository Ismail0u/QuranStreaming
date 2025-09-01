// 🗃️ src/store/useAudioStore.ts - Corrected Version
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AudioTrack, PlaybackState, Reciter, RepeatMode } from '../types';

interface AudioState extends PlaybackState {
  playlist: AudioTrack[];
  currentIndex: number;
  history: AudioTrack[];
  favorites: string[];
  volume: number;
  playbackRate: number;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  selectedReciter: Reciter | null;
  autoNext: boolean;
  crossfadeEnabled: boolean;
  showLyrics: boolean;
  showVisualizer: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
  wifiOnlyDownload: boolean;
  cacheSize: number;
  play: (track?: AudioTrack) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  togglePlayPause: () => Promise<void>;
  addToPlaylist: (track: AudioTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  clearPlaylist: () => void;
  reorderPlaylist: (fromIndex: number, toIndex: number) => void;
  addToFavorites: (trackId: string) => void;
  removeFromFavorites: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  addToHistory: (track: AudioTrack) => void;
  clearHistory: () => void;
  setReciter: (reciter: Reciter | null) => void;
  toggleLyrics: () => void;
  toggleVisualizer: () => void;
  updatePlaybackState: (state: Partial<PlaybackState>) => void;
  resetPlayer: () => void;
  getCacheSize: () => number;
  clearCache: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      // Initial Playback State
      isPlaying: false,
      currentTrack: undefined,
      position: 0,
      duration: 0,
      isLoading: false,
      error: undefined,

      // Initial Settings & State
      playlist: [],
      currentIndex: 0,
      history: [],
      favorites: [],
      volume: 0.8,
      playbackRate: 1.0,
      repeatMode: 'off',
      shuffleEnabled: false,
      selectedReciter: null,
      autoNext: true,
      crossfadeEnabled: false,
      showLyrics: false,
      showVisualizer: false,
      downloadQuality: 'medium',
      wifiOnlyDownload: true,
      cacheSize: 0,

      // Enhanced Actions
      play: async (track) => {
        const state = get();

        if (track) {
          state.addToHistory(track);
          set({
            currentTrack: track,
            isPlaying: true,
            isLoading: true,
            error: undefined,
            position: 0,
          });

          const trackIndex = state.playlist.findIndex(t => t.id === track.id);
          if (trackIndex !== -1) {
            set({ currentIndex: trackIndex });
          }
        } else {
          set({ isPlaying: true });
        }
      },

      pause: async () => {
        set({ isPlaying: false });
      },

      stop: async () => {
        set({
          isPlaying: false,
          position: 0,
          isLoading: false,
        });
      },

      togglePlayPause: async () => {
        const { isPlaying, play, pause } = get();
        if (isPlaying) {
          await pause();
        } else {
          await play();
        }
      },

      next: async () => {
        const { playlist, currentIndex, repeatMode, shuffleEnabled } = get();

        if (playlist.length === 0) return;

        let nextIndex: number;

        if (shuffleEnabled) {
          const availableIndices = playlist.map((_, i) => i).filter(i => i !== currentIndex);
          nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        } else {
          nextIndex = currentIndex + 1;
          if (nextIndex >= playlist.length) {
            if (repeatMode === 'all') {
              nextIndex = 0;
            } else {
              return;
            }
          }
        }

        const nextTrack = playlist[nextIndex];
        if (nextTrack) {
          set({ currentIndex: nextIndex });
          await get().play(nextTrack);
        }
      },

      previous: async () => {
        const { playlist, currentIndex, position } = get();

        if (playlist.length === 0) return;

        if (position > 3000) {
          await get().seekTo(0);
          return;
        }

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = playlist.length - 1;
        }

        const prevTrack = playlist[prevIndex];
        if (prevTrack) {
          set({ currentIndex: prevIndex });
          await get().play(prevTrack);
        }
      },

      seekTo: async (position) => {
        set({ position });
      },

      setVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ volume: clampedVolume });
      },

      setPlaybackRate: (rate) => {
        const clampedRate = Math.max(0.5, Math.min(2.0, rate));
        set({ playbackRate: clampedRate });
      },

      setRepeatMode: (repeatMode) => set({ repeatMode }),

      toggleShuffle: () => {
        const { shuffleEnabled, playlist, currentTrack } = get();

        if (!shuffleEnabled && playlist.length > 1) {
          const otherTracks = playlist.filter(t => t.id !== currentTrack?.id);
          const shuffledOthers = otherTracks.sort(() => Math.random() - 0.5);
          const newPlaylist = currentTrack ? [currentTrack, ...shuffledOthers] : shuffledOthers;

          set({
            shuffleEnabled: true,
            playlist: newPlaylist,
            currentIndex: 0,
          });
        } else {
          set({ shuffleEnabled: false });
        }
      },

      // Playlist Management
      addToPlaylist: (track) => {
        const { playlist } = get();
        const exists = playlist.find(t => t.id === track.id);

        if (!exists) {
          set({ playlist: [...playlist, track] });
        }
      },

      removeFromPlaylist: (trackId) => {
        const { playlist, currentIndex, currentTrack } = get();
        const newPlaylist = playlist.filter(t => t.id !== trackId);

        let newIndex = currentIndex;
        if (currentTrack?.id === trackId) {
          set({
            currentTrack: undefined,
            isPlaying: false,
            position: 0,
          });
          newIndex = 0;
        } else if (currentIndex > 0) {
          const currentTrackIndex = newPlaylist.findIndex(t => t.id === currentTrack?.id);
          newIndex = Math.max(0, currentTrackIndex);
        }

        set({
          playlist: newPlaylist,
          currentIndex: newIndex,
        });
      },

      clearPlaylist: () => {
        set({
          playlist: [],
          currentIndex: 0,
          currentTrack: undefined,
          isPlaying: false,
          position: 0,
        });
      },

      reorderPlaylist: (fromIndex, toIndex) => {
        const { playlist, currentTrack } = get();
        const newPlaylist = [...playlist];
        const [removed] = newPlaylist.splice(fromIndex, 1);
        newPlaylist.splice(toIndex, 0, removed);

        const newCurrentIndex = newPlaylist.findIndex(t => t.id === currentTrack?.id);

        set({
          playlist: newPlaylist,
          currentIndex: Math.max(0, newCurrentIndex),
        });
      },

      // Favorites Management
      addToFavorites: (trackId) => {
        const { favorites } = get();
        if (!favorites.includes(trackId)) {
          set({ favorites: [...favorites, trackId] });
        }
      },

      removeFromFavorites: (trackId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(id => id !== trackId) });
      },

      isFavorite: (trackId) => {
        const { favorites } = get();
        return favorites.includes(trackId);
      },

      // History Management
      addToHistory: (track) => {
        const { history } = get();
        const filteredHistory = history.filter(t => t.id !== track.id);
        const newHistory = [track, ...filteredHistory].slice(0, 50);
        set({ history: newHistory });
      },

      clearHistory: () => set({ history: [] }),

      // Reciter Management
      setReciter: (reciter) => {
        set({ selectedReciter: reciter });

        const { playlist } = get();
        if (reciter && playlist.length > 0) {
          const updatedPlaylist = playlist.map(track => ({
            ...track,
            reciter,
            url: `https://cdn.islamic.network/quran/audio/128/${reciter.id}/${track.surahNumber}.mp3`,
          }));
          set({ playlist: updatedPlaylist });
        }
      },

      // UI Actions
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
      toggleVisualizer: () => set((state) => ({ showVisualizer: !state.showVisualizer })),

      // Utility Actions
      updatePlaybackState: (newState) => {
        set((state) => ({
          ...state,
          ...newState,
        }));
      },

      resetPlayer: () => {
        set({
          isPlaying: false,
          currentTrack: undefined,
          position: 0,
          duration: 0,
          isLoading: false,
          error: undefined,
          currentIndex: 0,
        });
      },

      // Cache Management
      getCacheSize: () => {
        const { cacheSize } = get();
        return cacheSize;
      },

      clearCache: () => {
        set({ cacheSize: 0 });
      },
    }),
    {
      name: 'audio-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        volume: state.volume,
        playbackRate: state.playbackRate,
        repeatMode: state.repeatMode,
        selectedReciter: state.selectedReciter,
        autoNext: state.autoNext,
        crossfadeEnabled: state.crossfadeEnabled,
        downloadQuality: state.downloadQuality,
        wifiOnlyDownload: state.wifiOnlyDownload,
        favorites: state.favorites,
        history: state.history,
        showLyrics: state.showLyrics,
        showVisualizer: state.showVisualizer,
      }),
    }
  )
);

// Audio Store Utilities
export const audioStoreUtils = {
  formatTime: (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  calculateProgress: (position: number, duration: number): number => {
    if (duration === 0) return 0;
    return Math.max(0, Math.min(1, position / duration));
  },

  createTrackFromSurah: (
    surah: any,
    reciter: Reciter,
    ayahNumber?: number
  ): AudioTrack => ({
    id: `${surah.number}-${reciter.id}${ayahNumber ? `-${ayahNumber}` : ''}`,
    surahNumber: surah.number,
    ayahNumber,
    title: ayahNumber ? `آية ${ayahNumber}` : surah.englishName,
    surahName: surah.name,
    reciter,
    url: ayahNumber
      ? `https://cdn.islamic.network/quran/audio/128/${reciter.id}/${surah.number}/${ayahNumber}.mp3`
      : `https://cdn.islamic.network/quran/audio/128/${reciter.id}/${surah.number}.mp3`,
    quality: '128kbps',
    duration: 0,
  }),

  validateAudioUrl: (url: string): boolean => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
    return audioExtensions.some(ext => url.toLowerCase().includes(ext));
  },

  getQualityBitrate: (quality: 'low' | 'medium' | 'high'): string => {
    switch (quality) {
      case 'low': return '64';
      case 'high': return '192';
      default: return '128';
    }
  },
};

// Audio Store Hooks for specific functionalities
export const useCurrentTrack = () => {
  return useAudioStore((state) => ({
    currentTrack: state.currentTrack,
    isPlaying: state.isPlaying,
    position: state.position,
    duration: state.duration,
  }));
};

export const usePlaylistControls = () => {
  return useAudioStore((state) => ({
    playlist: state.playlist,
    currentIndex: state.currentIndex,
    addToPlaylist: state.addToPlaylist,
    removeFromPlaylist: state.removeFromPlaylist,
    clearPlaylist: state.clearPlaylist,
    reorderPlaylist: state.reorderPlaylist,
  }));
};

export const useAudioSettings = () => {
  return useAudioStore((state) => ({
    volume: state.volume,
    playbackRate: state.playbackRate,
    repeatMode: state.repeatMode,
    shuffleEnabled: state.shuffleEnabled,
    selectedReciter: state.selectedReciter,
    setVolume: state.setVolume,
    setPlaybackRate: state.setPlaybackRate,
    setRepeatMode: state.setRepeatMode,
    toggleShuffle: state.toggleShuffle,
    setReciter: state.setReciter,
  }));
};

export const useFavorites = () => {
  return useAudioStore((state) => ({
    favorites: state.favorites,
    addToFavorites: state.addToFavorites,
    removeFromFavorites: state.removeFromFavorites,
    isFavorite: state.isFavorite,
  }));
};

export const useHistory = () => {
  return useAudioStore((state) => ({
    history: state.history,
    addToHistory: state.addToHistory,
    clearHistory: state.clearHistory,
  }));
};

export default useAudioStore;
