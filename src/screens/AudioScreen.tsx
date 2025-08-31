// 🎵 src/screens/AudioScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Card from '../components/common/Card';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MiniPlayer from '../components/audio/MiniPlayer';

// Stores
import { useSettingsStore } from '../store/useSettingsStore';
import { useQuranStore } from '../store/useQuranStore';
import { useAudioStore } from '../store/useAudioStore';

// Types
import { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

interface AudioScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

// Mock data pour les récitateurs populaires
const POPULAR_RECITERS = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    country: 'الكويت',
    image: null,
    color: ['#10b981', '#059669'],
  },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    country: 'السعودية',
    image: null,
    color: ['#8b5cf6', '#7c3aed'],
  },
  {
    id: 'ar.mahermuaiqly',
    name: 'Maher Al Mueaqly',
    arabicName: 'ماهر المعيقلي',
    country: 'السعودية',
    image: null,
    color: ['#f59e0b', '#d97706'],
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    country: 'مصر',
    image: null,
    color: ['#ef4444', '#dc2626'],
  },
];

type ViewMode = 'reciters' | 'surahs' | 'playlists' | 'favorites';

const AudioScreen: React.FC<AudioScreenProps> = ({ navigation }) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { surahs, fetchSurahs, isLoading } = useQuranStore();
  const { currentTrack, playlist, selectedReciter, setReciter } = useAudioStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('reciters');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs();
    }
  }, []);

  const TabButton = ({ title, mode, icon }: { title: string; mode: ViewMode; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        viewMode === mode && styles.tabButtonActive,
      ]}
      onPress={() => setViewMode(mode)}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={viewMode === mode ? '#0ea5e9' : (isDarkMode ? '#94a3b8' : '#6b7280')} 
      />
      <Text style={[
        styles.tabButtonText,
        { color: viewMode === mode ? '#0ea5e9' : (isDarkMode ? '#94a3b8' : '#6b7280') }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ReciterCard = ({ reciter }: { reciter: typeof POPULAR_RECITERS[0] }) => (
    <TouchableOpacity
      style={[
        styles.reciterCard,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
      onPress={() => {
        setReciter({
          id: reciter.id,
          name: reciter.name,
          arabicName: reciter.arabicName,
          language: 'ar',
          style: 'tarteel'
        });
      }}
    >
      <LinearGradient
        colors={reciter.color}
        style={styles.reciterImageContainer}
      >
        <Ionicons name="person" size={32} color="#fff" />
      </LinearGradient>
      <View style={styles.reciterInfo}>
        <Text style={[styles.reciterName, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          {reciter.name}
        </Text>
        <Text style={[styles.reciterArabicName, { color: isDarkMode ? '#cbd5e1' : '#374151' }]}>
          {reciter.arabicName}
        </Text>
        <Text style={[styles.reciterCountry, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
          {reciter.country}
        </Text>
      </View>
      <View style={styles.reciterActions}>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: reciter.color[0] }]}
        >
          <Ionicons name="play" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const SurahAudioItem = ({ surah }: { surah: any }) => (
    <TouchableOpacity
      style={[
        styles.surahAudioItem,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
      onPress={() => {
        // Play audio for this surah with selected reciter
      }}
    >
      <View style={styles.surahAudioLeft}>
        <View style={styles.surahNumberBadge}>
          <Text style={styles.surahNumberText}>{surah.number}</Text>
        </View>
        <View style={styles.surahAudioInfo}>
          <Text style={[styles.surahAudioName, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            {surah.englishName}
          </Text>
          <Text style={[styles.surahAudioArabic, { color: isDarkMode ? '#cbd5e1' : '#374151' }]}>
            {surah.name}
          </Text>
          <Text style={[styles.surahAudioDetails, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
            {surah.numberOfAyahs} آيات • {selectedReciter?.name || 'اختر قارئ'}
          </Text>
        </View>
      </View>
      <View style={styles.surahAudioRight}>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={18} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.audioPlayButton}>
          <Ionicons name="play" size={16} color="#0ea5e9" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const PlaylistItem = ({ title, count, icon, color }: { title: string; count: number; icon: string; color: string[] }) => (
    <TouchableOpacity
      style={[
        styles.playlistItem,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
    >
      <LinearGradient colors={color} style={styles.playlistIcon}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </LinearGradient>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          {title}
        </Text>
        <Text style={[styles.playlistCount, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
          {count} عنصر
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
        الاستماع
      </Text>
      
      {selectedReciter && (
        <Card style={styles.selectedReciterCard}>
          <LinearGradient
            colors={['#0ea5e9', '#3b82f6']}
            style={styles.selectedReciterGradient}
          >
            <Ionicons name="person" size={20} color="#fff" />
            <Text style={styles.selectedReciterText}>
              {selectedReciter.arabicName || selectedReciter.name}
            </Text>
            <TouchableOpacity onPress={() => setReciter(null)}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </Card>
      )}
    </View>
  );

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabScrollView}
      contentContainerStyle={styles.tabContainer}
    >
      <TabButton title="القراء" mode="reciters" icon="people-outline" />
      <TabButton title="السور" mode="surahs" icon="library-outline" />
      <TabButton title="القوائم" mode="playlists" icon="list-outline" />
      <TabButton title="المفضلة" mode="favorites" icon="heart-outline" />
    </ScrollView>
  );

  const renderRecitersView = () => (
    <View style={styles.content}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          القراء المشهورون
        </Text>
      </View>
      <FlatList
        data={POPULAR_RECITERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReciterCard reciter={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderSurahsView = () => (
    <View style={styles.content}>
      {!selectedReciter ? (
        <View style={styles.noReciterContainer}>
          <Ionicons name="person-outline" size={64} color={isDarkMode ? '#64748b' : '#9ca3af'} />
          <Text style={[styles.noReciterTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            اختر قارئاً أولاً
          </Text>
          <Text style={[styles.noReciterSubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
            قم بتحديد قارئ من قسم القراء لبدء الاستماع
          </Text>
          <TouchableOpacity 
            style={styles.selectReciterButton}
            onPress={() => setViewMode('reciters')}
          >
            <Text style={styles.selectReciterButtonText}>اختيار قارئ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              السور المتاحة
            </Text>
          </View>
          <FlatList
            data={surahs}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => <SurahAudioItem surah={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );

  const renderPlaylistsView = () => (
    <View style={styles.content}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          قوائم التشغيل
        </Text>
      </View>
      <View style={styles.playlistContainer}>
        <PlaylistItem 
          title="الاستماع الأخير" 
          count={5} 
          icon="time-outline" 
          color={['#10b981', '#059669']} 
        />
        <PlaylistItem 
          title="السور القصيرة" 
          count={12} 
          icon="flash-outline" 
          color={['#f59e0b', '#d97706']} 
        />
        <PlaylistItem 
          title="للحفظ" 
          count={8} 
          icon="bookmark-outline" 
          color={['#8b5cf6', '#7c3aed']} 
        />
        <PlaylistItem 
          title="للاسترخاء" 
          count={15} 
          icon="moon-outline" 
          color={['#0ea5e9', '#3b82f6']} 
        />
      </View>
    </View>
  );

  const renderFavoritesView = () => (
    <View style={styles.content}>
      <View style={styles.emptyFavorites}>
        <Ionicons name="heart-outline" size={64} color={isDarkMode ? '#64748b' : '#9ca3af'} />
        <Text style={[styles.emptyTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          لا توجد مفضلة بعد
        </Text>
        <Text style={[styles.emptySubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
          أضف السور والقراء المفضلين لديك هنا
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner text="جاري تحميل المحتوى الصوتي..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
      />
      
      {renderHeader()}
      {renderTabs()}
      
      <View style={styles.searchSection}>
        <SearchBar
          placeholder="البحث في المحتوى الصوتي..."
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>
      
      {viewMode === 'reciters' && renderRecitersView()}
      {viewMode === 'surahs' && renderSurahsView()}
      {viewMode === 'playlists' && renderPlaylistsView()}
      {viewMode === 'favorites' && renderFavoritesView()}
      
      {currentTrack && (
        <MiniPlayer 
          onPress={() => navigation.navigate('AudioPlayer')}
          style={styles.miniPlayer}
        />
      )}
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedReciterCard: {
    padding: 0,
    overflow: 'hidden',
  },
  selectedReciterGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedReciterText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    textAlign: 'right',
  },
  tabScrollView: {
    flexGrow: 0,
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tabButtonActive: {
    backgroundColor: '#e0f2fe',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  
  // Reciter styles
  reciterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reciterImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reciterInfo: {
    flex: 1,
  },
  reciterName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reciterArabicName: {
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'right',
  },
  reciterCountry: {
    fontSize: 12,
    textAlign: 'right',
  },
  reciterActions: {
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginBottom: 8,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Surah audio styles
  surahAudioItem: {
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
  surahAudioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surahNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  surahAudioInfo: {
    flex: 1,
  },
  surahAudioName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  surahAudioArabic: {
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'right',
  },
  surahAudioDetails: {
    fontSize: 11,
    textAlign: 'right',
  },
  surahAudioRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButton: {
    padding: 8,
    marginRight: 8,
  },
  audioPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // No reciter state
  noReciterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noReciterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noReciterSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  selectReciterButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  selectReciterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Playlist styles
  playlistContainer: {
    paddingHorizontal: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  playlistCount: {
    fontSize: 13,
    textAlign: 'right',
  },
  
  // Empty states
  emptyFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Mini player
  miniPlayer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default AudioScreen;