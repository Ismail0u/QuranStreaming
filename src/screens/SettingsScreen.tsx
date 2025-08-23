// 📱 src/screens/SettingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';

// Stores
import { useSettingsStore } from '../store/useSettingsStore';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const settings = useSettingsStore();

  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const mutedColor = isDarkMode ? '#64748b' : '#6b7280';

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onPress, 
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Feather name={icon as any} size={20} color="#0ea5e9" />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: textColor }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: mutedColor }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {value && (
          <Text style={[styles.settingValue, { color: mutedColor }]}>
            {value}
          </Text>
        )}
        {rightComponent}
        {onPress && !rightComponent && (
          <Feather name="chevron-right" size={20} color={mutedColor} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Header 
        leftIcon="arrow-left"
        title="Settings"
        onLeftPress={() => navigation.goBack()}
        style={{ backgroundColor: bgColor }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <Card style={styles.settingCard}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Appearance
          </Text>
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Toggle between light and dark theme"
            rightComponent={
              <Switch
                value={settings.isDarkMode}
                onValueChange={settings.toggleDarkMode}
                trackColor={{ false: '#767577', true: '#0ea5e9' }}
                thumbColor={settings.isDarkMode ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingItem
            icon="type"
            title="Font Size"
            subtitle="Adjust text size for comfortable reading"
            value={`${settings.fontSize}px`}
            onPress={() => {
              Alert.alert('Font Size', 'Font size adjustment coming soon!');
            }}
          />
          
          <SettingItem
            icon="globe"
            title="Language"
            subtitle="Change app language"
            value={settings.language.toUpperCase()}
            onPress={() => {
              Alert.alert('Language', 'Language selection coming soon!');
            }}
          />
        </Card>

        {/* Audio Settings */}
        <Card style={styles.settingCard}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Audio Settings
          </Text>
          
          <SettingItem
            icon="play"
            title="Auto Play"
            subtitle="Automatically play next ayah"
            rightComponent={
              <Switch
                value={settings.autoPlay}
                onValueChange={(value) => settings.updateAudioSettings({ autoPlay: value })}
                trackColor={{ false: '#767577', true: '#0ea5e9' }}
                thumbColor={settings.autoPlay ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingItem
            icon="headphones"
            title="Audio Quality"
            subtitle="Choose audio quality for downloads"
            value={settings.downloadQuality}
            onPress={() => {
              Alert.alert('Audio Quality', 'Quality selection coming soon!');
            }}
          />
          
          <SettingItem
            icon="wifi"
            title="WiFi Only Downloads"
            subtitle="Download only when connected to WiFi"
            rightComponent={
              <Switch
                value={settings.wifiOnlyDownload}
                onValueChange={(value) => settings.updateAudioSettings({ wifiOnlyDownload: value })}
                trackColor={{ false: '#767577', true: '#0ea5e9' }}
                thumbColor={settings.wifiOnlyDownload ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </Card>

        {/* Notifications */}
        <Card style={styles.settingCard}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Notifications
          </Text>
          
          <SettingItem
            icon="bell"
            title="Enable Notifications"
            subtitle="Receive daily reminders and updates"
            rightComponent={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => settings.updateNotificationSettings({ notificationsEnabled: value })}
                trackColor={{ false: '#767577', true: '#0ea5e9' }}
                thumbColor={settings.notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingItem
            icon="clock"
            title="Daily Reminder"
            subtitle="Set time for daily reading reminder"
            value={settings.dailyReminderTime}
            onPress={() => {
              Alert.alert('Reminder Time', 'Time picker coming soon!');
            }}
          />
        </Card>

        {/* Privacy & Security */}
        <Card style={styles.settingCard}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Privacy & Security
          </Text>
          
          <SettingItem
            icon="bar-chart"
            title="Analytics"
            subtitle="Help improve the app with usage data"
            rightComponent={
              <Switch
                value={settings.analyticsEnabled}
                onValueChange={(value) => settings.updatePrivacySettings({ analyticsEnabled: value })}
                trackColor={{ false: '#767577', true: '#0ea5e9' }}
                thumbColor={settings.analyticsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingItem
            icon="alert-triangle"
            title="Crash Reporting"
            subtitle="Automatically send crash reports"
            rightComponent={
              <Switch
                value={settings.crashReportingEnabled}
                onValueChange={(value) => settings.updatePrivacySettings({ crashReportingEnabled: value })}
                trackColor={{ false: '#767577', true: '#0ea5e9' }}
                thumbColor={settings.crashReportingEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </Card>

        {/* About */}
        <Card style={styles.settingCard}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            About
          </Text>
          
          <SettingItem
            icon="info"
            title="App Version"
            subtitle="Current version information"
            value="1.0.0"
          />
          
          <SettingItem
            icon="help-circle"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => {
              Alert.alert('Support', 'Support page coming soon!');
            }}
          />
          
          <SettingItem
            icon="file-text"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => {
              Alert.alert('Privacy Policy', 'Privacy policy coming soon!');
            }}
          />
        </Card>

        {/* Reset */}
        <Card style={[styles.settingCard, styles.dangerCard]}>
          <SettingItem
            icon="refresh-cw"
            title="Reset to Defaults"
            subtitle="Reset all settings to default values"
            onPress={() => {
              Alert.alert(
                'Reset Settings',
                'Are you sure you want to reset all settings to default?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: settings.resetToDefaults 
                  },
                ]
              );
            }}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  // Settings Styles
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingCard: {
    marginBottom: 16,
    padding: 16,
  },
  dangerCard: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
});  