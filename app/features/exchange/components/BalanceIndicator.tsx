import { Typography } from '../../../components/Typography';
import {
  ExchangeMode,
  ExchangeModeOptios,
  useExchangeStore,
} from '../stores/exchangeStore';
import { Asset } from '../../../storage/assets-storage';
import {
  formatCryptoAmount,
  formatFiatAmount,
} from '../../../utils/numberFormatter';
import { balanceService } from '../../../services/balance-service';
import { useQuery } from '@tanstack/react-query';
import { QueryRender } from '../../../components/QueryRender';

const BalanceMapper: Record<
  ExchangeMode,
  (asset: Asset, balance: number) => string
> = {
  [ExchangeModeOptios.FIAT_TO_CRYPTO]: (asset: Asset, balance: number) =>
    `Balance: ${formatFiatAmount(balance, asset.symbol)} `,
  [ExchangeModeOptios.CRYPTO_TO_FIAT]: (asset: Asset, balance: number) =>
    `Balance: ${formatCryptoAmount(balance, asset.symbol)} `,
};

const BalanceIndicator = () => {
  const { from, mode } = useExchangeStore();

  const balanceQuery = useQuery({
    queryKey: ['balances', from.id],
    queryFn: () => balanceService.getAssetBalance(from.id),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  return (
    <QueryRender
      query={balanceQuery}
      onData={data => {
        return (
          <Typography variant="body2" font="space" color="textSecondary">
            {BalanceMapper[mode](from, data?.amount ?? 0)}
          </Typography>
        );
      }}
      onLoading={() => <Typography variant="body2">{`...`} </Typography>}
      onError={() => (
        <Typography variant="body2">{`Balance no disponible :(`} </Typography>
      )}
    />
  );
};

export { BalanceIndicator };
