// 📱 src/screens/QuranScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';

// Stores
import { useQuranStore } from '../store/useQuranStore';
import { useSettingsStore } from '../store/useSettingsStore';

// Types
import type { Surah } from '../types';

type ViewMode = 'surahs' | 'juz' | 'hizb';

export default function QuranScreen() {
  const navigation = useNavigation<any>();
  const [viewMode, setViewMode] = useState<ViewMode>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { surahs, isLoading, error } = useQuranStore();

  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const mutedColor = isDarkMode ? '#64748b' : '#6b7280';

  // Filtrer les sourates selon la recherche
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    
    const query = searchQuery.toLowerCase();
    return surahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(query) ||
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.number.toString().includes(query)
    );
  }, [surahs, searchQuery]);

  const handleSurahPress = (surah: Surah) => {
    navigation.navigate('SurahDetail', { surahNumber: surah.number });
  };

  const ViewModeSelector = () => (
    <View style={styles.viewModeContainer}>
      <Button
        title="Surahs"
        onPress={() => setViewMode('surahs')}
        variant={viewMode === 'surahs' ? 'primary' : 'ghost'}
        size="small"
        style={styles.viewModeButton}
      />
      <Button
        title="Juz"
        onPress={() => setViewMode('juz')}
        variant={viewMode === 'juz' ? 'primary' : 'ghost'}
        size="small"
        style={styles.viewModeButton}
      />
      <Button
        title="Hizb"
        onPress={() => setViewMode('hizb')}
        variant={viewMode === 'hizb' ? 'primary' : 'ghost'}
        size="small"
        style={styles.viewModeButton}
      />
    </View>
  );

  const SurahListItem = ({ surah }: { surah: Surah }) => (
    <TouchableOpacity
      onPress={() => handleSurahPress(surah)}
      activeOpacity={0.7}
    >
      <Card style={styles.surahListCard}>
        <View style={styles.surahListContent}>
          <View style={styles.surahNumberContainer}>
            <Text style={[styles.surahNumberText, { color: '#0ea5e9' }]}>
              {surah.number}
            </Text>
          </View>
          
          <View style={styles.surahDetails}>
            <View style={styles.surahNameRow}>
              <Text style={[styles.surahNameArabic, { color: textColor }]}>
                {surah.name}
              </Text>
              <View style={styles.revelationBadge}>
                <Text style={styles.revelationText}>
                  {surah.revelationType.charAt(0)}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.surahNameEnglish, { color: textColor }]}>
              {surah.englishName}
            </Text>
            
            <Text style={[styles.surahTranslation, { color: mutedColor }]}>
              {surah.englishNameTranslation} • {surah.numberOfAyahs} verses
            </Text>
          </View>

          <TouchableOpacity style={styles.playButton}>
            <Feather name="play" size={20} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
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
        title="Holy Quran"
        rightIcon="search"
        style={{ backgroundColor: bgColor }}
      />
      
      <View style={styles.content}>
        {/* Search */}
        <SearchBar
          placeholder="Search surahs..."
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
          style={styles.searchBar}
        />

        {/* View Mode Selector */}
        <ViewModeSelector />

        {/* Results Count */}
        <Text style={[styles.resultsCount, { color: mutedColor }]}>
          {filteredSurahs.length} surahs found
        </Text>

        {/* Surahs List */}
        <FlatList
          data={filteredSurahs}
          renderItem={({ item }) => <SurahListItem surah={item} />}
          keyExtractor={(item) => item.number.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
  searchBar: {
    marginVertical: 16,
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  viewModeButton: {
    marginRight: 8,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  surahListCard: {
    marginBottom: 12,
    padding: 16,
  },
  surahListContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumberContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumberText: {
    fontSize: 18,
    fontWeight: '600',
  },
  surahDetails: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  surahNameArabic: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  revelationBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  revelationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  surahNameEnglish: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  surahTranslation: {
    fontSize: 14,
  },
  playButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});