// 🏠 src/screens/HomeScreen.tsx - Enhanced Version (fixed for LinearGradient colors typing)
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import type { ColorValue } from 'react-native';

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

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

/**
 * Colors tuple type compatible with expo-linear-gradient's expected type:
 * readonly [ColorValue, ColorValue, ...ColorValue[]]
 */
type Colors = readonly [ColorValue, ColorValue, ...ColorValue[]];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { surahs, fetchSurahs, isLoading } = useQuranStore();
  const { stats } = useUserStore();
  const { currentTrack } = useAudioStore();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs();
    }

    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  type Greeting = {
    text: string;
    icon: string;
    // au moins 2 couleurs, readonly
    gradient: Colors;
  };

  const getGreeting = (): Greeting => {
    const hour = new Date().getHours();
    if (hour < 12)
      return {
        text: 'صباح الخير',
        icon: 'sunny-outline',
        gradient: ['#fbbf24', '#f59e0b'] as const,
      };
    if (hour < 18)
      return {
        text: 'نهارك سعيد',
        icon: 'partly-sunny-outline',
        gradient: ['#3b82f6', '#1d4ed8'] as const,
      };
    return {
      text: 'مساء الخير',
      icon: 'moon-outline',
      gradient: ['#6366f1', '#4338ca'] as const,
    };
  };

  const greeting = getGreeting();
  const popularSurahs = surahs.slice(0, 6);

  const AnimatedQuickAction = ({
    icon,
    title,
    onPress,
    gradient,
    delay = 0,
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    gradient: Colors;
    delay?: number;
  }) => {
    const actionScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(actionScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={{ transform: [{ scale: actionScale }] }}>
        <TouchableOpacity onPress={onPress} style={styles.quickAction} activeOpacity={0.8}>
          <LinearGradient colors={gradient} style={styles.quickActionGradient}>
            <Ionicons name={icon as any} size={26} color="#fff" />
            <View style={styles.quickActionRipple} />
          </LinearGradient>
          <Text style={[styles.quickActionText, { color: isDarkMode ? '#f8fafc' : '#374151' }]}>
            {title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const EnhancedSurahCard = ({ surah, index }: { surah: any; index: number }) => (
    <Animated.View
      style={[
        styles.surahCardAnimated,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.surahCard, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}
        onPress={() => navigation.navigate('SurahDetail', { surahNumber: surah.number })}
        activeOpacity={0.85}
      >
        <View style={styles.surahCardContent}>
          <View style={styles.surahNumberContainer}>
            <LinearGradient colors={['#0ea5e9', '#3b82f6'] as const} style={styles.surahNumberGradient}>
              <Text style={styles.surahNumber}>{surah.number}</Text>
              <View style={styles.surahNumberGlow} />
            </LinearGradient>
          </View>

          <View style={styles.surahInfo}>
            <Text style={[styles.surahName, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              {surah.englishName}
            </Text>
            <Text style={[styles.surahArabic, { color: isDarkMode ? '#cbd5e1' : '#6b7280' }]}>
              {surah.name}
            </Text>
            <View style={styles.surahMeta}>
              <View style={styles.ayahBadge}>
                <Text style={styles.ayahBadgeText}>{surah.numberOfAyahs} آيات</Text>
              </View>
              <Text style={[styles.revelationType, { color: isDarkMode ? '#94a3b8' : '#9ca3af' }]}>
                {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
            <LinearGradient colors={['#10b981', '#059669'] as const} style={styles.playButtonGradient}>
              <Ionicons name="play" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.cardGlow} />
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
        <LoadingSpinner text="جاري التحميل..." />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      {/* Background Gradient */}
      <LinearGradient
        colors={isDarkMode ? (['#0f172a', '#1e293b', '#0f172a'] as const) : (['#f8fafc', '#e2e8f0', '#f8fafc'] as const)}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Enhanced Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingSection}>
              <LinearGradient colors={greeting.gradient} style={styles.greetingIcon}>
                <Ionicons name={greeting.icon as any} size={24} color="#fff" />
              </LinearGradient>
              <View style={styles.greetingText}>
                <Text style={[styles.greeting, { color: isDarkMode ? '#cbd5e1' : '#6b7280' }]}>{greeting.text}</Text>
                <Text style={[styles.welcomeText, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
                  مرحباً بك في القرآن الكريم
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={24} color={isDarkMode ? '#f8fafc' : '#374151'} />
              <View style={styles.profileButtonGlow} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Currently Playing - Enhanced */}
        {currentTrack && (
          <Animated.View
            style={[
              styles.nowPlayingContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <BlurView intensity={80} style={styles.nowPlayingBlur}>
              <LinearGradient
                colors={['rgba(14, 165, 233, 0.8)', 'rgba(59, 130, 246, 0.8)'] as const}
                style={styles.nowPlayingGradient}
              >
                <View style={styles.nowPlayingContent}>
                  <View style={styles.nowPlayingIcon}>
                    <Ionicons name="musical-notes" size={28} color="#fff" />
                    <View style={styles.playingPulse} />
                  </View>
                  <View style={styles.nowPlayingInfo}>
                    <Text style={styles.nowPlayingTitle}>{currentTrack.title}</Text>
                    <Text style={styles.nowPlayingSubtitle}>{currentTrack.surahName}</Text>
                  </View>
                  <TouchableOpacity style={styles.nowPlayingButton} onPress={() => navigation.navigate('AudioPlayer')}>
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>
        )}

        {/* Quick Actions - Enhanced */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>الوصول السريع</Text>
          <View style={styles.quickActions}>
            <AnimatedQuickAction
              icon="book-outline"
              title="قراءة"
              gradient={['#10b981', '#059669'] as const}
              onPress={() => navigation.navigate('Main', { screen: 'Quran' })}
              delay={100}
            />
            <AnimatedQuickAction
              icon="headset-outline"
              title="استماع"
              gradient={['#8b5cf6', '#7c3aed'] as const}
              onPress={() => navigation.navigate('Main', { screen: 'Audio' })}
              delay={200}
            />
            <AnimatedQuickAction
              icon="bookmark-outline"
              title="المفضلة"
              gradient={['#f59e0b', '#d97706'] as const}
              onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
              delay={300}
            />
            <AnimatedQuickAction
              icon="search-outline"
              title="البحث"
              gradient={['#ef4444', '#dc2626'] as const}
              onPress={() => {}}
              delay={400}
            />
          </View>
        </View>

        {/* Enhanced Stats */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>إحصائياتك</Text>
          <View style={styles.statsContainer}>
            {[
              {
                icon: 'time-outline',
                value: `${Math.floor(stats.totalListeningTime / 60)}س`,
                label: 'وقت الاستماع',
                gradient: ['#0ea5e9', '#3b82f6'] as const,
              },
              {
                icon: 'checkmark-circle-outline',
                value: stats.surahsCompleted,
                label: 'سور مكتملة',
                gradient: ['#10b981', '#059669'] as const,
              },
              {
                icon: 'flame-outline',
                value: stats.currentStreak,
                label: 'أيام متتالية',
                gradient: ['#f59e0b', '#d97706'] as const,
              },
            ].map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <LinearGradient colors={stat.gradient} style={styles.statGradient}>
                  <Ionicons name={stat.icon as any} size={22} color="#fff" />
                </LinearGradient>
                <Text style={[styles.statValue, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>{stat.label}</Text>
              </Card>
            ))}
          </View>
        </Animated.View>

        {/* Popular Surahs - Enhanced */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>السور الأكثر استماعاً</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Quran' })} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>عرض الكل</Text>
              <Ionicons name="chevron-forward" size={16} color="#0ea5e9" />
            </TouchableOpacity>
          </View>

          <View style={styles.surahList}>
            {popularSurahs.map((surah, index) => (
              <EnhancedSurahCard key={surah.number} surah={surah} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  /* ... same styles as before ... */
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  greetingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    position: 'relative',
  },
  profileButtonGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    opacity: 0,
  },
  nowPlayingContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  nowPlayingBlur: {
    overflow: 'hidden',
  },
  nowPlayingGradient: {
    padding: 20,
  },
  nowPlayingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowPlayingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  playingPulse: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  nowPlayingSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  nowPlayingButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  quickActionRipple: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    paddingVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  surahList: {
    paddingHorizontal: 20,
  },
  surahCardAnimated: {
    marginBottom: 12,
  },
  surahCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  surahCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
    position: 'relative',
  },
  surahNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  surahNumberGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  surahArabic: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'right',
    fontWeight: '500',
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    fontSize: 11,
    fontWeight: '600',
  },
  revelationType: {
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    marginLeft: 12,
  },
  playButtonGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(14, 165, 233, 0.3)',
  },
});

export default HomeScreen;
