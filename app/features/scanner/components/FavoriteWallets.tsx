import { StyleSheet, View } from 'react-native';
import { useFavoriteWallets } from '../../../storage/useFavoriteWallets';
import { WalletList } from './WalletList';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';
import { Divider } from '../../../components/Divider';

const FavoriteWalletsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: theme.spacing.md,
    },
  });

const FavoriteWallets = () => {
  const { theme } = useTheme();
  const { favorites } = useFavoriteWallets();
  const styles = FavoriteWalletsStyles(theme);
  return (
    <View style={styles.container}>
      <Typography variant="h3">Favoritos</Typography>
      <Divider />
      <WalletList
        wallets={favorites.map(favorite => ({
          ...favorite,
          scannedAt: favorite.addedAt,
        }))}
      />
    </View>
  );
};

export { FavoriteWallets };
