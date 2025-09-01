// Incluir información relevante: nombre, símbolo, imagen, precio actual y variación porcentual en 24hs.

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';

import { BalanceView } from '../../../services/balance-service';
import {
  formatCryptoAmount,
  formatFiatAmount,
} from '../../../utils/numberFormatter';

interface AssetBalanceItemProps {
  balance: BalanceView;
  onPress?: (balance: BalanceView) => void;
  index?: number;
  highlight?: boolean;
}

const AssetBalanceItemStyles = (theme: Theme, highlight: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: highlight ? theme.colors.primary : theme.colors.border,
    },
    cryptoImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: theme.spacing.md,
    },
    cryptoInfo: {
      flex: 1,
    },
    cryptoHeader: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    symbolContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    symbolBadge: {
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: 6,
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    priceText: {
      marginBottom: theme.spacing.xs,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 4,
      borderRadius: 6,
    },
    changeText: {
      fontWeight: '600',
    },
  });

const AssetBalanceItem: React.FC<AssetBalanceItemProps> = ({
  balance,
  onPress,
  index = 0,
  highlight = false,
}) => {
  const { theme } = useTheme();
  const styles = AssetBalanceItemStyles(theme, highlight);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const delay = index * 100;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress?.(balance)}
        activeOpacity={0.7}
      >
        {/* Información de la balance */}
        <View style={styles.cryptoInfo}>
          <View style={styles.cryptoHeader}>
            <View style={styles.symbolContainer}>
              <View style={styles.symbolBadge}>
                <Typography variant="caption" color="textSecondary">
                  {balance.asset.symbol.toUpperCase()}
                </Typography>
              </View>
            </View>

            <Typography variant="subtitle1" color="text">
              {balance.asset.name}
            </Typography>
          </View>
        </View>

        {/* Precio y variación */}
        <View style={styles.priceContainer}>
          <Typography variant="subtitle1" color="text" style={styles.priceText}>
            {balance.asset.type === 'fiat'
              ? formatFiatAmount(balance.amount)
              : formatCryptoAmount(balance.amount, balance.asset.symbol)}
          </Typography>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export { AssetBalanceItem };
