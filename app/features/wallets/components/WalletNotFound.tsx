import { StyleSheet } from 'react-native';
import { ScreenContent } from '../../../components/ScreenContent';
import { Typography } from '../../../components/Typography';

const WalletNotFoundStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
});

const WalletNotFound = () => {
  return (
    <ScreenContent style={WalletNotFoundStyles.container}>
      <Typography variant="body1">Wallet no encontrada</Typography>
    </ScreenContent>
  );
};

export { WalletNotFound };
