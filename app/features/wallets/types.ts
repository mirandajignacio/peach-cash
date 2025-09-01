export const WalletTypes = {
  recents: 'recents',
  favorites: 'favorites',
} as const;

export type WalletType = (typeof WalletTypes)[keyof typeof WalletTypes];
