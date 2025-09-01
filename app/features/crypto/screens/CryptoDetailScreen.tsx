import React from 'react';
import { RefreshControl, View } from 'react-native';
import { Typography } from '../../../components/Typography';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../../components/AppStackNavigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cryptoService } from '../../../services/crypto-service';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { QueryRender } from '../../../components/QueryRender';
import { ScreenContent } from '../../../components/ScreenContent';
import { ScreenView } from '../../../components/ScreenView';
import { FavoriteButton } from '../../../components/FavoriteButton';
import { formatCurrency } from '../../../utils/numberFormatter';
import { usePreferences } from '../../../storage/preferences';

const CryptoDetailScreen = ({
  route,
}: {
  route: RouteProp<AppStackParamList, 'CryptoDetail'>;
}) => {
  const { id } = route.params;

  const { getCurrentCurrency } = usePreferences();
  const currency = getCurrentCurrency();
  const queryClient = useQueryClient();
  const cryptoQuery = useQuery({
    queryKey: ['crypto', id],
    queryFn: () => cryptoService.get(id),
    retry: 2,
    retryDelay: 1000,
  });

  const isFavoriteQuery = useQuery({
    queryKey: ['is-favorite', id],
    queryFn: () => cryptoService.isFavorite(id),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => cryptoService.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['is-favorite', id],
      });
    },
  });

  const onPressFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  const onRefresh = () => {
    cryptoQuery.refetch();
  };

  return (
    <ScreenView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <HeaderScreenBase backButton>
        <QueryRender
          query={isFavoriteQuery}
          onData={data => (
            <FavoriteButton onPress={onPressFavorite} fav={data} />
          )}
          onLoading={() => <></>}
          onError={() => <></>}
        />
      </HeaderScreenBase>
      <QueryRender
        query={cryptoQuery}
        onData={data => (
          <ScreenContent>
            <View>
              <Typography variant="h1">{data?.name}</Typography>
              {data?.symbol && (
                <Typography variant="body2" color="textSecondary">
                  {`#${data.market_cap_rank || 'N/A'} Rank`}
                </Typography>
              )}
            </View>
            {data?.market_data?.current_price?.[currency] && (
              <View>
                <View>
                  <Typography variant="h1" font="space" color="primary">
                    {formatCurrency(data.market_data.current_price[currency])}
                  </Typography>
                </View>
              </View>
            )}
          </ScreenContent>
        )}
        onError={error => (
          <ScreenContent>
            <Typography variant="body1" align="center" color="error">
              {error?.message === 'Invalid data structure received from API'
                ? 'Error: Los datos recibidos del servidor no tienen el formato esperado. Intenta nuevamente.'
                : `Error: ${error?.message || 'Ocurrió un error inesperado'}`}
            </Typography>
          </ScreenContent>
        )}
        onLoading={() => (
          <ScreenContent>
            <Typography variant="body1">Loading...</Typography>
          </ScreenContent>
        )}
      />
    </ScreenView>
  );
};

export { CryptoDetailScreen };
