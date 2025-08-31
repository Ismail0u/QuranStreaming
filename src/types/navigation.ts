// 📝 src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  SurahDetail: { surahNumber: number };
  Settings: undefined;
  AudioPlayer: undefined;
};

export type TabParamList = {
  Home: undefined;
  Quran: undefined;
  Audio: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  Search: undefined;
};

export type QuranStackParamList = {
  QuranScreen: undefined;
  SurahList: undefined;
  JuzList: undefined;
  HizbList: undefined;
};