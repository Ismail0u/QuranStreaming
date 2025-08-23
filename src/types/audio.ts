// 📝 src/types/audio.ts
export interface AudioTrack {
  id: string;
  surahNumber: number;
  ayahNumber?: number;
  reciter: Reciter;
  url: string;
  duration?: number;
  quality: AudioQuality;
}

export interface Reciter {
  id: string;
  name: string;
  arabicName?: string;
  language: string;
  style: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTrack?: AudioTrack;
  position: number;
  duration: number;
  isLoading: boolean;
  error?: string;
}

export type AudioQuality = '64kbps' | '128kbps' | '192kbps';

export type RepeatMode = 'off' | 'one' | 'all';
