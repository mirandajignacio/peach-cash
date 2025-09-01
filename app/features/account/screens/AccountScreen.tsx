import { StyleSheet } from 'react-native';
import { Typography } from '../../../components/Typography';
import { LogOut, ToolCase } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../../../components/AppStackNavigation';
import { useGoogleAuth } from '../../auth/hooks/useGoogleAuth';
import { clearCurrentUser, getUser } from '../../../storage/user';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { Button } from '../../../components/Button';
import { Avatar } from '../../../components/Avatar';
import { BackButtonBase } from '../../../components/BackButtonBase';
import { ScreenView } from '../../../components/ScreenView';
import { ScreenContent } from '../../../components/ScreenContent';
import { useTheme } from '../../../theme';
import { IconButton } from '../../../components/IconButton';

type AccountScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Account'
>;

const AccountScrrenStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

const AccountScreen = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const user = getUser();
  const { theme } = useTheme();
  const { signOut } = useGoogleAuth();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeveloperToolsPress = () => {
    navigation.navigate('DeveloperTools' as never);
  };

  return (
    <ScreenView>
      <HeaderScreenBase>
        <BackButtonBase onPress={handleBackPress} />
        <IconButton
          onPress={handleDeveloperToolsPress}
          icon={
            <ToolCase size={24} color={theme.colors.text} strokeWidth={1.5} />
          }
        />
      </HeaderScreenBase>

      <ScreenContent style={AccountScrrenStyles.container}>
        <Avatar
          src={user?.photo}
          size="xxl"
          variant="circular"
          alt={user?.name}
        />
        <Typography variant="h1">{user?.name}</Typography>
        <Typography variant="body1" color="textSecondary">
          {user?.email}
        </Typography>
      </ScreenContent>

      <Button
        variant="text"
        color="primary"
        fullWidth
        startIcon={
          <LogOut size={24} color={theme.colors.primary} strokeWidth={1} />
        }
        onPress={() => {
          signOut();
          clearCurrentUser();
        }}
        children="Cerrar Sesión"
      />
    </ScreenView>
  );
};

export { AccountScreen };
