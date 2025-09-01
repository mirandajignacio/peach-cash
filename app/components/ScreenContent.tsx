import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ScreenContent = ({ children, style }: Props) => {
  return <View style={[ScreenContentStyles.container, style]}>{children}</View>;
};

const ScreenContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export { ScreenContent };
