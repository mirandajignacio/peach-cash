import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  Pressable,
  PressableProps,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme';

export type ButtonVariant = 'contained' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning';

export type TouchableType =
  | 'opacity'
  | 'highlight'
  | 'withoutFeedback'
  | 'pressable';

interface BaseButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  touchableType?: TouchableType;
}

interface OpacityButtonProps
  extends BaseButtonProps,
    Omit<TouchableOpacityProps, 'style' | 'children'> {
  touchableType?: 'opacity';
}

interface HighlightButtonProps
  extends BaseButtonProps,
    Omit<TouchableHighlightProps, 'style' | 'children'> {
  touchableType: 'highlight';
  underlayColor?: string;
}

interface WithoutFeedbackButtonProps
  extends BaseButtonProps,
    Omit<TouchableWithoutFeedbackProps, 'style' | 'children'> {
  touchableType: 'withoutFeedback';
}

interface PressableButtonProps
  extends BaseButtonProps,
    Omit<PressableProps, 'style' | 'children' | 'disabled'> {
  touchableType: 'pressable';
}

export type ButtonProps =
  | OpacityButtonProps
  | HighlightButtonProps
  | WithoutFeedbackButtonProps
  | PressableButtonProps;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  style,
  textStyle,
  touchableType = 'opacity',
  onPress,
  ...props
}) => {
  const { theme } = useTheme();

  const getButtonColors = () => {
    const colorValue = theme.colors[color];

    switch (variant) {
      case 'contained':
        return {
          backgroundColor: disabled ? theme.colors.border : colorValue,
          textColor: disabled ? theme.colors.textSecondary : '#FFFFFF',
          borderColor: 'transparent',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          textColor: disabled ? theme.colors.textSecondary : colorValue,
          borderColor: disabled ? theme.colors.border : colorValue,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          textColor: disabled ? theme.colors.textSecondary : colorValue,
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colorValue,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        };
    }
  };

  const getSizePadding = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
          minHeight: 32,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          minHeight: 40,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          minHeight: 48,
        };
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          minHeight: 40,
        };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return theme.typography.fontSize.caption;
      case 'medium':
        return theme.typography.fontSize.button;
      case 'large':
        return theme.typography.fontSize.body1;
      default:
        return theme.typography.fontSize.button;
    }
  };

  const colors = getButtonColors();
  const sizePadding = getSizePadding();
  const fontSize = getFontSize();

  const buttonStyle: ViewStyle = {
    ...sizePadding,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.backgroundColor,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled && !loading ? 0.6 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  const buttonTextStyle: TextStyle = {
    color: colors.textColor,
    fontSize,
    fontFamily: theme.typography.fontFamily.medium,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  };

  const handlePress = (event: any) => {
    if (!disabled && !loading && onPress) {
      onPress(event);
    }
  };

  const renderContent = () => {
    if (loading) {
      const spinnerStyle = {
        marginRight: typeof children === 'string' ? theme.spacing.xs : 0,
      };

      return (
        <ActivityIndicator
          size="small"
          color={colors.textColor}
          style={spinnerStyle}
        />
      );
    }
    return null;
  };

  const renderButtonContent = () => (
    <>
      {startIcon && (
        <Text style={[buttonTextStyle, { marginRight: theme.spacing.xs }]}>
          {startIcon}
        </Text>
      )}

      {renderContent()}

      {typeof children === 'string' ? (
        <Text style={[buttonTextStyle, textStyle]}>{children}</Text>
      ) : (
        children
      )}

      {endIcon && (
        <Text style={[buttonTextStyle, { marginLeft: theme.spacing.xs }]}>
          {endIcon}
        </Text>
      )}
    </>
  );

  const getUnderlayColor = () => {
    if ('underlayColor' in props && props.underlayColor) {
      return props.underlayColor;
    }

    const baseColor = theme.colors[color];
    return variant === 'contained' ? `${baseColor}CC` : `${baseColor}33`;
  };

  switch (touchableType) {
    case 'highlight':
      return (
        <TouchableHighlight
          style={[buttonStyle, style]}
          onPress={handlePress}
          disabled={disabled || loading}
          underlayColor={getUnderlayColor()}
          {...(props as Omit<TouchableHighlightProps, 'style' | 'children'>)}
        >
          <>{renderButtonContent()}</>
        </TouchableHighlight>
      );

    case 'withoutFeedback':
      return (
        <TouchableWithoutFeedback
          onPress={handlePress}
          disabled={disabled || loading}
          {...(props as Omit<
            TouchableWithoutFeedbackProps,
            'style' | 'children'
          >)}
        >
          <Text style={[buttonStyle, style]}>{renderButtonContent()}</Text>
        </TouchableWithoutFeedback>
      );

    case 'pressable':
      return (
        <Pressable
          style={({ pressed }) => [
            buttonStyle,
            pressed && { opacity: 0.7 },
            style,
          ]}
          onPress={handlePress}
          disabled={disabled || loading}
          {...(props as Omit<PressableProps, 'style' | 'children'>)}
        >
          {renderButtonContent()}
        </Pressable>
      );

    case 'opacity':
    default:
      return (
        <TouchableOpacity
          style={[buttonStyle, style]}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={0.7}
          {...(props as Omit<TouchableOpacityProps, 'style' | 'children'>)}
        >
          {renderButtonContent()}
        </TouchableOpacity>
      );
  }
};

type ContainedButtonProps =
  | Omit<OpacityButtonProps, 'variant'>
  | Omit<HighlightButtonProps, 'variant'>
  | Omit<WithoutFeedbackButtonProps, 'variant'>
  | Omit<PressableButtonProps, 'variant'>;

export const ContainedButton: React.FC<ContainedButtonProps> = props => (
  <Button variant="contained" {...props} />
);

export const OutlinedButton: React.FC<ContainedButtonProps> = props => (
  <Button variant="outlined" {...props} />
);

export const TextButton: React.FC<ContainedButtonProps> = props => (
  <Button variant="text" {...props} />
);

export const OpacityButton: React.FC<
  Omit<OpacityButtonProps, 'touchableType'>
> = props => <Button touchableType="opacity" {...props} />;

export const HighlightButton: React.FC<
  Omit<HighlightButtonProps, 'touchableType'>
> = props => <Button touchableType="highlight" {...props} />;

export const WithoutFeedbackButton: React.FC<
  Omit<WithoutFeedbackButtonProps, 'touchableType'>
> = props => <Button touchableType="withoutFeedback" {...props} />;

export const PressableButton: React.FC<
  Omit<PressableButtonProps, 'touchableType'>
> = props => <Button touchableType="pressable" {...props} />;
