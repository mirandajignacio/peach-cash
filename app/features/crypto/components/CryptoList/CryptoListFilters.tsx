import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../../../components/Typography';
import {
  orderOptions,
  priceChangeOptions,
} from '../../../../schemas/market-filters.schema';
import { MarketFiltersForm } from '../../../../schemas/market-filters.schema';
import { Theme, useTheme } from '../../../../theme';
import { ToggleButtonChip } from '../../../../components/ToggleButtonChip';

const CryptoListFiltersStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    filterSection: {
      marginBottom: theme.spacing.sm,
    },
    filterLabel: {
      paddingBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    firstChip: {
      marginLeft: theme.spacing.md,
      marginRight: theme.spacing.sm,
    },
    lastChip: {
      marginRight: theme.spacing.md,
    },
    chip: {
      marginRight: theme.spacing.sm,
    },
  });

const CryptoListFilters = ({
  priceChangeFilter,
  setPriceChangeFilter,
  orderFilter,
  setOrderFilter,
}: {
  priceChangeFilter: MarketFiltersForm['priceChangeFilter'];
  setPriceChangeFilter: (value: MarketFiltersForm['priceChangeFilter']) => void;
  orderFilter: MarketFiltersForm['orderFilter'];
  setOrderFilter: (value: MarketFiltersForm['orderFilter']) => void;
}) => {
  const { theme } = useTheme();

  const cryptoListFiltersStyles = CryptoListFiltersStyles(theme);

  return (
    <>
      <View style={cryptoListFiltersStyles.filterSection}>
        <Typography
          variant="subtitle2"
          style={cryptoListFiltersStyles.filterLabel}
        >
          Cambio de precio:
        </Typography>
        <FlashList
          data={priceChangeOptions}
          horizontal
          renderItem={({ item, index }) => (
            <ToggleButtonChip
              key={item.value}
              children={item.label}
              active={priceChangeFilter === item.value}
              onPress={() => setPriceChangeFilter(item.value)}
              style={
                index === 0
                  ? cryptoListFiltersStyles.firstChip
                  : index === orderOptions.length - 1
                  ? cryptoListFiltersStyles.lastChip
                  : cryptoListFiltersStyles.chip
              }
            />
          )}
          style={cryptoListFiltersStyles.chipContainer}
        />
      </View>

      {/* Filtros de orden */}
      <View>
        <Typography
          variant="subtitle2"
          style={cryptoListFiltersStyles.filterLabel}
        >
          Ordenar por:
        </Typography>

        <FlashList
          data={orderOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ToggleButtonChip
              key={item.value}
              children={item.label}
              active={orderFilter === item.value}
              onPress={() => setOrderFilter(item.value)}
              style={
                index === 0
                  ? cryptoListFiltersStyles.firstChip
                  : cryptoListFiltersStyles.chip
              }
            />
          )}
          style={cryptoListFiltersStyles.chipContainer}
        />
      </View>
    </>
  );
};

export { CryptoListFilters };
