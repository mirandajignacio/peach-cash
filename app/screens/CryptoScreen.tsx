import { RefreshControl, ScrollView } from 'react-native';
import { cryptoService } from '../services/crypto-service';
import { useQuery } from '@tanstack/react-query';
import type { ICrypto } from '../services/crypto-service';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../components/AppStackNavigation';
import { SearchIcon } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '../theme';
import { useMarketFilters } from '../hooks/useMarketFilters';
import { type MarketFiltersForm } from '../schemas/market-filters.schema';
import { HeaderScreenBase } from '../components/HeaderScreenBase';
import { ScreenView } from '../components/ScreenView';
import { CryptoList } from '../features/crypto/components/CryptoList';
import { IconButton } from '../components/IconButton';

type MarketItemNavigationProp = StackNavigationProp<
  AppStackParamList,
  'CryptoDetail'
>;

const CryptoScreen = () => {
  const { theme } = useTheme();
  const ref = React.useRef<ScrollView>(null);

  const [hasMoreData, setHasMoreData] = useState(true);

  const {
    priceChangeFilter,
    orderFilter,
    page: currentPage,
    perPage,
    setPriceChangeFilter,
    setOrderFilter,
    setPage,
    resetPage,
  } = useMarketFilters({
    onFiltersChange: useCallback(
      (_newFilters: MarketFiltersForm & { debouncedSearchText: string }) => {},
      [],
    ),
    debounceDelay: 500,
  });

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTo({ y: 0, animated: true });
      }
    }, 150);
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      scrollToTop();
    }
  }, [currentPage, scrollToTop]);

  useEffect(() => {
    const isDefaultState =
      priceChangeFilter === '24h' &&
      orderFilter === 'market_cap_desc' &&
      currentPage === 1;

    if (!isDefaultState) {
      scrollToTop();
    }
  }, [priceChangeFilter, orderFilter, currentPage, scrollToTop]);

  const cryptosQuery = useQuery({
    queryKey: ['cryptos', priceChangeFilter, orderFilter, currentPage, perPage],
    queryFn: async () => {
      const result = await cryptoService.list({
        page: currentPage,
        per_page: perPage,
        order: orderFilter,
        vs_currency: 'usd',
        price_change_percentage: priceChangeFilter,
        names: '',
      });

      const validResult = Array.isArray(result) ? result : [];

      return validResult;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 30 * 1000,
  });

  // Manejar acumulación de datos cuando se carga una nueva página
  useEffect(() => {
    if (cryptosQuery.data && cryptosQuery.isSuccess) {
      setHasMoreData(cryptosQuery.data.length === perPage);
    }
  }, [cryptosQuery.data, perPage, cryptosQuery.isSuccess]);

  useEffect(() => {
    setHasMoreData(true);
  }, [priceChangeFilter, orderFilter]);

  const onRefresh = () => {
    resetPage();
    setHasMoreData(true);
    cryptosQuery.refetch();
  };

  const navigation = useNavigation<MarketItemNavigationProp>();

  const onPressCryptoCard = (crypto: ICrypto) => {
    navigation.navigate('CryptoDetail', { id: crypto.id });
  };

  const onPressPreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const onPressNextPage = () => {
    if (hasMoreData) {
      setPage(currentPage + 1);
    }
  };

  return (
    <ScreenView
      scrollViewRef={ref}
      refreshControl={
        <RefreshControl
          refreshing={cryptosQuery.isRefetching}
          onRefresh={onRefresh}
        />
      }
    >
      <HeaderScreenBase
        title="Criptomonedas"
        subtitle="Explora el mercado de criptomonedas"
      >
        <IconButton
          onPress={() => navigation.navigate('SearchCrypto')}
          icon={
            <SearchIcon size={24} color={theme.colors.text} strokeWidth={1} />
          }
        />
      </HeaderScreenBase>

      <CryptoList
        priceChangeFilter={priceChangeFilter}
        setPriceChangeFilter={setPriceChangeFilter}
        orderFilter={orderFilter}
        setOrderFilter={setOrderFilter}
        cryptosQuery={cryptosQuery}
        onPressCryptoCard={onPressCryptoCard}
        onPressPreviousPage={onPressPreviousPage}
        onPressNextPage={onPressNextPage}
        hasMoreData={hasMoreData}
        currentPage={currentPage}
      />
    </ScreenView>
  );
};

export { CryptoScreen };
