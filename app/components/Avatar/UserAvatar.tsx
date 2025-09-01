import { StyleSheet, View } from 'react-native';
import { Avatar } from '.';
import { getUser } from '../../storage/user';
import { Theme, useTheme } from '../../theme';
import { Typography } from '../Typography';

const UserAvatarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.xs,
      gap: theme.spacing.sm,
      paddingRight: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

const UserAvatar = () => {
  const user = getUser();
  const { theme } = useTheme();

  const styles = UserAvatarStyles(theme);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Avatar src={user?.photo} size="md" variant="rounded" alt={user?.name} />
      <Typography variant="body1">{user?.name}</Typography>
    </View>
  );
};

export { UserAvatar };
