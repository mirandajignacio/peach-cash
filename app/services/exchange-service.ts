import {
  ExchangeMode,
  ExchangeModeOptios,
} from '../features/exchange/stores/exchangeStore';
import { AssetType, CryptoAsset, FiatAsset } from '../storage/assets-storage';
import { BalanceStorage } from '../storage/balance-storage';
import { Transaction } from '../storage/transactions';
import { generateUUID } from '../utils/generate-uuid';
import { assetsService } from './assets-service';
import { balanceService } from './balance-service';
import { transactionsService } from './transactions-service';

/**
 * Validates exchange rate and ensures it's a positive number
 */
const validateExchangeRate = (
  rate: number,
  crypto: string,
  fiat: string,
): void => {
  if (!rate || rate <= 0 || !isFinite(rate)) {
    throw new Error(`Tasa de cambio inválida para ${crypto}/${fiat}: ${rate}`);
  }
};

/**
 * Rounds amount to 8 decimal places for crypto and 2 for fiat
 */
const roundAmount = (amount: number, isCrypto: boolean): number => {
  const decimals = isCrypto ? 8 : 2;
  return Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Validates that the asset exists in the system
 */
const validateAsset = async (
  assetId: string,
  _assetType: 'crypto' | 'fiat',
): Promise<void> => {
  const asset = await assetsService.get(assetId);
  if (!asset) {
    throw new Error(`Asset ${assetId} no encontrado en el sistema`);
  }
};

/**
 * Gets or creates a balance for the specified asset
 */
const getOrCreateBalance = (assetId: string): BalanceStorage => {
  let balance = balanceService.getAssetBalance(assetId);
  if (!balance) {
    balance = balanceService.addAssetBalanceAmount(assetId, 0);
  }
  return balance!;
};

/**
 * Obtiene la tasa de cambio para los 2 modos soportados
 * @param mode - 'fiat-to-crypto' o 'crypto-to-fiat'
 * @param crypto - ID de la criptomoneda (ej: "bitcoin")
 * @param fiat - ID de la moneda fiat (ej: "usd")
 * @returns Promise<number> - Tasa de cambio
 */
const getExchangeRate = async (
  mode: 'fiat-to-crypto' | 'crypto-to-fiat',
  crypto: string,
  fiat: string,
): Promise<number> => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const price = data[crypto]?.[fiat];

    if (!price) {
      throw new Error(`No se pudo obtener el precio para ${crypto} en ${fiat}`);
    }

    // Para fiat-to-crypto: necesitamos 1/price (cuántos crypto por 1 fiat)
    // Para crypto-to-fiat: price ya es correcto (cuántos fiat por 1 crypto)
    const rate =
      mode === 'fiat-to-crypto' ? 1 / parseFloat(price) : parseFloat(price);

    // Validar que la tasa sea válida
    validateExchangeRate(rate, crypto, fiat);

    return rate;
  } catch (error) {
    console.error(`[ExchangeService] Error getting exchange rate:`, error);
    throw new Error(
      `No se pudo obtener la tasa de cambio para ${crypto}/${fiat}`,
    );
  }
};

/**
 * Creates a transaction record for the exchange
 */
const createExchangeTransaction = (
  fromAssetId: string,
  toAssetId: string,
  fromAmount: number,
  toAmount: number,
  fromSymbol: string,
  toSymbol: string,
  fromType: AssetType,
  toType: AssetType,
): Transaction => {
  return {
    type: 'exchange',
    fromAsset: {
      assetId: fromAssetId,
      amount: fromAmount,
      symbol: fromSymbol,
      type: fromType,
    },
    toAsset: {
      assetId: toAssetId,
      amount: toAmount,
      symbol: toSymbol,
      type: toType,
    },
    id: generateUUID(),
    status: 'completed',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/**
 * Validates user has sufficient balance for the exchange
 */
const validateSufficientBalance = (
  balance: BalanceStorage | undefined,
  requiredAmount: number,
  _assetId: string,
): void => {
  if (!balance) {
    throw new Error(
      `Fondos insuficientes. Disponible: 0.00, Requerido: ${requiredAmount}`,
    );
  }

  if (balance.amount < requiredAmount) {
    throw new Error(
      `Fondos insuficientes. Disponible: ${balance.amount}, Requerido: ${requiredAmount}`,
    );
  }
};

/**
 * Realiza el intercambio de monedas
 * @param params {
 *   userId: string;
 *   mode: 'fiat-to-crypto' | 'crypto-to-fiat';
 *   crypto: string;
 *   fiat: string;
 *   amount: number;
 * }
 * @returns {
 *   success: boolean;
 *   fromAmount: number;
 *   toAmount: number;
 * }
 */
export type ExchangeProps = {
  mode: ExchangeMode;
  crypto: CryptoAsset;
  fiat: FiatAsset;
  amount: number;
};

const exchange = async ({ mode, crypto, fiat, amount }: ExchangeProps) => {
  // Validaciones básicas
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }

  try {
    // Validar que ambos assets existen
    await validateAsset(crypto.id, 'crypto');
    await validateAsset(fiat.id, 'fiat');

    const rate = await getExchangeRate(mode, crypto.id, fiat.id);

    if (mode === ExchangeModeOptios.FIAT_TO_CRYPTO) {
      // Obtener balance de origen (fiat)
      const fromBalance = balanceService.getAssetBalance(fiat.id);
      validateSufficientBalance(fromBalance, amount, fiat.id);

      // Calcular nuevos balances con precisión adecuada
      const newFromBalance = roundAmount(fromBalance!.amount - amount, false);
      const toAmount = roundAmount(amount * rate, true);

      // Obtener o crear balance de destino (crypto)
      const toBalance = getOrCreateBalance(crypto.id);
      const newToBalance = roundAmount(toBalance.amount + toAmount, true);

      try {
        // Actualizar balances - usar setAssetBalanceAmount para reemplazar el balance

        balanceService.setAssetBalanceAmount(fiat.id, newFromBalance);
        balanceService.setAssetBalanceAmount(crypto.id, newToBalance);

        // Crear transacción
        const transaction = createExchangeTransaction(
          fiat.id,
          crypto.id,
          amount,
          toAmount,
          fiat.symbol,
          crypto.symbol,
          fiat.type,
          crypto.type,
        );
        transactionsService.addTransaction(transaction);

        return {
          success: true,
          fromAssetId: fiat.id,
          toAssetId: crypto.id,
          fromAmount: amount,
          toAmount: toAmount,
        };
      } catch (error) {
        console.error('Error updating balances in fiat-to-crypto mode:', error);
        throw new Error('Error al actualizar los balances');
      }
    } else {
      // crypto-to-fiat mode
      // Obtener balance de origen (crypto)
      const fromBalance = balanceService.getAssetBalance(crypto.id);
      validateSufficientBalance(fromBalance, amount, crypto.id);

      // Calcular nuevos balances con precisión adecuada
      const newFromBalance = roundAmount(fromBalance!.amount - amount, true);
      const toAmount = roundAmount(amount * rate, false);

      // Obtener o crear balance de destino (fiat)
      const toBalance = getOrCreateBalance(fiat.id);
      const newToBalance = roundAmount(toBalance.amount + toAmount, false);

      try {
        // Actualizar balances - usar setAssetBalanceAmount para reemplazar el balance

        balanceService.setAssetBalanceAmount(crypto.id, newFromBalance);
        balanceService.setAssetBalanceAmount(fiat.id, newToBalance);

        // Crear transacción (añadido para consistencia)
        const transaction = createExchangeTransaction(
          crypto.id,
          fiat.id,
          amount,
          toAmount,
          crypto.symbol,
          fiat.symbol,
          crypto.type,
          fiat.type,
        );
        transactionsService.addTransaction(transaction);

        return {
          success: true,
          fromAssetId: crypto.id,
          toAssetId: fiat.id,
          fromAmount: amount,
          toAmount: toAmount,
        };
      } catch (error) {
        console.error('Error updating balances in crypto-to-fiat mode:', error);
        throw new Error('Error al actualizar los balances');
      }
    }
  } catch (error) {
    console.error('[exchangeBalance] Exchange failed:', error);
    throw error;
  }
};

const exchangeServiceV2 = {
  getExchangeRate,
  exchange,
};

export { exchangeServiceV2 };
