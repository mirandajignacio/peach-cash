import { Typography } from '../../../components/Typography';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import {
  ExchangeMode,
  ExchangeModeOptios,
  useExchangeStore,
} from '../stores/exchangeStore';
import { Theme, useTheme } from '../../../theme';
import { Asset } from '../../../storage/assets-storage';
import {
  formatCryptoAmount,
  formatFiatAmount,
} from '../../../utils/numberFormatter';

const RateMapper: Record<
  ExchangeMode,
  (from: Asset, to: Asset, rate: number) => string
> = {
  [ExchangeModeOptios.FIAT_TO_CRYPTO]: (from: Asset, to: Asset, rate: number) =>
    `1 ${from.name} = ${formatCryptoAmount(rate)} ${to.name}`,
  [ExchangeModeOptios.CRYPTO_TO_FIAT]: (from: Asset, to: Asset, rate: number) =>
    `1 ${from.name} = ${formatFiatAmount(rate)} ${to.name}`,
};

const RateIndicatorStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.sm,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
  });

type RateIndicatorProps = {
  style?: StyleProp<ViewStyle>;
};

const RateIndicator = ({ style }: RateIndicatorProps) => {
  const { from, to, rate, mode } = useExchangeStore();
  const { theme } = useTheme();
  const styles = RateIndicatorStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {rate === 0 ? (
        <Typography variant="caption">No hay tasa disponible</Typography>
      ) : (
        <Typography variant="caption">
          {RateMapper[mode](from, to, rate)}
        </Typography>
      )}
    </View>
  );
};

export default RateIndicator;
