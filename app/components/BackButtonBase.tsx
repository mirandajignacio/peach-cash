import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../theme';
import { IconButton } from './IconButton';
import { IconButtonProps } from './IconButton';

type BackButtonBaseProps = Omit<IconButtonProps, 'touchableType' | 'icon'>;

const BackButtonBase = ({ onPress }: BackButtonBaseProps) => {
  const { theme } = useTheme();

  return (
    <IconButton
      onPress={onPress}
      icon={<ArrowLeft size={24} color={theme.colors.text} strokeWidth={1.5} />}
    />
  );
};

export { BackButtonBase };
