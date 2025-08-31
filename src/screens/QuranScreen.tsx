// 📖 src/screens/QuranScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Card from '../components/common/Card';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Stores
import { useSettingsStore } from '../store/useSettingsStore';
import { useQuranStore } from '../store/useQuranStore';

// Types
import { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import type { Surah } from '../types';

const { width } = Dimensions.get('window');

interface QuranScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

type ViewMode = 'surahs' | 'juz' | 'search';

const QuranScreen: React.FC<QuranScreenProps> = ({ navigation }) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { surahs, fetchSurahs, isLoading } = useQuranStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs();
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = surahs.filter(surah => 
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.includes(searchQuery) ||
        surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSurahs(filtered);
    } else {
      setFilteredSurahs(surahs);
    }
  }, [searchQuery, surahs]);

  const TabButton = ({ title, mode, icon }: { title: string; mode: ViewMode; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        viewMode === mode && styles.tabButtonActive,
        { backgroundColor: viewMode === mode ? '#0ea5e9' : 'transparent' }
      ]}
      onPress={() => setViewMode(mode)}
    >
      <Ionicons 
        name={icon as any} 
        size={18} 
        color={viewMode === mode ? '#fff' : (isDarkMode ? '#94a3b8' : '#6b7280')} 
      />
      <Text style={[
        styles.tabButtonText,
        { color: viewMode === mode ? '#fff' : (isDarkMode ? '#94a3b8' : '#6b7280') }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const SurahItem = ({ surah, index }: { surah: Surah; index: number }) => (
    <TouchableOpacity
      style={[
        styles.surahItem,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
      onPress={() => navigation.navigate('SurahDetail', { surahNumber: surah.number })}
    >
      <View style={styles.surahLeft}>
        <View style={styles.surahNumberContainer}>
          <Text style={styles.surahNumber}>{surah.number}</Text>
        </View>
        <View style={styles.surahInfo}>
          <Text style={[styles.surahName, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            {surah.englishName}
          </Text>
          <Text style={[styles.surahTranslation, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
            {surah.englishNameTranslation}
          </Text>
          <Text style={[styles.surahDetails, { color: isDarkMode ? '#64748b' : '#9ca3af' }]}>
            {surah.numberOfAyahs} آيات • {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </Text>
        </View>
      </View>
      <View style={styles.surahRight}>
        <Text style={[styles.surahArabic, { color: isDarkMode ? '#cbd5e1' : '#374151' }]}>
          {surah.name}
        </Text>
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={16} color="#0ea5e9" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const JuzItem = ({ juz }: { juz: number }) => (
    <TouchableOpacity
      style={[
        styles.juzItem,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
      onPress={() => {}}
    >
      <LinearGradient
        colors={['#0ea5e9', '#3b82f6']}
        style={styles.juzGradient}
      >
        <Text style={styles.juzNumber}>{juz}</Text>
      </LinearGradient>
      <View style={styles.juzInfo}>
        <Text style={[styles.juzTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          الجزء {juz}
        </Text>
        <Text style={[styles.juzSubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
          Part {juz}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? '#64748b' : '#9ca3af'} 
      />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
        القرآن الكريم
      </Text>
      <View style={styles.tabContainer}>
        <TabButton title="السور" mode="surahs" icon="book-outline" />
        <TabButton title="الأجزاء" mode="juz" icon="library-outline" />
      </View>
    </View>
  );

  const renderSearchSection = () => (
    <View style={styles.searchSection}>
      <SearchBar
        placeholder="البحث في القرآن الكريم..."
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
        style={styles.searchBar}
      />
    </View>
  );

  const renderSurahsView = () => (
    <View style={styles.content}>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            {surahs.length}
          </Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
            سورة
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            6236
          </Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
            آية
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            30
          </Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
            جزء
          </Text>
        </Card>
      </View>
      
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item, index }) => <SurahItem surah={item} index={index} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderJuzView = () => (
    <View style={styles.content}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
        أجزاء القرآن الكريم
      </Text>
      <FlatList
        data={Array.from({ length: 30 }, (_, i) => i + 1)}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => <JuzItem juz={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.juzContainer}
      />
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner text="جاري تحميل القرآن الكريم..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
      />
      
      {renderHeader()}
      {renderSearchSection()}
      
      {viewMode === 'surahs' && renderSurahsView()}
      {viewMode === 'juz' && renderJuzView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabButtonActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
    textAlign: 'right',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  surahLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  surahTranslation: {
    fontSize: 13,
    marginBottom: 2,
  },
  surahDetails: {
    fontSize: 11,
    textAlign: 'right',
  },
  surahRight: {
    alignItems: 'flex-end',
  },
  surahArabic: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'right',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  juzContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  juzItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  juzGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  juzNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  juzInfo: {
    flex: 1,
  },
  juzTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'right',
  },
  juzSubtitle: {
    fontSize: 13,
  },
});

export default QuranScreen;