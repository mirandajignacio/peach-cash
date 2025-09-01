/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  CSSAnimationKeyframes,
  cubicBezier,
} from 'react-native-reanimated';
import { Theme, useTheme } from '../theme';

const rotate: CSSAnimationKeyframes = {
  from: {
    transform: [{ rotateZ: '0deg' }],
  },
  to: {
    transform: [{ rotateZ: '360deg' }],
  },
};

export function LoadingScreen() {
  const { theme } = useTheme();
  const styles = LoadingScreenStyles(theme);
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            animationName: rotate,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
            animationTimingFunction: cubicBezier(0.25, -0.5, 0.25, 1),
          },
        ]}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
}

const LoadingScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: theme.colors.background,
    },
    logo: {
      width: 120,
      height: 120,
      objectFit: 'contain',
    },
  });
