import React, { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { Theme, useTheme } from '../theme';
import { HeaderScreenBase } from '../components/HeaderScreenBase';
import { ToggleButtonChip } from '../components/ToggleButtonChip';
import { ScreenView } from '../components/ScreenView';

import { WalletType, WalletTypes } from '../features/wallets/types';
import { WalletList } from '../features/scanner/components/WalletList';
import { ScreenContent } from '../components/ScreenContent';
import { walletsService } from '../services/wallets-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryRender } from '../components/QueryRender';

const ScannedWallets = () => {
  const walletsQuery = useQuery({
    queryKey: ['scanned-wallets'],
    queryFn: () => walletsService.getScannedWallets(),
  });

  return (
    <QueryRender
      query={walletsQuery}
      onData={wallets => (
        <WalletList wallets={wallets} emptyStateComponent={<></>} />
      )}
      onLoading={() => <></>}
      onError={() => <></>}
    />
  );
};

const FavoriteWallets = () => {
  const walletsQuery = useQuery({
    queryKey: ['favorite-wallets'],
    queryFn: () => walletsService.getFavoriteWallets(),
  });

  return (
    <QueryRender
      query={walletsQuery}
      onData={wallets => (
        <WalletList wallets={wallets} emptyStateComponent={<></>} />
      )}
      onLoading={() => <></>}
      onError={() => <></>}
    />
  );
};

const WalletsTab: Record<WalletType, React.ReactNode> = {
  recents: <ScannedWallets />,
  favorites: <FavoriteWallets />,
};

const WalletsScreen = () => {
  const [tab, setTab] = useState<WalletType>(WalletTypes.recents);
  const queryClient = useQueryClient();

  const { theme } = useTheme();

  const styles = WalletsScreenStyles(theme);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['scanned-wallets'] });
    queryClient.invalidateQueries({ queryKey: ['favorite-wallets'] });
  };

  return (
    <ScreenView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={handleRefresh} />
      }
    >
      <HeaderScreenBase
        title="Wallets"
        subtitle="Manage your scanned wallets"
      />

      <View style={styles.filterContainer}>
        <ToggleButtonChip
          children="Ultimas scaneadas"
          active={tab === 'recents'}
          onPress={() => setTab('recents')}
          style={styles.chip}
        />
        <ToggleButtonChip
          children="Favoritas"
          active={tab === 'favorites'}
          onPress={() => setTab('favorites')}
          style={styles.chip}
        />
      </View>
      <ScreenContent>{WalletsTab[tab]}</ScreenContent>
    </ScreenView>
  );
};

const WalletsScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    filterContainer: {
      margin: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    chip: {
      flex: 1,
      alignItems: 'center',
    },
  });

export { WalletsScreen };
