import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../theme';

interface TypographyProps extends TextProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'button'
    | 'caption'
    | 'overline';
  color?:
    | 'primary'
    | 'secondary'
    | 'text'
    | 'textSecondary'
    | 'error'
    | 'success'
    | 'warning';
  align?: 'left' | 'center' | 'right';

  font?: 'ibm' | 'space' | 'default';
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'text',
  style,
  children,
  align = 'left',
  font = 'default',
  ...props
}) => {
  const { theme } = useTheme();

  const getTextStyle = () => {
    const baseStyle = {
      color: theme.colors[color],
      textAlign: align,
    };

    let fontFamily;

    switch (font) {
      case 'space':
        fontFamily = theme.typography.spaceGrotesk;
        break;
      case 'ibm':
        fontFamily = theme.typography.ibmPlexSans;
        break;
      default:
        fontFamily = theme.typography.ibmPlexSans;
        break;
    }

    switch (variant) {
      case 'h1':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.h1,
          fontFamily: fontFamily.bold,
          fontWeight: theme.typography.fontWeight.bold,
        };
      case 'h2':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.h2,
          fontFamily: fontFamily.bold,
          fontWeight: theme.typography.fontWeight.bold,
        };
      case 'h3':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.h3,
          fontFamily: fontFamily.bold,
          fontWeight: theme.typography.fontWeight.bold,
        };
      case 'h4':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.h4,
          fontFamily: fontFamily.medium,
          fontWeight: theme.typography.fontWeight.medium,
        };
      case 'h5':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.h5,
          fontFamily: fontFamily.medium,
          fontWeight: theme.typography.fontWeight.medium,
        };
      case 'h6':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.h6,
          fontFamily: fontFamily.medium,
          fontWeight: theme.typography.fontWeight.medium,
        };
      case 'subtitle1':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.subtitle1,
          fontFamily: fontFamily.regular,
          fontWeight: theme.typography.fontWeight.regular,
        };
      case 'subtitle2':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.subtitle2,
          fontFamily: fontFamily.medium,
          fontWeight: theme.typography.fontWeight.medium,
        };
      case 'body1':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.body1,
          fontFamily: fontFamily.regular,
          fontWeight: theme.typography.fontWeight.regular,
        };
      case 'body2':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.body2,
          fontFamily: fontFamily.regular,
          fontWeight: theme.typography.fontWeight.regular,
        };
      case 'button':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.button,
          fontFamily: fontFamily.medium,
          fontWeight: theme.typography.fontWeight.medium,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.75,
        };
      case 'caption':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.caption,
          fontFamily: fontFamily.regular,
          fontWeight: theme.typography.fontWeight.regular,
        };
      case 'overline':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.overline,
          fontFamily: fontFamily.regular,
          fontWeight: theme.typography.fontWeight.regular,
          textTransform: 'uppercase' as const,
          letterSpacing: 1.5,
        };
      default:
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.body1,
          fontFamily: fontFamily.regular,
          fontWeight: theme.typography.fontWeight.regular,
        };
    }
  };

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

export { Typography };
