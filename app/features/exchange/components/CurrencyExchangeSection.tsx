import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Typography } from '../../../components/Typography';
import { useTheme, Theme } from '../../../theme';

interface CurrencyExchangeSectionProps {
  label: string;
  symbol: string;
  amount: string;
  isEditable: boolean;
  onAmountChange?: (value: string) => void;
  onCurrencyPress?: () => void;
  currencyDisabled?: boolean;
  exchangeRate?: string;
  balance?: { amount: number };
  autoFocus?: boolean;
  placeholder?: string;
}

export const CurrencyExchangeSection: React.FC<
  CurrencyExchangeSectionProps
> = ({
  label,
  symbol,
  amount,
  isEditable,
  onAmountChange,
  onCurrencyPress,
  currencyDisabled = false,
  exchangeRate,
  balance,
  autoFocus = false,
  placeholder = '0.00',
}) => {
  const { theme } = useTheme();
  const styles = CurrencyExchangeSectionStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.currencySelector}>
        <Typography variant="body1">{label}</Typography>
        <TouchableOpacity
          style={styles.selector}
          onPress={onCurrencyPress}
          disabled={currencyDisabled}
        >
          <Typography variant="body1" style={styles.inputSelector}>
            {symbol}
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.amountContainer}>
        {isEditable ? (
          <TextInput
            style={styles.amountInput}
            inputMode="decimal"
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor={theme.colors.surface}
            returnKeyLabel="done"
            returnKeyType="done"
            autoFocus={autoFocus}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            value={amount}
            onChangeText={onAmountChange}
          />
        ) : (
          <Typography variant="body1" style={styles.amountOutput}>
            {amount}
          </Typography>
        )}
      </View>

      {exchangeRate && <Typography variant="body1">{exchangeRate}</Typography>}

      {balance && (
        <Typography variant="body1">
          Balance:{' '}
          {balance.amount.toLocaleString('es-ES', {
            minimumFractionDigits: ['USD', 'ARS', 'EUR'].includes(symbol)
              ? 2
              : ['JPY'].includes(symbol)
              ? 0
              : 8,
          }) || '0.00'}{' '}
          {symbol}
        </Typography>
      )}
    </View>
  );
};

const CurrencyExchangeSectionStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      gap: 0,
    },
    currencySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 8,
    },
    selector: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'right',
      display: 'contents',
    },
    inputSelector: {
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      padding: 8,
      borderRadius: 14,
      fontSize: 16,
    },
    amountContainer: {
      width: '100%',
      alignItems: 'flex-end',
    },
    amountInput: {
      width: '100%',
      color: theme.colors.primary,
      fontSize: 48,
      fontWeight: 'bold',
      textAlign: 'right',
      padding: 0,
      margin: 0,
    },
    amountOutput: {
      color: theme.colors.primary,
      fontSize: 54,
      fontWeight: 'bold',
      textAlign: 'right',
      width: '100%',
    },
  });
