import { X } from 'lucide-react-native';
import { useTheme } from '../theme';
import { IconButton, IconButtonProps } from './IconButton';

type CloseButtonBaseProps = Omit<IconButtonProps, 'icon'>;

const CloseButtonBase = ({ onPress, ...props }: CloseButtonBaseProps) => {
  const { theme } = useTheme();

  return (
    <IconButton
      onPress={onPress}
      icon={<X size={24} color={theme.colors.text} strokeWidth={1} />}
      {...props}
    />
  );
};

export { CloseButtonBase };
