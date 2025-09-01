import { kv } from './mmkv';

export type BalanceStorage = {
  id: string;
  assetId: string;
  amount: number;
  updatedAt: number;
};

const INITIAL_BALANCES: BalanceStorage[] = [
  {
    id: 'usd',
    assetId: 'usd',
    amount: 10_000,
    updatedAt: Date.now(),
  },
  {
    id: 'ars',
    assetId: 'ars',
    amount: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'eur',
    assetId: 'eur',
    amount: 0,
    updatedAt: Date.now(),
  },
  {
    id: 'jpy',
    assetId: 'jpy',
    amount: 10_000,
    updatedAt: Date.now(),
  },
  {
    id: 'bitcoin',
    assetId: 'bitcoin',
    amount: 0.001,
    updatedAt: Date.now(),
  },
  {
    id: 'ethereum',
    assetId: 'ethereum',
    amount: 0.05,
    updatedAt: Date.now(),
  },
];

const keyBalances = () => {
  return `balances`;
};

export const getBalances = () => {
  return kv.get<BalanceStorage[]>(keyBalances(), []);
};

export const getAssetBalance = (assetId: string) => {
  const balances = getBalances();
  return balances.find(b => b.assetId === assetId);
};

export const addAssetBalanceAmount = (
  assetId: string,
  amount: number,
): BalanceStorage | undefined => {
  const balances = getBalances();
  const balance = balances.find(b => b.assetId === assetId);
  if (balance) {
    balance.amount += amount;
    balance.updatedAt = Date.now();
  } else {
    balances.push({
      id: `${assetId}`,
      assetId: assetId,
      amount: amount,
      updatedAt: Date.now(),
    });
  }
  kv.set(keyBalances(), balances);
  return getAssetBalance(assetId);
};

/**
 * Sets the balance amount for an asset (replaces the current balance)
 */
export const setAssetBalanceAmount = (
  assetId: string,
  amount: number,
): BalanceStorage | undefined => {
  const balances = getBalances();
  const balance = balances.find(b => b.assetId === assetId);

  if (balance) {
    balance.amount = amount;
    balance.updatedAt = Date.now();
  } else {
    balances.push({
      id: `${assetId}`,
      assetId: assetId,
      amount: amount,
      updatedAt: Date.now(),
    });
  }

  kv.set(keyBalances(), balances);

  return getAssetBalance(assetId);
};

export const resetBalances = () => {
  kv.del(keyBalances());
  kv.set(keyBalances(), INITIAL_BALANCES);
};

export const initializeDefaultBalances = () => {
  const balances = getBalances();
  if (balances.length > 0) {
    return;
  }
  kv.set(keyBalances(), INITIAL_BALANCES);
};
