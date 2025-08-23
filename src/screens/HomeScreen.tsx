// 📱 src/screens/HomeScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';

// Stores
import { useQuranStore } from '../store/useQuranStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAudioStore } from '../store/useAudioStore';

// Types
import type { Surah } from '../types';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  
  // Stores
  const { surahs, isLoading, error } = useQuranStore();
  const { currentTrack, isPlaying } = useAudioStore();
  const { history, stats } = useUserStore();

  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const mutedColor = isDarkMode ? '#64748b' : '#6b7280';

  // Sourates populaires (premières sourates + les plus écoutées)
  const popularSurahs = surahs.slice(0, 6);

  const handleSearch = (query: string) => {
    // TODO: Implémenter la recherche
    console.log('Search:', query);
  };

  const handleSurahPress = (surah: Surah) => {
    navigation.navigate('SurahDetail', { surahNumber: surah.number });
  };

  const SurahCard = ({ surah }: { surah: Surah }) => (
    <TouchableOpacity
      onPress={() => handleSurahPress(surah)}
      activeOpacity={0.7}
    >
      <Card style={styles.surahCard}>
        <View style={styles.surahHeader}>
          <View style={styles.surahNumber}>
            <Text style={[styles.numberText, { color: '#0ea5e9' }]}>
              {surah.number}
            </Text>
          </View>
          <View style={styles.surahInfo}>
            <Text style={[styles.surahName, { color: textColor }]}>
              {surah.name}
            </Text>
            <Text style={[styles.surahEnglish, { color: mutedColor }]}>
              {surah.englishName} • {surah.numberOfAyahs} verses
            </Text>
          </View>
          <Feather name="play" size={20} color="#0ea5e9" />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const ContinueListening = () => {
    if (!currentTrack) return null;

    return (
      <Card style={styles.continueCard}>
        <View style={styles.continueHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Continue Listening
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('AudioPlayer')}>
            <Feather name="chevron-right" size={20} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
        <View style={styles.continueContent}>
          <View style={styles.playIcon}>
            <Feather 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color="#ffffff" 
            />
          </View>
          <View style={styles.trackInfo}>
            <Text style={[styles.trackTitle, { color: textColor }]}>
              Surah {currentTrack.surahNumber}
            </Text>
            <Text style={[styles.trackSubtitle, { color: mutedColor }]}>
              {currentTrack.reciter.name}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const QuickStats = () => (
    <Card style={styles.statsCard}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Your Progress
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            Day Streak
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>
            {Math.floor(stats.totalListeningTime / 60)}h
          </Text>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            Total Time
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>
            {stats.surahsCompleted}
          </Text>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            Completed
          </Text>
        </View>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <LoadingSpinner text="Loading Quran..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          Error: {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Header 
        title="Quran Streaming"
        rightIcon="settings"
        onRightPress={() => navigation.navigate('Settings')}
        style={{ backgroundColor: bgColor }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Search surahs, verses..."
            onSearch={handleSearch}
            style={styles.searchBar}
          />
        </View>

        {/* Continue Listening */}
        <ContinueListening />

        {/* Quick Stats */}
        <QuickStats />

        {/* Popular Surahs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Popular Surahs
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Quran')}>
              <Text style={[styles.seeAll, { color: '#0ea5e9' }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularSurahs}
            renderItem={({ item }) => <SurahCard surah={item} />}
            keyExtractor={(item) => item.number.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Recent Activity */}
        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Recently Played
            </Text>
            {history.slice(0, 3).map((entry) => (
              <Card key={entry.id} style={styles.historyCard}>
                <View style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <Feather name="clock" size={16} color="#0ea5e9" />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={[styles.historyTitle, { color: textColor }]}>
                      Surah {entry.surahNumber}
                      {entry.ayahNumber && ` - Ayah ${entry.ayahNumber}`}
                    </Text>
                    <Text style={[styles.historyTime, { color: mutedColor }]}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchSection: {
    paddingVertical: 16,
  },
  searchBar: {
    marginBottom: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 16,
    fontWeight: '500',
  },
  horizontalList: {
    paddingRight: 16,
  },
  surahCard: {
    width: 280,
    marginRight: 16,
  },
  surahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  surahEnglish: {
    fontSize: 14,
  },
  continueCard: {
    marginBottom: 24,
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackSubtitle: {
    fontSize: 14,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyCard: {
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});