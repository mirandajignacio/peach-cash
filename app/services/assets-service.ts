import {
  Asset,
  getAssetById,
  getAssets,
  addAsset,
  updateAsset,
  deleteAsset,
} from '../storage/assets-storage';

export const assetsService = {
  get: async (id: string) => {
    const assets = getAssetById(id);
    return assets;
  },
  list: async () => {
    const asset = getAssets();
    return asset;
  },
  search: async (_query: string) => {
    const asset = getAssets();
    return asset;
  },
  del: async (id: string) => {
    deleteAsset(id);
    return;
  },
  create: async (asset: Asset): Promise<Asset | null> => {
    return addAsset(asset);
  },
  patch: async (id: string, updates: Partial<Asset>) => {
    const asset = updateAsset(id, updates);
    return asset;
  },
};
