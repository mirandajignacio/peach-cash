// features/auth/useGoogleAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  setCurrentUser,
  clearCurrentUser,
  mapGoogleUserToProfile,
} from '../../../storage/user';
import {
  GoogleAuthService,
  GoogleAuthResult,
} from '../services/GoogleAuthService';
import Toast from 'react-native-toast-message';

export const useGoogleAuth = () => {
  const queryClient = useQueryClient();

  const googleSignInMutation = useMutation({
    mutationFn: async () => GoogleAuthService.signIn(),
    onSuccess: (result: GoogleAuthResult) => {
      if (result?.user && !result.error && !result.cancelled) {
        const userProfile = mapGoogleUserToProfile(result.user);
        setCurrentUser(userProfile);
        queryClient.invalidateQueries();
        return;
      }

      if (result?.cancelled) {
        return;
      }
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error inesperado',
        text2: 'No se pudo iniciar sesión. Inténtalo de nuevo.',
      });
    },
  });

  const signOut = async () => {
    try {
      await GoogleAuthService.signOut();
      clearCurrentUser();

      await queryClient.clear();
    } catch (error) {
      console.error('Sign out error:', error);
      clearCurrentUser();
    }
  };

  return {
    signInWithGoogle: googleSignInMutation.mutate,
    signOut,
    isMutationLoading: googleSignInMutation.isPending,
    isError: googleSignInMutation.isError,
    isSuccess: googleSignInMutation.isSuccess,
    data: googleSignInMutation.data,
    error: googleSignInMutation.error,
    reset: googleSignInMutation.reset,
  };
};
