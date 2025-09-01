import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import { ScreenView } from '../../../components/ScreenView';
import { Typography } from '../../../components/Typography';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { BackButtonBase } from '../../../components/BackButtonBase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../components/AppStackNavigation';
import { SearchIcon } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { cryptoService } from '../../../services/crypto-service';
import { useQuery } from '@tanstack/react-query';
import type { ICrypto } from '../../../services/crypto-service';
import { Theme, useTheme } from '../../../theme';
import { useMarketFilters } from '../../../hooks/useMarketFilters';
import { type MarketFiltersForm } from '../../../schemas/market-filters.schema';
import { CryptoList } from '../components/CryptoList';
import { ScreenContent } from '../../../components/ScreenContent';

type SearchCryptoNavigationProp = StackNavigationProp<
  AppStackParamList,
  'SearchCrypto'
>;

const SearchCryptoScreen = () => {
  const { theme } = useTheme();
  const styles = SearchCryptoScreenStyles(theme);
  const ref = React.useRef<ScrollView>(null);
  const navigation = useNavigation<SearchCryptoNavigationProp>();
  const [hasMoreData, setHasMoreData] = useState(true);

  const {
    searchText,
    priceChangeFilter,
    orderFilter,
    page: currentPage,
    perPage,
    debouncedSearchText,
    setSearchText,
    setPriceChangeFilter,
    setOrderFilter,
    setPage,
    resetPage,
    errors: filterErrors,
  } = useMarketFilters({
    onFiltersChange: useCallback(
      (newFilters: MarketFiltersForm & { debouncedSearchText: string }) => {
        console.log('Search filters', newFilters);
      },
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
      !debouncedSearchText &&
      priceChangeFilter === '24h' &&
      orderFilter === 'market_cap_desc' &&
      currentPage === 1;

    if (!isDefaultState) {
      scrollToTop();
    }
  }, [
    debouncedSearchText,
    priceChangeFilter,
    orderFilter,
    currentPage,
    scrollToTop,
  ]);

  const cryptosQuery = useQuery({
    queryKey: [
      'search-cryptos',
      debouncedSearchText,
      priceChangeFilter,
      orderFilter,
      currentPage,
      perPage,
    ],
    queryFn: async () => {
      if (!debouncedSearchText.trim()) {
        return [];
      }

      const result = await cryptoService.list({
        page: currentPage,
        per_page: perPage,
        names: debouncedSearchText,
        order: orderFilter,
        vs_currency: 'usd',
        price_change_percentage: priceChangeFilter,
      });

      const validResult = Array.isArray(result) ? result : [];
      return validResult;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    enabled: !!debouncedSearchText.trim(), // Solo ejecutar si hay texto de búsqueda
  });

  useEffect(() => {
    if (cryptosQuery.data && cryptosQuery.isSuccess) {
      setHasMoreData(cryptosQuery.data.length === perPage);
    }
  }, [cryptosQuery.data, perPage, cryptosQuery.isSuccess]);

  useEffect(() => {
    setHasMoreData(true);
  }, [debouncedSearchText, priceChangeFilter, orderFilter]);

  const onRefresh = () => {
    resetPage();
    setHasMoreData(true);
    cryptosQuery.refetch();
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressCryptoCard = (crypto: ICrypto) => {
    navigation.navigate('CryptoDetail', { id: crypto.id });
  };

  const onPressPreviousPage = () => {
    if (currentPage > 1) {
      console.log('onPressPreviousPage', currentPage);
      setPage(currentPage - 1);
    }
  };

  const onPressNextPage = () => {
    if (hasMoreData) {
      console.log('onPressNextPage', currentPage);
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
      <HeaderScreenBase>
        <BackButtonBase onPress={onPressBack} />
      </HeaderScreenBase>

      <ScreenContent>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[
              styles.searchInput,
              { color: theme.colors.text },
              filterErrors.searchText && styles.inputError,
            ]}
            placeholder="Buscar criptomonedas..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
          />
        </View>

        {filterErrors.searchText && (
          <Typography variant="caption" style={styles.errorText}>
            {filterErrors.searchText.message}
          </Typography>
        )}

        {/* Mostrar mensaje cuando no hay texto de búsqueda */}
        {!debouncedSearchText.trim() && (
          <View style={styles.emptyStateContainer}>
            <Typography variant="body1" color="textSecondary">
              Escribe para buscar criptomonedas
            </Typography>
          </View>
        )}
      </ScreenContent>

      {/* Mostrar lista solo si hay texto de búsqueda */}
      {debouncedSearchText.trim() && (
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
      )}
    </ScreenView>
  );
};

const SearchCryptoScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 10,
      paddingHorizontal: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 24,
      fontFamily: 'IBMPlexSans-Regular',
      padding: 8,
    },
    inputError: {
      borderColor: '#ff4444',
      borderWidth: 1,
    },
    errorText: {
      color: '#ff4444',
      marginTop: 4,
      marginLeft: 12,
    },
    emptyStateContainer: {
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export { SearchCryptoScreen };
