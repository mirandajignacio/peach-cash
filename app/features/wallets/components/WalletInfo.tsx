import { ScreenContent } from '../../../components/ScreenContent';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import { Copy, Wallet as WalletIcon } from 'lucide-react-native';
import { formatWalletAddress } from '../utils';
import { ScannedWallet } from '../../../storage/wallets';

type WalletInfoProps = {
  wallet: ScannedWallet;
};

const WalletInfoStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    walletIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    walletTypeBadge: {
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 20,
      marginBottom: theme.spacing.sm,
    },
    addressContainer: {
      marginBottom: theme.spacing.xl,
    },
    addressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 8,
    },
    addressText: {
      fontFamily: 'monospace',
      fontSize: 16,
      backgroundColor: theme.colors.surfaceSecondary,
      padding: theme.spacing.md,
      borderRadius: 8,
      textAlign: 'center',
    },
  });

const WalletInfo = ({ wallet }: WalletInfoProps) => {
  const { theme } = useTheme();
  const styles = WalletInfoStyles(theme);

  const handleCopyAddress = () => {
    Clipboard.setString(wallet.address);
  };

  return (
    <ScreenContent>
      <View style={styles.headerContainer}>
        <View style={styles.walletIconContainer}>
          <WalletIcon size={40} color={theme.colors.primary} />
        </View>

        <View style={styles.walletTypeBadge}>
          <Typography variant="caption" color="textSecondary">
            {wallet.assetId?.toUpperCase()}
          </Typography>
        </View>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.addressHeader}>
          <Typography variant="subtitle1">Dirección</Typography>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleCopyAddress}
              style={styles.actionButton}
            >
              <Copy size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <Typography style={styles.addressText}>
          {formatWalletAddress(wallet.address)}
        </Typography>
      </View>
    </ScreenContent>
  );
};

export { WalletInfo };
