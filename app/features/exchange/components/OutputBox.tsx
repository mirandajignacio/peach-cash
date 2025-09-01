import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';
import { ExchangeMode, useExchangeStore } from '../stores/exchangeStore';
import { ExchangeModeOptios } from '../stores/exchangeStore';
import { AssetButtonChip } from './AssetButtonChip';
import {
  formatCryptoAmount,
  formatFiatAmount,
} from '../../../utils/numberFormatter';

interface OutputBoxProps {
  label: string;
  symbol: string;
  amount: number;
  onCurrencyPress: () => void;
  balance?: { amount: number } | null;
  isLoading?: boolean;
  commissionText?: string;
}

const FinalValueMapper: Record<
  ExchangeMode,
  (amount: number, symbol: string) => string
> = {
  [ExchangeModeOptios.FIAT_TO_CRYPTO]: (amount: number, symbol: string) =>
    formatCryptoAmount(amount, symbol),
  [ExchangeModeOptios.CRYPTO_TO_FIAT]: (amount: number, symbol: string) =>
    formatFiatAmount(amount, symbol),
};

export const OutputBox: React.FC<OutputBoxProps> = ({
  symbol,
  onCurrencyPress,
  isLoading = false,
}) => {
  const { theme } = useTheme();

  const styles = OutputBoxStyles(theme);
  const { rate, amount, mode, to } = useExchangeStore();
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    setConvertedAmount(rate * amount);
  }, [rate, amount]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="caption">{`Por ${to.name}`}</Typography>
        <AssetButtonChip label={symbol} onPress={onCurrencyPress} />
      </View>

      <View>
        {isLoading ? (
          <Typography variant="body1">Calculando...</Typography>
        ) : (
          <Typography variant="h3" color="primary" align="right" font="space">
            {FinalValueMapper[mode](convertedAmount, to.symbol)}
          </Typography>
        )}
      </View>
    </View>
  );
};

const OutputBoxStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 16,
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  });
