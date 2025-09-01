import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { BackButtonBase } from '../../../components/BackButtonBase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Theme, useTheme } from '../../../theme';
import { ScreenView } from '../../../components/ScreenView';
import { FavoriteButton } from '../../../components/FavoriteButton';
import { WalletNotFound } from '../components/WalletNotFound';
import { WalletInfo } from '../components/WalletInfo';
import { walletsService } from '../../../services/wallets-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryRender } from '../../../components/QueryRender';

const WalletScreenStyles = (theme: Theme, isWalletFavorite: boolean) =>
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
    infoSection: {
      marginBottom: theme.spacing.xl,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
    },
    infoValue: {
      fontWeight: '600',
    },
    favoriteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: isWalletFavorite
        ? theme.colors.error
        : theme.colors.primary,
      borderRadius: 12,
      marginBottom: theme.spacing.sm,
    },
    favoriteButtonText: {
      color: 'white',
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
  });

const WalletScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params as { address: string };
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const walletQuery = useQuery({
    queryKey: ['wallet', address],
    queryFn: () => walletsService.getWalletByAddress(address),
  });

  const isFavoriteWallet = useQuery({
    queryKey: ['is-favorite-wallet', address],
    queryFn: () => walletsService.isFavoriteWallet(address),
  });

  const toggleFavoriteWallet = useMutation({
    mutationFn: () => walletsService.toggleFavoriteWallet(address),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['is-favorite-wallet', address],
      });
      queryClient.invalidateQueries({
        queryKey: ['favorite-wallets'],
      });
    },
  });

  const isWalletFavorite = isFavoriteWallet.data || false;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleToggleFavorite = () => {
    toggleFavoriteWallet.mutate();
  };

  const styles = WalletScreenStyles(theme, isWalletFavorite);

  return (
    <ScreenView style={styles.container}>
      <HeaderScreenBase>
        <BackButtonBase onPress={handleBackPress} />
        <QueryRender
          query={isFavoriteWallet}
          onData={data => (
            <FavoriteButton fav={data} onPress={handleToggleFavorite} />
          )}
          onLoading={() => <></>}
          onError={() => <></>}
        />
      </HeaderScreenBase>

      <ScrollView showsVerticalScrollIndicator={false}>
        <QueryRender
          query={walletQuery}
          onData={wallet => <WalletInfo wallet={wallet!} />}
          onLoading={() => <></>}
          onError={() => <WalletNotFound />}
        />
      </ScrollView>
    </ScreenView>
  );
};

export { WalletScreen };
