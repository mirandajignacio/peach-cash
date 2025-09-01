import { useScrollToTop, useFocusEffect } from '@react-navigation/native';
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import type { RefreshControlProps } from 'react-native';
import { useRef, useCallback } from 'react';
import { Theme, useTheme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenViewStyles = (theme: Theme, paddingBottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingBottom: paddingBottom,
    },
    content: {
      flexGrow: 1,
    },
  });

const ScreenView = ({
  children,
  style,
  scrollViewRef,
  refreshControl,
  ignoreBottomSafeArea = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollViewRef?: React.RefObject<ScrollView | null>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  ignoreBottomSafeArea?: boolean;
}) => {
  const internalRef = useRef<ScrollView>(null);
  const ref = scrollViewRef || internalRef;
  const { theme } = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  // Scroll to top cuando se navega de vuelta al tab (comportamiento estándar)
  useScrollToTop(ref);

  // Scroll to top cada vez que se enfoca la pantalla (incluyendo primera vez)
  useFocusEffect(
    useCallback(() => {
      ref.current?.scrollTo({ y: 0, animated: false });
    }, [ref]),
  );

  const styles = ScreenViewStyles(
    theme,
    ignoreBottomSafeArea ? 0 : safeAreaInsets.bottom,
  );
  return (
    <ScrollView
      ref={ref}
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  );
};

export { ScreenView };
