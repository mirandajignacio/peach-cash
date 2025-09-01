import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { useQuery } from '@tanstack/react-query';
import { balanceService } from '../../services/balance-service';
import { QueryRender } from '../QueryRender';
import { formatFiatAmount } from '../../utils/numberFormatter';

const styles = StyleSheet.create({
  totalBalance: {
    fontSize: 48,
  },
});

const BalanceSection = () => {
  const balanceQuery = useQuery({
    queryKey: ['total-balance'],
    queryFn: () => balanceService.getAssetsBalanceAmount(),
  });

  return (
    <View>
      <Typography variant="caption">Balance Total</Typography>

      <QueryRender
        query={balanceQuery}
        onLoading={() => <>{`...`} </>}
        onData={data => {
          return (
            <Typography
              variant="h1"
              style={styles.totalBalance}
              font="space"
              color="primary"
            >
              {formatFiatAmount(data, 'usd')}
            </Typography>
          );
        }}
      />
    </View>
  );
};

export { BalanceSection };
