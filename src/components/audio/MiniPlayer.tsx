// src/components/audio/MiniPlayer.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioStore } from '../../store/useAudioStore';

const { width } = Dimensions.get('window');

interface MiniPlayerProps {
  onPress?: () => void;
  style?: any;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress, style }) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    position,
    duration,
    play,
    pause,
    next,
  } = useAudioStore();

  if (!currentTrack) {
    return null;
  }

  const progress = duration > 0 ? position / duration : 0;

  const handlePlayPress = (e: any) => {
    e.stopPropagation(); // Empêche l'ouverture du player complet
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleNextPress = (e: any) => {
    e.stopPropagation();
    next();
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(20, 20, 30, 0.95)', 'rgba(30, 30, 45, 0.95)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.content}>
        {/* Artwork Placeholder */}
        <View style={styles.artwork}>
          <LinearGradient
            colors={['#4c669f', '#3b5998']}
            style={styles.artworkGradient}
          >
            <Ionicons name="musical-notes" size={20} color="#fff" />
          </LinearGradient>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackSubtitle} numberOfLines={1}>
            {currentTrack.surahName} • {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            onPress={handlePlayPress} 
            style={styles.playButton}
          >
            {isLoading ? (
              <Ionicons name="hourglass-outline" size={24} color="#fff" />
            ) : (
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={24} 
                color="#fff" 
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleNextPress} 
            style={styles.nextButton}
          >
            <Ionicons name="play-skip-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Au-dessus de la tab bar
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 2, // Pour laisser de la place à la barre de progression
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  artworkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  nextButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniPlayer;