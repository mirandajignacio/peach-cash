import { StyleSheet, View } from 'react-native';
import { ButtonIcon } from '../../../../components/Button/ButtonIcon';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../../../theme';

const PaginationButtonsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  nextPageButton: {
    marginLeft: 'auto',
  },
  previousPageButton: {
    marginRight: 'auto',
  },
});

type CryptoListPaginationProps = {
  currentPage: number;
  onPressPreviousPage: () => void;
  onPressNextPage: () => void;
  hasMoreData: boolean;
};

const CryptoListPagination = ({
  currentPage,
  onPressPreviousPage,
  onPressNextPage,
  hasMoreData,
}: CryptoListPaginationProps) => {
  const { theme } = useTheme();

  return (
    <View style={PaginationButtonsStyles.container}>
      {currentPage > 1 ? (
        <ButtonIcon
          onPress={onPressPreviousPage}
          icon={<ArrowLeft size={40} color={theme.colors.primary} />}
          style={PaginationButtonsStyles.previousPageButton}
        />
      ) : null}
      {hasMoreData ? (
        <ButtonIcon
          onPress={onPressNextPage}
          icon={<ArrowRight size={40} color={theme.colors.primary} />}
          style={PaginationButtonsStyles.nextPageButton}
        />
      ) : null}
    </View>
  );
};

export { CryptoListPagination };
