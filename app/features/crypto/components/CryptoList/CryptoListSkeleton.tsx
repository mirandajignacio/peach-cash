import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Theme, useTheme } from '../../../../theme';

interface CryptoItemSkeletonProps {
  style?: any;
}

interface CryptoListSkeletonProps {
  itemCount?: number;
}

const CryptoItemSkeleton: React.FC<CryptoItemSkeletonProps> = ({ style }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
    symbolBadge: {
      width: 50,
      height: 18,
      borderRadius: 6,
      marginBottom: theme.spacing.xs,
    },
    cryptoName: {
      width: 120,
      height: 16,
      borderRadius: 4,
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    priceText: {
      width: 80,
      height: 16,
      borderRadius: 4,
      marginBottom: theme.spacing.xs,
    },
    changeContainer: {
      width: 60,
      height: 20,
      borderRadius: 6,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Imagen skeleton */}
      <Animated.View
        style={[
          styles.cryptoImage,
          {
            backgroundColor: theme.colors.border,
            opacity: pulseAnim,
          },
        ]}
      />

      {/* Información central */}
      <View style={styles.cryptoInfo}>
        <Animated.View
          style={[
            styles.symbolBadge,
            {
              backgroundColor: theme.colors.border,
              opacity: pulseAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.cryptoName,
            {
              backgroundColor: theme.colors.border,
              opacity: pulseAnim,
            },
          ]}
        />
      </View>

      {/* Precio y cambio */}
      <View style={styles.priceContainer}>
        <Animated.View
          style={[
            styles.priceText,
            {
              backgroundColor: theme.colors.border,
              opacity: pulseAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.changeContainer,
            {
              backgroundColor: theme.colors.border,
              opacity: pulseAnim,
            },
          ]}
        />
      </View>
    </View>
  );
};

const CryptoListSkeletonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.md,
      flex: 1,
      minHeight: 400,
    },
  });

const CryptoListSkeleton: React.FC<CryptoListSkeletonProps> = ({
  itemCount = 10,
}) => {
  const { theme } = useTheme();
  const styles = CryptoListSkeletonStyles(theme);

  return (
    <View style={styles.container}>
      {Array.from({ length: itemCount }, (_, index) => (
        <CryptoItemSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
};

export { CryptoListSkeleton, CryptoItemSkeleton };
