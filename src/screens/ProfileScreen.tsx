// 📱 src/screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Stores
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const toggleDarkMode = useSettingsStore((state) => state.toggleDarkMode);
  const { stats, history, clearHistory } = useUserStore();

  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const mutedColor = isDarkMode ? '#64748b' : '#6b7280';

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear your listening history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: clearHistory 
        },
      ]
    );
  };

  const ProfileStats = () => (
    <Card style={styles.statsCard}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Your Statistics
      </Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>
            {Math.floor(stats.totalListeningTime / 60)}
          </Text>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            Hours Listened
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            Day Streak
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>
            {stats.surahsCompleted}
          </Text>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            Surahs Completed
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#0ea5e9' }]}>
            {stats.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: mutedColor }]}>
            Best Streak
          </Text>
        </View>
      </View>
    </Card>
  );

  const SettingsMenu = () => (
    <Card style={styles.menuCard}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Settings
      </Text>
      
      {/* Theme Toggle */}
      <TouchableOpacity style={styles.menuItem} onPress={toggleDarkMode}>
        <View style={styles.menuItemLeft}>
          <Feather 
            name={isDarkMode ? "sun" : "moon"} 
            size={20} 
            color="#0ea5e9" 
          />
          <Text style={[styles.menuItemText, { color: textColor }]}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={mutedColor} />
      </TouchableOpacity>

      {/* Settings Navigation */}
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate('Settings')}
      >
        <View style={styles.menuItemLeft}>
          <Feather name="settings" size={20} color="#0ea5e9" />
          <Text style={[styles.menuItemText, { color: textColor }]}>
            App Settings
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={mutedColor} />
      </TouchableOpacity>

      {/* Bookmarks */}
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Feather name="bookmark" size={20} color="#0ea5e9" />
          <Text style={[styles.menuItemText, { color: textColor }]}>
            Bookmarks
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={mutedColor} />
      </TouchableOpacity>

      {/* History */}
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Feather name="clock" size={20} color="#0ea5e9" />
          <Text style={[styles.menuItemText, { color: textColor }]}>
            Listening History
          </Text>
        </View>
        <View style={styles.menuItemRight}>
          <Text style={[styles.menuItemCount, { color: mutedColor }]}>
            {history.length}
          </Text>
          <Feather name="chevron-right" size={20} color={mutedColor} />
        </View>
      </TouchableOpacity>
    </Card>
  );

  const ActionsMenu = () => (
    <Card style={styles.menuCard}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Data & Privacy
      </Text>
      
      <TouchableOpacity style={styles.menuItem} onPress={handleClearHistory}>
        <View style={styles.menuItemLeft}>
          <Feather name="trash-2" size={20} color="#ef4444" />
          <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
            Clear History
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Feather name="download" size={20} color="#0ea5e9" />
          <Text style={[styles.menuItemText, { color: textColor }]}>
            Export Data
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={mutedColor} />
      </TouchableOpacity>
    </Card>
  );

  const AppInfo = () => (
    <Card style={styles.infoCard}>
      <View style={styles.appInfo}>
        <Text style={[styles.appName, { color: textColor }]}>
          Quran Streaming
        </Text>
        <Text style={[styles.appVersion, { color: mutedColor }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.appDescription, { color: mutedColor }]}>
          Experience the Holy Quran with beautiful recitations
        </Text>
      </View>
      
      <View style={styles.socialLinks}>
        <TouchableOpacity style={styles.socialButton}>
          <Feather name="star" size={20} color="#0ea5e9" />
          <Text style={[styles.socialText, { color: textColor }]}>
            Rate App
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton}>
          <Feather name="share-2" size={20} color="#0ea5e9" />
          <Text style={[styles.socialText, { color: textColor }]}>
            Share App
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Header 
        title="Profile"
        rightIcon="edit-3"
        style={{ backgroundColor: bgColor }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileStats />
        <SettingsMenu />
        <ActionsMenu />
        <AppInfo />
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
    
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  

  // Profile Screen Styles
  statsCard: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  statBox: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 16,
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
    textAlign: 'center',
  },
  
  // Menu
  menuCard: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  menuItemCount: {
    fontSize: 14,
    marginRight: 8,
  },
  
  // App Info
  infoCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
  },
  socialText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});