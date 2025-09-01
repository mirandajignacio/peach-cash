import { RefreshControl, StyleSheet, View } from 'react-native';
import { Theme, useTheme } from '../theme';
import { useCallback } from 'react';
import { ArrowUpDown } from 'lucide-react-native';
import { InputBox } from '../features/exchange/components/InputBox';
import { OutputBox } from '../features/exchange/components/OutputBox';
import { Button } from '../components/Button';
import { ScreenView } from '../components/ScreenView';
import { HeaderScreenBase } from '../components/HeaderScreenBase';
import { ScreenContent } from '../components/ScreenContent';
import {
  ExchangeModeOptios,
  useExchangeStore,
} from '../features/exchange/stores/exchangeStore';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from '../components/IconButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppStackParamList } from '../components/AppStackNavigation';
import { ExchangeProps, exchangeServiceV2 } from '../services/exchange-service';
import { CryptoAsset, FiatAsset } from '../storage/assets-storage';
import Toast from 'react-native-toast-message';
import RateIndicator from '../features/exchange/components/RateIndicator';

type HomeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ExchangeResult'
>;

const ExchangeScreen = () => {
  const { theme } = useTheme();
  const styles = ExchangeScreenStyles(theme);
  const queryClient = useQueryClient();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { amount, from, to, mode, shouldDisableButton, toggleMode } =
    useExchangeStore();

  const handleNavigateToToSelection = useCallback(() => {
    navigation.navigate('ExchangeTo' as never);
  }, [navigation]);

  const exchangeMutation = useMutation({
    mutationFn: (data: ExchangeProps) => {
      return exchangeServiceV2.exchange(data);
    },
    onSuccess: data => {
      navigation.navigate('ExchangeResult', {
        success: true,
        fromAmount: data.fromAmount,
        fromSymbol: from.symbol,
        toAmount: data.toAmount,
        toSymbol: to.symbol,
        mode,
      });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: error => {
      Toast.show({
        type: 'error',
        text1: 'Error al intercambiar',
        text2: error.message,
      });
    },
  });

  const onPressExchange = async () => {
    exchangeMutation.mutate({
      mode,
      crypto:
        mode === ExchangeModeOptios.FIAT_TO_CRYPTO
          ? (to as CryptoAsset)
          : (from as CryptoAsset),
      fiat:
        mode === ExchangeModeOptios.FIAT_TO_CRYPTO
          ? (from as FiatAsset)
          : (to as FiatAsset),
      amount,
    });
  };

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['balances'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  return (
    <ScreenView
      ignoreBottomSafeArea
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <HeaderScreenBase
        title="Exchange"
        subtitle="Intercambia tus criptomonedas con el mejor precio"
      />

      <ScreenContent>
        <RateIndicator style={styles.rateIndicator} />
        <View style={styles.exchangeContent}>
          <InputBox />

          <IconButton
            icon={
              <ArrowUpDown
                size={24}
                color={theme.colors.text}
                strokeWidth={1.5}
              />
            }
            touchableType="opacity"
            onPress={toggleMode}
          />

          <OutputBox
            label={`To ${to.symbol} balance`}
            symbol={to.name}
            amount={0}
            onCurrencyPress={handleNavigateToToSelection}
            balance={null}
            isLoading={false}
            commissionText="Comisión incluida"
          />
        </View>
      </ScreenContent>

      <View style={styles.bottomButtonContainer}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={shouldDisableButton}
          onPress={onPressExchange}
        >
          {shouldDisableButton ? 'Ingresa un monto' : 'Intercambiar'}
        </Button>
      </View>
    </ScreenView>
  );
};

const ExchangeScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    exchangeContent: {
      flex: 1,
      gap: 24,
    },
    rateIndicator: {
      marginBottom: theme.spacing.sm,
      alignSelf: 'flex-end',
    },

    bottomButtonContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  });

export { ExchangeScreen };
