import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../../../components/AppStackNavigation';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';
import { ScreenView } from '../../../components/ScreenView';
import { useQuery } from '@tanstack/react-query';
import { cryptoService, ICrypto } from '../../../services/crypto-service';
import {
  AVAILABLE_FIATS,
  ExchangeMode,
  ExchangeModeOptios,
  useExchangeStore,
} from '../stores/exchangeStore';

import { SearchInput } from '../../../components/SearchInput';
import { useDebounce } from '../../../hooks';
import { CryptoListSkeleton } from '../../crypto/components/CryptoList/CryptoListSkeleton';
import { CryptoListList } from '../../crypto/components/CryptoList/CryptoListList';

import { assetsService } from '../../../services/assets-service';
import { BackButtonBase } from '../../../components/BackButtonBase';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { QueryRender } from '../../../components/QueryRender';
import { Asset } from '../../../storage/assets-storage';
import { AnimatedFlashList } from '../../../components/AnimatedFlashList';
import { AssetItem } from '../components/Assettem';

type ExchangeToScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ExchangeTo'
>;

const ExchangeToCryptoStyles = (theme: Theme) =>
  StyleSheet.create({
    searchContainer: {
      paddingHorizontal: theme.spacing.md,
    },
  });

const ExchangeToCrypto = () => {
  const [search, setSearch] = useState('');
  const { theme } = useTheme();
  const styles = ExchangeToCryptoStyles(theme);
  const { setTo } = useExchangeStore();
  const navigation = useNavigation<ExchangeToScreenNavigationProp>();
  const onPressCryptoCard = async (crypto: ICrypto) => {
    const asset = await assetsService.get(crypto.id);
    if (!asset) {
      const createdAsset = await assetsService.create({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        type: 'crypto',
        decimals: 8,
        isActive: true,
        image: crypto.image,
      });
      if (createdAsset) {
        setTo(createdAsset);
      }
    } else {
      setTo(asset);
    }

    navigation.goBack();
  };

  const debouncedSearchText = useDebounce(search, 500);

  const cryptosQuery = useQuery({
    queryKey: ['search-cryptos', debouncedSearchText],
    queryFn: async () => {
      if (!debouncedSearchText.trim()) {
        return [];
      }

      const result = await cryptoService.search(debouncedSearchText, {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        price_change_percentage: '24h',
      });

      const validResult = Array.isArray(result) ? result : [];
      return validResult;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    enabled: !!debouncedSearchText.trim(),
  });

  return (
    <>
      <View style={styles.searchContainer}>
        <SearchInput
          searchText={search}
          setSearchText={setSearch}
          filterErrors={{ searchText: '' }}
          placeholder="Buscar criptomonedas..."
          autoFocus={true}
        />
      </View>
      <QueryRender
        query={cryptosQuery}
        onData={data => (
          <CryptoListList data={data} onPressCryptoCard={onPressCryptoCard} />
        )}
        onError={() => {
          return (
            <Typography variant="body1">
              Error cargando criptomonedas
            </Typography>
          );
        }}
        onLoading={() => {
          return <CryptoListSkeleton itemCount={10} />;
        }}
      />
    </>
  );
};

const ExchangeToFiatStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      paddingVertical: theme.spacing.md,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    fiatOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    fiatOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surfaceSecondary,
    },
    fiatInfo: {
      flex: 1,
    },
    fiatSymbol: {
      color: theme.colors.text,
      marginBottom: 4,
    },
    fiatName: {
      color: theme.colors.textSecondary,
    },
    checkmark: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });

const ExchangeToFiat = () => {
  const { setTo, to } = useExchangeStore();
  const { theme } = useTheme();
  const styles = ExchangeToFiatStyles(theme);
  const navigation = useNavigation<ExchangeToScreenNavigationProp>();

  const onPressFiatOption = (fiat: Asset) => {
    setTo(fiat);
    navigation.goBack();
  };
  return (
    <View style={styles.content}>
      <AnimatedFlashList
        data={AVAILABLE_FIATS}
        renderItem={(asset, index) => (
          <AssetItem
            asset={asset}
            index={index}
            highlight={asset.id === to.id}
            onPress={onPressFiatOption}
          />
        )}
      />
    </View>
  );
};
const ExchangeToScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: theme.spacing.md,
    },
  });

const exchangeMapper: Record<ExchangeMode, () => React.ReactNode> = {
  [ExchangeModeOptios.FIAT_TO_CRYPTO]: () => <ExchangeToCrypto />,
  [ExchangeModeOptios.CRYPTO_TO_FIAT]: () => <ExchangeToFiat />,
};

export const ExchangeToScreen: React.FC = () => {
  const navigation = useNavigation<ExchangeToScreenNavigationProp>();
  const { theme } = useTheme();
  const styles = ExchangeToScreenStyles(theme);

  const { mode } = useExchangeStore();

  return (
    <ScreenView>
      <HeaderScreenBase>
        <BackButtonBase onPress={navigation.goBack} />
      </HeaderScreenBase>
      <View style={styles.container}>{exchangeMapper[mode]()}</View>
    </ScreenView>
  );
};
