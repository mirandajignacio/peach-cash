import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Typography } from '../../../../components/Typography';
import { useTheme } from '../../../../theme';
import { cryptoService, ICrypto } from '../../../../services/crypto-service';
import { Star } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

interface CryptoItemProps {
  crypto: ICrypto;
  onPress?: (crypto: ICrypto) => void;
  index?: number;
}

const CryptoItem: React.FC<CryptoItemProps> = ({
  crypto,
  onPress,
  index = 0,
}) => {
  const { theme } = useTheme();

  const isFavoriteQuery = useQuery({
    queryKey: ['is-favorite', crypto.id],
    queryFn: () => cryptoService.isFavorite(crypto.id),
  });

  const isFavorite = isFavoriteQuery.data || false;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const delay = index * 100; // Delay escalonado de 100ms por item

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

  const priceChange = crypto.price_change_percentage_24h ?? 0;
  const isPositiveChange = priceChange >= 0;

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return 'N/A';
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percentage: number | null | undefined) => {
    if (percentage == null) return 'N/A';
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

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

  const changeContainerStyle = [
    styles.changeContainer,
    {
      backgroundColor: isPositiveChange
        ? `${theme.colors.success}20`
        : `${theme.colors.error}20`,
    },
  ];

  const changeTextStyle = [
    styles.changeText,
    {
      color: isPositiveChange ? theme.colors.success : theme.colors.error,
    },
  ];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress?.(crypto)}
        activeOpacity={0.7}
      >
        {/* Imagen de la criptomoneda */}
        <Image
          source={{ uri: crypto.image }}
          style={styles.cryptoImage}
          resizeMode="cover"
        />

        {/* Información de la crypto */}
        <View style={styles.cryptoInfo}>
          <View style={styles.cryptoHeader}>
            <View style={styles.symbolContainer}>
              <View style={styles.symbolBadge}>
                <Typography variant="caption" color="textSecondary">
                  {crypto.symbol.toUpperCase()}
                </Typography>
              </View>
              {isFavorite && (
                <Star
                  size={16}
                  color={theme.colors.primary}
                  fill={theme.colors.primary}
                />
              )}
            </View>

            <Typography variant="subtitle1" color="text">
              {crypto.name}
            </Typography>
          </View>
        </View>

        {/* Precio y variación */}
        <View style={styles.priceContainer}>
          <Typography variant="subtitle1" color="text" style={styles.priceText}>
            {formatPrice(crypto.current_price)}
          </Typography>
          <View style={changeContainerStyle}>
            <Typography variant="caption" style={changeTextStyle}>
              {formatPercentage(priceChange)}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export { CryptoItem };
