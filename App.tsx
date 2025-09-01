import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { MMKV } from 'react-native-mmkv';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ThemeProvider, useTheme } from './app/theme';
import { RootStack } from './app/components/RootStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppToast } from './app/components/AppToast';

GoogleSignin.configure({
  webClientId:
    '530705736214-c80a8lhciqro7snn84au931hhs762fp4.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId:
    '530705736214-2go7kktdr18on8cfp0kskk9tijvvv5l7.apps.googleusercontent.com',
});

const mmkv = new MMKV({ id: 'rq-cache' });
const mmkvAsync = {
  getItem: async (key: string) => mmkv.getString(key) ?? null,
  setItem: async (key: string, value: string) => {
    mmkv.set(key, value);
  },
  removeItem: async (key: string) => {
    mmkv.delete(key);
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error instanceof TypeError &&
          (error.message.includes('Network request failed') ||
            error.message.includes('fetch'))
        ) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: { retry: 1 },
  },
});

const persister = createAsyncStoragePersister({
  storage: mmkvAsync,
  key: 'rq-cache',
  throttleTime: 1000,
});

function SafeAreaWrapper() {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.statusBarBackground,
          {
            height: safeAreaInsets.top,
            backgroundColor: theme.colors.background,
          },
        ]}
      />
      <GestureHandlerRootView
        style={[
          styles.content,
          {
            paddingLeft: safeAreaInsets.left,
            paddingRight: safeAreaInsets.right,
          },
        ]}
      >
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </GestureHandlerRootView>
    </View>
  );
}

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 }}
    >
      <ThemeProvider forceDarkMode={true}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <SafeAreaWrapper />
          <AppToast />
        </SafeAreaProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBarBackground: {},
  content: { flex: 1 },
});

export default App;
