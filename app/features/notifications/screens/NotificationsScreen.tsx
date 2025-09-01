import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { ScreenView } from '../../../components/ScreenView';
import { Theme, useTheme } from '../../../theme';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { BackButtonBase } from '../../../components/BackButtonBase';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../../../components/AppStackNavigation';

type NotificationsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Notifications'
>;

const NotificationsScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      alignSelf: 'center',
    },
    image: {
      padding: theme.spacing.md,
      width: '100%',
      objectFit: 'fill',
      borderRadius: theme.spacing.lg,
    },
  });

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const styles = NotificationsScreenStyles(theme);
  const navigation = useNavigation<NotificationsScreenNavigationProp>();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScreenView>
      <HeaderScreenBase>
        <BackButtonBase onPress={handleBackPress} />
      </HeaderScreenBase>
      <Image
        source={require('../../../assets/images/notifications-placeholder.jpg')}
        style={styles.image}
      />
    </ScreenView>
  );
};

export { NotificationsScreen };
