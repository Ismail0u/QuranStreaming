// 📖 src/components/quran/SurahCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Types
import type { Surah } from '../../types';

// Stores
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAudioStore } from '../../store/useAudioStore';

interface SurahCardProps {
  surah: Surah;
  onPress: () => void;
  onPlayPress?: () => void;
  variant?: 'default' | 'compact' | 'horizontal';
  style?: ViewStyle;
  showPlayButton?: boolean;
}

const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  onPress,
  onPlayPress,
  variant = 'default',
  style,
  showPlayButton = true,
}) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { currentTrack, isPlaying } = useAudioStore();

  const isCurrentlyPlaying = currentTrack?.surahNumber === surah.number && isPlaying;

  const renderSurahNumber = () => (
    <View style={[
      styles.surahNumber,
      variant === 'compact' && styles.surahNumberCompact,
      { backgroundColor: isCurrentlyPlaying ? '#10b981' : '#0ea5e9' }
    ]}>
      {isCurrentlyPlaying ? (
        <View style={styles.playingIndicator}>
          <View style={[styles.playingBar, styles.bar1]} />
          <View style={[styles.playingBar, styles.bar2]} />
          <View style={[styles.playingBar, styles.bar3]} />
        </View>
      ) : (
        <Text style={styles.surahNumberText}>{surah.number}</Text>
      )}
    </View>
  );

  const renderSurahInfo = () => (
    <View style={[
      styles.surahInfo,
      variant === 'horizontal' && styles.surahInfoHorizontal
    ]}>
      <Text style={[
        styles.surahEnglishName,
        variant === 'compact' && styles.textCompact,
        { color: isDarkMode ? '#f8fafc' : '#111827' }
      ]}>
        {surah.englishName}
      </Text>
      
      <Text style={[
        styles.surahArabicName,
        variant === 'compact' && styles.textCompact,
        { color: isDarkMode ? '#cbd5e1' : '#374151' }
      ]}>
        {surah.name}
      </Text>
      
      {variant !== 'compact' && (
        <Text style={[
          styles.surahTranslation,
          { color: isDarkMode ? '#94a3b8' : '#6b7280' }
        ]}>
          {surah.englishNameTranslation}
        </Text>
      )}
      
      <View style={styles.surahMeta}>
        <Text style={[
          styles.surahDetails,
          variant === 'compact' && styles.textCompact,
          { color: isDarkMode ? '#64748b' : '#9ca3af' }
        ]}>
          {surah.numberOfAyahs} آيات
        </Text>
        <View style={styles.separator} />
        <Text style={[
          styles.surahDetails,
          variant === 'compact' && styles.textCompact,
          { color: isDarkMode ? '#64748b' : '#9ca3af' }
        ]}>
          {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
        </Text>
      </View>
    </View>
  );

  const renderActions = () => {
    if (!showPlayButton || variant === 'compact') return null;

    return (
      <View style={styles.actions}>
        {onPlayPress && (
          <TouchableOpacity
            style={[
              styles.playButton,
              { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onPlayPress();
            }}
          >
            <Ionicons 
              name={isCurrentlyPlaying ? 'pause' : 'play'} 
              size={16} 
              color="#0ea5e9" 
            />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.moreButton,
            { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }
          ]}
          onPress={(e) => {
            e.stopPropagation();
            // Handle more options
          }}
        >
          <Ionicons 
            name="ellipsis-horizontal" 
            size={16} 
            color={isDarkMode ? '#94a3b8' : '#6b7280'} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  const getCardStyle = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: variant === 'compact' ? 8 : 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: isDarkMode ? '#334155' : 'transparent',
    };

    if (isCurrentlyPlaying) {
      baseStyle.borderColor = '#10b981';
      baseStyle.borderWidth = 1;
    }

    switch (variant) {
      case 'compact':
        return {
          ...baseStyle,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
        };
      case 'horizontal':
        return {
          ...baseStyle,
          flexDirection: 'column',
          padding: 16,
          width: 280,
          marginRight: 16,
        };
      default:
        return {
          ...baseStyle,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {variant === 'horizontal' ? (
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
      
      {/* Background decoration for horizontal variant */}
      {variant === 'horizontal' && (
        <LinearGradient
          colors={[
            'transparent',
            isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(14, 165, 233, 0.03)'
          ]}
          style={styles.backgroundGradient}
          pointerEvents="none"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  surahNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumberCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  surahNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingBar: {
    width: 2,
    backgroundColor: '#fff',
    marginHorizontal: 1,
    borderRadius: 1,
  },
  bar1: {
    height: 8,
    animationName: 'bounce1',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
  },
  bar2: {
    height: 12,
    animationName: 'bounce2',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0.1s',
  },
  bar3: {
    height: 6,
    animationName: 'bounce3',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0.2s',
  },
  surahInfo: {
    flex: 1,
  },
  surahInfoHorizontal: {
    marginTop: 12,
    alignItems: 'center',
  },
  surahEnglishName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  surahArabicName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: 'System', // On peut ajouter une police arabe ici
  },
  surahTranslation: {
    fontSize: 13,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahDetails: {
    fontSize: 12,
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 8,
  },
  textCompact: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
});

export default SurahCard;