// src/components/audio/PlayerControls.tsx
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioStore } from '../../store/useAudioStore';
import type { RepeatMode } from '../../types';

interface PlayerControlsProps {
  size?: 'small' | 'medium' | 'large';
  showExtended?: boolean;
  style?: any;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ 
  size = 'medium', 
  showExtended = false,
  style 
}) => {
  const {
    isPlaying,
    isLoading,
    repeatMode,
    shuffleEnabled,
    play,
    pause,
    next,
    previous,
    setRepeatMode,
    toggleShuffle,
  } = useAudioStore();

  const [scaleAnim] = useState(new Animated.Value(1));

  const sizes = {
    small: { play: 32, controls: 20, container: 40 },
    medium: { play: 48, controls: 28, container: 56 },
    large: { play: 64, controls: 32, container: 72 },
  };

  const currentSizes = sizes[size];

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
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
      case 'one':
        return 'repeat';
      case 'all':
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

  const getRepeatModeText = () => {
    switch (repeatMode) {
      case 'one':
        return '1';
      case 'all':
        return '∞';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Extended Controls */}
      {showExtended && (
        <View style={styles.extendedControls}>
          <TouchableOpacity onPress={toggleShuffle} style={styles.extendedButton}>
            <Ionicons 
              name="shuffle" 
              size={currentSizes.controls - 4} 
              color={shuffleEnabled ? '#1DB954' : 'rgba(255,255,255,0.7)'} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleRepeatMode} style={styles.extendedButton}>
            <View style={styles.repeatContainer}>
              <Ionicons 
                name={getRepeatIcon()} 
                size={currentSizes.controls - 4} 
                color={repeatMode !== 'off' ? '#1DB954' : 'rgba(255,255,255,0.7)'} 
              />
              {repeatMode === 'one' && (
                <View style={styles.repeatBadge}>
                  <Text style={styles.repeatText}>1</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Controls */}
      <View style={styles.mainControls}>
        <TouchableOpacity onPress={previous} style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={currentSizes.controls} color="#fff" />
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity onPress={handlePlayPress} style={[
            styles.playButton,
            { width: currentSizes.container, height: currentSizes.container }
          ]}>
            <LinearGradient
              colors={['#1DB954', '#1ed760']}
              style={styles.playButtonGradient}
            >
              <Ionicons 
                name={getPlayButtonIcon()} 
                size={currentSizes.play} 
                color="#fff" 
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={next} style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={currentSizes.controls} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  extendedControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 40,
  },
  extendedButton: {
    padding: 8,
  },
  repeatContainer: {
    position: 'relative',
  },
  repeatBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#1DB954',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
  },
  controlButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  playButton: {
    borderRadius: 36,
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
});

export default PlayerControls;