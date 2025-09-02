import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Typography } from '../../../components/Typography';
import { useTheme } from '../../../theme';

import { BalanceView } from '../../../services/balance-service';
import {
  formatCryptoAmount,
  formatFiatAmount,
} from '../../../utils/numberFormatter';
import { AssetItemStyles } from './Assettem';

interface AssetBalanceItemProps {
  balance: BalanceView;
  onPress?: (balance: BalanceView) => void;
  index?: number;
  highlight?: boolean;
}

const AssetBalanceItem: React.FC<AssetBalanceItemProps> = ({
  balance,
  onPress,
  index = 0,
  highlight = false,
}) => {
  const { theme } = useTheme();
  const styles = AssetItemStyles(theme, highlight);
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
