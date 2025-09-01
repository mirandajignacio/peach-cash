import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Typography } from '../Typography';
import { useTheme } from '../../theme';
import {
  formatFiatAmount,
  formatCryptoAmount,
} from '../../utils/numberFormatter';
import { BalanceStorage } from '../../storage/balance-storage';
import { assetsService } from '../../services/assets-service';
import { useQuery } from '@tanstack/react-query';
import { balanceService } from '../../services/balance-service';
import { QueryRender } from '../QueryRender';

const BalanceCard = ({ balance }: { balance: BalanceStorage }) => {
  const { theme } = useTheme();
  const assetQuery = useQuery({
    queryKey: ['asset', balance.assetId],
    queryFn: () => assetsService.get(balance.assetId),
  });

  return (
    <QueryRender
      query={assetQuery}
      onLoading={() => (
        <Typography variant="body1" style={styles.currencyName}>
          {`...`}
        </Typography>
      )}
      onError={() => (
        <Typography variant="body1" style={styles.currencyName}>
          {`Error :(`}
        </Typography>
      )}
      onData={data => {
        return (
          <TouchableOpacity
            style={[
              styles.balanceCard,
              { backgroundColor: theme.colors.surfaceSecondary },
            ]}
          >
            <View style={styles.balanceCardHeader}>
              <View style={styles.currencyInfo}>
                <Typography variant="body1" style={styles.currencyName}>
                  {data?.name}
                </Typography>
              </View>
            </View>
            <View style={styles.balanceCardContent}>
              <Typography
                variant="body1"
                style={styles.balanceCardAmount}
                font="space"
                color="primary"
              >
                {data?.type === 'fiat'
                  ? formatFiatAmount(balance.amount)
                  : formatCryptoAmount(balance.amount)}
              </Typography>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export const BalanceCards = () => {
  const balancesQuery = useQuery({
    queryKey: ['balances'],
    queryFn: () => balanceService.getBalances(),
  });

  return (
    <View style={styles.balanceCardsWrapper}>
      <FlashList
        data={balancesQuery.data?.filter(b => b.amount > 0)}
        renderItem={({ item }) => <BalanceCard balance={item} />}
        keyExtractor={item => item.assetId}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.balanceCardsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCardsWrapper: {
    marginBottom: 32,
  },
  balanceCardsContainer: {
    paddingHorizontal: 16,
  },
  balanceCard: {
    width: 240,
    minHeight: 120,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
  },
  balanceCardHeader: {
    marginBottom: 16,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cryptoImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  balanceCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  balanceCardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
