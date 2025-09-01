import {
  getFavoriteWallets,
  getScannedWallets,
  Wallet,
  getScannedWalletByAddress,
  ScannedWallet,
  addScannedWallet,
  isFavoriteWallet,
  toggleFavoriteWallet,
} from '../storage/wallets';

const walletsService = {
  getScannedWallets: async (): Promise<ScannedWallet[]> => {
    const wallets = getScannedWallets();
    return wallets;
  },
  getFavoriteWallets: async (): Promise<ScannedWallet[]> => {
    const favoriteWallets = getFavoriteWallets();

    const walletsData = favoriteWallets
      .map(address => getScannedWalletByAddress(address))
      .filter(wallet => wallet !== null);
    return walletsData;
  },
  getWalletByAddress: async (
    address: string,
  ): Promise<ScannedWallet | null> => {
    return getScannedWalletByAddress(address);
  },
  addScannedWallet: async (wallet: Wallet): Promise<ScannedWallet> => {
    return addScannedWallet(wallet);
  },
  isFavoriteWallet: async (walletId: string): Promise<boolean> => {
    return isFavoriteWallet(walletId);
  },
  toggleFavoriteWallet: async (walletId: string): Promise<void> => {
    return toggleFavoriteWallet(walletId);
  },
};

export { walletsService };
