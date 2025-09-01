import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppStackNavigation } from './AppStackNavigation';
import { LoadingScreen } from './LoadingScreen';
import { GoogleAuthService } from '../features/auth/services/GoogleAuthService';
import {
  getUser,
  mapCurrentUserToProfile,
  setCurrentUser,
} from '../storage/user';
import { mmkv } from '../storage/mmkv';
import { initializeDefaultBalances } from '../storage/balance-storage';
import { initializeDefaultAssets } from '../storage/assets-storage';

type RootStackParamList = {
  Loading: undefined;
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // Verify if there is a user in MMKV storage
        let storedUser = getUser();

        // If there is no user in storage, verify Google Sign In
        if (!storedUser) {
          const googleUser = await GoogleAuthService.getCurrentUser();

          if (googleUser) {
            // Sync: save Google user to MMKV
            storedUser = mapCurrentUserToProfile(googleUser);
            setCurrentUser(storedUser);
          }
        }

        setIsAuthenticated(!!storedUser);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const listener = mmkv.addOnValueChangedListener((key: string) => {
      if (key === `user`) {
        const currentUser = getUser();
        setIsAuthenticated(!!currentUser);
      }
    });

    initializeDefaultAssets();
    initializeDefaultBalances();

    return () => {
      listener.remove();
    };
  }, []);

  // Todo: Agregar Onboarding Screen
  // Todo: Cambiar el nombre de IsLoading a algo mas descriptivo
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      ) : isAuthenticated ? (
        <Stack.Screen name="App" component={AppStackNavigation} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};
