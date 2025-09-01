import { z } from 'zod';
import {
  CryptoDetailSchema,
  type CryptoDetail,
} from '../schemas/crypto-detail.schema';
import {
  clearFavorites,
  getFavorites,
  isFavorite,
  toggleFavorite,
} from '../storage/crypto-favorites';

export interface ICrypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

type CoinsMarketListFilter = {
  page: number;
  per_page: number;
  names: string;
  order:
    | 'market_cap_desc'
    | 'market_cap_asc'
    | 'volume_desc'
    | 'volume_asc'
    | 'price_desc'
    | 'price_asc';
  vs_currency: 'usd' | 'eur' | 'gbp' | 'jpy' | 'krw' | 'cny' | 'inr' | 'rub';
  price_change_percentage: '1h' | '24h' | '7d' | '14d' | '30d' | '200d' | '1y';
};

const cryptoService = {
  search: async (
    query: string,
    filters: Omit<CoinsMarketListFilter, 'names' | 'page' | 'per_page'>,
  ) => {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
        query,
      )}`,
    );
    const searchData = await response.json();

    // El endpoint de búsqueda devuelve IDs, necesitamos obtener los datos de mercado
    if (searchData.coins && searchData.coins.length > 0) {
      const coinIds = searchData.coins
        .slice(0, 5)
        .map((coin: any) => coin.id)
        .join(',');

      // Usar todos los filtros proporcionados
      const marketResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${filters.vs_currency}&ids=${coinIds}&order=${filters.order}&per_page=20&page=1&sparkline=false&price_change_percentage=${filters.price_change_percentage}`,
      );

      return await marketResponse.json();
    }

    return [];
  },

  list: async (filters: CoinsMarketListFilter) => {
    if (filters.names && filters.names.length >= 2) {
      const searchFilters = {
        vs_currency: filters.vs_currency,
        order: filters.order,
        price_change_percentage: filters.price_change_percentage,
      };

      const searchResults = await cryptoService.search(
        filters.names,
        searchFilters,
      );

      return searchResults;
    }

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${filters.vs_currency}&order=${filters.order}&per_page=${filters.per_page}&page=${filters.page}&sparkline=false&price_change_percentage=${filters.price_change_percentage}`;

    const response = await fetch(url);
    const data: ICrypto[] = await response.json();

    return data;
  },

  get: async (id: string): Promise<CryptoDetail> => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const validatedData = CryptoDetailSchema.parse(data);
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.issues);
        throw new Error('Invalid data structure received from API');
      }
      throw error;
    }
  },

  getPrice: async (
    cryptoId: string,
    vsCurrency: string = 'usd',
  ): Promise<number> => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${vsCurrency}`,
    );
    const data = await response.json();
    return data[cryptoId]?.[vsCurrency] || 0;
  },

  getFavorites: async (): Promise<string[]> => {
    return getFavorites();
  },

  isFavorite: async (id: string): Promise<boolean> => {
    return isFavorite(id);
  },

  toggleFavorite: async (id: string): Promise<void> => {
    return toggleFavorite(id);
  },

  clearFavorites: async (): Promise<void> => {
    return clearFavorites();
  },
};

export { cryptoService };
