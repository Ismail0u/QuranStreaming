// 📱 src/screens/SurahDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

// Stores
import { useQuranStore } from '../store/useQuranStore';
import { useAudioStore } from '../store/useAudioStore';
import { useSettingsStore } from '../store/useSettingsStore';

// Types
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, Ayah } from '../types';

type SurahDetailRouteProp = RouteProp<RootStackParamList, 'SurahDetail'>;

export default function SurahDetailScreen() {
  const route = useRoute<SurahDetailRouteProp>();
  const navigation = useNavigation();
  const { surahNumber } = route.params;
  
  const [showTranslation, setShowTranslation] = useState(false);
  
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { currentSurah, isLoadingSurah, fetchSurahDetail, addBookmark } = useQuranStore();
  const { play, isPlaying } = useAudioStore();

  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const mutedColor = isDarkMode ? '#64748b' : '#6b7280';

  useEffect(() => {
    fetchSurahDetail(surahNumber);
  }, [surahNumber]);

  const handlePlaySurah = () => {
    if (currentSurah) {
      // TODO: Créer AudioTrack et lancer la lecture
      console.log('Playing surah:', currentSurah.number);
    }
  };

  const handleBookmark = (ayah: Ayah) => {
    addBookmark({
      surahNumber: currentSurah!.number,
      ayahNumber: ayah.numberInSurah,
      note: `Surah ${currentSurah!.englishName} - Ayah ${ayah.numberInSurah}`,
    });
  };

  const AyahCard = ({ ayah }: { ayah: Ayah }) => (
    <Card style={styles.ayahCard}>
      <View style={styles.ayahHeader}>
        <View style={styles.ayahNumber}>
          <Text style={styles.ayahNumberText}>{ayah.numberInSurah}</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => handleBookmark(ayah)}
        >
          <Feather name="bookmark" size={16} color="#0ea5e9" />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.ayahText, { color: textColor }]}>
        {ayah.text}
      </Text>
      
      {showTranslation && (
        <Text style={[styles.ayahTranslation, { color: mutedColor }]}>
          {/* TODO: Ajouter la traduction */}
          Translation will be available soon...
        </Text>
      )}
      
      <View style={styles.ayahActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="play" size={16} color="#0ea5e9" />
          <Text style={[styles.actionText, { color: '#0ea5e9' }]}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share" size={16} color="#0ea5e9" />
          <Text style={[styles.actionText, { color: '#0ea5e9' }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (isLoadingSurah) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Header 
          leftIcon="arrow-left"
          onLeftPress={() => navigation.goBack()}
          style={{ backgroundColor: bgColor }}
        />
        <LoadingSpinner text="Loading surah..." />
      </View>
    );
  }

  if (!currentSurah) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Header 
          leftIcon="arrow-left"
          onLeftPress={() => navigation.goBack()}
          style={{ backgroundColor: bgColor }}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: textColor }]}>
            Surah not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Header 
        leftIcon="arrow-left"
        title={currentSurah.englishName}
        rightIcon="more-vertical"
        onLeftPress={() => navigation.goBack()}
        style={{ backgroundColor: bgColor }}
      />
      
      {/* Surah Info Header */}
      <Card style={styles.surahInfoCard}>
        <View style={styles.surahInfoContent}>
          <Text style={[styles.surahNameArabic, { color: textColor }]}>
            {currentSurah.name}
          </Text>
          <Text style={[styles.surahNameEnglish, { color: textColor }]}>
            {currentSurah.englishName}
          </Text>
          <Text style={[styles.surahTranslation, { color: mutedColor }]}>
            {currentSurah.englishNameTranslation}
          </Text>
          
          <View style={styles.surahMeta}>
            <View style={styles.metaItem}>
              <Feather name="book" size={16} color="#0ea5e9" />
              <Text style={[styles.metaText, { color: mutedColor }]}>
                {currentSurah.numberOfAyahs} Ayahs
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={16} color="#0ea5e9" />
              <Text style={[styles.metaText, { color: mutedColor }]}>
                {currentSurah.revelationType}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <Button
              title={isPlaying ? "Pause" : "Play All"}
              onPress={handlePlaySurah}
              style={styles.playButton}
            />
            <TouchableOpacity 
              style={styles.translationToggle}
              onPress={() => setShowTranslation(!showTranslation)}
            >
              <Text style={[styles.toggleText, { color: '#0ea5e9' }]}>
                {showTranslation ? 'Hide' : 'Show'} Translation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
      
      {/* Ayahs List */}
      <ScrollView 
        style={styles.ayahsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ayahsContent}
      >
        {currentSurah.ayahs.map((ayah) => (
          <AyahCard key={ayah.number} ayah={ayah} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
    // SurahDetail Styles
  surahInfoCard: {
    margin: 16,
    padding: 20,
  },
  surahInfoContent: {
    alignItems: 'center',
  },
  surahNameArabic: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  surahNameEnglish: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  surahTranslation: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  surahMeta: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  playButton: {
    paddingHorizontal: 24,
  },
  translationToggle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ayahsList: {
    flex: 1,
  },
  ayahsContent: {
    padding: 16,
  },
  ayahCard: {
    marginBottom: 16,
    padding: 16,
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ayahNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  bookmarkButton: {
    padding: 8,
  },
  ayahText: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'right',
    marginBottom: 12,
  },
  ayahTranslation: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  ayahActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
});