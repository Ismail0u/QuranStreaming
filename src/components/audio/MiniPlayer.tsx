// src/components/audio/MiniPlayer.tsx - Enhanced Version
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanGestureHandler,
  State as GestureState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAudioStore } from '../../store/useAudioStore';
import { useSettingsStore } from '../../store/useSettingsStore';

const { width } = Dimensions.get('window');

interface MiniPlayerProps {
  onPress?: () => void;
  style?: any;
  onSwipeDown?: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress, style, onSwipeDown }) => {
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
  
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const playingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentTrack && !isVisible) {
      setIsVisible(true);
      // Entrance animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!currentTrack && isVisible) {
      // Exit animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    // Update progress animation
    const progress = duration > 0 ? position / duration : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [position, duration]);

  useEffect(() => {
    // Playing pulse animation
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(playingAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(playingAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      playingAnim.stopAnimation();
      playingAnim.setValue(0);
    }
  }, [isPlaying]);

  const handleGesture = (event: any) => {
    const { state, translationY, velocityY } = event.nativeEvent;
    
    if (state === GestureState.END) {
      if (translationY > 50 || velocityY > 500) {
        // Swipe down to dismiss
        onSwipeDown?.();
      }
    }
  };

  const handlePlayPress = (e: any) => {
    e.stopPropagation();
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

  if (!currentTrack || !isVisible) {
    return null;
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const playingPulse = playingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const playingOpacity = playingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim,
          },
          style,
        ]}
      >
        <BlurView intensity={95} style={styles.blurContainer}>
          <LinearGradient
            colors={
              isDarkMode 
                ? ['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)']
                : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.95)']
            }
            style={styles.gradient}
          />
          
          {/* Enhanced Progress Bar */}
          <Animated.View style={[styles.progressBar, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
            <Animated.View style={[
              styles.progressFill, 
              { width: progressWidth }
            ]} />
          </Animated.View>

          <TouchableOpacity 
            style={styles.content}
            onPress={onPress}
            activeOpacity={0.95}
          >
            {/* Enhanced Artwork */}
            <Animated.View 
              style={[
                styles.artwork,
                {
                  transform: [{ scale: playingPulse }],
                  opacity: playingOpacity,
                }
              ]}
            >
              <LinearGradient
                colors={['#3b82f6', '#1e40af']}
                style={styles.artworkGradient}
              >
                <Ionicons name="musical-notes" size={22} color="#fff" />
                {isPlaying && (
                  <View style={styles.playingOverlay}>
                    <View style={styles.playingDot} />
                    <View style={styles.playingDot} />
                    <View style={styles.playingDot} />
                  </View>
                )}
              </LinearGradient>
            </Animated.View>

            {/* Enhanced Track Info */}
            <View style={styles.trackInfo}>
              <Text style={[
                styles.trackTitle, 
                { color: isDarkMode ? '#f8fafc' : '#111827' }
              ]} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <View style={styles.trackMeta}>
                <Text style={[
                  styles.trackSubtitle, 
                  { color: isDarkMode ? 'rgba(248, 250, 252, 0.7)' : 'rgba(17, 24, 39, 0.7)' }
                ]} numberOfLines={1}>
                  {currentTrack.surahName}
                </Text>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>
                    {formatTime(position)} / {formatTime(duration)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Enhanced Controls */}
            <View style={styles.controls}>
              <TouchableOpacity 
                onPress={handlePlayPress} 
                style={[
                  styles.playButton,
                  { backgroundColor: isDarkMode ? 'rgba(248, 250, 252, 0.1)' : 'rgba(17, 24, 39, 0.1)' }
                ]}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <Animated.View style={{ transform: [{ rotate: '0deg' }] }}>
                    <Ionicons name="hourglass-outline" size={20} color="#0ea5e9" />
                  </Animated.View>
                ) : (
                  <Ionicons 
                    name={isPlaying ? 'pause' : 'play'} 
                    size={20} 
                    color="#0ea5e9" 
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleNextPress} 
                style={[
                  styles.nextButton,
                  { backgroundColor: isDarkMode ? 'rgba(248, 250, 252, 0.1)' : 'rgba(17, 24, 39, 0.1)' }
                ]}
                activeOpacity={0.7}
              >
                <Ionicons name="play-skip-forward" size={18} color={isDarkMode ? '#f8fafc' : '#111827'} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
          {/* Floating Action Button */}
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0ea5e9', '#3b82f6']}
              style={styles.expandButtonGradient}
            >
              <Ionicons name="chevron-up" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 3,
  },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  artworkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playingOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 8,
    right: 8,
  },
  playingDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#10b981',
    marginHorizontal: 1,
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  timeBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 10,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    elevation: 2,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandButton: {
    position: 'absolute',
    top: -12,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  expandButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniPlayer;