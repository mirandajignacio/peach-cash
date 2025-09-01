import { kv } from './mmkv';

export interface Wallet {
  id: string;
  assetId: string;
  address: string;
}

export interface ScannedWallet extends Wallet {
  scannedAt: number[];
}

// Favorite wallets are just an array of wallet IDs

function keyScannedWallets() {
  return `scanned-wallets`;
}

function keyFavoriteWallets() {
  return `favorite-wallets`;
}

export function getScannedWallets(): ScannedWallet[] {
  const wallets = kv.get<ScannedWallet[]>(keyScannedWallets(), []);
  return wallets.sort((a, b) => {
    const aLastScan = a.scannedAt[a.scannedAt.length - 1];
    const bLastScan = b.scannedAt[b.scannedAt.length - 1];
    return bLastScan - aLastScan;
  });
}

export function getFavoriteWallets(): string[] {
  const wallets = kv.get<string[]>(keyFavoriteWallets(), []);
  return wallets;
}

export function isFavoriteWallet(id: string): boolean {
  const wallets = getFavoriteWallets();
  return wallets.includes(id);
}

export function getScannedWallet(id: string): ScannedWallet | null {
  const wallets = getScannedWallets();
  return wallets.find(wallet => wallet.id === id) || null;
}

export function getScannedWalletByAddress(
  address: string,
): ScannedWallet | null {
  const wallets = getScannedWallets();
  return wallets.find(wallet => wallet.address === address) || null;
}

export function addFavoriteWallet(walletId: string): void {
  const wallets = getFavoriteWallets();
  if (!wallets.includes(walletId)) {
    wallets.push(walletId);
    kv.set(keyFavoriteWallets(), wallets);
  }
}

export function addScannedWallet(wallet: Wallet): ScannedWallet {
  const wallets = getScannedWallets();
  const existingWallet = wallets.find(
    w => w.address === wallet.address && w.assetId === wallet.assetId,
  );

  if (existingWallet) {
    // Add new scan timestamp to existing wallet
    existingWallet.scannedAt.push(Date.now());
  } else {
    // Create new scanned wallet
    const newScannedWallet: ScannedWallet = {
      ...wallet,
      scannedAt: [Date.now()],
    };
    wallets.push(newScannedWallet);
  }

  kv.set(keyScannedWallets(), wallets);
  return existingWallet || wallets[wallets.length - 1];
}

export function toggleFavoriteWallet(walletId: string): void {
  if (isFavoriteWallet(walletId)) {
    deleteFavoriteWallet(walletId);
  } else {
    addFavoriteWallet(walletId);
  }
}

export function deleteScannedWallet(id: string): void {
  const wallets = getScannedWallets();
  const filteredWallets = wallets.filter(wallet => wallet.id !== id);
  kv.set(keyScannedWallets(), filteredWallets);
}

export function deleteFavoriteWallet(id: string): void {
  const wallets = getFavoriteWallets();
  const filteredWallets = wallets.filter(walletId => walletId !== id);
  kv.set(keyFavoriteWallets(), filteredWallets);
}

export function clearScannedWallets(): void {
  kv.del(keyScannedWallets());
}

export function clearFavoriteWallets(): void {
  kv.del(keyFavoriteWallets());
}
