// 📖 src/screens/QuranScreen.tsx - Enhanced Version
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
  RefreshControl,
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

type ViewMode = 'surahs' | 'juz' | 'favorites';

const QuranScreen: React.FC<QuranScreenProps> = ({ navigation }) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { surahs, fetchSurahs, isLoading } = useQuranStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs();
    }
    
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = surahs.filter(surah => 
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.includes(searchQuery) ||
        surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    } else {
      setFilteredSurahs(surahs);
    }
  }, [searchQuery, surahs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSurahs();
    setRefreshing(false);
  };

  const TabButton = ({ title, mode, icon, count }: { 
    title: string; 
    mode: ViewMode; 
    icon: string;
    count?: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        viewMode === mode && styles.tabButtonActive,
      ]}
      onPress={() => setViewMode(mode)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          viewMode === mode 
            ? ['#0ea5e9', '#3b82f6'] 
            : ['transparent', 'transparent']
        }
        style={styles.tabButtonGradient}
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
        {count !== undefined && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{count}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const EnhancedSurahItem = ({ surah, index }: { surah: Surah; index: number }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(itemAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.surahItemContainer,
          {
            opacity: itemAnim,
            transform: [{ translateX: itemAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })}]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.surahItem,
            { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
          ]}
          onPress={() => navigation.navigate('SurahDetail', { surahNumber: surah.number })}
          activeOpacity={0.8}
        >
          <View style={styles.surahLeft}>
            <View style={styles.surahNumberContainer}>
              <LinearGradient
                colors={['#0ea5e9', '#3b82f6']}
                style={styles.surahNumberGradient}
              >
                <Text style={styles.surahNumber}>{surah.number}</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.surahInfo}>
              <Text style={[styles.surahName, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
                {surah.englishName}
              </Text>
              <Text style={[styles.surahTranslation, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
                {surah.englishNameTranslation}
              </Text>
              <View style={styles.surahMetaRow}>
                <View style={styles.ayahBadge}>
                  <Text style={styles.ayahBadgeText}>{surah.numberOfAyahs} آيات</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={[styles.typeBadgeText, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
                    {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.surahRight}>
            <Text style={[styles.surahArabic, { color: isDarkMode ? '#cbd5e1' : '#374151' }]}>
              {surah.name}
            </Text>
            <View style={styles.surahActions}>
              <TouchableOpacity style={styles.bookmarkButton}>
                <Ionicons name="bookmark-outline" size={16} color={isDarkMode ? '#94a3b8' : '#6b7280'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.playButtonGradient}
                >
                  <Ionicons name="play" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Hover effect */}
          <View style={[styles.hoverEffect, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(14, 165, 233, 0.03)' }]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const JuzCard = ({ juz }: { juz: number }) => (
    <TouchableOpacity
      style={[
        styles.juzCard,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
      onPress={() => {}}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        style={styles.juzGradient}
      >
        <Text style={styles.juzNumber}>{juz}</Text>
        <View style={styles.juzPattern}>
          <View style={styles.juzDot} />
          <View style={styles.juzDot} />
          <View style={styles.juzDot} />
        </View>
      </LinearGradient>
      
      <View style={styles.juzInfo}>
        <Text style={[styles.juzTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          الجزء {juz}
        </Text>
        <Text style={[styles.juzSubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
          Part {juz}
        </Text>
        <View style={styles.juzProgress}>
          <View style={styles.juzProgressBar}>
            <View style={[styles.juzProgressFill, { width: '0%' }]} />
          </View>
          <Text style={[styles.juzProgressText, { color: isDarkMode ? '#64748b' : '#9ca3af' }]}>
            0% مكتمل
          </Text>
        </View>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? '#64748b' : '#9ca3af'} 
      />
    </TouchableOpacity>
  );

  const renderStatsHeader = () => (
    <Animated.View 
      style={[
        styles.statsHeader,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.statsRow}>
        {[
          { label: 'سورة', value: surahs.length, icon: 'book-outline', gradient: ['#0ea5e9', '#3b82f6'] },
          { label: 'آية', value: 6236, icon: 'text-outline', gradient: ['#10b981', '#059669'] },
          { label: 'جزء', value: 30, icon: 'library-outline', gradient: ['#f59e0b', '#d97706'] },
        ].map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <LinearGradient colors={stat.gradient} style={styles.statIcon}>
              <Ionicons name={stat.icon as any} size={20} color="#fff" />
            </LinearGradient>
            <Text style={[styles.statValue, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
              {stat.label}
            </Text>
          </Card>
        ))}
      </View>
    </Animated.View>
  );

  if (isLoading && surahs.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
        <LoadingSpinner text="جاري تحميل القرآن الكريم..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Background */}
      <LinearGradient
        colors={
          isDarkMode 
            ? ['#0f172a', '#1e293b', '#0f172a']
            : ['#f8fafc', '#e2e8f0', '#f8fafc']
        }
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          القرآن الكريم
        </Text>
        
        {/* Enhanced Tab Container */}
        <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}>
          <TabButton title="السور" mode="surahs" icon="book-outline" count={surahs.length} />
          <TabButton title="الأجزاء" mode="juz" icon="library-outline" count={30} />
          <TabButton title="المفضلة" mode="favorites" icon="heart-outline" />
        </View>
      </Animated.View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <SearchBar
          placeholder="البحث في القرآن الكريم..."
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
          style={styles.searchBar}
        />
      </View>

      {/* Stats Header */}
      {viewMode === 'surahs' && renderStatsHeader()}

      {/* Content */}
      <View style={styles.content}>
        {viewMode === 'surahs' && (
          <FlatList
            data={filteredSurahs}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item, index }) => <EnhancedSurahItem surah={item} index={index} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={isDarkMode ? '#f8fafc' : '#111827'}
              />
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}
        
        {viewMode === 'juz' && (
          <FlatList
            data={Array.from({ length: 30 }, (_, i) => i + 1)}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => <JuzCard juz={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.juzContainer}
            numColumns={1}
          />
        )}
        
        {viewMode === 'favorites' && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={64} color={isDarkMode ? '#64748b' : '#9ca3af'} />
            </View>
            <Text style={[styles.emptyTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              لا توجد مفضلة بعد
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
              أضف السور المفضلة لديك لسهولة الوصول إليها
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabButton: {
    flex: 1,
  },
  tabButtonActive: {
    elevation: 2,
  },
  tabButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    position: 'relative',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0ea5e9',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statsHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  surahItemContainer: {
    marginBottom: 8,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  surahLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberContainer: {
    marginRight: 16,
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
  },
  surahNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  surahTranslation: {
    fontSize: 13,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  surahMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ayahBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  ayahBadgeText: {
    color: '#0ea5e9',
    fontSize: 10,
    fontWeight: '600',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  surahRight: {
    alignItems: 'flex-end',
  },
  surahArabic: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: 'System',
  },
  surahActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoverEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  juzContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  juzCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  juzGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  juzNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  juzPattern: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
  },
  juzDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
  },
  juzInfo: {
    flex: 1,
  },
  juzTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'right',
  },
  juzSubtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  juzProgress: {
    marginTop: 4,
  },
  juzProgressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginBottom: 4,
  },
  juzProgressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  juzProgressText: {
    fontSize: 10,
    textAlign: 'right',
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

export default QuranScreen;