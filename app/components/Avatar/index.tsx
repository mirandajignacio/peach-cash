import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  ImageProps,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';

interface AvatarProps extends Omit<ImageProps, 'source' | 'style'> {
  src?: string;
  fallbackSrc?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  borderRadius?: number;
  alt?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  containerProps?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallbackSrc,
  size = 'md',
  variant = 'circular',
  borderRadius,
  alt,
  backgroundColor,
  textColor,
  style,
  textStyle,
  containerProps,
  ...imageProps
}) => {
  const { theme } = useTheme();
  const [hasError, setHasError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const getAvatarSize = (): number => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 56;
      case 'xl':
        return 80;
      case 'xxl':
        return 120;
      default:
        return 40;
    }
  };

  const getBorderRadius = (): number => {
    if (borderRadius !== undefined) {
      return borderRadius;
    }

    const avatarSize = getAvatarSize();

    switch (variant) {
      case 'circular':
        return avatarSize / 2;
      case 'rounded':
        return theme.spacing.sm;
      case 'square':
        return 0;
      default:
        return avatarSize / 2;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'xs':
        return theme.typography.fontSize.caption;
      case 'sm':
        return theme.typography.fontSize.body2;
      case 'md':
        return theme.typography.fontSize.body1;
      case 'lg':
        return theme.typography.fontSize.h6;
      case 'xl':
        return theme.typography.fontSize.h5;
      case 'xxl':
        return 120;
      default:
        return theme.typography.fontSize.body1;
    }
  };

  const getInitials = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const avatarSize = getAvatarSize();
  const radius = getBorderRadius();
  const fontSize = getFontSize();

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: radius,
    backgroundColor: backgroundColor || theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...containerProps,
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: radius,
  };

  const fallbackTextStyle: TextStyle = {
    fontSize,
    fontFamily: theme.typography.fontFamily.medium,
    fontWeight: theme.typography.fontWeight.medium,
    color: textColor || theme.colors.text,
    textAlign: 'center',
    ...textStyle,
  };

  const shouldShowImage =
    (src && !hasError) || (fallbackSrc && hasError && !fallbackError);
  const currentSrc =
    hasError && fallbackSrc && !fallbackError ? fallbackSrc : src;

  const handleImageError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
    } else {
      setFallbackError(true);
    }
  };

  return (
    <View style={[containerStyle, style]}>
      {shouldShowImage ? (
        <Image
          source={{ uri: currentSrc }}
          style={imageStyle}
          onError={handleImageError}
          {...imageProps}
        />
      ) : alt ? (
        <Text style={fallbackTextStyle}>{getInitials(alt)}</Text>
      ) : (
        <View style={imageStyle} />
      )}
    </View>
  );
};
