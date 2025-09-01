import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { useTheme } from '../../theme';
import { Typography } from '../Typography';

// TODO: Add estimatedItemSize
interface AnimatedFlashListProps<T>
  extends Omit<FlashListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  emptyStateComponent?: React.ReactNode;
  emptyStateMessage?: string;
  emptyStateSubmessage?: string;
}

const AnimatedFlashList = <T extends { id?: string | number }>({
  data,
  renderItem,
  emptyStateComponent,
  emptyStateMessage = 'No hay elementos disponibles',
  emptyStateSubmessage,
  ...flashListProps
}: AnimatedFlashListProps<T>) => {
  const { theme } = useTheme();

  const styles = AnimatedFlashListStyles(theme);

  if (data.length === 0) {
    return (
      <>
        {emptyStateComponent || (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateContent}>
              <View style={styles.emptyStateIcon}>
                {/* Puedes personalizar el ícono aquí */}
              </View>
              <View style={styles.emptyStateText}>
                <View style={styles.emptyStateTitle}>
                  {/* Aquí puedes usar Typography si quieres */}
                  <Typography variant="body1" color="textSecondary">
                    {emptyStateMessage}
                  </Typography>
                </View>
                {emptyStateSubmessage && (
                  <View style={styles.emptyStateSubtitle}>
                    <Typography variant="body1" color="textSecondary">
                      {emptyStateSubmessage}
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </>
    );
  }

  return (
    <FlashList
      data={data}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item, index) =>
        item.id ? String(item.id) : `item-${index}`
      }
      {...flashListProps}
    />
  );
};

const AnimatedFlashListStyles = (theme: any) =>
  StyleSheet.create({
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateContent: {
      alignItems: 'center',
      maxWidth: 300,
    },
    emptyStateIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${theme.colors.primary}20`,
      marginBottom: theme.spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStateText: {
      alignItems: 'center',
    },
    emptyStateTitle: {
      marginBottom: theme.spacing.xs,
    },
    emptyStateTitleText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
    },
    emptyStateSubtitle: {
      marginTop: theme.spacing.xs,
    },
    emptyStateSubtitleText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

export { AnimatedFlashList };
export type { AnimatedFlashListProps };
