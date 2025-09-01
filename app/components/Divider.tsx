import { StyleSheet, View } from 'react-native';
import { Theme, useTheme } from '../theme';

const DividerStyles = (theme: Theme) =>
  StyleSheet.create({
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: theme.colors.border,
    },
  });

const Divider = () => {
  const { theme } = useTheme();
  const styles = DividerStyles(theme);
  return <View style={styles.divider} />;
};

export { Divider };
