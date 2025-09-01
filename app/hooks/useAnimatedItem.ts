import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UseAnimatedItemOptions {
  index?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  fadeIn?: boolean;
  slideIn?: boolean;
  scaleIn?: boolean;
}

export const useAnimatedItem = ({
  index = 0,
  delay = 100,
  duration = 600,
  distance = 30,
  fadeIn = true,
  slideIn = true,
  scaleIn = false,
}: UseAnimatedItemOptions = {}) => {
  const fadeAnim = useRef(new Animated.Value(fadeIn ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(slideIn ? distance : 0)).current;
  const scaleAnim = useRef(new Animated.Value(scaleIn ? 0.8 : 1)).current;

  useEffect(() => {
    const itemDelay = index * delay;

    const animations: Animated.CompositeAnimation[] = [];

    if (fadeIn) {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay: itemDelay,
          useNativeDriver: true,
        }),
      );
    }

    if (slideIn) {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          delay: itemDelay,
          useNativeDriver: true,
        }),
      );
    }

    if (scaleIn) {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          delay: itemDelay,
          useNativeDriver: true,
        }),
      );
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [
    fadeAnim,
    slideAnim,
    scaleAnim,
    index,
    delay,
    duration,
    fadeIn,
    slideIn,
    scaleIn,
  ]);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
  };

  return {
    animatedStyle,
    fadeAnim,
    slideAnim,
    scaleAnim,
  };
};
