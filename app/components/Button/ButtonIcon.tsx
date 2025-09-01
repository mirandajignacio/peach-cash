import { Button, ButtonProps } from '.';
import { useTheme } from '../../theme';

interface ButtonIconProps
  extends Omit<
    Extract<ButtonProps, { touchableType: 'pressable' }>,
    'children' | 'touchableType'
  > {
  onPress: () => void;
  icon: React.ReactNode;
}
const ButtonIcon = ({ onPress, icon, ...props }: ButtonIconProps) => {
  const { theme } = useTheme();

  return (
    <Button
      onPress={onPress}
      variant="text"
      touchableType="pressable"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.xs,
        minWidth: undefined, // Remueve el ancho mínimo
      }}
      {...props}
    >
      {icon}
    </Button>
  );
};

export { ButtonIcon };
