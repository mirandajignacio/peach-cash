import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useAnimatedItem } from '../../hooks/useAnimatedItem';

interface AnimatedListItemProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  fadeIn?: boolean;
  slideIn?: boolean;
  scaleIn?: boolean;
  style?: ViewStyle;
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index = 0,
  delay = 100,
  duration = 600,
  distance = 30,
  fadeIn = true,
  slideIn = true,
  scaleIn = false,
  style,
}) => {
  const { animatedStyle } = useAnimatedItem({
    index,
    delay,
    duration,
    distance,
    fadeIn,
    slideIn,
    scaleIn,
  });

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
};

export { AnimatedListItem };
