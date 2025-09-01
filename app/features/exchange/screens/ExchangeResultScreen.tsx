import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';
import { Check, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '../../../components/Button';
import { ScreenView } from '../../../components/ScreenView';
import { ExchangeMode, ExchangeModeOptios } from '../stores/exchangeStore';
import { formatFiatAmount } from '../../../utils/numberFormatter';
import { formatCryptoAmount } from '../../../utils/numberFormatter';

interface ExchangeResultParams {
  success: boolean;
  fromAmount: number;
  fromSymbol: string;
  toAmount: number;
  toSymbol: string;
  errorMessage?: string;
  transactionId?: string;
  mode: ExchangeMode;
}

type ExchangeResultScreenProps = {
  route: {
    params: ExchangeResultParams;
  };
};

const ExchangeResultScreen: React.FC<ExchangeResultScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as ExchangeResultParams;

  const { theme } = useTheme();
  const styles = ExchangeResultScreenStyles(theme);

  const {
    success,
    fromAmount,
    fromSymbol,
    toAmount,
    toSymbol,
    errorMessage,
    transactionId,
    mode,
  } = params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    // @ts-ignore
    navigation.navigate('MainTabs');
  };

  return (
    <ScreenView>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {success ? (
              <Check size={80} color={theme.colors.success} strokeWidth={1.5} />
            ) : (
              <X size={80} color={theme.colors.error} strokeWidth={1.5} />
            )}
          </View>

          <Typography
            style={[
              styles.statusTitle,
              { color: success ? theme.colors.success : theme.colors.error },
            ]}
          >
            {success ? '¡Intercambio exitoso!' : 'Intercambio falló'}
          </Typography>

          {success ? (
            <View style={styles.detailsContainer}>
              <Typography variant="body1" style={styles.detailsText}>
                Has intercambiado exitosamente
              </Typography>

              <View style={styles.amountContainer}>
                <Typography variant="body1" style={styles.fromAmount}>
                  {mode === ExchangeModeOptios.FIAT_TO_CRYPTO
                    ? formatFiatAmount(fromAmount)
                    : formatCryptoAmount(fromAmount)}
                  {fromSymbol}
                </Typography>
                <Typography variant="body1" style={styles.arrowText}>
                  →
                </Typography>
                <Typography variant="body1" style={styles.toAmount}>
                  {mode === ExchangeModeOptios.FIAT_TO_CRYPTO
                    ? formatCryptoAmount(toAmount)
                    : formatFiatAmount(toAmount)}
                  {toSymbol}
                </Typography>
              </View>

              {transactionId && (
                <View style={styles.transactionIdContainer}>
                  <Typography variant="body1" style={styles.transactionIdLabel}>
                    ID de transacción:
                  </Typography>
                  <Typography variant="body1" style={styles.transactionId}>
                    {transactionId}
                  </Typography>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Typography variant="body1" style={styles.errorMessage}>
                {errorMessage ||
                  'Ocurrió un error inesperado. Inténtalo de nuevo.'}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {success ? (
            <>
              <Button onPress={handleGoHome} variant="contained">
                Ver Balance
              </Button>
              <Button onPress={handleGoBack} variant="outlined">
                Hacer otro intercambio
              </Button>
            </>
          ) : (
            <>
              <Button onPress={handleGoBack} variant="contained">
                Intentar de nuevo
              </Button>
              <Button onPress={handleGoHome} variant="outlined">
                Ir al Balance
              </Button>
            </>
          )}
        </View>
      </View>
    </ScreenView>
  );
};

const ExchangeResultScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 10,
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    iconContainer: {
      marginBottom: 24,
    },
    statusTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 24,
    },
    detailsContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    detailsText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      opacity: 0.8,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    fromAmount: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    arrowText: {
      fontSize: 20,
      color: theme.colors.primary,
      marginHorizontal: 16,
      fontWeight: 'bold',
    },
    toAmount: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    transactionIdContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      width: '100%',
    },
    transactionIdLabel: {
      fontSize: 14,
      opacity: 0.7,
      marginBottom: 4,
    },
    transactionId: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: 'monospace',
    },
    errorContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      marginBottom: 40,
    },
    errorMessage: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.error,
    },
    buttonContainer: {
      marginHorizontal: 16,
      gap: 12,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 18,
      borderRadius: 25,
      alignItems: 'center',
      width: '100%',
    },
    primaryButtonText: {
      color: theme.colors.background,
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      paddingVertical: 18,
      borderRadius: 25,
      alignItems: 'center',
      width: '100%',
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: '600',
    },
  });

export { ExchangeResultScreen };
export type { ExchangeResultParams };
