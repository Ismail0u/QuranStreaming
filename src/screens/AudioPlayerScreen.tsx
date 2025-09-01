// 📱 src/screens/AudioPlayerScreen.tsx - Enhanced Version
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanGestureHandler,
  State as GestureState,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Stores
import { useAudioStore } from '../store/useAudioStore';
import { useSettingsStore } from '../store/useSettingsStore';

const { width, height } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.8;

export default function AudioPlayerScreen() {
  const navigation = useNavigation();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { 
    currentTrack, 
    isPlaying, 
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

  // Animations
  const artworkRotation = useRef(new Animated.Value(0)).current;
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const progressOpacity = useRef(new Animated.Value(1)).current;
  const controlsTranslateY = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);

  // Rotate artwork when playing
  useEffect(() => {
    let rotationAnimation: Animated.CompositeAnimation;

    if (isPlaying) {
      rotationAnimation = Animated.loop(
        Animated.timing(artworkRotation, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      );
      rotationAnimation.start();
    } else {
      artworkRotation.stopAnimation();
    }

    return () => {
      if (rotationAnimation) {
        rotationAnimation.stop();
      }
    };
  }, [isPlaying]);

  // Auto-hide controls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        Animated.timing(controlsTranslateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPlaying]);

  const showControls = () => {
    Animated.timing(controlsTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePlayPress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(playButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(playButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = isDragging ? tempProgress : (duration > 0 ? position / duration : 0);

  const handleSeekGesture = (event: any) => {
    const { state, x } = event.nativeEvent;
    
    if (state === GestureState.BEGAN) {
      setIsDragging(true);
      Animated.timing(progressOpacity, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else if (state === GestureState.ACTIVE) {
      const progressBarWidth = width - 80;
      const newProgress = Math.max(0, Math.min(1, x / progressBarWidth));
      setTempProgress(newProgress);
    } else if (state === GestureState.END) {
      setIsDragging(false);
      const seekPosition = tempProgress * duration;
      seekTo(seekPosition);
      
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'off': return 'repeat-outline';
      case 'one': return 'repeat';
      case 'all': return 'repeat';
      default: return 'repeat-outline';
    }
  };

  const toggleRepeatMode = () => {
    const modes = ['off', 'one', 'all'] as const;
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-down" size={32} color={isDarkMode ? '#f8fafc' : '#111827'} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="musical-notes-outline" size={80} color={isDarkMode ? '#64748b' : '#9ca3af'} />
          </View>
          <Text style={[styles.emptyTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            لا يوجد صوت محدد
          </Text>
          <Text style={[styles.emptySubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
            اختر سورة أو آية للاستماع
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const artworkRotationDegrees = artworkRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDarkMode 
            ? ['#0f172a', '#1e293b', '#0f172a']
            : ['#f8fafc', '#e2e8f0', '#f8fafc']
        }
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-down" size={32} color={isDarkMode ? '#f8fafc' : '#111827'} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          الآن يُتلى
        </Text>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={28} color={isDarkMode ? '#f8fafc' : '#111827'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.content}
        onPress={showControls}
        activeOpacity={1}
      >
        {/* Artwork Container */}
        <View style={styles.artworkContainer}>
          <View style={styles.artworkShadow}>
            <Animated.View 
              style={[
                styles.artwork,
                { transform: [{ rotate: artworkRotationDegrees }] }
              ]}
            >
              <LinearGradient
                colors={['#3b82f6', '#1e40af', '#1e3a8a']}
                style={styles.artworkGradient}
              >
                <Ionicons name="musical-notes" size={80} color="rgba(255,255,255,0.9)" />
                <View style={styles.artworkReflection} />
              </LinearGradient>
            </Animated.View>
          </View>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={[styles.trackTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.trackSubtitle, { color: isDarkMode ? '#cbd5e1' : '#6b7280' }]}>
            {currentTrack.surahName} • {currentTrack.reciter}
          </Text>
        </View>

        {/* Progress Section */}
        <Animated.View style={[styles.progressSection, { opacity: progressOpacity }]}>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.timeText, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
              {formatTime(duration)}
            </Text>
          </View>
          
          <PanGestureHandler onGestureEvent={handleSeekGesture}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
                <LinearGradient
                  colors={['#0ea5e9', '#3b82f6']}
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
                <View style={[styles.progressThumb, { left: `${progress * 100}%` }]}>
                  <LinearGradient
                    colors={['#0ea5e9', '#3b82f6']}
                    style={styles.thumbGradient}
                  />
                </View>
              </View>
            </View>
          </PanGestureHandler>
        </Animated.View>

        {/* Main Controls */}
        <Animated.View style={[styles.controlsContainer, { transform: [{ translateY: controlsTranslateY }] }]}>
          <TouchableOpacity onPress={toggleRepeatMode} style={styles.secondaryButton}>
            <Ionicons 
              name={getRepeatIcon()} 
              size={24} 
              color={repeatMode !== 'off' ? '#10b981' : (isDarkMode ? '#94a3b8' : '#6b7280')} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={previous} style={styles.secondaryButton}>
            <Ionicons name="play-skip-back" size={32} color={isDarkMode ? '#f8fafc' : '#111827'} />
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: playButtonScale }] }}>
            <TouchableOpacity onPress={handlePlayPress} style={styles.playButton}>
              <LinearGradient
                colors={['#0ea5e9', '#3b82f6']}
                style={styles.playButtonGradient}
              >
                <Ionicons 
                  name={isPlaying ? 'pause' : 'play'} 
                  size={42} 
                  color="#fff" 
                />
                <View style={styles.playButtonGlow} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={next} style={styles.secondaryButton}>
            <Ionicons name="play-skip-forward" size={32} color={isDarkMode ? '#f8fafc' : '#111827'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="shuffle" size={24} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
          </TouchableOpacity>
        </Animated.View>

        {/* Volume Control */}
        <View style={styles.volumeSection}>
          <View style={styles.volumeContainer}>
            <Ionicons name="volume-low" size={20} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
            <View style={styles.volumeSlider}>
              <View style={[styles.volumeBar, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
                <LinearGradient
                  colors={['#0ea5e9', '#3b82f6']}
                  style={[styles.volumeFill, { width: `${volume * 100}%` }]}
                />
              </View>
            </View>
            <Ionicons name="volume-high" size={20} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
          </View>
        </View>

        {/* Additional Actions */}
        <View style={styles.additionalActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={22} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={22} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={22} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="list-outline" size={22} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  artworkShadow: {
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
  },
  artworkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  artworkReflection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  trackTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    paddingVertical: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    marginLeft: -9,
  },
  thumbGradient: {
    width: 18,
    height: 18,
    borderRadius: 9,
    elevation: 4,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  secondaryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playButtonGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  volumeSection: {
    marginBottom: 32,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 20,
  },
  volumeBar: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
  },
  volumeFill: {
    height: '100%',
    borderRadius: 2,
  },
  additionalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});