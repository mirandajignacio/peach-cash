import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';

import { Asset } from '../../../storage/assets-storage';

interface AssetItemProps {
  asset: Asset;
  onPress?: (asset: Asset) => void;
  index?: number;
  highlight?: boolean;
}

export const AssetItemStyles = (theme: Theme, highlight: boolean) =>
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

const AssetItem: React.FC<AssetItemProps> = ({
  asset,
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
        onPress={() => onPress?.(asset)}
        activeOpacity={0.7}
      >
        <View style={styles.cryptoInfo}>
          <View style={styles.cryptoHeader}>
            <View style={styles.symbolContainer}>
              <View style={styles.symbolBadge}>
                <Typography variant="caption" color="textSecondary">
                  {asset.symbol.toUpperCase()}
                </Typography>
              </View>
            </View>

            <Typography variant="subtitle1" color="text">
              {asset.name}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export { AssetItem };
