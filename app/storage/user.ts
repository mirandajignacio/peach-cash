import {
  SignInResponse,
  User,
} from '@react-native-google-signin/google-signin';
import { kv } from './mmkv';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  photo?: string;
  givenName?: string;
  familyName?: string;
  nickname?: string;
};

export function setCurrentUser(user: UserProfile) {
  kv.set(`user`, user);
}

export function getUser() {
  return kv.get<UserProfile | null>(`user`, null);
}

export function clearCurrentUser() {
  kv.del(`user`);
}

export const mapGoogleUserToProfile = (
  googleUser: SignInResponse,
): UserProfile => {
  if (!googleUser.data?.user) {
    throw new Error('Invalid Google user data');
  }

  return {
    id: googleUser.data.user.id,
    name: googleUser.data.user.name || '',
    email: googleUser.data.user.email,
    photo: googleUser.data.user.photo || undefined,
    givenName: googleUser.data.user.givenName || undefined,
    familyName: googleUser.data.user.familyName || undefined,
  };
};

// Todo: Chequear si tiene sentido esto, un Google User deberia mapearse a Profile, y lo hace `mapGoogleUserToProfile`
export const mapCurrentUserToProfile = (googleUser: User): UserProfile => {
  return {
    id: googleUser.user.id,
    name: googleUser.user.name || '',
    email: googleUser.user.email,
    photo: googleUser.user.photo || undefined,
    givenName: googleUser.user.givenName || undefined,
    familyName: googleUser.user.familyName || undefined,
  };
};
