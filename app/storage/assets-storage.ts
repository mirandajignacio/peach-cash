import { kv } from './mmkv';

export type AssetType = 'crypto' | 'fiat';

export interface Asset {
  id: string;
  type: AssetType;
  symbol: string;
  decimals: number;
  name: string;
  image?: string;
  isActive: boolean;
}

export interface FiatAsset extends Asset {
  type: 'fiat';
  decimals: 2;
}

export interface CryptoAsset extends Asset {
  type: 'crypto';
  decimals: 8;
}

const keyAssets = 'assets';

// CRUD Operations

/**
 * Get all assets
 */
export function getAssets(): Asset[] {
  return kv.get<Asset[]>(keyAssets, []);
}

/**
 * Get asset by ID
 */
export function getAssetById(id: string): Asset | undefined {
  const assets = getAssets();
  return assets.find(asset => asset.id === id);
}

/**
 * Get assets by type
 */
export function getAssetsByType(type: AssetType): Asset[] {
  const assets = getAssets();
  return assets.filter(asset => asset.type === type);
}

/**
 * Get only active assets
 */
export function getActiveAssets(): Asset[] {
  const assets = getAssets();
  return assets.filter(asset => asset.isActive);
}

/**
 * Add new asset
 */
export function addAsset(asset: Asset): Asset | null {
  try {
    const assets = getAssets();

    // Check if asset already exists
    if (assets.find(existing => existing.id === asset.id)) {
      console.warn(`Asset with ID ${asset.id} already exists`);
      return asset;
    }

    // Validate required fields
    if (!asset.id || !asset.symbol || !asset.name) {
      console.error('Asset missing required fields');
      return asset;
    }

    // Validate decimals based on type
    if (asset.type === 'fiat' && asset.decimals !== 2) {
      console.error('Fiat assets must have 2 decimals');
      return asset;
    }

    if (asset.type === 'crypto' && asset.decimals !== 8) {
      console.error('Crypto assets must have 8 decimals');
      return asset;
    }

    assets.push(asset);
    kv.set(keyAssets, assets);

    return asset;
  } catch (error) {
    console.error('Error adding asset:', error);
    return null;
  }
}

/**
 * Update existing asset
 */
export function updateAsset(id: string, updates: Partial<Asset>): boolean {
  try {
    const assets = getAssets();
    const assetIndex = assets.findIndex(asset => asset.id === id);

    if (assetIndex === -1) {
      console.warn(`Asset with ID ${id} not found`);
      return false;
    }

    const currentAsset = assets[assetIndex];
    const updatedAsset = { ...currentAsset, ...updates };

    // Validate the updated asset
    if (updatedAsset.type === 'fiat' && updatedAsset.decimals !== 2) {
      console.error('Fiat assets must have 2 decimals');
      return false;
    }

    if (updatedAsset.type === 'crypto' && updatedAsset.decimals !== 8) {
      console.error('Crypto assets must have 8 decimals');
      return false;
    }

    assets[assetIndex] = updatedAsset;
    kv.set(keyAssets, assets);

    return true;
  } catch (error) {
    console.error('Error updating asset:', error);
    return false;
  }
}

/**
 * Delete asset by ID
 */
export function deleteAsset(id: string): boolean {
  try {
    const assets = getAssets();
    const filteredAssets = assets.filter(asset => asset.id !== id);

    if (filteredAssets.length === assets.length) {
      console.warn(`Asset with ID ${id} not found`);
      return false;
    }

    kv.set(keyAssets, filteredAssets);

    return true;
  } catch (error) {
    console.error('Error deleting asset:', error);
    return false;
  }
}

/**
 * Toggle asset active status
 */
export function toggleAssetActive(id: string): boolean {
  try {
    const asset = getAssetById(id);
    if (!asset) {
      console.warn(`Asset with ID ${id} not found`);
      return false;
    }

    return updateAsset(id, { isActive: !asset.isActive });
  } catch (error) {
    console.error('Error toggling asset active status:', error);
    return false;
  }
}

/**
 * Initialize with default assets
 */
export function initializeDefaultAssets(): void {
  const existingAssets = getAssets();
  if (existingAssets.length > 0) {
    return;
  }

  const defaultAssets: Asset[] = [
    // Fiat assets
    {
      id: 'usd',
      type: 'fiat',
      symbol: 'USD',
      name: 'US Dollar',
      decimals: 2,
      isActive: true,
    },
    {
      id: 'ars',
      type: 'fiat',
      symbol: 'ARS',
      name: 'Argentine Peso',
      decimals: 2,
      isActive: true,
    },
    {
      id: 'eur',
      type: 'fiat',
      symbol: 'EUR',
      name: 'Euro',
      decimals: 2,
      isActive: true,
    },
    {
      id: 'jpy',
      type: 'fiat',
      symbol: 'JPY',
      name: 'Japanese Yen',
      decimals: 2,
      isActive: true,
    },

    // Crypto assets
    {
      id: 'bitcoin',
      type: 'crypto',
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 8,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      isActive: true,
    },
    {
      id: 'ethereum',
      type: 'crypto',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 8,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      isActive: true,
    },
    {
      id: 'tether',
      type: 'crypto',
      symbol: 'USDT',
      name: 'Tether',
      decimals: 8,
      image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      isActive: true,
    },
  ];

  kv.set(keyAssets, defaultAssets);
}

/**
 * Clear all assets
 */
export function clearAllAssets() {
  kv.del(keyAssets);
}

/**
 * Get asset count
 */
export function getAssetCount(): number {
  return getAssets().length;
}

/**
 * Get active asset count
 */
export function getActiveAssetCount(): number {
  return getActiveAssets().length;
}
