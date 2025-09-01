import { SupportedFiat } from '../features/exchange/stores/exchangeStore';
import { Asset } from '../storage/assets-storage';
import {
  addAssetBalanceAmount,
  BalanceStorage,
  getAssetBalance,
  getBalances,
  resetBalances,
  setAssetBalanceAmount,
} from '../storage/balance-storage';
import { assetsService } from './assets-service';
import { cryptoService } from './crypto-service';
import { fiatService } from './fiat-service';

export type BalanceView = BalanceStorage & {
  asset: Asset;
};

const balanceService = {
  resetBalances: () => {
    return resetBalances();
  },
  getBalances: async (): Promise<BalanceView[]> => {
    const balances = getBalances();
    const balancesWithAssets: BalanceView[] = [];
    for (const balance of balances) {
      const asset = await assetsService.get(balance.assetId);
      if (asset) {
        balancesWithAssets.push({ ...balance, asset });
      }
    }

    return balancesWithAssets;
  },

  addAssetBalanceAmount: (assetId: string, amount: number) => {
    return addAssetBalanceAmount(assetId, amount);
  },
  setAssetBalanceAmount: (assetId: string, amount: number) => {
    return setAssetBalanceAmount(assetId, amount);
  },
  getAssetBalance: (assetId: string) => {
    return getAssetBalance(assetId);
  },
  getAssetsBalanceAmount: async () => {
    const balances = getBalances();
    let totalValue = 0;

    // Calculate fiat balances
    for (const balance of balances) {
      const asset = await assetsService.get(balance.assetId);
      if (asset?.type === 'fiat') {
        totalValue += balance.amount;
      }
    }

    // Calculate crypto balances
    for (const balance of balances) {
      const asset = await assetsService.get(balance.assetId);
      if (asset?.type === 'crypto') {
        try {
          const price = await cryptoService.getPrice(balance.assetId, 'usd');
          totalValue += balance.amount * price;
        } catch (error) {
          console.warn(`Error getting price for ${balance.assetId}:`, error);
          // Continue with other cryptos even if one fails
        }
      } else {
        const price = await fiatService.getPrice(
          balance.assetId as SupportedFiat,
        );
        totalValue += balance.amount * price;
      }
    }

    return totalValue;
  },
};

export { balanceService };
