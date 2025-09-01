import { Star } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { Theme, useTheme } from '../theme';
import { IconButton } from './IconButton';

type FavoriteButtonProps = {
  onPress: () => void;
  fav: boolean;
};

const FavoriteButton = ({ onPress, fav }: FavoriteButtonProps) => {
  const { theme } = useTheme();
  const styles = FavoriteButtonStyles(theme, fav);

  return (
    <IconButton
      onPress={onPress}
      touchableType="opacity"
      style={styles.container}
      icon={
        <Star
          size={24}
          color={fav ? 'white' : theme.colors.primary}
          strokeWidth={1}
          fill={fav ? 'white' : 'none'}
        />
      }
    />
  );
};

const FavoriteButtonStyles = (theme: Theme, fav: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: fav
        ? theme.colors.primary
        : theme.colors.surfaceSecondary,
    },
  });

export { FavoriteButton };
