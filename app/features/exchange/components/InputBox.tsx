import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Theme, useTheme } from '../../../theme';
import { TextInput } from 'react-native-gesture-handler';
import { useExchangeStore } from '../stores/exchangeStore';
import { exchangeService } from '../../../services/exchangee-service';
import { ExchangeModeOptios } from '../stores/exchangeStore';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../../components/AppStackNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { BalanceIndicator } from './BalanceIndicator';
import { AssetButtonChip } from './AssetButtonChip';
import { MaxButtonChip } from './MaxButtonChip';

type ExchangeFromScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ExchangeFrom'
>;

export const InputBox = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ExchangeFromScreenNavigationProp>();
  const { from, mode, to, setRate, setAmount, amount } = useExchangeStore();

  const styles = InputBoxStyles(theme);

  const onHandleAmountChange = (text: string) => {
    setAmount(Number(text));
  };

  const onPressAssest = () => {
    navigation.navigate('ExchangeFrom');
  };

  useEffect(() => {
    const calculateRate = async () => {
      const crypto =
        mode === ExchangeModeOptios.FIAT_TO_CRYPTO ? to.id : from.id;
      const fiat = mode === ExchangeModeOptios.FIAT_TO_CRYPTO ? from.id : to.id;
      try {
        const rate = await exchangeService.getExchangeRate(mode, crypto, fiat);
        setRate(rate);
      } catch {
        // workaround to avoid CoinGecko rate error
        setRate(0.000009);
      }
    };

    calculateRate();
  }, [from, mode, to, setRate]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="caption">Vas a cambiar {from.name} </Typography>
        <AssetButtonChip
          label={from.name.toUpperCase()}
          onPress={onPressAssest}
        />
      </View>

      {/* <View style={styles.amountContainer}> */}
      <TextInput
        style={styles.input}
        placeholder={'0.00'}
        placeholderTextColor="#FF3D4040"
        returnKeyLabel="done"
        returnKeyType="done"
        textAlign="right"
        autoFocus={true}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        value={amount.toString()}
        showSoftInputOnFocus={false}
        inputMode="decimal"
        keyboardType="numbers-and-punctuation"
        onChangeText={onHandleAmountChange}
        submitBehavior="blurAndSubmit"
      />
      {/* </View> */}

      <View style={styles.footer}>
        <BalanceIndicator />
        <MaxButtonChip />
      </View>
    </View>
  );
};

const InputBoxStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.spacing.md,
      width: '100%',
      gap: theme.spacing.md,
    },
    input: {
      color: theme.colors.primary,
      fontSize: 48,
      fontWeight: 'bold',
      fontFamily: theme.typography.spaceGrotesk.bold,
      textAlign: 'left',
      padding: 0,
      margin: 0,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
  });
