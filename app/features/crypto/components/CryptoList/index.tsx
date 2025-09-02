import { CryptoListPagination } from './CryptoListPagination';
import { CryptoListFilters } from './CryptoListFilters';
import { QueryRender } from '../../../../components/QueryRender';
import { Typography } from '../../../../components/Typography';
import { CryptoListList } from './CryptoListList';
import { CryptoListSkeleton } from './CryptoListSkeleton';
import { MarketFiltersForm } from '../../../../schemas/market-filters.schema';
import { UseQueryResult } from '@tanstack/react-query';
import { ICrypto } from '../../../../services/crypto-service';
import { View } from 'react-native';

type CryptoListProps = {
  priceChangeFilter: MarketFiltersForm['priceChangeFilter'];
  setPriceChangeFilter: (value: MarketFiltersForm['priceChangeFilter']) => void;
  orderFilter: MarketFiltersForm['orderFilter'];
  setOrderFilter: (value: MarketFiltersForm['orderFilter']) => void;
  cryptosQuery: UseQueryResult<ICrypto[], Error>;
  onPressCryptoCard: (crypto: ICrypto) => void;
  onPressPreviousPage: () => void;
  onPressNextPage: () => void;
  hasMoreData: boolean;
  currentPage: number;
};

const CryptoList = ({
  priceChangeFilter,
  setPriceChangeFilter,
  orderFilter,
  setOrderFilter,
  cryptosQuery,
  onPressCryptoCard,
  onPressPreviousPage,
  onPressNextPage,
  hasMoreData,
  currentPage,
}: CryptoListProps) => {
  return (
    <View>
      <CryptoListFilters
        priceChangeFilter={priceChangeFilter}
        setPriceChangeFilter={setPriceChangeFilter}
        orderFilter={orderFilter}
        setOrderFilter={setOrderFilter}
      />
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
      <CryptoListPagination
        currentPage={currentPage}
        onPressPreviousPage={onPressPreviousPage}
        onPressNextPage={onPressNextPage}
        hasMoreData={hasMoreData}
      />
    </View>
  );
};

export { CryptoList };
