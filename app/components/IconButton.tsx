import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Theme, useTheme } from '../theme';

type TouchableType = 'pressable' | 'opacity' | 'highlight' | 'withoutFeedback';

const IconButtonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      backgroundColor: theme.colors.surface,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

type TouchableTypeMapperProps = {
  onPress: () => void;
  icon: React.ReactNode;
  touchableType?: TouchableType;
  style?: StyleProp<ViewStyle>;
};

const TouchableTypeMapper: Record<
  TouchableType,
  (props: TouchableTypeMapperProps) => React.ReactNode
> = {
  pressable: ({ onPress, icon, style }) => (
    <Pressable onPress={onPress} style={style}>
      {icon}
    </Pressable>
  ),
  opacity: ({ onPress, icon, style }) => (
    <TouchableOpacity onPress={onPress} style={style}>
      {icon}
    </TouchableOpacity>
  ),
  highlight: ({ onPress, icon, style }) => (
    <TouchableHighlight onPress={onPress} style={style}>
      {icon}
    </TouchableHighlight>
  ),
  withoutFeedback: ({ onPress, icon, style }) => (
    <TouchableWithoutFeedback onPress={onPress} style={style}>
      {icon}
    </TouchableWithoutFeedback>
  ),
};

export type IconButtonProps = TouchableTypeMapperProps;

export const IconButton = ({
  onPress,
  icon,
  touchableType = 'opacity',
  style,
}: IconButtonProps) => {
  const { theme } = useTheme();
  const styles = IconButtonStyles(theme);
  return TouchableTypeMapper[touchableType]({
    onPress,
    icon,
    style: [styles.container, style],
  });
};
