import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Coins,
  ScanQrCode,
  ArrowRightLeft,
  Wallet,
  LayoutDashboard,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { CryptoScreen } from '../screens/CryptoScreen';
import { ExchangeScreen } from '../screens/ExchangeScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { WalletsScreen } from '../screens/WalletsScreen';

type MainTabParamList = {
  Home: undefined;
  Crypto: undefined;
  Scanner: undefined;
  Wallets: undefined;
  Exchange: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const DashboardIcon = ({ color, size }: { color: string; size: number }) => (
  <LayoutDashboard color={color} size={size} strokeWidth={1.5} />
);

const MarketIcon = ({ color, size }: { color: string; size: number }) => (
  <Coins color={color} size={size} strokeWidth={1.5} />
);

const ScannerIcon = ({ color, size }: { color: string; size: number }) => (
  <ScanQrCode color={color} size={size} strokeWidth={1.5} />
);

const ExchangeIcon = ({ color, size }: { color: string; size: number }) => (
  <ArrowRightLeft color={color} size={size} strokeWidth={1.5} />
);

const WalletsIcon = ({ color, size }: { color: string; size: number }) => (
  <Wallet color={color} size={size} strokeWidth={1.5} />
);

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={() => {
        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            height: 100,
            paddingTop: 12,
            paddingHorizontal: theme.spacing.sm,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 6,
            marginBottom: 0,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },

          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tab.Screen
        name="Crypto"
        component={CryptoScreen}
        options={{
          title: 'Crypto',
          tabBarIcon: MarketIcon,
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          title: 'Scanner',
          tabBarIcon: ScannerIcon,
        }}
      />
      <Tab.Screen
        name="Wallets"
        component={WalletsScreen}
        options={{
          title: 'Wallets',
          tabBarIcon: WalletsIcon,
        }}
      />
      <Tab.Screen
        name="Exchange"
        component={ExchangeScreen}
        options={{
          title: 'Exchange',
          tabBarIcon: ExchangeIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export { AppNavigator, type MainTabParamList };
