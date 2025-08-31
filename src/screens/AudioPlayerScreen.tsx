// 📱 src/screens/AudioPlayerScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Stores
import { useAudioStore } from '../store/useAudioStore';
import { useSettingsStore } from '../store/useSettingsStore';

export default function AudioPlayerScreen() {
  const navigation = useNavigation();
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);
  const { currentTrack, isPlaying, play, pause } = useAudioStore();

  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';

  if (!currentTrack) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-down" size={28} color={textColor} />
        </TouchableOpacity>
        
        <View style={styles.emptyPlayer}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            No audio selected
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-down" size={28} color={textColor} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Now Playing
        </Text>
        
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="more-vertical" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.artworkContainer}>
        <View style={styles.artwork}>
          <Feather name="book-open" size={80} color="#0ea5e9" />
        </View>
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={[styles.trackTitle, { color: textColor }]}>
          Surah {currentTrack.surahNumber}
        </Text>
        <Text style={[styles.trackArtist, { color: '#64748b' }]}>
          {currentTrack.reciter.name}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '30%' }]} />
        </View>
        <View style={styles.timeLabels}>
          <Text style={[styles.timeText, { color: '#64748b' }]}>
            2:30
          </Text>
          <Text style={[styles.timeText, { color: '#64748b' }]}>
            8:45
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Feather name="shuffle" size={20} color="#64748b" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Feather name="skip-back" size={24} color={textColor} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={isPlaying ? pause : play}
        >
          <Feather 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color="#ffffff" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Feather name="skip-forward" size={24} color={textColor} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Feather name="repeat" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="heart" size={20} color="#64748b" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={20} color="#64748b" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="list" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  
  // AudioPlayer Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 18,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 2,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 40,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  actionButton: {
    padding: 12,
  },
  emptyPlayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});