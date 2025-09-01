// 📖 src/components/quran/SurahCard.tsx - Enhanced Version
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Types
import type { Surah } from '../../types';

// Stores
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAudioStore } from '../../store/useAudioStore';

const { width } = Dimensions.get('window');

interface SurahCardProps {
  surah: Surah;
  onPress: () => void;
  onPlayPress?: () => void;
  variant?: 'default' | 'compact' | 'horizontal' | 'featured';
  style?: ViewStyle;
  showPlayButton?: boolean;
  index?: number;
}

const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  onPress,
  onPlayPress,
  variant = 'default',
  style,
  showPlayButton = true,
  index = 0,
}) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { currentTrack, isPlaying } = useAudioStore();
  
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const playingAnim = useRef(new Animated.Value(0)).current;

  const isCurrentlyPlaying = currentTrack?.surahNumber === surah.number && isPlaying;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Playing animation
    if (isCurrentlyPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(playingAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(playingAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      playingAnim.stopAnimation();
      playingAnim.setValue(0);
    }
  }, [isCurrentlyPlaying]);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const renderPlayingIndicator = () => {
    const bar1Height = playingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [8, 16],
    });
    const bar2Height = playingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 8],
    });
    const bar3Height = playingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 14],
    });

    return (
      <View style={styles.playingIndicator}>
        <Animated.View style={[styles.playingBar, { height: bar1Height }]} />
        <Animated.View style={[styles.playingBar, { height: bar2Height }]} />
        <Animated.View style={[styles.playingBar, { height: bar3Height }]} />
      </View>
    );
  };

  const renderSurahNumber = () => (
    <View style={[
      styles.surahNumberContainer,
      variant === 'compact' && styles.surahNumberCompact,
      variant === 'featured' && styles.surahNumberFeatured,
    ]}>
      <LinearGradient
        colors={
          isCurrentlyPlaying 
            ? ['#10b981', '#059669'] 
            : ['#0ea5e9', '#3b82f6']
        }
        style={styles.surahNumberGradient}
      >
        {isCurrentlyPlaying ? renderPlayingIndicator() : (
          <Text style={styles.surahNumberText}>{surah.number}</Text>
        )}
        {variant === 'featured' && (
          <View style={styles.numberGlow} />
        )}
      </LinearGradient>
    </View>
  );

  const renderSurahInfo = () => (
    <View style={[
      styles.surahInfo,
      variant === 'horizontal' && styles.surahInfoHorizontal,
      variant === 'featured' && styles.surahInfoFeatured,
    ]}>
      <Text style={[
        styles.surahEnglishName,
        variant === 'compact' && styles.textCompact,
        variant === 'featured' && styles.textFeatured,
        { color: isDarkMode ? '#f8fafc' : '#111827' }
      ]}>
        {surah.englishName}
      </Text>
      
      <Text style={[
        styles.surahArabicName,
        variant === 'compact' && styles.textCompact,
        variant === 'featured' && styles.textFeatured,
        { color: isDarkMode ? '#cbd5e1' : '#374151' }
      ]}>
        {surah.name}
      </Text>
      
      {variant !== 'compact' && (
        <Text style={[
          styles.surahTranslation,
          variant === 'featured' && styles.translationFeatured,
          { color: isDarkMode ? '#94a3b8' : '#6b7280' }
        ]}>
          {surah.englishNameTranslation}
        </Text>
      )}
      
      <View style={styles.surahMeta}>
        <View style={styles.ayahBadge}>
          <Text style={styles.ayahBadgeText}>{surah.numberOfAyahs} آيات</Text>
        </View>
        <View style={styles.separator} />
        <Text style={[
          styles.revelationType,
          variant === 'compact' && styles.textCompact,
          { color: isDarkMode ? '#64748b' : '#9ca3af' }
        ]}>
          {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
        </Text>
      </View>
    </View>
  );

  const renderActions = () => {
    if (!showPlayButton) return null;

    if (variant === 'compact') {
      return (
        <TouchableOpacity
          style={[styles.compactPlayButton, { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }]}
          onPress={(e) => {
            e.stopPropagation();
            onPlayPress?.();
          }}
        >
          <Ionicons 
            name={isCurrentlyPlaying ? 'pause' : 'play'} 
            size={16} 
            color="#0ea5e9" 
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation();
            // Handle bookmark
          }}
        >
          <Ionicons name="bookmark-outline" size={18} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
        </TouchableOpacity>
        
        {onPlayPress && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={(e) => {
              e.stopPropagation();
              onPlayPress();
            }}
          >
            <LinearGradient
              colors={isCurrentlyPlaying ? ['#10b981', '#059669'] : ['#0ea5e9', '#3b82f6']}
              style={styles.playButtonGradient}
            >
              <Ionicons 
                name={isCurrentlyPlaying ? 'pause' : 'play'} 
                size={18} 
                color="#fff" 
              />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: variant === 'compact' ? 12 : variant === 'featured' ? 20 : 16,
      elevation: variant === 'featured' ? 8 : 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: variant === 'featured' ? 8 : 2 },
      shadowOpacity: variant === 'featured' ? 0.2 : 0.1,
      shadowRadius: variant === 'featured' ? 15 : 6,
      borderWidth: isCurrentlyPlaying ? 2 : (isDarkMode ? 1 : 0),
      borderColor: isCurrentlyPlaying ? '#10b981' : (isDarkMode ? '#334155' : 'transparent'),
      overflow: 'hidden',
    };

    switch (variant) {
      case 'compact':
        return {
          ...baseStyle,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 14,
        };
      case 'horizontal':
        return {
          ...baseStyle,
          flexDirection: 'column',
          padding: 16,
          width: width * 0.75,
          marginRight: 16,
        };
      case 'featured':
        return {
          ...baseStyle,
          flexDirection: 'column',
          padding: 24,
          minHeight: 200,
        };
      default:
        return {
          ...baseStyle,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 18,
        };
    }
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {variant === 'horizontal' || variant === 'featured' ? (
          <>
            <View style={styles.horizontalHeader}>
              {renderSurahNumber()}
              {renderActions()}
            </View>
            {renderSurahInfo()}
          </>
        ) : (
          <>
            {renderSurahNumber()}
            {renderSurahInfo()}
            {renderActions()}
          </>
        )}
        
        {/* Background Decoration */}
        <LinearGradient
          colors={[
            'transparent',
            isDarkMode 
              ? 'rgba(59, 130, 246, 0.03)' 
              : 'rgba(14, 165, 233, 0.02)'
          ]}
          style={styles.backgroundGradient}
          pointerEvents="none"
        />
        
        {/* Active State Overlay */}
        {isPressed && (
          <View style={[
            styles.pressedOverlay,
            { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(14, 165, 233, 0.05)' }
          ]} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  surahNumberContainer: {
    marginRight: 16,
  },
  surahNumberCompact: {
    marginRight: 12,
  },
  surahNumberFeatured: {
    marginRight: 0,
    marginBottom: 16,
  },
  surahNumberGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: 'relative',
  },
  surahNumberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 16,
  },
  playingBar: {
    width: 3,
    backgroundColor: '#fff',
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  surahInfo: {
    flex: 1,
  },
  surahInfoHorizontal: {
    marginTop: 12,
    alignItems: 'center',
    flex: 0,
  },
  surahInfoFeatured: {
    alignItems: 'center',
    flex: 0,
  },
  surahEnglishName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'left',
  },
  surahArabicName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'right',
    fontFamily: 'System',
  },
  surahTranslation: {
    fontSize: 13,
    marginBottom: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  textCompact: {
    fontSize: 14,
  },
  textFeatured: {
    fontSize: 20,
    textAlign: 'center',
  },
  translationFeatured: {
    fontSize: 15,
    textAlign: 'center',
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ayahBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  ayahBadgeText: {
    color: '#0ea5e9',
    fontSize: 11,
    fontWeight: '600',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 6,
  },
  revelationType: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 8,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pressedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SurahCard;