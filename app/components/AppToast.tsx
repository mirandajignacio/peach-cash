import Toast, { BaseToast, ToastOptions } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { Theme, useTheme } from '../theme';

const AppToastStyles = (theme: Theme) =>
  StyleSheet.create({
    successToast: {
      borderLeftColor: theme.colors.success,
    },
    errorToast: {
      borderLeftColor: theme.colors.error,
    },
  });

const SuccessToast = (props: ToastOptions) => {
  const { theme } = useTheme();
  const styles = AppToastStyles(theme);

  return <BaseToast {...props} style={styles.successToast} />;
};

const ErrorToast = (props: ToastOptions) => {
  const { theme } = useTheme();
  const styles = AppToastStyles(theme);

  return <BaseToast {...props} style={styles.errorToast} />;
};

const CONFIG = {
  success: (props: ToastOptions) => <SuccessToast {...props} />,
  error: (props: ToastOptions) => <ErrorToast {...props} />,
};

const AppToast = () => {
  return <Toast position="bottom" config={CONFIG} />;
};

export { AppToast };
