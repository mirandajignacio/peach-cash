import { StyleSheet, View } from 'react-native';
import { Typography } from '../../../../components/Typography';
import { CryptoItem } from './CryptoListItem';
import { ICrypto } from '../../../../services/crypto-service';
import { Theme, useTheme } from '../../../../theme';
import { AnimatedFlashList } from '../../../../components/AnimatedFlashList';

const CryptoListListStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
      flex: 1,
      minHeight: 400,
      paddingHorizontal: theme.spacing.md,
    },
    endMessage: {
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    loadingText: {
      textAlign: 'center',
    },
  });

const CryptoListList = ({
  data,
  onPressCryptoCard,
}: {
  data: ICrypto[];
  onPressCryptoCard: (crypto: ICrypto) => void;
}) => {
  const { theme } = useTheme();
  const styles = CryptoListListStyles(theme);
  return data.length > 0 ? (
    <AnimatedFlashList
      data={data}
      renderItem={(item, index) => (
        <CryptoItem
          key={item.id}
          crypto={item}
          onPress={onPressCryptoCard}
          index={index}
        />
      )}
      style={styles.container}
      scrollEnabled={false}
    />
  ) : (
    <View style={styles.endMessage}>
      <Typography variant="caption" style={styles.loadingText}>
        No hay criptomonedas disponibles para mostrar.
      </Typography>
    </View>
  );
};

export { CryptoListList };
