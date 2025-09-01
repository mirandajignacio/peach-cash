import { SupportedFiat } from '../features/exchange/stores/exchangeStore';

const MOCK_FIAT_USD_PRICE: Record<SupportedFiat, number> = {
  usd: 1,
  ars: 0.00073,
  eur: 1.17,
  jpy: 0.0068,
};

const fiatService = {
  getPrice: async (fiatId: SupportedFiat): Promise<number> => {
    const price = MOCK_FIAT_USD_PRICE[fiatId];
    return price;
  },
};

export { fiatService };
