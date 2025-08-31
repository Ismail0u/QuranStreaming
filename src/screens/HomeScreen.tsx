// 🏠 src/screens/HomeScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Stores
import { useSettingsStore } from '../store/useSettingsStore';
import { useQuranStore } from '../store/useQuranStore';
import { useAudioStore } from '../store/useAudioStore';
import { useUserStore } from '../store/useUserStore';

// Types
import { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { surahs, fetchSurahs, isLoading } = useQuranStore();
  const { stats } = useUserStore();
  const { currentTrack } = useAudioStore();

  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs();
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'نهارك سعيد';
    return 'مساء الخير';
  };

  const popularSurahs = surahs.slice(0, 6);
  const recentSurahs = surahs.slice(0, 3);

  const QuickAction = ({ icon, title, onPress, gradient }: {
    icon: string;
    title: string;
    onPress: () => void;
    gradient: string[];
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickAction}>
      <LinearGradient colors={gradient} style={styles.quickActionGradient}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </LinearGradient>
      <Text style={[styles.quickActionText, { color: isDarkMode ? '#f8fafc' : '#374151' }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const SurahCard = ({ surah, isHorizontal = false }: { surah: any; isHorizontal?: boolean }) => (
    <TouchableOpacity
      style={[
        styles.surahCard,
        isHorizontal && styles.surahCardHorizontal,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
      onPress={() => navigation.navigate('SurahDetail', { surahNumber: surah.number })}
    >
      <View style={styles.surahNumber}>
        <Text style={styles.surahNumberText}>{surah.number}</Text>
      </View>
      <View style={[styles.surahInfo, isHorizontal && styles.surahInfoHorizontal]}>
        <Text style={[styles.surahName, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
          {surah.englishName}
        </Text>
        <Text style={[styles.surahArabic, { color: isDarkMode ? '#cbd5e1' : '#6b7280' }]}>
          {surah.name}
        </Text>
        <Text style={[styles.surahDetails, { color: isDarkMode ? '#94a3b8' : '#9ca3af' }]}>
          {surah.numberOfAyahs} آيات • {surah.revelationType}
        </Text>
      </View>
      {!isHorizontal && (
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={16} color="#0ea5e9" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingSpinner text="جاري التحميل..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: isDarkMode ? '#cbd5e1' : '#6b7280' }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.welcomeText, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              مرحباً بك في القرآن الكريم
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={isDarkMode ? '#f8fafc' : '#374151'} 
            />
          </TouchableOpacity>
        </View>

        {/* Currently Playing */}
        {currentTrack && (
          <Card style={styles.nowPlayingCard}>
            <LinearGradient
              colors={['#0ea5e9', '#3b82f6']}
              style={styles.nowPlayingGradient}
            >
              <View style={styles.nowPlayingContent}>
                <View style={styles.nowPlayingIcon}>
                  <Ionicons name="musical-notes" size={24} color="#fff" />
                </View>
                <View style={styles.nowPlayingInfo}>
                  <Text style={styles.nowPlayingTitle}>{currentTrack.title}</Text>
                  <Text style={styles.nowPlayingSubtitle}>{currentTrack.surahName}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.nowPlayingButton}
                  onPress={() => navigation.navigate('AudioPlayer')}
                >
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            الوصول السريع
          </Text>
          <View style={styles.quickActions}>
            <QuickAction
              icon="book-outline"
              title="قراءة"
              gradient={['#10b981', '#059669']}
              onPress={() => navigation.navigate('Main', { screen: 'Quran' })}
            />
            <QuickAction
              icon="headset-outline"
              title="استماع"
              gradient={['#8b5cf6', '#7c3aed']}
              onPress={() => navigation.navigate('Main', { screen: 'Audio' })}
            />
            <QuickAction
              icon="bookmark-outline"
              title="المفضلة"
              gradient={['#f59e0b', '#d97706']}
              onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
            />
            <QuickAction
              icon="search-outline"
              title="البحث"
              gradient={['#ef4444', '#dc2626']}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            إحصائياتك
          </Text>
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <LinearGradient colors={['#0ea5e9', '#3b82f6']} style={styles.statIconGradient}>
                  <Ionicons name="time-outline" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={[styles.statValue, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
                {Math.floor(stats.totalListeningTime / 60)}س
              </Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
                وقت الاستماع
              </Text>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <LinearGradient colors={['#10b981', '#059669']} style={styles.statIconGradient}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={[styles.statValue, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
                {stats.surahsCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
                سور مكتملة
              </Text>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statIcon}>
                <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.statIconGradient}>
                  <Ionicons name="flame-outline" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={[styles.statValue, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
                {stats.currentStreak}
              </Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
                أيام متتالية
              </Text>
            </Card>
          </View>
        </View>

        {/* Recent Listening */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              الاستماع الأخير
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Audio' })}>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalList}>
              {recentSurahs.map((surah) => (
                <SurahCard key={surah.number} surah={surah} isHorizontal />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Popular Surahs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              السور الأكثر استماعاً
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Quran' })}>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.surahList}>
            {popularSurahs.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nowPlayingCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 0,
    overflow: 'hidden',
  },
  nowPlayingGradient: {
    padding: 16,
  },
  nowPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowPlayingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  nowPlayingSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  nowPlayingButton: {
    padding: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  seeAllText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    marginBottom: 8,
  },
  statIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  horizontalList: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  surahList: {
    paddingHorizontal: 20,
  },
  surahCard: {
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
  surahCardHorizontal: {
    width: width * 0.7,
    marginRight: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  surahNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  surahInfo: {
    flex: 1,
  },
  surahInfoHorizontal: {
    flex: 0,
    marginTop: 12,
    marginRight: 0,
  },
  surahName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  surahArabic: {
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'right',
  },
  surahDetails: {
    fontSize: 12,
    textAlign: 'right',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;