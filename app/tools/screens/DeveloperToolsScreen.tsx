import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../components/AppStackNavigation';
import { StyleSheet, View } from 'react-native';
import { ScreenView } from '../../components/ScreenView';
import { HeaderScreenBase } from '../../components/HeaderScreenBase';
import { BackButtonBase } from '../../components/BackButtonBase';
import { ScreenContent } from '../../components/ScreenContent';
import { Button } from '../../components/Button';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { balanceService } from '../../services/balance-service';
import { transactionsService } from '../../services/transactions-service';
import { Typography } from '../../components/Typography';

import {
  clearFavoriteWallets,
  clearScannedWallets,
} from '../../storage/wallets';

type DeveloperToolsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'DeveloperTools'
>;

const DeveloperToolsScreenStyles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    gap: 4,
  },
});

const DeveloperToolsScreen = () => {
  const navigation = useNavigation<DeveloperToolsScreenNavigationProp>();
  const queryClient = useQueryClient();

  const resetBalancesMutation = useMutation({
    mutationFn: async () => {
      return await balanceService.resetBalances();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      Toast.show({
        type: 'success',
        text1: 'Storage reseteado',
        text2: 'Los balances se han reiniciado',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error al resetear el storage',
        text2: 'Intenta de nuevo',
      });
    },
  });

  const resetTransactionsMutation = useMutation({
    mutationFn: async () => {
      return await transactionsService.resetTransactions();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      Toast.show({
        type: 'success',
        text1: 'Storage reseteado',
        text2: 'Las transacciones se han reiniciado',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error al resetear el storage',
        text2: 'Intenta de nuevo',
      });
    },
  });

  const resetAllQueries = async () => {
    try {
      await queryClient.clear();
      await queryClient.resetQueries();
      await queryClient.invalidateQueries();
      await queryClient.clear();
      Toast.show({
        type: 'success',
        text1: 'Queries reseteadas',
        text2: 'Las queries se han reiniciado',
      });
    } catch (error) {
      console.error('Error al resetear las queries', error);
      Toast.show({
        type: 'error',
        text1: 'Error al resetear las queries',
        text2: 'Intenta de nuevo',
      });
    }
  };

  const resetAllWalletsMutation = useMutation({
    mutationFn: async () => {
      await clearScannedWallets();
      await clearFavoriteWallets();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['scanned-wallets'] });
      await queryClient.invalidateQueries({ queryKey: ['favorite-wallets'] });
      Toast.show({
        type: 'success',
        text1: 'Wallets reseteadas',
        text2: 'Las wallets se han reiniciado',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error al resetear las wallets',
        text2: 'Intenta de nuevo',
      });
    },
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const onPressResetBalances = () => {
    resetBalancesMutation.mutate();
  };

  const onPressResetTransactions = () => {
    resetTransactionsMutation.mutate();
  };

  const onPressResetAllWallets = () => {
    resetAllWalletsMutation.mutate();
  };

  return (
    <ScreenView>
      <HeaderScreenBase>
        <BackButtonBase onPress={handleBackPress} />
      </HeaderScreenBase>

      <ScreenContent style={DeveloperToolsScreenStyles.container}>
        <View style={DeveloperToolsScreenStyles.header}>
          <Typography variant="body1">Developer Tools</Typography>
        </View>
        <Button onPress={onPressResetBalances}>Reset Balances</Button>
        <Button onPress={onPressResetTransactions}>Reset Transactions</Button>
        <Button onPress={resetAllQueries}>Reset All Queries</Button>
        <Button onPress={onPressResetAllWallets}>Reset All Wallets</Button>
      </ScreenContent>
    </ScreenView>
  );
};

export { DeveloperToolsScreen };
