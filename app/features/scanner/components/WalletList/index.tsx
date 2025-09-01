import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../../components/AppStackNavigation';
import { ScannedWalletItem } from '../../../../components/ScannedWalletItem';
import { ScannedWallet, Wallet } from '../../../../storage/wallets';
import { AnimatedFlashList } from '../../../../components/AnimatedFlashList';

type ScannerScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Wallet'
>;

type WalletListProps = {
  wallets: ScannedWallet[];
  emptyStateComponent: React.ReactNode;
};

const WalletList = ({ wallets, emptyStateComponent }: WalletListProps) => {
  const navigation = useNavigation<ScannerScreenNavigationProp>();

  const handleWalletPress = (wallet: Wallet) => {
    navigation.navigate('Wallet', {
      address: wallet.address,
      coin: wallet.assetId,
    });
  };

  return (
    <AnimatedFlashList
      data={wallets}
      showsVerticalScrollIndicator={false}
      renderItem={(item, index) => (
        <ScannedWalletItem
          key={item.id}
          wallet={item}
          onPress={handleWalletPress}
          index={index}
        />
      )}
      emptyStateComponent={emptyStateComponent}
      emptyStateMessage="No hay wallets escaneadas"
      emptyStateSubmessage="Escanea un QR para empezar"
    />
  );
};

export { WalletList };
