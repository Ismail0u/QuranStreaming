// 🌐 src/services/api/quranApi.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import type { 
  ApiResponse, 
  Surah, 
  SurahDetail, 
  Edition, 
  SearchResult,
  QuranApiError 
} from '../../types';

class QuranApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour gérer les erreurs globalement
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): QuranApiError {
    if (error.response?.data) {
      return error.response.data;
    }
    
    return {
      code: error.code || 500,
      status: 'error',
      message: error.message || 'Network error occurred',
    };
  }

  /**
   * Récupère la liste de toutes les sourates
   */
  async getSurahs(): Promise<Surah[]> {
    try {
      const response: AxiosResponse<ApiResponse<Surah[]>> = await this.api.get('/surah');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère les détails d'une sourate avec ses versets
   */
  async getSurahDetail(
    surahNumber: number, 
    edition: string = 'quran-uthmani'
  ): Promise<SurahDetail> {
    try {
      const response: AxiosResponse<ApiResponse<SurahDetail>> = 
        await this.api.get(`/surah/${surahNumber}/${edition}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère une sourate avec audio d'un récitateur spécifique
   */
  async getSurahWithAudio(
    surahNumber: number, 
    reciterEdition: string = 'ar.alafasy'
  ): Promise<SurahDetail> {
    try {
      const response: AxiosResponse<ApiResponse<SurahDetail>> = 
        await this.api.get(`/surah/${surahNumber}/${reciterEdition}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Recherche dans le Coran
   */
  async searchQuran(
    query: string, 
    surah?: number, 
    edition: string = 'quran-uthmani'
  ): Promise<SearchResult> {
    try {
      let url = `/search/${encodeURIComponent(query)}/${edition}`;
      if (surah) {
        url += `/${surah}`;
      }
      
      const response: AxiosResponse<ApiResponse<SearchResult>> = 
        await this.api.get(url);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère les éditions/traductions disponibles
   */
  async getEditions(format?: 'text' | 'audio', language?: string): Promise<Edition[]> {
    try {
      let url = '/edition';
      const params: string[] = [];
      
      if (format) params.push(`format=${format}`);
      if (language) params.push(`language=${language}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response: AxiosResponse<ApiResponse<Edition[]>> = 
        await this.api.get(url);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère les récitateurs audio disponibles
   */
  async getAudioEditions(): Promise<Edition[]> {
    return this.getEditions('audio');
  }

  /**
   * Récupère un verset spécifique
   */
  async getAyah(
    ayahNumber: number, 
    edition: string = 'quran-uthmani'
  ): Promise<any> {
    try {
      const response = await this.api.get(`/ayah/${ayahNumber}/${edition}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère une page spécifique du Coran
   */
  async getPage(
    pageNumber: number, 
    edition: string = 'quran-uthmani'
  ): Promise<any> {
    try {
      const response = await this.api.get(`/page/${pageNumber}/${edition}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère un Juz/Para spécifique
   */
  async getJuz(
    juzNumber: number, 
    edition: string = 'quran-uthmani'
  ): Promise<any> {
    try {
      const response = await this.api.get(`/juz/${juzNumber}/${edition}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const quranApi = new QuranApiService();
export default quranApi;