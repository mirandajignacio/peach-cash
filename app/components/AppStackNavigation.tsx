import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigator } from './AppNavigator';
import { AccountScreen } from '../features/account/screens/AccountScreen';
import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';
import { CryptoDetailScreen } from '../features/crypto/screens/CryptoDetailScreen';
import {
  ExchangeResultScreen,
  ExchangeResultParams,
} from '../features/exchange/screens/ExchangeResultScreen';
import { ExchangeFromScreen } from '../features/exchange/screens/ExchangeFromScreen';
import { ExchangeToScreen } from '../features/exchange/screens/ExchangeToScreen';

import { WalletScreen } from '../features/wallets/sceens/WalletScreen';
import { SearchCryptoScreen } from '../features/crypto/screens/SearchCryptoScreen';
import { DeveloperToolsScreen } from '../tools/screens/DeveloperToolsScreen';

type AppStackParamList = {
  MainTabs: undefined;

  // Account
  Account: undefined;
  SettingsAccount: undefined;

  // Notifications
  Notifications: undefined;
  SettingsNotifications: undefined;

  // Crypto
  CryptoDetail: { id: string };
  SearchCrypto: undefined;

  // Exchange
  ExchangeResult: ExchangeResultParams;
  ExchangeFrom: undefined;
  ExchangeTo: undefined;

  // Scanner
  ScanQr: undefined;
  GenerateQr: undefined;
  Wallet: { address: string; coin: string };

  // Developer Tools
  DeveloperTools: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={AppNavigator} />

      {/* Home secondary screens */}
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      {/* Market secondary screens */}
      <Stack.Screen name="CryptoDetail" component={CryptoDetailScreen} />
      <Stack.Screen name="SearchCrypto" component={SearchCryptoScreen} />
      {/* Exchange secondary screens */}
      <Stack.Screen
        name="ExchangeResult"
        component={ExchangeResultScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="ExchangeFrom" component={ExchangeFromScreen} />
      <Stack.Screen name="ExchangeTo" component={ExchangeToScreen} />

      {/* Scanner secondary screens */}
      <Stack.Screen name="Wallet" component={WalletScreen} />

      {/* Developer Tools secondary screens */}
      <Stack.Screen name="DeveloperTools" component={DeveloperToolsScreen} />
    </Stack.Navigator>
  );
};

export { AppStackNavigation, type AppStackParamList };
