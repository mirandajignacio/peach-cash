import { create } from 'zustand';
import { Asset } from '../../../storage/assets-storage';

const SUPPORTED_FIATS = ['usd', 'ars', 'eur', 'jpy'] as const;

export type SupportedFiat = (typeof SUPPORTED_FIATS)[number];

export const AVAILABLE_FIATS: Asset[] = [
  {
    id: 'usd',
    symbol: 'USD',
    name: 'US Dollar',
    decimals: 2,
    type: 'fiat',
    isActive: true,
  },
  {
    id: 'ars',
    symbol: 'ARS',
    name: 'Argentine Peso',
    decimals: 2,
    type: 'fiat',
    isActive: true,
  },
  {
    id: 'eur',
    symbol: 'EUR',
    name: 'Euro',
    decimals: 2,
    type: 'fiat',
    isActive: true,
  },
  {
    id: 'jpy',
    symbol: 'JPY',
    name: 'Japanese Yen',
    decimals: 0,
    type: 'fiat',
    isActive: true,
  },
];

export const ExchangeModeOptios = {
  FIAT_TO_CRYPTO: 'fiat-to-crypto',
  CRYPTO_TO_FIAT: 'crypto-to-fiat',
} as const;

export type ExchangeMode =
  (typeof ExchangeModeOptios)[keyof typeof ExchangeModeOptios];

interface ExchangeState {
  mode: ExchangeMode;
  amount: number;
  from: Asset;
  to: Asset;
  rate: number;

  hasInsufficientBalance: boolean;
  isInvalidAmount: boolean;
  hasNoCryptoSelected: boolean;
  shouldDisableButton: boolean;

  setAmount: (amount: number) => void;
  setFrom: (currency: Asset) => void;
  setTo: (currency: Asset) => void;
  setRate: (rate: number) => void;
  toggleMode: () => void;
  reset: () => void;
  updateValidations: (balances: any[]) => void;
}

// TODO: Cambiar al que tenga disponible
const DEFAULT_CRYPTO: Asset = {
  id: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  decimals: 8,
  type: 'crypto',
  isActive: true,
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
};

// TODO: Cambiar al que tenga disponible
const DEFAULT_FIAT: Asset = AVAILABLE_FIATS[0];

export const useExchangeStore = create<ExchangeState>((set, get) => {
  const calculateValidations = (state: {
    amount: number;
    from: Asset;
    to: Asset;
    mode: ExchangeMode;
    balances?: any[];
  }) => {
    const { amount, from, to, mode, balances = [] } = state;

    const isInvalidAmount = amount <= 0;

    const hasNoCryptoSelected =
      mode === ExchangeModeOptios.FIAT_TO_CRYPTO ? !to : !from;

    let hasInsufficientBalance = false;
    if (amount > 0 && balances.length > 0) {
      const fromBalance = balances.find(b => b.assetId === from.id);
      hasInsufficientBalance = !fromBalance || fromBalance.amount < amount;
    }

    const shouldDisableButton =
      isInvalidAmount || hasInsufficientBalance || hasNoCryptoSelected;

    return {
      hasInsufficientBalance,
      isInvalidAmount,
      hasNoCryptoSelected,
      shouldDisableButton,
    };
  };

  const initialState = {
    mode: ExchangeModeOptios.FIAT_TO_CRYPTO,
    amount: 0,
    from: DEFAULT_FIAT,
    to: DEFAULT_CRYPTO,
    rate: 0.000009,
  };

  const initialValidations = calculateValidations(initialState);

  return {
    ...initialState,
    ...initialValidations,

    setAmount: amount => {
      const currentState = get();
      const { mode, from, to } = currentState;
      const newValidations = calculateValidations({
        mode,
        from,
        to,
        amount,
      });
      set({ amount, ...newValidations });
    },

    setFrom: currency => {
      const currentState = get();
      const { mode, amount, to } = currentState;
      const newValidations = calculateValidations({
        mode,
        from: currency,
        to,
        amount,
      });
      set({ from: currency, ...newValidations });
    },

    setTo: currency => {
      const currentState = get();
      const { mode, amount, from } = currentState;
      const newValidations = calculateValidations({
        mode,
        from,
        to: currency,
        amount,
      });
      set({ to: currency, ...newValidations });
    },

    setRate: rate => {
      set({ rate });
    },

    updateValidations: balances => {
      const currentState = get();
      const { mode, amount, from, to } = currentState;
      const newValidations = calculateValidations({
        mode,
        from,
        to,
        amount,
        balances,
      });
      set(newValidations);
    },

    toggleMode: () => {
      const currentState = get();
      const newMode: ExchangeMode =
        currentState.mode === ExchangeModeOptios.FIAT_TO_CRYPTO
          ? ExchangeModeOptios.CRYPTO_TO_FIAT
          : ExchangeModeOptios.FIAT_TO_CRYPTO;

      const newFrom =
        newMode === ExchangeModeOptios.FIAT_TO_CRYPTO
          ? DEFAULT_FIAT
          : DEFAULT_CRYPTO;
      const newTo =
        newMode === ExchangeModeOptios.FIAT_TO_CRYPTO
          ? DEFAULT_CRYPTO
          : DEFAULT_FIAT;

      const newState = {
        mode: newMode,
        amount: 0,
        from: newFrom,
        to: newTo,
        rate: 0,
      };

      const newValidations = calculateValidations(newState);
      set({ ...newState, ...newValidations });
    },

    reset: () => {
      const newState = {
        mode: ExchangeModeOptios.FIAT_TO_CRYPTO,
        amount: 0,
        from: DEFAULT_FIAT,
        to: DEFAULT_CRYPTO,
        rate: 0,
      };

      const newValidations = calculateValidations(newState);
      set({ ...newState, ...newValidations });
    },
  };
});
