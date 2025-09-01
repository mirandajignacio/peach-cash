// storage/transactions.ts
import { generateUUID } from '../utils/generate-uuid';
import { AssetType } from './assets-storage';
import { kv } from './mmkv';

export type TransactionType = 'exchange';

export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface BaseTransaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: number;
  updatedAt: number;
  description?: string;
  txHash?: string;
}

export interface ExchangeTransaction extends BaseTransaction {
  type: 'exchange';
  fromAsset: {
    assetId: string;
    amount: number;
    symbol: string;
    type: AssetType;
  };
  toAsset: {
    assetId: string;
    amount: number;
    symbol: string;
    type: AssetType;
  };
  exchangeRate?: number;
}

export type Transaction = ExchangeTransaction;

function keyTransactions() {
  return `transactions`;
}

export function getTransactions(): Transaction[] {
  const transactions = kv.get<Transaction[]>(keyTransactions(), []);
  return transactions.sort((a, b) => b.createdAt - a.createdAt);
}

export function getTransactionsByStatus(
  status: TransactionStatus,
): Transaction[] {
  return getTransactions().filter(tx => tx.status === status);
}

export function getTransaction(id: string): Transaction | null {
  const transactions = getTransactions();
  return transactions.find(tx => tx.id === id) || null;
}

export function addTransaction(
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
): Transaction {
  const transactions = getTransactions();

  const newTransaction: Transaction = {
    ...transaction,
    id: generateUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  transactions.push(newTransaction);

  kv.set(keyTransactions(), transactions);
  return newTransaction;
}

export function resetTransactions(): void {
  kv.del(keyTransactions());
}
