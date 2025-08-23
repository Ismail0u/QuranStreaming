// src/components/audio/AudioPlayer.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAudioStore } from '../../store/useAudioStore';
import type { RepeatMode } from '../../types';

const { width } = Dimensions.get('window');

interface AudioPlayerProps {
  onClose?: () => void;
  style?: any;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onClose, style }) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    position,
    duration,
    volume,
    repeatMode,
    play,
    pause,
    next,
    previous,
    seekTo,
    setVolume,
    setRepeatMode
  } = useAudioStore();

  // États locaux pour les animations et UI
  const [showControls, setShowControls] = useState(true);
  const [seekPosition, setSeekPosition] = useState(0);
  const [isSeekingActive, setIsSeekingActive] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Animation pour masquer/afficher les contrôles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showControls && isPlaying) {
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const showControlsTemporarily = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Gestion du seek
  const handleSeekStart = () => {
    setIsSeekingActive(true);
  };

  const handleSeekChange = (value: number) => {
    setSeekPosition(value);
  };

  const handleSeekComplete = async (value: number) => {
    setIsSeekingActive(false);
    const seekPosition = value * duration;
    seekTo(seekPosition);
  };

  // Formatage du temps
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calcul du progrès
  const progress = isSeekingActive 
    ? seekPosition 
    : duration > 0 
      ? position / duration
      : 0;

  // Animation des boutons
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePlayPress = () => {
    animateButton();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const getPlayButtonIcon = () => {
    if (isLoading) {
      return 'hourglass-outline';
    }
    return isPlaying ? 'pause' : 'play';
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'off':
        return 'repeat-outline';
      case 'all':
        return 'repeat';
      case 'one':
        return 'repeat';
      default:
        return 'repeat-outline';
    }
  };

  const toggleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  if (!currentTrack) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Aucune piste sélectionnée</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={showControlsTemporarily}
      activeOpacity={1}
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>En cours de lecture</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Artwork placeholder */}
        <View style={styles.artworkContainer}>
          <View style={styles.artwork}>
            <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.artworkGradient}
            >
              <Ionicons name="musical-notes" size={80} color="rgba(255,255,255,0.8)" />
            </LinearGradient>
          </View>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackSubtitle} numberOfLines={1}>
            {currentTrack.surahName} • {currentTrack.reciter}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <TouchableOpacity
                style={[styles.progressThumb, { left: `${progress * 100}%` }]}
                onPressIn={handleSeekStart}
                // Ici on ajouterait la gestion du pan gesture pour le seek
              />
            </View>
          </View>
          
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* Main Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={toggleRepeatMode} style={styles.controlButton}>
            <Ionicons 
              name={getRepeatIcon()} 
              size={24} 
              color={repeatMode !== 'off' ? '#1DB954' : '#fff'} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={previous} style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={32} color="#fff" />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handlePlayPress} style={styles.playButton}>
              <LinearGradient
                colors={['#1DB954', '#1ed760']}
                style={styles.playButtonGradient}
              >
                <Ionicons 
                  name={getPlayButtonIcon()} 
                  size={40} 
                  color="#fff" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={next} style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="shuffle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <Ionicons name="volume-low" size={20} color="#fff" />
          <View style={styles.volumeSlider}>
            <View style={styles.volumeBar}>
              <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
            </View>
          </View>
          <Ionicons name="volume-high" size={20} color="#fff" />
        </View>

        {/* Additional Controls */}
        <View style={styles.additionalControls}>
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="list-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  moreButton: {
    padding: 8,
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  artwork: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  artworkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    width: 45,
    textAlign: 'center',
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#1DB954',
    borderRadius: 8,
    marginLeft: -8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 16,
  },
  volumeBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  additionalButton: {
    padding: 12,
  },
});

export default AudioPlayer;