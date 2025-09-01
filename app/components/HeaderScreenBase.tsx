import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BackButtonBase } from './BackButtonBase';
import { useNavigation } from '@react-navigation/native';
import { Typography } from './Typography';

type Props = {
  children?: React.ReactNode;
  backButton?: boolean;
  title?: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
};

const HeaderScreenBaseStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
  },
});

const HeaderScreenBase = ({
  children = null,
  style,
  title,
  subtitle,
  backButton,
}: Props) => {
  const navigation = useNavigation();

  const onPressBack = () => {
    if (backButton) {
      navigation.goBack();
    }
  };

  return (
    <View style={[HeaderScreenBaseStyles.container, style]}>
      {backButton && <BackButtonBase onPress={onPressBack} />}
      {title || subtitle ? (
        <View>
          {title && <Typography variant="h6">{title}</Typography>}
          {subtitle && (
            <Typography variant="subtitle2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </View>
      ) : null}
      {children}
    </View>
  );
};

export { HeaderScreenBase };
