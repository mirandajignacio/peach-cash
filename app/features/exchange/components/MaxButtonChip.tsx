import { StyleSheet, TouchableOpacity } from 'react-native';

import { View } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';
import { useExchangeStore } from '../stores/exchangeStore';
import { useQuery } from '@tanstack/react-query';
import { balanceService } from '../../../services/balance-service';
import { QueryRender } from '../../../components/QueryRender';

const MaxButtonChipStyles = (theme: Theme) =>
  StyleSheet.create({
    currencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.spacing.sm,
      alignSelf: 'flex-start',

      gap: 4,
    },
    amountContainer: {
      marginBottom: 12,
    },
  });

const MaxButtonChip = () => {
  const { theme } = useTheme();
  const styles = MaxButtonChipStyles(theme);
  const { from, setAmount } = useExchangeStore();

  const balanceQuery = useQuery({
    queryKey: ['balances', from.id],
    queryFn: () => balanceService.getAssetBalance(from.id),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  return (
    <QueryRender
      query={balanceQuery}
      onData={data => {
        return (
          <TouchableOpacity onPress={() => setAmount(data?.amount ?? 0)}>
            <View style={styles.currencyButton}>
              <Typography variant="body2">MAX</Typography>
            </View>
          </TouchableOpacity>
        );
      }}
      onLoading={() => <Typography variant="body1">...</Typography>}
      onError={() => <Typography variant="body1">Error</Typography>}
    />
  );
};

export { MaxButtonChip };
