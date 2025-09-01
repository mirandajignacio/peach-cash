import { StyleSheet } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Link } from '@react-navigation/native';
import { ScreenView } from '../../../components/ScreenView';

function SignUpScreen() {
  return (
    <ScreenView style={styles.container}>
      <Typography variant="h1">Crea tu cuenta</Typography>
      <Typography variant="body1">
        Crea tu cuenta para empezar a usar la app
      </Typography>
      <Link href="/SignIn" action={{ type: '' }}>
        <Typography variant="body1">
          Ya tienes una cuenta? Inicia sesión
        </Typography>
      </Link>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export { SignUpScreen };
