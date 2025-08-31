// 📖 src/components/quran/VerseCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Types
import type { Ayah } from '../../types';

// Stores
import { useSettingsStore } from '../../store/useSettingsStore';
import { useUserStore } from '../../store/useUserStore';
import { useAudioStore } from '../../store/useAudioStore';

interface VerseCardProps {
  verse: Ayah;
  surahName?: string;
  surahNumber?: number;
  translation?: string;
  onPlayPress?: () => void;
  onBookmarkPress?: () => void;
  style?: ViewStyle;
  showTranslation?: boolean;
  isBookmarked?: boolean;
}

const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  surahName,
  surahNumber,
  translation,
  onPlayPress,
  onBookmarkPress,
  style,
  showTranslation = true,
  isBookmarked = false,
}) => {
  const { isDarkMode, fontSize } = useSettingsStore();
  const { addBookmark } = useUserStore();
  const { currentTrack, isPlaying } = useAudioStore();
  
  const [showActions, setShowActions] = useState(false);

  const isCurrentlyPlaying = currentTrack?.ayahNumber === verse.numberInSurah && 
                            currentTrack?.surahNumber === surahNumber && 
                            isPlaying;

  const handleBookmark = () => {
    if (onBookmarkPress) {
      onBookmarkPress();
    } else {
      addBookmark({
        surahNumber: surahNumber || 1,
        ayahNumber: verse.numberInSurah,
        note: `آية ${verse.numberInSurah} من سورة ${surahName || ''}`,
      });
      Alert.alert('تم', 'تم إضافة الآية إلى المفضلة');
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `
${verse.text}

${translation ? `الترجمة: ${translation}` : ''}

سورة ${surahName || ''} - آية ${verse.numberInSurah}
من تطبيق القرآن الكريم
      `.trim();

      await Share.share({
        message: shareText,
        title: `آية ${verse.numberInSurah} من سورة ${surahName || ''}`,
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  };

  const handleCopy = () => {
    // In a real app, you would implement copy to clipboard
    Alert.alert('تم', 'تم نسخ الآية');
  };

  const ActionButton = ({ 
    icon, 
    onPress, 
    color = isDarkMode ? '#94a3b8' : '#6b7280',
    active = false 
  }: {
    icon: string;
    onPress: () => void;
    color?: string;
    active?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }
      ]}
      onPress={onPress}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={active ? '#0ea5e9' : color} 
      />
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          borderColor: isCurrentlyPlaying ? '#10b981' : (isDarkMode ? '#334155' : 'transparent'),
          borderWidth: isCurrentlyPlaying ? 1 : (isDarkMode ? 1 : 0),
        },
        style
      ]}
      onPress={() => setShowActions(!showActions)}
      activeOpacity={0.8}
    >
      {/* Verse Number Badge */}
      <View style={styles.header}>
        <View style={[
          styles.verseNumber,
          { backgroundColor: isCurrentlyPlaying ? '#10b981' : '#0ea5e9' }
        ]}>
          {isCurrentlyPlaying ? (
            <View style={styles.playingIndicator}>
              <View style={[styles.playingDot, styles.dot1]} />
              <View style={[styles.playingDot, styles.dot2]} />
              <View style={[styles.playingDot, styles.dot3]} />
            </View>
          ) : (
            <Text style={styles.verseNumberText}>{verse.numberInSurah}</Text>
          )}
        </View>

        {/* Verse Meta Info */}
        <View style={styles.verseMeta}>
          <Text style={[
            styles.verseMetaText,
            { color: isDarkMode ? '#94a3b8' : '#6b7280' }
          ]}>
            الجزء {verse.juz} • الصفحة {verse.page}
          </Text>
          {verse.sajda && (
            <View style={styles.sajdaBadge}>
              <Text style={styles.sajdaText}>سجدة</Text>
            </View>
          )}
        </View>
      </View>

      {/* Arabic Text */}
      <View style={styles.arabicTextContainer}>
        <Text style={[
          styles.arabicText,
          {
            fontSize: fontSize + 2,
            color: isDarkMode ? '#f8fafc' : '#111827',
            lineHeight: (fontSize + 2) * 1.8,
          }
        ]}>
          {verse.text}
        </Text>
      </View>

      {/* Translation */}
      {showTranslation && translation && (
        <View style={styles.translationContainer}>
          <Text style={[
            styles.translationText,
            {
              fontSize: fontSize - 1,
              color: isDarkMode ? '#cbd5e1' : '#374151',
            }
          ]}>
            {translation}
          </Text>
        </View>
      )}

      {/* Actions */}
      {showActions && (
        <View style={styles.actionsContainer}>
          <LinearGradient
            colors={[
              'transparent',
              isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)'
            ]}
            style={styles.actionsGradient}
          />
          
          <View style={styles.actions}>
            {onPlayPress && (
              <ActionButton
                icon={isCurrentlyPlaying ? 'pause' : 'play'}
                onPress={onPlayPress}
                color="#0ea5e9"
                active={isCurrentlyPlaying}
              />
            )}
            
            <ActionButton
              icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              onPress={handleBookmark}
              color="#f59e0b"
              active={isBookmarked}
            />
            
            <ActionButton
              icon="copy-outline"
              onPress={handleCopy}
            />
            
            <ActionButton
              icon="share-outline"
              onPress={handleShare}
            />
          </View>
        </View>
      )}

      {/* Background decoration */}
      <LinearGradient
        colors={[
          'transparent',
          isDarkMode 
            ? 'rgba(59, 130, 246, 0.02)' 
            : 'rgba(14, 165, 233, 0.01)'
        ]}
        style={styles.backgroundGradient}
        pointerEvents="none"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 0,
  },
  verseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.4,
  },
  verseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verseMetaText: {
    fontSize: 11,
    marginRight: 8,
  },
  sajdaBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sajdaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  arabicTextContainer: {
    padding: 16,
    paddingTop: 12,
  },
  arabicText: {
    textAlign: 'right',
    fontFamily: 'System', // يمكن إضافة خط عربي مخصص
    fontWeight: '400',
  },
  translationContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginTop: 8,
    paddingTop: 16,
  },
  translationText: {
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionsContainer: {
    position: 'relative',
    marginTop: 8,
  },
  actionsGradient: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default VerseCard;