import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../../../components/AppStackNavigation';
import { ScreenView } from '../../../components/ScreenView';
import { BackButtonBase } from '../../../components/BackButtonBase';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { ExchangeModeOptios, useExchangeStore } from '../stores/exchangeStore';
import { balanceService, BalanceView } from '../../../services/balance-service';
import { useQuery } from '@tanstack/react-query';
import { QueryRender } from '../../../components/QueryRender';
import { AnimatedFlashList } from '../../../components/AnimatedFlashList';
import { AssetBalanceItem } from '../components/AssetBalanceItem';
import { ScreenContent } from '../../../components/ScreenContent';

type ExchangeFromScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ExchangeFrom'
>;

const ExchangeFromScreen: React.FC = () => {
  const navigation = useNavigation<ExchangeFromScreenNavigationProp>();

  const { mode, from, setFrom } = useExchangeStore();

  const balancesQuery = useQuery({
    queryKey: ['balances'],
    queryFn: () => balanceService.getBalances(),
  });

  const onPressAsset = (balance: BalanceView) => {
    setFrom(balance.asset);
    navigation.goBack();
  };

  return (
    <ScreenView>
      <HeaderScreenBase>
        <BackButtonBase onPress={navigation.goBack} />
      </HeaderScreenBase>
      <ScreenContent>
        <QueryRender
          query={balancesQuery}
          onData={data => {
            const filteredData = data.filter(balance => {
              if (mode === ExchangeModeOptios.FIAT_TO_CRYPTO) {
                return balance.asset.type === 'fiat' && balance.amount > 0;
              } else {
                return balance.asset.type === 'crypto' && balance.amount > 0;
              }
            });
            return (
              <AnimatedFlashList
                data={filteredData}
                renderItem={(balance, index) => (
                  <AssetBalanceItem
                    balance={balance}
                    index={index}
                    highlight={balance.asset.id === from.id}
                    onPress={onPressAsset}
                  />
                )}
              />
            );
          }}
        />
      </ScreenContent>
    </ScreenView>
  );
};

export { ExchangeFromScreen };
