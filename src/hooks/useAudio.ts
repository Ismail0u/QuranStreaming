// src/hooks/useAudio.ts
import { useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { useAudioStore } from '../store/useAudioStore';

export const useAudio = () => {
  const soundRef = useRef<Sound | null>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    position,
    updatePlaybackState,
  } = useAudioStore();

  // Configuration initiale d'expo-av
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Failed to setup audio:', error);
      }
    };

    setupAudio();

    return () => {
      // Cleanup
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Gestion des changements de piste
  useEffect(() => {
    if (currentTrack && currentTrack.audioUrl) {
      loadSound(currentTrack.audioUrl);
    }
  }, [currentTrack]);

  // Gestion play/pause
  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.playAsync();
      } else {
        soundRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  // Gestion du volume
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(volume);
    }
  }, [volume]);

  const loadSound = async (uri: string) => {
    try {
      updatePlaybackState({ isLoading: true, error: undefined });

      // Nettoyer l'ancienne piste
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Charger la nouvelle piste
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          shouldPlay: false,
          volume,
          progressUpdateIntervalMillis: 1000,
        }
      );

      soundRef.current = sound;

      // Configurer le callback de status
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      updatePlaybackState({ 
        isLoading: false,
        error: undefined,
        position: 0,
      });

    } catch (error) {
      console.error('Failed to load sound:', error);
      updatePlaybackState({ 
        isLoading: false, 
        error: 'Impossible de charger l\'audio' 
      });
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      updatePlaybackState({
        position: status.positionMillis || 0,
        duration: status.durationMillis || 0,
        isPlaying: status.isPlaying || false,
        isLoading: status.isBuffering || false,
      });

      // Gestion de la fin de piste
      if (status.didJustFinish && !status.isLooping) {
        handleTrackEnd();
      }
    } else {
      if (status.error) {
        updatePlaybackState({
          error: 'Erreur de lecture',
          isLoading: false,
        });
      }
    }
  };

  const handleTrackEnd = () => {
    const { next, repeatMode } = useAudioStore.getState();
    
    switch (repeatMode) {
      case 'one':
        // Répéter la piste actuelle
        seekToPosition(0);
        break;
      case 'all':
      default:
        // Passer à la suivante
        next();
        break;
    }
  };

  const seekToPosition = async (positionMillis: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(positionMillis);
        updatePlaybackState({ position: positionMillis });
      } catch (error) {
        console.error('Failed to seek:', error);
      }
    }
  };

  const setPlaybackRate = async (rate: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setRateAsync(rate, true);
      } catch (error) {
        console.error('Failed to set rate:', error);
      }
    }
  };

  return {
    seekToPosition,
    setPlaybackRate,
    isReady: soundRef.current !== null,
  };
};

// Hook pour les contrôles média (notifications, lock screen)
export const useMediaSession = () => {
  const { currentTrack, isPlaying } = useAudioStore();

  useEffect(() => {
    // Ici on pourrait intégrer avec react-native-track-player
    // ou expo-media-library pour les contrôles système
    console.log('Media session updated:', { currentTrack, isPlaying });
  }, [currentTrack, isPlaying]);
};

// Hook pour la gestion des interruptions audio
export const useAudioInterruptions = () => {
  const { pause, play, isPlaying } = useAudioStore();

  useEffect(() => {
    const handleInterruption = (status: AVPlaybackStatus) => {
      // Gérer les interruptions (appels, notifications, etc.)
      if (status.isLoaded && !status.isPlaying && isPlaying) {
        // L'audio a été interrompu
        console.log('Audio interrupted');
      }
    };

    // Ici on s'abonnerait aux événements d'interruption système
    return () => {
      // Cleanup
    };
  }, []);
};

// Hook pour les raccourcis clavier (si nécessaire)
export const useAudioKeyboard = () => {
  const { togglePlayPause, next, previous } = useAudioStore();

  useEffect(() => {
    // Gérer les raccourcis clavier pour le web ou les contrôles externes
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'ArrowLeft':
          previous();
          break;
      }
    };

    // Pour React Native Web
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);
};

// Utilitaires audio
export const audioUtils = {
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

  msToSeconds: (ms: number): number => Math.floor(ms / 1000),
  
  secondsToMs: (seconds: number): number => seconds * 1000,

  calculateProgress: (position: number, duration: number): number => {
    if (duration === 0) return 0;
    return Math.max(0, Math.min(1, position / duration));
  },

  validateAudioUrl: (url: string): boolean => {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
    return audioExtensions.some(ext => url.toLowerCase().includes(ext));
  },
};

export default useAudio;