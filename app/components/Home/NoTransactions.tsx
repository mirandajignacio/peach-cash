import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';

export const NoTransactions: React.FC = () => {
  return (
    <View style={styles.noTransactionsContainer}>
      <Typography variant="body1" style={styles.noTransactionsText}>
        No hay transacciones recientes
      </Typography>
      <Typography variant="body1" style={styles.noTransactionsSubtext}>
        Haz tu primer intercambio en la pestaña Exchange
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  noTransactionsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noTransactionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  noTransactionsSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
