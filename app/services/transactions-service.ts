import {
  addTransaction,
  getTransactions,
  Transaction,
  resetTransactions,
} from '../storage/transactions';

const transactionsService = {
  getTransactions: async () => {
    return getTransactions();
  },
  addTransaction: async (transaction: Transaction) => {
    return addTransaction(transaction);
  },
  resetTransactions: async () => {
    return resetTransactions();
  },
};

export { transactionsService };
