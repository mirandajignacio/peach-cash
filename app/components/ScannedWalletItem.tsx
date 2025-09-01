import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Wallet, Clock, Trash2 } from 'lucide-react-native';
import { useTheme } from '../theme';
import { Typography } from './Typography';
import { formatWalletScanDate } from '../utils/dateFormatter';
import { useAnimatedItem } from '../hooks/useAnimatedItem';
import { ScannedWallet } from '../storage/wallets';

interface ScannedWalletItemProps {
  wallet: ScannedWallet;
  onPress?: (wallet: ScannedWallet) => void;
  onDelete?: (wallet: ScannedWallet) => void;
  index?: number;
}

const ScannedWalletItem: React.FC<ScannedWalletItemProps> = ({
  wallet,
  onPress,
  onDelete,
  index = 0,
}) => {
  const { theme } = useTheme();

  // Animaciones de entrada usando nuestro hook personalizado
  const { animatedStyle } = useAnimatedItem({
    index,
    delay: 100,
    duration: 600,
    distance: 30,
    fadeIn: true,
    slideIn: true,
    scaleIn: false,
  });

  const getWalletTypeLabel = () => {
    switch (wallet.assetId) {
      case 'bitcoin':
        return 'BTC';
      case 'ethereum':
        return 'ETH';
      default:
        return 'WALLET';
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatDate = (timestamp: number) => {
    return formatWalletScanDate(timestamp);
  };

  const styles = ScannedWalletItemStyles(theme);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => onPress?.(wallet)}
        activeOpacity={0.7}
      >
        <View style={styles.walletIcon}>
          <Wallet size={20} color={theme.colors.primary} />
        </View>

        <View style={styles.walletInfo}>
          <View style={styles.walletHeader}>
            <View style={styles.typeContainer}>
              <View style={styles.typeBadge}>
                <Typography variant="caption" color="textSecondary">
                  {getWalletTypeLabel()}
                </Typography>
              </View>
              {wallet.assetId && (
                <Typography variant="subtitle1" color="text">
                  {wallet.assetId}
                </Typography>
              )}
            </View>

            <Typography
              variant="body2"
              color="textSecondary"
              style={styles.addressText}
            >
              {formatAddress(wallet.address)}
            </Typography>
          </View>
        </View>

        {/* Información del lado derecho */}
        <View style={styles.rightContainer}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={theme.colors.textSecondary} />
            <Typography variant="caption" color="textSecondary">
              {formatDate(wallet.scannedAt[wallet.scannedAt.length - 1])}
            </Typography>
          </View>

          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(wallet)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={16} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ScannedWalletItemStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.xs,
    },
    touchableContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    walletIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    walletInfo: {
      flex: 1,
    },
    walletHeader: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    typeBadge: {
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: 6,
    },
    addressText: {
      fontFamily: 'monospace',
      fontSize: 14,
    },
    rightContainer: {
      alignItems: 'flex-end',
      alignSelf: 'flex-start',
      gap: theme.spacing.xs,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    deleteButton: {
      padding: theme.spacing.xs,
    },
  });

export { ScannedWalletItem };
