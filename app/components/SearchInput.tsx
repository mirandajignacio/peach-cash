import { StyleSheet, TextInput, View } from 'react-native';
import { Theme, useTheme } from '../theme';
import { SearchIcon } from 'lucide-react-native';

const SearchInputStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 10,
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      marginLeft: 8,
      fontSize: 24,
      fontFamily: 'IBMPlexSans-Regular',
      padding: 8,
    },
    error: {
      borderColor: '#ff4444',
      borderWidth: 1,
    },
    errorText: {
      color: '#ff4444',
      marginTop: 4,
      marginLeft: 12,
    },
  });

type SearchInputProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  filterErrors: { searchText: string };
  placeholder: string;
  autoFocus?: boolean;
};

const SearchInput = ({
  searchText,
  setSearchText,
  filterErrors,
  placeholder,
  autoFocus = true,
}: SearchInputProps) => {
  const { theme } = useTheme();
  const styles = SearchInputStyles(theme);

  return (
    <View style={styles.container}>
      <SearchIcon size={20} color={theme.colors.textSecondary} />
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text },
          filterErrors.searchText && styles.error,
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={searchText}
        onChangeText={setSearchText}
        autoFocus={autoFocus}
      />
    </View>
  );
};

export { SearchInput };
export type { SearchInputProps };
