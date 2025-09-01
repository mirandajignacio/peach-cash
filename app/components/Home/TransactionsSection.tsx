import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { ScreenContent } from '../ScreenContent';
import { TransactionItem } from './TransactionItem';
import { NoTransactions } from './NoTransactions';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../../storage/transactions';

export const TransactionsSection = () => {
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(),
  });

  return (
    <ScreenContent>
      <View style={styles.transactionsHeader}>
        <Typography variant="h5" style={styles.transactionsTitle}>
          Transacciones
        </Typography>
      </View>

      <View>
        {transactionsQuery.data?.length === 0 ? (
          <NoTransactions />
        ) : (
          transactionsQuery.data?.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </View>
    </ScreenContent>
  );
};

const styles = StyleSheet.create({
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
