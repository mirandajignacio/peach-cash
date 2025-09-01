import React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';

import { ScreenView } from '../components/ScreenView';
import { BalanceCards } from '../components/Home/BalanceCards';
import { BalanceSection } from '../components/Home/BalanceSection';
import { HomeHeader } from '../components/Home/HomeHeader';
import { TransactionsSection } from '../components/Home/TransactionsSection';
import { ScreenContent } from '../components/ScreenContent';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme, Theme } from '../theme';

const HomeScreen = () => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['balances'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['total-balance'] });
  };

  const styles = HomeScreenStyles(theme);

  return (
    <ScreenView
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={handleRefresh} />
      }
    >
      <HomeHeader />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ScreenContent style={styles.balance}>
          <BalanceSection />
        </ScreenContent>

        <BalanceCards />

        <TransactionsSection />
      </ScrollView>
    </ScreenView>
  );
};

const HomeScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContainer: {
      gap: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    balance: {
      marginBottom: theme.spacing.lg,
    },
  });

export { HomeScreen };
