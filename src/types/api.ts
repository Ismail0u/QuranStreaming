// 📝 src/types/api.ts
import { Surah, Ayah,Edition } from "./quran";

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface QuranApiError {
  code: number;
  status: string;
  message: string;
}

export interface SearchResult {
  count: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  surah: Surah;
  ayah: Ayah;
  edition: Edition;
  text: string;
}