import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../Typography';
import { Transaction, TransactionType } from '../../storage/transactions';
import { ArrowRightLeft } from 'lucide-react-native';
import { AssetType } from '../../storage/assets-storage';
import {
  formatCryptoAmount,
  formatFiatAmount,
} from '../../utils/numberFormatter';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionIconMapper: Record<TransactionType, React.ReactNode> = {
  exchange: <ArrowRightLeft color="#ffffff" size={16} strokeWidth={1.5} />,
};

const TransactionTitleMapper: Record<TransactionType, string> = {
  exchange: 'Exchange',
};

const TransactionDateMapper: Record<TransactionType, string> = {
  exchange: 'Exchange',
};

const TransactionAmountTypeMapper: Record<
  AssetType,
  (amount: number, symbol: string) => string
> = {
  fiat: (amount: number, symbol: string) => formatFiatAmount(amount, symbol),
  crypto: (amount: number, symbol: string) =>
    formatCryptoAmount(amount, symbol),
};

const TransactionAmountMapper: Record<
  TransactionType,
  (transaction: Transaction) => ReactNode
> = {
  exchange: (transaction: Transaction) => {
    if (transaction.type === 'exchange') {
      return (
        <>
          <Typography variant="body1" style={styles.transactionAmount}>
            {TransactionAmountTypeMapper[transaction.fromAsset.type](
              transaction.fromAsset.amount,
              transaction.fromAsset.symbol,
            )}
          </Typography>
          <Typography
            style={[styles.transactionAmount, styles.transactionAmountPositive]}
            font="space"
          >
            {TransactionAmountTypeMapper[transaction.toAsset.type](
              transaction.toAsset.amount,
              transaction.toAsset.symbol,
            )}
          </Typography>
        </>
      );
    }
    return null;
  },
};

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <View style={styles.transactionIconContent}>
          {TransactionIconMapper[transaction.type]}
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <Typography variant="body1" style={styles.transactionTitle}>
          {TransactionTitleMapper[transaction.type]}
        </Typography>
        <Typography variant="body1" style={styles.transactionDate}>
          {TransactionDateMapper[transaction.type]}
        </Typography>
      </View>
      <View style={styles.transactionAmountContainer}>
        {TransactionAmountMapper[transaction.type](transaction)}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionIconContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
    gap: 2,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  transactionDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  transactionAmountPositive: {
    color: '#4CAF50',
  },
});
