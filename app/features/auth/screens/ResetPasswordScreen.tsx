import { StyleSheet } from 'react-native';
import { Typography } from '../../../components/Typography';
import { ScreenView } from '../../../components/ScreenView';
import { ScreenContent } from '../../../components/ScreenContent';

function ResetPasswordScreen() {
  return (
    <ScreenView>
      <ScreenContent style={styles.container}>
        <Typography variant="h1">Restablecer contraseña</Typography>
        <Typography variant="body1">
          Ingresa tu correo electrónico para restablecer tu contraseña
        </Typography>
      </ScreenContent>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export { ResetPasswordScreen };
