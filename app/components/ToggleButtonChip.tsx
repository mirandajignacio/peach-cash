import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { Theme } from '../theme';
import { Typography } from './Typography';

type ButtonChipProps = {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  active: boolean;
};

const ToggleButtonChipStyles = (theme: Theme, active: boolean) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.sm,
      borderRadius: theme.spacing.sm,
      backgroundColor: active ? theme.colors.primary : theme.colors.background,
      borderWidth: 1,
      borderColor: active ? theme.colors.primary : theme.colors.border,
      color: active ? '#FFFFFF' : theme.colors.primary,
    },
  });

const ToggleButtonChip = ({
  onPress,
  children,
  style,
  active,
}: ButtonChipProps) => {
  const { theme } = useTheme();
  const styles = ToggleButtonChipStyles(theme, active);
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Typography variant="caption">{children}</Typography>
    </TouchableOpacity>
  );
};

export { ToggleButtonChip };
