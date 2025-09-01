// 📱 src/screens/SurahDetailScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  Share,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

// Stores & hooks (assumed present in your project)
import { useQuranStore } from '../store/useQuranStore';
import { useAudioStore } from '../store/useAudioStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAudio } from '../hooks/useAudio'; // if you implemented earlier

// Types (adjust path if needed)
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import type { Ayah } from '../types/quran';

type SurahDetailRouteProp = RouteProp<RootStackParamList, 'SurahDetail'>;

export default function SurahDetailScreen() {
  const route = useRoute<SurahDetailRouteProp>();
  const navigation = useNavigation();
  const { surahNumber } = route.params;

  // Theme / settings
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);
  const reciterId = useSettingsStore((s) => s.reciterId);

  // Quran store: currentSurah should include .ayahs: Ayah[]
  const { currentSurah, isLoadingSurah, fetchSurahDetail, addBookmark } = useQuranStore();

  // Audio control: lightweight wrapper hook (from scaffold earlier). We use play/seek/load
  const audio = useAudio();
  const { status } = audio;

  // Local UI state
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [highlightAyah, setHighlightAyah] = useState<number | null>(null);
  const listRef = useRef<FlashList<Ayah> | null>(null);

  // Fetch surah on mount / when param changes
  useEffect(() => {
    fetchSurahDetail(surahNumber);
  }, [surahNumber]);

  // When audio status changes, try to highlight corresponding ayah if available (you can map)
  useEffect(() => {
    // If your audio manager exposes currentAyahIndex, use it; otherwise map by position
    // For MVP: we don't assume perfect mapping, just keep highlight when playing a specific ayah via playAyah()
  }, [status]);

  const handlePlaySurah = useCallback(async () => {
    if (!currentSurah) return;
    try {
      // Option: load full surah stream from quranApi by reciter + surahNumber
      await audio.load(reciterId, currentSurah.number);
      await audio.play();
      // highlight first ayah
      setHighlightAyah(1);
      // scroll to top
      listRef.current?.scrollToIndex?.({ index: 0, animated: true });
    } catch (err) {
      Alert.alert('Playback error', 'Impossible de lancer la lecture.');
      console.warn(err);
    }
  }, [audio, currentSurah, reciterId]);

  const playAyah = useCallback(
    async (ayah: Ayah) => {
      if (!currentSurah) return;
      try {
        // If your backend provides per-ayah audio urls, you can call audio.load(ayahUrl)
        // Here we use audio.load(reciterId, surahNumber) and then seek to ayah position if you track timestamps.
        // MVP: load the surah stream then optionally use stored timestamps to seek to ayah.
        await audio.load(reciterId, currentSurah.number); // loads surah
        // If you have timestamps: await audio.seek(ayah.startMillis)
        await audio.play();
        setHighlightAyah(ayah.numberInSurah);
        // scroll this ayah to center
        const idx = currentSurah.ayahs.findIndex((a) => a.numberInSurah === ayah.numberInSurah);
        if (idx >= 0) listRef.current?.scrollToIndex?.({ index: idx, animated: true, viewPosition: 0.4 });
      } catch (err) {
        Alert.alert('Playback error', 'Impossible de lire cette ayah.');
        console.warn(err);
      }
    },
    [audio, currentSurah, reciterId],
  );

  const handleBookmark = useCallback(
    (ayah: Ayah) => {
      if (!currentSurah) return;
      addBookmark({
        surahNumber: currentSurah.number,
        ayahNumber: ayah.numberInSurah,
        note: `${currentSurah.englishName} — Ayah ${ayah.numberInSurah}`,
      });
      Alert.alert('Favori', 'Ayah ajoutée aux favoris.');
    },
    [currentSurah, addBookmark],
  );

  const handleShare = useCallback(async (ayah: Ayah) => {
    try {
      const text = `${ayah.text}\n\n— ${currentSurah?.englishName} (${currentSurah?.number}) Ayah ${ayah.numberInSurah}`;
      await Share.share({ message: text });
    } catch (err) {
      console.warn('Share error', err);
    }
  }, [currentSurah]);

  const renderAyah = useCallback(
    ({ item }: { item: Ayah }) => {
      const isActive = highlightAyah === item.numberInSurah;
      return (
        <AyahRow
          ayah={item}
          isActive={isActive}
          showTranslation={showTranslation}
          onPlay={() => playAyah(item)}
          onBookmark={() => handleBookmark(item)}
          onShare={() => handleShare(item)}
          isDarkMode={isDarkMode}
        />
      );
    },
    [highlightAyah, showTranslation, playAyah, handleBookmark, handleShare, isDarkMode],
  );

  // If loading:
  if (isLoadingSurah) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#fff' }]}>
        <Header leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} style={{ backgroundColor: 'transparent' }} />
        <LoadingSpinner text="جاري تحميل السورة..." />
      </SafeAreaView>
    );
  }

  if (!currentSurah) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#fff' }]}>
        <Header leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} style={{ backgroundColor: 'transparent' }} />
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>السورة غير متوفرة</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0b1220' : '#fff8fb' }]}>
      <Header
        leftIcon="arrow-left"
        title={`${currentSurah.englishName} — ${currentSurah.number}`}
        rightIcon="more-vertical"
        onLeftPress={() => navigation.goBack()}
        style={{ backgroundColor: 'transparent' }}
      />

      <Card style={[styles.surahInfoCard, { backgroundColor: isDarkMode ? '#071026' : '#fff' }]}>
        <Text style={[styles.surahArabicTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a', fontFamily: 'Uthmani' }]}>
          {currentSurah.name}
        </Text>
        <Text style={[styles.surahEnglishTitle, { color: isDarkMode ? '#cbd5e1' : '#374151' }]}>
          {currentSurah.englishName}
        </Text>
        <Text style={[styles.surahTranslation, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
          {currentSurah.englishNameTranslation}
        </Text>

        <View style={styles.headerMeta}>
          <View style={styles.metaItem}>
            <Feather name="layers" size={14} color="#0ea5e9" />
            <Text style={[styles.metaText, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>{currentSurah.numberOfAyahs} آية</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={14} color="#0ea5e9" />
            <Text style={[styles.metaText, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>{currentSurah.revelationType}</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Button title={status.isPlaying ? 'Pause' : 'Play All'} onPress={handlePlaySurah} style={styles.playBtn} />
          <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowTranslation((s) => !s)}>
            <Ionicons name={showTranslation ? 'eye-off' : 'eye'} size={18} color="#0ea5e9" />
            <Text style={[styles.toggleText, { color: isDarkMode ? '#cbd5e1' : '#0f172a' }]}>{showTranslation ? 'إخفاء الترجمة' : 'عرض الترجمة'}</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Ayahs list — FlashList for perf */}
      <FlashList
        ref={listRef}
        data={currentSurah.ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => `${item.numberInSurah}`}
        estimatedItemSize={160}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ayahsContent}
        ListFooterComponent={<View style={{ height: 48 }} />}
      />
    </SafeAreaView>
  );
}

/* --------- Verse row component (mimics mushaf style) --------- */
function AyahRow({
  ayah,
  onPlay,
  onBookmark,
  onShare,
  isActive,
  showTranslation,
  isDarkMode,
}: {
  ayah: Ayah;
  onPlay: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isActive?: boolean;
  showTranslation: boolean;
  isDarkMode: boolean;
}) {
  return (
    <View style={[styles.ayahRow, isActive ? styles.ayahRowActive : null]}>
      {/* Arabic text block */}
      <View style={styles.ayahArabicContainer}>
        <Text
          style={[
            styles.ayahArabic,
            { color: isDarkMode ? '#f8fafc' : '#0b1220', fontFamily: 'Uthmani' },
            isActive && styles.ayahArabicActive,
          ]}
          selectable
          accessibilityRole="text"
        >
          {ayah.text}
        </Text>

        {/* ornate ayah number medallion — positioned after text */}
        <View style={styles.ayahNumberMedallion}>
          <Text style={styles.ayahNumberMedallionText}>{ayah.numberInSurah}</Text>
        </View>
      </View>

      {/* translation (optional) */}
      {showTranslation && ayah.translation && (
        <Text style={[styles.ayahTranslation, { color: isDarkMode ? '#94a3b8' : '#475569' }]}>{ayah.translation}</Text>
      )}

      {/* small actions row */}
      <View style={styles.ayahActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onPlay} accessibilityLabel="Play ayah">
          <Feather name="play" size={14} color="#0ea5e9" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onBookmark} accessibilityLabel="Bookmark ayah">
          <Feather name="bookmark" size={14} color="#0ea5e9" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onShare} accessibilityLabel="Share ayah">
          <Feather name="share" size={14} color="#0ea5e9" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------- styles -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18 },

  surahInfoCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  surahArabicTitle: {
    fontSize: 34,
    textAlign: 'center',
    lineHeight: 48,
  },
  surahEnglishTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '700',
  },
  surahTranslation: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 6 },
  metaText: { fontSize: 13 },

  headerActions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    alignItems: 'center',
  },
  playBtn: { paddingHorizontal: 18 },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  toggleText: { fontSize: 14 },

  ayahsContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 6,
  },

  ayahRow: {
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ayahRowActive: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)',
  },

  ayahArabicContainer: {
    position: 'relative',
    paddingBottom: 6,
  },
  ayahArabic: {
    fontSize: 26,
    lineHeight: 48,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ayahArabicActive: {
    // subtle emphasis when active
    textShadowColor: 'rgba(14,165,233,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  /** Ornament number medallion (mimics mushaf) */
  ayahNumberMedallion: {
    position: 'absolute',
    right: -8,
    top: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  ayahNumberMedallionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b1220',
  },

  ayahTranslation: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'right',
    fontStyle: 'italic',
  },

  ayahActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(14,165,233,0.06)',
  },
});
