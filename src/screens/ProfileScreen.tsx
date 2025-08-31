// 👤 src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Stores
import { useSettingsStore } from '../store/useSettingsStore';
import { useUserStore } from '../store/useUserStore';
import { useAudioStore } from '../store/useAudioStore';

// Types
import { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

interface ProfileScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    fontSize,
    setFontSize,
    language,
    setLanguage,
    notificationsEnabled,
    updateNotificationSettings,
    resetToDefaults,
  } = useSettingsStore();
  
  const { stats, preferences } = useUserStore();
  const { clearPlaylist } = useAudioStore();
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    color = isDarkMode ? '#f8fafc' : '#111827' 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon as any} size={20} color="#0ea5e9" />
        </View>
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.menuSubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent || (
        onPress && (
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={isDarkMode ? '#64748b' : '#9ca3af'} 
          />
        )
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }: {
    icon: string;
    value: string | number;
    label: string;
    color: string[];
  }) => (
    <Card style={styles.statCard}>
      <LinearGradient colors={color} style={styles.statGradient}>
        <Ionicons name={icon as any} size={24} color="#fff" />
      </LinearGradient>
      <Text style={[styles.statValue, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
        {label}
      </Text>
    </Card>
  );

  const handleLanguageChange = () => {
    Alert.alert(
      'اختر اللغة',
      'Choose Language',
      [
        { text: 'العربية', onPress: () => setLanguage('ar') },
        { text: 'English', onPress: () => setLanguage('en') },
        { text: 'Français', onPress: () => setLanguage('fr') },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  const handleFontSizeChange = () => {
    Alert.alert(
      'حجم الخط',
      'اختر حجم الخط المناسب',
      [
        { text: 'صغير', onPress: () => setFontSize(14) },
        { text: 'متوسط', onPress: () => setFontSize(16) },
        { text: 'كبير', onPress: () => setFontSize(18) },
        { text: 'كبير جداً', onPress: () => setFontSize(20) },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'إعادة تعيين الإعدادات',
      'هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى الافتراضية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'إعادة تعيين', 
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            clearPlaylist();
            Alert.alert('تم', 'تم إعادة تعيين الإعدادات بنجاح');
          }
        },
      ]
    );
  };

  const getCurrentLanguageText = () => {
    switch (language) {
      case 'ar': return 'العربية';
      case 'en': return 'English';
      case 'fr': return 'Français';
      default: return 'العربية';
    }
  };

  const getFontSizeText = () => {
    if (fontSize <= 14) return 'صغير';
    if (fontSize <= 16) return 'متوسط';
    if (fontSize <= 18) return 'كبير';
    return 'كبير جداً';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0f172a' : '#f8fafc'}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#0ea5e9', '#3b82f6']}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <Text style={styles.userName}>مستخدم القرآن الكريم</Text>
            <Text style={styles.userLevel}>المستوى: مبتدئ</Text>
          </LinearGradient>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            إحصائياتك
          </Text>
          <View style={styles.statsContainer}>
            <StatCard
              icon="time"
              value={`${Math.floor(stats.totalListeningTime / 60)}س`}
              label="وقت الاستماع"
              color={['#10b981', '#059669']}
            />
            <StatCard
              icon="checkmark-circle"
              value={stats.surahsCompleted}
              label="سور مكتملة"
              color={['#8b5cf6', '#7c3aed']}
            />
            <StatCard
              icon="flame"
              value={`${stats.currentStreak}`}
              label="أيام متتالية"
              color={['#f59e0b', '#d97706']}
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            المظهر والتخصيص
          </Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="moon"
              title="الوضع المظلم"
              subtitle="تفعيل أو إلغاء الوضع المظلم"
              rightComponent={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#767577', true: '#0ea5e9' }}
                  thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                />
              }
            />
            <MenuItem
              icon="language"
              title="اللغة"
              subtitle={getCurrentLanguageText()}
              onPress={handleLanguageChange}
            />
            <MenuItem
              icon="text"
              title="حجم الخط"
              subtitle={getFontSizeText()}
              onPress={handleFontSizeChange}
            />
          </View>
        </View>

        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            إعدادات الصوت
          </Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="musical-notes"
              title="جودة الصوت"
              subtitle="عالية (192kbps)"
              onPress={() => {}}
            />
            <MenuItem
              icon="download"
              title="التحميل عبر WiFi فقط"
              rightComponent={
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: '#767577', true: '#0ea5e9' }}
                  thumbColor="#fff"
                />
              }
            />
            <MenuItem
              icon="repeat"
              title="التكرار التلقائي"
              subtitle="تكرار السورة عند الانتهاء"
              rightComponent={
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: '#767577', true: '#0ea5e9' }}
                  thumbColor="#f4f3f4"
                />
              }
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            الإشعارات
          </Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="notifications"
              title="تفعيل الإشعارات"
              subtitle="إشعارات التذكير اليومي"
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={(value) => updateNotificationSettings({ notificationsEnabled: value })}
                  trackColor={{ false: '#767577', true: '#0ea5e9' }}
                  thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                />
              }
            />
            <MenuItem
              icon="time"
              title="وقت التذكير"
              subtitle="8:00 صباحاً"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            البيانات والتخزين
          </Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="cloud-download"
              title="المحتوى المحمل"
              subtitle="2.1 جيجا بايت"
              onPress={() => {}}
            />
            <MenuItem
              icon="bookmark"
              title="العلامات المرجعية"
              subtitle={`${5} علامة محفوظة`}
              onPress={() => {}}
            />
            <MenuItem
              icon="heart"
              title="المفضلة"
              subtitle={`${3} عناصر محفوظة`}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Advanced Settings */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.advancedToggle}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
              الإعدادات المتقدمة
            </Text>
            <Ionicons 
              name={showAdvanced ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={isDarkMode ? '#94a3b8' : '#6b7280'} 
            />
          </TouchableOpacity>
          
          {showAdvanced && (
            <View style={styles.menuContainer}>
              <MenuItem
                icon="analytics"
                title="تحليلات الاستخدام"
                subtitle="مساعدة في تحسين التطبيق"
                rightComponent={
                  <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#767577', true: '#0ea5e9' }}
                    thumbColor="#fff"
                  />
                }
              />
              <MenuItem
                icon="bug"
                title="تقارير الأخطاء"
                subtitle="إرسال تقارير الأخطاء تلقائياً"
                rightComponent={
                  <Switch
                    value={true}
                    onValueChange={() => {}}
                    trackColor={{ false: '#767577', true: '#0ea5e9' }}
                    thumbColor="#fff"
                  />
                }
              />
              <MenuItem
                icon="server"
                title="خادم API"
                subtitle="api.alquran.cloud"
                onPress={() => {}}
              />
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
            الإجراءات
          </Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="share"
              title="مشاركة التطبيق"
              subtitle="شارك التطبيق مع الأصدقاء"
              onPress={() => {}}
            />
            <MenuItem
              icon="star"
              title="تقييم التطبيق"
              subtitle="قيم التطبيق في المتجر"
              onPress={() => {}}
            />
            <MenuItem
              icon="mail"
              title="تواصل معنا"
              subtitle="إرسال ملاحظات أو اقتراحات"
              onPress={() => {}}
            />
            <MenuItem
              icon="information-circle"
              title="حول التطبيق"
              subtitle="الإصدار 1.0.0"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Reset Section */}
        <View style={styles.section}>
          <Card style={styles.resetCard}>
            <View style={styles.resetContent}>
              <Ionicons name="warning" size={24} color="#ef4444" />
              <View style={styles.resetText}>
                <Text style={[styles.resetTitle, { color: isDarkMode ? '#f8fafc' : '#111827' }]}>
                  إعادة تعيين الإعدادات
                </Text>
                <Text style={[styles.resetSubtitle, { color: isDarkMode ? '#94a3b8' : '#6b7280' }]}>
                  سيتم حذف جميع إعداداتك والعودة للحالة الافتراضية
                </Text>
              </View>
            </View>
            <Button
              title="إعادة تعيين"
              onPress={handleResetSettings}
              variant="secondary"
              size="small"
            />
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDarkMode ? '#64748b' : '#9ca3af' }]}>
            تطبيق القرآن الكريم
          </Text>
          <Text style={[styles.footerText, { color: isDarkMode ? '#64748b' : '#9ca3af' }]}>
            الإصدار 1.0.0
          </Text>
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
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLevel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 12,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
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
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'right',
  },
  menuSubtitle: {
    fontSize: 13,
    textAlign: 'right',
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resetCard: {
    marginHorizontal: 20,
    padding: 16,
  },
  resetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetText: {
    flex: 1,
    marginLeft: 16,
  },
  resetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'right',
  },
  resetSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
});

export default ProfileScreen;