import { StyleSheet, TouchableOpacity } from 'react-native';

import { View } from 'react-native';
import { Typography } from '../../../components/Typography';
import { ChevronDown } from 'lucide-react-native';
import { Theme, useTheme } from '../../../theme';

export type AssetButtonChipProps = {
  label: string;
  onPress: () => void;
};

const AssetButtonChipStyles = (theme: Theme) =>
  StyleSheet.create({
    currencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      alignSelf: 'flex-start',
      textTransform: 'uppercase',
      gap: 4,
    },
    currencySymbol: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    amountContainer: {
      marginBottom: 12,
    },
  });

const AssetButtonChip = ({ label, onPress }: AssetButtonChipProps) => {
  const { theme } = useTheme();
  const styles = AssetButtonChipStyles(theme);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.currencyButton}>
        <Typography variant="body1" style={styles.currencySymbol}>
          {label}
        </Typography>
        <ChevronDown size={12} color={theme.colors.text} strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
};

export { AssetButtonChip };
