// 📱 src/screens/AudioScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Components
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Stores
import { useAudioStore } from '../store/useAudioStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useUserStore } from '../store/useUserStore';

// Constants
import { POPULAR_RECITERS } from '../utils/constants';

export default function AudioScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'playing' | 'reciters' | 'downloads'>('playing');
  
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { 
    currentTrack, 
    isPlaying, 
    playlist, 
    selectedReciter,
    setReciter,
  } = useAudioStore();
  const { history } = useUserStore();

  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const mutedColor = isDarkMode ? '#64748b' : '#6b7280';

  const TabSelector = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'playing' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('playing')}
      >
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'playing' ? '#ffffff' : mutedColor },
          ]}
        >
          Now Playing
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'reciters' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('reciters')}
      >
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'reciters' ? '#ffffff' : mutedColor },
          ]}
        >
          Reciters
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'downloads' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('downloads')}
      >
        <Text
          style={[
            styles.tabText,
            { color: activeTab === 'downloads' ? '#ffffff' : mutedColor },
          ]}
        >
          Downloads
        </Text>
      </TouchableOpacity>
    </View>
  );

  const NowPlayingTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Current Track */}
      {currentTrack ? (
        <Card style={styles.currentTrackCard}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AudioPlayer')}
            style={styles.currentTrackContent}
          >
            <View style={styles.currentTrackArt}>
              <Feather 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="#ffffff" 
              />
            </View>
            <View style={styles.currentTrackInfo}>
              <Text style={[styles.currentTrackTitle, { color: textColor }]}>
                Surah {currentTrack.surahNumber}
              </Text>
              <Text style={[styles.currentTrackReciter, { color: mutedColor }]}>
                {currentTrack.reciter.name}
              </Text>
              <Text style={[styles.currentTrackStatus, { color: '#0ea5e9' }]}>
                {isPlaying ? 'Playing...' : 'Paused'}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={mutedColor} />
          </TouchableOpacity>
        </Card>
      ) : (
        <Card style={styles.emptyStateCard}>
          <View style={styles.emptyState}>
            <Feather name="headphones" size={48} color={mutedColor} />
            <Text style={[styles.emptyStateTitle, { color: textColor }]}>
              No audio playing
            </Text>
            <Text style={[styles.emptyStateDesc, { color: mutedColor }]}>
              Select a surah to start listening
            </Text>
            <Button
              title="Browse Quran"
              onPress={() => navigation.navigate('Quran')}
              style={styles.browseButton}
            />
          </View>
        </Card>
      )}

      {/* Playlist */}
      {playlist.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Up Next ({playlist.length})
          </Text>
          {playlist.slice(0, 5).map((track, index) => (
            <Card key={track.id} style={styles.playlistItem}>
              <View style={styles.playlistContent}>
                <Text style={[styles.playlistNumber, { color: mutedColor }]}>
                  {index + 1}
                </Text>
                <View style={styles.playlistInfo}>
                  <Text style={[styles.playlistTitle, { color: textColor }]}>
                    Surah {track.surahNumber}
                  </Text>
                  <Text style={[styles.playlistReciter, { color: mutedColor }]}>
                    {track.reciter.name}
                  </Text>
                </View>
                <TouchableOpacity style={styles.playlistAction}>
                  <Feather name="more-vertical" size={16} color={mutedColor} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Recently Played
          </Text>
          {history.slice(0, 3).map((entry) => (
            <Card key={entry.id} style={styles.historyItem}>
              <View style={styles.historyContent}>
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
                <Text style={[styles.historyDuration, { color: mutedColor }]}>
                  {Math.floor(entry.duration / 60)}m
                </Text>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const RecitersTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Popular Reciters
      </Text>
      {POPULAR_RECITERS.map((reciter) => (
        <Card key={reciter.id} style={styles.reciterCard}>
          <TouchableOpacity
            onPress={() => setReciter(reciter)}
            style={styles.reciterContent}
          >
            <View style={[
              styles.reciterAvatar,
              selectedReciter?.id === reciter.id && styles.selectedReciterAvatar
            ]}>
              <Feather 
                name="mic" 
                size={24} 
                color={selectedReciter?.id === reciter.id ? '#ffffff' : '#0ea5e9'} 
              />
            </View>
            <View style={styles.reciterInfo}>
              <Text style={[styles.reciterName, { color: textColor }]}>
                {reciter.name}
              </Text>
              <Text style={[styles.reciterLanguage, { color: mutedColor }]}>
                Arabic • Traditional Style
              </Text>
            </View>
            {selectedReciter?.id === reciter.id && (
              <Feather name="check" size={20} color="#0ea5e9" />
            )}
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );

  const DownloadsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card style={styles.emptyStateCard}>
        <View style={styles.emptyState}>
          <Feather name="download" size={48} color={mutedColor} />
          <Text style={[styles.emptyStateTitle, { color: textColor }]}>
            No downloads yet
          </Text>
          <Text style={[styles.emptyStateDesc, { color: mutedColor }]}>
            Download surahs for offline listening
          </Text>
          <Button
            title="Browse Quran"
            onPress={() => navigation.navigate('Quran')}
            style={styles.browseButton}
          />
        </View>
      </Card>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'playing':
        return <NowPlayingTab />;
      case 'reciters':
        return <RecitersTab />;
      case 'downloads':
        return <DownloadsTab />;
      default:
        return <NowPlayingTab />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Header 
        title="Audio"
        rightIcon="more-vertical"
        style={{ backgroundColor: bgColor }}
      />
      
      <View style={styles.content}>
        <TabSelector />
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
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
// Audio Screen Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0ea5e9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  
  // Current Track
  currentTrackCard: {
    marginBottom: 24,
  },
  currentTrackContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTrackArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  currentTrackInfo: {
    flex: 1,
  },
  currentTrackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentTrackReciter: {
    fontSize: 14,
    marginBottom: 2,
  },
  currentTrackStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Empty State
  emptyStateCard: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    paddingHorizontal: 24,
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
  
  // Playlist
  playlistItem: {
    marginBottom: 8,
    padding: 12,
  },
  playlistContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistNumber: {
    fontSize: 16,
    fontWeight: '500',
    width: 24,
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  playlistReciter: {
    fontSize: 12,
  },
  playlistAction: {
    padding: 8,
  },
  
  // History
  historyItem: {
    marginBottom: 8,
    padding: 12,
  },
  historyContent: {
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
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
  },
  historyDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Reciters
  reciterCard: {
    marginBottom: 12,
  },
  reciterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reciterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedReciterAvatar: {
    backgroundColor: '#0ea5e9',
  },
  reciterInfo: {
    flex: 1,
  },
  reciterName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  reciterLanguage: {
    fontSize: 12,
  },
});