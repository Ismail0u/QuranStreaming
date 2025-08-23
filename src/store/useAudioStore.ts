// 🗃️ src/store/useAudioStore.ts
import { create } from 'zustand';
import type { AudioTrack, PlaybackState, Reciter, RepeatMode } from '../types';

interface AudioState extends PlaybackState {
  // Playlist & Queue
  playlist: AudioTrack[];
  currentIndex: number;
  
  // Settings
  volume: number;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
  selectedReciter: Reciter | null;
  
  // Actions
  play: (track?: AudioTrack) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (position: number) => void;
  setVolume: (volume: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  setReciter: (reciter: Reciter) => void;
  addToPlaylist: (track: AudioTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  clearPlaylist: () => void;
  updatePlaybackState: (state: Partial<PlaybackState>) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  // Initial playback state
  isPlaying: false,
  currentTrack: undefined,
  position: 0,
  duration: 0,
  isLoading: false,
  error: undefined,

  // Initial settings
  playlist: [],
  currentIndex: 0,
  volume: 1.0,
  repeatMode: 'off',
  shuffleEnabled: false,
  selectedReciter: null,

  // Actions
  play: (track) => {
    if (track) {
      set({ currentTrack: track, isPlaying: true, isLoading: true });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => set({ isPlaying: false }),
  
  stop: () => set({ 
    isPlaying: false, 
    position: 0, 
    currentTrack: undefined 
  }),

  next: () => {
    const { playlist, currentIndex, repeatMode } = get();
    if (playlist.length === 0) return;

    let nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) {
      nextIndex = repeatMode === 'all' ? 0 : currentIndex;
    }

    if (nextIndex !== currentIndex) {
      set({ 
        currentIndex: nextIndex, 
        currentTrack: playlist[nextIndex],
        position: 0 
      });
    }
  },

  previous: () => {
    const { playlist, currentIndex } = get();
    if (playlist.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }

    set({ 
      currentIndex: prevIndex, 
      currentTrack: playlist[prevIndex],
      position: 0 
    });
  },

  seekTo: (position) => set({ position }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  setRepeatMode: (repeatMode) => set({ repeatMode }),

  toggleShuffle: () => set((state) => ({ shuffleEnabled: !state.shuffleEnabled })),

  setReciter: (reciter) => set({ selectedReciter: reciter }),

  addToPlaylist: (track) => {
    set((state) => ({
      playlist: [...state.playlist, track],
    }));
  },

  removeFromPlaylist: (trackId) => {
    set((state) => ({
      playlist: state.playlist.filter((t) => t.id !== trackId),
    }));
  },

  clearPlaylist: () => set({ playlist: [], currentIndex: 0 }),

  updatePlaybackState: (newState) => set(newState),
}));
