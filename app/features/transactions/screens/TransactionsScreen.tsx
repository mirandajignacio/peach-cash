import { useNavigation } from '@react-navigation/native';
import { BackButtonBase } from '../../../components/BackButtonBase';
import { HeaderScreenBase } from '../../../components/HeaderScreenBase';
import { ScreenView } from '../../../components/ScreenView';
import { ScreenContent } from '../../../components/ScreenContent';
import { Typography } from '../../../components/Typography';
import { AnimatedFlashList } from '@shopify/flash-list';
import { useTransactions } from '../hooks/use-transactions';
import { QueryRender } from '../../../components/QueryRender';

const TransactionsScreen = () => {
  const navigation = useNavigation();

  const { transactionsQuery } = useTransactions();
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScreenView>
      <HeaderScreenBase>
        <BackButtonBase onPress={handleBackPress} />
      </HeaderScreenBase>

      <ScreenContent>
        <Typography variant="h1">Transactions</Typography>
        <QueryRender
          query={transactionsQuery}
          onData={data => (
            <AnimatedFlashList
              data={data}
              renderItem={({ item }) => (
                <Typography variant="h1">{item.name}</Typography>
              )}
            />
          )}
          onLoading={() => <>{`...`} </>}
          onError={() => <>{`...`} </>}
        />
      </ScreenContent>
    </ScreenView>
  );
};

export { TransactionsScreen };
