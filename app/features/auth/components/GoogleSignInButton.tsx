import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
  Image,
} from 'react-native';
import { Theme, useTheme } from '../../../theme';
import { Button } from '../../../components/Button';
import { Typography } from '../../../components/Typography';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const styles = GoogleSignInButtonStyles(theme);
  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading, pulseAnim]);

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: loading ? theme.colors.surface : theme.colors.primary,
      borderColor: theme.colors.border,
    },
    disabled && styles.disabled,
  ];

  if (loading) {
    return (
      <Animated.View style={[buttonStyle, { opacity: pulseAnim }]}>
        <View style={styles.skeletonContent}>
          <View
            style={[
              styles.skeletonIcon,
              { backgroundColor: theme.colors.border },
            ]}
          />
          <View
            style={[
              styles.skeletonText,
              { backgroundColor: theme.colors.border },
            ]}
          />
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.content}>
      <Button
        variant="text"
        onPress={onPress}
        color="primary"
        size="large"
        fullWidth
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Image
          source={require('../../../assets/images/google-g.png')}
          style={styles.logo}
        />
        <Typography variant="body1">Continuar con Google</Typography>
      </Button>
      {loading && (
        <ActivityIndicator
          size="small"
          color={theme.colors.background}
          style={styles.loader}
        />
      )}
    </View>
  );
};

const GoogleSignInButtonStyles = (theme: Theme) =>
  StyleSheet.create({
    logo: {
      width: 24,
      height: 24,
    },
    button: {
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginVertical: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    },
    disabled: {
      opacity: 0.6,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    loader: {
      marginLeft: 8,
    },

    skeletonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    skeletonIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 12,
    },
    skeletonText: {
      height: 20,
      width: 140,
      borderRadius: 4,
    },
  });

export default GoogleSignInButton;
