// src/screens/AudioScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import AudioPlayer from '../components/audio/AudioPlayer';
import MiniPlayer from '../components/audio/MiniPlayer';
import PlayerControls from '../components/audio/PlayerControls';
import { useAudioStore } from '../store/useAudioStore';
import useAudio from '../hooks/useAudio';
import { useMediaSession } from '../hooks/useAudio';
import type { AudioTrack, Reciter } from '../types';

const AudioScreen: React.FC = () => {
  const {
    currentTrack,
    playlist,
    isPlaying,
    selectedReciter,
    play,
    addToPlaylist,
    clearPlaylist,
  } = useAudioStore();

  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showReciters, setShowReciters] = useState(false);

  // Hooks personnalisés
  useAudio();
  useMediaSession();

  // Mock data - à remplacer par de vraies données API
  const mockTracks: AudioTrack[] = [
    {
      id: '1',
      title: 'Al-Fatiha',
      surahName: 'الفاتحة',
      surahNumber: 1,
      verseCount: 7,
      audioUrl: 'https://example.com/fatiha.mp3',
      duration: 120000, // 2 minutes
      reciter: 'Abd al-Basit Abd as-Samad',
    },
    {
      id: '2',
      title: 'Al-Baqarah (1-5)',
      surahName: 'البقرة',
      surahNumber: 2,
      verseCount: 5,
      audioUrl: 'https://example.com/baqarah-1-5.mp3',
      duration: 300000, // 5 minutes
      reciter: 'Abd al-Basit Abd as-Samad',
    },
    {
      id: '3',
      title: 'Ayat al-Kursi',
      surahName: 'البقرة',
      surahNumber: 2,
      verseCount: 1,
      audioUrl: 'https://example.com/ayat-kursi.mp3',
      duration: 180000, // 3 minutes
      reciter: 'Mishary Rashid Alafasy',
    },
  ];

  const mockReciters: Reciter[] = [
    {
      id: '1',
      name: 'Abd al-Basit Abd as-Samad',
      arabicName: 'عبد الباسط عبد الصمد',
      country: 'Egypt',
      style: 'Murattal',
    },
    {
      id: '2',
      name: 'Mishary Rashid Alafasy',
      arabicName: 'مشاري بن راشد العفاسي',
      country: 'Kuwait',
      style: 'Murattal',
    },
    {
      id: '3',
      name: 'Maher Al Mueaqly',
      arabicName: 'ماهر المعيقلي',
      country: 'Saudi Arabia',
      style: 'Murattal',
    },
  ];

  const handleTrackPress = (track: AudioTrack) => {
    play(track);
  };

  const handleAddAllToPlaylist = () => {
    clearPlaylist();
    mockTracks.forEach(track => addToPlaylist(track));
  };

  const renderTrackItem = ({ item }: { item: AudioTrack }) => (
    <TouchableOpacity
      style={[
        styles.trackItem,
        currentTrack?.id === item.id && styles.activeTrackItem
      ]}
      onPress={() => handleTrackPress(item)}
    >
      <View style={styles.trackArtwork}>
        <LinearGradient
          colors={currentTrack?.id === item.id ? ['#1DB954', '#1ed760'] : ['#4c669f', '#3b5998']}
          style={styles.trackArtworkGradient}
        >
          <Ionicons 
            name={currentTrack?.id === item.id && isPlaying ? 'pause' : 'play'} 
            size={20} 
            color="#fff" 
          />
        </LinearGradient>
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackSubtitle} numberOfLines={1}>
          {item.surahName} • {item.reciter}
        </Text>
        <Text style={styles.trackDuration}>
          {Math.floor(item.duration / 60000)}:{((item.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}
        </Text>
      </View>

      <TouchableOpacity style={styles.trackOptions}>
        <Ionicons name="ellipsis-vertical" size={16} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderReciterItem = ({ item }: { item: Reciter }) => (
    <TouchableOpacity
      style={[
        styles.reciterItem,
        selectedReciter?.id === item.id && styles.activeReciterItem
      ]}
      onPress={() => {/* setSelectedReciter(item) */}}
    >
      <View style={styles.reciterAvatar}>
        <Text style={styles.reciterInitial}>
          {item.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.reciterInfo}>
        <Text style={styles.reciterName}>{item.name}</Text>
        <Text style={styles.reciterDetails}>{item.arabicName}</Text>
        <Text style={styles.reciterCountry}>{item.country} • {item.style}</Text>
      </View>
      {selectedReciter?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#1DB954" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audio Quran</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowReciters(true)}
            style={styles.headerButton}
          >
            <Ionicons name="person" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPlaylist(true)}
            style={styles.headerButton}
          >
            <Ionicons name="list" size={24} color="#fff" />
            {playlist.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{playlist.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Current Playing Section */}
      {currentTrack && (
        <View style={styles.currentSection}>
          <Text style={styles.sectionTitle}>En cours de lecture</Text>
          <TouchableOpacity
            style={styles.currentTrack}
            onPress={() => setShowFullPlayer(true)}
          >
            <View style={styles.currentArtwork}>
              <LinearGradient
                colors={['#1DB954', '#1ed760']}
                style={styles.currentArtworkGradient}
              >
                <Ionicons name="musical-notes" size={32} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.currentInfo}>
              <Text style={styles.currentTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.currentSubtitle} numberOfLines={1}>
                {currentTrack.surahName} • {currentTrack.reciter}
              </Text>
            </View>
          </TouchableOpacity>
          
          <PlayerControls size="medium" showExtended />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAddAllToPlaylist}
        >
          <Ionicons name="play-circle" size={20} color="#1DB954" />
          <Text style={styles.actionText}>Lire tout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download" size={20} color="#fff" />
          <Text style={styles.actionText}>Télécharger</Text>
        </TouchableOpacity>
      </View>

      {/* Tracks List */}
      <View style={styles.tracksSection}>
        <Text style={styles.sectionTitle}>Sourates disponibles</Text>
        <FlatList
          data={mockTracks}
          keyExtractor={(item) => item.id}
          renderItem={renderTrackItem}
          showsVerticalScrollIndicator={false}
          style={styles.tracksList}
        />
      </View>

      {/* Mini Player */}
      {currentTrack && !showFullPlayer && (
        <MiniPlayer onPress={() => setShowFullPlayer(true)} />
      )}

      {/* Full Player Modal */}
      <Modal
        visible={showFullPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AudioPlayer onClose={() => setShowFullPlayer(false)} />
      </Modal>

      {/* Playlist Modal */}
      <Modal
        visible={showPlaylist}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Playlist ({playlist.length})</Text>
            <TouchableOpacity
              onPress={() => setShowPlaylist(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={playlist}
            keyExtractor={(item) => item.id}
            renderItem={renderTrackItem}
            style={styles.modalList}
          />
        </View>
      </Modal>

      {/* Reciters Modal */}
      <Modal
        visible={showReciters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Récitateurs</Text>
            <TouchableOpacity
              onPress={() => setShowReciters(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockReciters}
            keyExtractor={(item) => item.id}
            renderItem={renderReciterItem}
            style={styles.modalList}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#1DB954',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  currentSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  currentTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentArtwork: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  currentArtworkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentInfo: {
    flex: 1,
  },
  currentTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  actionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  tracksSection: {
    flex: 1,
    padding: 20,
  },
  tracksList: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  activeTrackItem: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  trackArtwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  trackArtworkGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  trackSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 2,
  },
  trackDuration: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  trackOptions: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    flex: 1,
    padding: 20,
  },
  reciterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  activeReciterItem: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  reciterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reciterInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reciterInfo: {
    flex: 1,
  },
  reciterName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  reciterDetails: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 2,
  },
  reciterCountry: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});

export default AudioScreen;