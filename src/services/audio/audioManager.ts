// src/services/audio/audioManager.ts
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

export enum PlaybackState {
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  BUFFERING = 'buffering',
  ERROR = 'error'
}

export enum RepeatMode {
  OFF = 'off',
  VERSE = 'verse',
  SURAH = 'surah',
  ALL = 'all'
}

export interface AudioTrack {
  id: string;
  title: string;
  surahName: string;
  surahNumber: number;
  verseNumber?: number;
  reciter: string;
  uri: string;
  duration?: number;
  artwork?: string;
}

export interface PlaybackPosition {
  positionMillis: number;
  durationMillis: number;
  playableDurationMillis: number;
}

class AudioManager {
  private static instance: AudioManager;
  private sound: Sound | null = null;
  private currentTrack: AudioTrack | null = null;
  private queue: AudioTrack[] = [];
  private currentIndex: number = 0;
  private listeners: Set<(state: any) => void> = new Set();
  
  private state = {
    playbackState: PlaybackState.STOPPED,
    position: { positionMillis: 0, durationMillis: 0, playableDurationMillis: 0 } as PlaybackPosition,
    volume: 1.0,
    rate: 1.0,
    repeatMode: RepeatMode.OFF,
    isShuffled: false
  };

  private constructor() {
    this.initializeAudio();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: 1,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      this.updateState({ playbackState: PlaybackState.ERROR });
    }
  }

  // État et listeners
  public subscribe(listener: (state: any) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private updateState(newState: Partial<typeof this.state>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState() {
    return { ...this.state };
  }

  // Gestion des pistes
  public async loadTrack(track: AudioTrack, autoPlay: boolean = false): Promise<boolean> {
    try {
      this.updateState({ playbackState: PlaybackState.LOADING });
      
      // Nettoyer l'ancienne piste
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Charger la nouvelle piste
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { 
          shouldPlay: autoPlay,
          volume: this.state.volume,
          rate: this.state.rate,
          progressUpdateIntervalMillis: 100
        }
      );

      this.sound = sound;
      this.currentTrack = track;

      // Configurer les callbacks
      this.sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate.bind(this));

      this.updateState({ 
        playbackState: autoPlay ? PlaybackState.PLAYING : PlaybackState.PAUSED 
      });

      return true;
    } catch (error) {
      console.error('Failed to load track:', error);
      this.updateState({ playbackState: PlaybackState.ERROR });
      return false;
    }
  }

  private onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (status.isLoaded) {
      this.updateState({
        position: {
          positionMillis: status.positionMillis || 0,
          durationMillis: status.durationMillis || 0,
          playableDurationMillis: status.playableDurationMillis || 0
        }
      });

      // Gestion de la fin de piste
      if (status.didJustFinish && !status.isLooping) {
        this.handleTrackEnd();
      }

      // Mise à jour du state de lecture
      if (status.isPlaying) {
        this.updateState({ playbackState: PlaybackState.PLAYING });
      } else if (status.isBuffering) {
        this.updateState({ playbackState: PlaybackState.BUFFERING });
      } else {
        this.updateState({ playbackState: PlaybackState.PAUSED });
      }
    } else {
      this.updateState({ playbackState: PlaybackState.ERROR });
    }
  }

  // Contrôles de lecture
  public async play(): Promise<boolean> {
    try {
      if (!this.sound) return false;
      
      await this.sound.playAsync();
      this.updateState({ playbackState: PlaybackState.PLAYING });
      return true;
    } catch (error) {
      console.error('Failed to play:', error);
      this.updateState({ playbackState: PlaybackState.ERROR });
      return false;
    }
  }

  public async pause(): Promise<boolean> {
    try {
      if (!this.sound) return false;
      
      await this.sound.pauseAsync();
      this.updateState({ playbackState: PlaybackState.PAUSED });
      return true;
    } catch (error) {
      console.error('Failed to pause:', error);
      return false;
    }
  }

  public async stop(): Promise<boolean> {
    try {
      if (!this.sound) return false;
      
      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
      this.updateState({ 
        playbackState: PlaybackState.STOPPED,
        position: { positionMillis: 0, durationMillis: 0, playableDurationMillis: 0 }
      });
      return true;
    } catch (error) {
      console.error('Failed to stop:', error);
      return false;
    }
  }

  public async seekTo(positionMillis: number): Promise<boolean> {
    try {
      if (!this.sound) return false;
      
      await this.sound.setPositionAsync(positionMillis);
      return true;
    } catch (error) {
      console.error('Failed to seek:', error);
      return false;
    }
  }

  public async setVolume(volume: number): Promise<boolean> {
    try {
      if (!this.sound) return false;
      
      const clampedVolume = Math.max(0, Math.min(1, volume));
      await this.sound.setVolumeAsync(clampedVolume);
      this.updateState({ volume: clampedVolume });
      return true;
    } catch (error) {
      console.error('Failed to set volume:', error);
      return false;
    }
  }

  public async setRate(rate: number): Promise<boolean> {
    try {
      if (!this.sound) return false;
      
      const clampedRate = Math.max(0.5, Math.min(2.0, rate));
      await this.sound.setRateAsync(clampedRate, true);
      this.updateState({ rate: clampedRate });
      return true;
    } catch (error) {
      console.error('Failed to set rate:', error);
      return false;
    }
  }

  // Gestion de la queue
  public setQueue(tracks: AudioTrack[], startIndex: number = 0) {
    this.queue = tracks;
    this.currentIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));
  }

  public async playNext(): Promise<boolean> {
    if (this.queue.length === 0) return false;
    
    let nextIndex = this.currentIndex + 1;
    
    // Gestion du repeat mode
    if (nextIndex >= this.queue.length) {
      if (this.state.repeatMode === RepeatMode.ALL) {
        nextIndex = 0;
      } else {
        return false;
      }
    }
    
    this.currentIndex = nextIndex;
    return await this.loadTrack(this.queue[this.currentIndex], true);
  }

  public async playPrevious(): Promise<boolean> {
    if (this.queue.length === 0) return false;
    
    let prevIndex = this.currentIndex - 1;
    
    if (prevIndex < 0) {
      if (this.state.repeatMode === RepeatMode.ALL) {
        prevIndex = this.queue.length - 1;
      } else {
        return false;
      }
    }
    
    this.currentIndex = prevIndex;
    return await this.loadTrack(this.queue[this.currentIndex], true);
  }

  private async handleTrackEnd() {
    switch (this.state.repeatMode) {
      case RepeatMode.VERSE:
        // Répéter le verset actuel
        await this.seekTo(0);
        await this.play();
        break;
      
      case RepeatMode.SURAH:
        // Vérifier si on est à la fin de la sourate
        if (this.hasNextInSurah()) {
          await this.playNext();
        } else {
          await this.seekTo(0);
          await this.play();
        }
        break;
      
      case RepeatMode.ALL:
        await this.playNext();
        break;
      
      default:
        // Mode normal - passer au suivant ou s'arrêter
        const hasNext = await this.playNext();
        if (!hasNext) {
          this.updateState({ playbackState: PlaybackState.STOPPED });
        }
    }
  }

  private hasNextInSurah(): boolean {
    if (!this.currentTrack || this.queue.length === 0) return false;
    
    const nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.queue.length) return false;
    
    const nextTrack = this.queue[nextIndex];
    return nextTrack.surahNumber === this.currentTrack.surahNumber;
  }

  // Getters
  public getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }

  public getQueue(): AudioTrack[] {
    return [...this.queue];
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  // Nettoyage
  public async cleanup() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.currentTrack = null;
      this.queue = [];
      this.currentIndex = 0;
      this.listeners.clear();
      this.updateState({ playbackState: PlaybackState.STOPPED });
    } catch (error) {
      console.error('Failed to cleanup:', error);
    }
  }

  // Utilitaires
  public togglePlayPause(): Promise<boolean> {
    return this.state.playbackState === PlaybackState.PLAYING 
      ? this.pause() 
      : this.play();
  }

  public setRepeatMode(mode: RepeatMode) {
    this.updateState({ repeatMode: mode });
  }

  public getRepeatMode(): RepeatMode {
    return this.state.repeatMode;
  }

  public formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public getProgress(): number {
    if (this.state.position.durationMillis === 0) return 0;
    return this.state.position.positionMillis / this.state.position.durationMillis;
  }
}

export default AudioManager;