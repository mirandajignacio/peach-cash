import { Image, StyleSheet, View } from 'react-native';
import { Typography } from '../components/Typography';

import GoogleSignInButton from '../features/auth/components/GoogleSignInButton';
import { useGoogleAuth } from '../features/auth/hooks/useGoogleAuth';
import { useTheme } from '../theme';
import { ScreenView } from '../components/ScreenView';
import { ScreenContent } from '../components/ScreenContent';
import { Button } from '../components/Button';

function SignInScreen() {
  const { theme } = useTheme();
  const styles = SignInScreenStyles();
  const { signInWithGoogle, isMutationLoading, isError, reset } =
    useGoogleAuth();

  const handleGoogleSignIn = () => {
    if (isError) {
      reset(); // Reset error state before trying again
    }
    signInWithGoogle();
  };

  const handleRetry = () => {
    reset();
    signInWithGoogle();
  };

  return (
    <ScreenView>
      <ScreenContent style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Peach Cash
          </Typography>
          <Typography
            variant="body1"
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Inicia sesión para continuar
          </Typography>
        </View>

        <View>
          <GoogleSignInButton
            onPress={handleGoogleSignIn}
            loading={isMutationLoading}
            disabled={isMutationLoading}
          />

          {isError && (
            <View style={styles.errorContainer}>
              <Typography
                variant="caption"
                style={[styles.errorText, { color: theme.colors.error }]}
              >
                Algo salió mal. Inténtalo de nuevo.
              </Typography>
              <Button variant="outlined" onPress={handleRetry} color="primary">
                Reintentar
              </Button>
            </View>
          )}
        </View>
      </ScreenContent>
    </ScreenView>
  );
}

const SignInScreenStyles = () =>
  StyleSheet.create({
    logo: {
      width: 120,
      height: 120,
      padding: 16,
      objectFit: 'contain',
      marginHorizontal: 'auto',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      opacity: 0.8,
    },
    errorContainer: {
      marginTop: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      alignItems: 'center',
    },
    errorText: {
      textAlign: 'center',
      marginBottom: 12,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
    },
    dividerLine: {
      flex: 1,
      height: 1,
    },
    dividerText: {
      marginHorizontal: 16,
      fontSize: 14,
    },
    alternativeAuth: {
      gap: 16,
    },
  });

export { SignInScreen };
