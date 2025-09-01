import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  User,
  SignInResponse,
} from '@react-native-google-signin/google-signin';

export interface GoogleAuthResult {
  user: SignInResponse | null;
  error: string | null;
  cancelled: boolean;
}

export class GoogleAuthService {
  static async signIn(): Promise<GoogleAuthResult> {
    try {
      // Verificar si Google Play Services está disponible
      await GoogleSignin.hasPlayServices();

      // Intentar sign in
      const user = await GoogleSignin.signIn();

      return {
        user,
        error: null,
        cancelled: false,
      };
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            return {
              user: null,
              error: null,
              cancelled: true,
            };
          case statusCodes.IN_PROGRESS:
            return {
              user: null,
              error: 'Sign in ya está en progreso. Por favor espera.',
              cancelled: false,
            };
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            return {
              user: null,
              error: 'Google Play Services no está disponible o actualizado.',
              cancelled: false,
            };
          default:
            return {
              user: null,
              error: 'Error desconocido al iniciar sesión con Google.',
              cancelled: false,
            };
        }
      }

      return {
        user: null,
        error: 'Error inesperado al iniciar sesión.',
        cancelled: false,
      };
    }
  }

  static async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {}
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = await GoogleSignin.getCurrentUser();
      return user;
    } catch (error) {
      return null;
    }
  }

  static async isSignedIn(): Promise<boolean> {
    try {
      const user = await GoogleSignin.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }
}
