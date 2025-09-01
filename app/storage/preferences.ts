import { kv } from './mmkv';

export interface UserPreferences {
  locale: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  onboarding: boolean;
  notifications: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  locale: 'en-US',
  currency: 'usd',
  theme: 'system',
  notifications: true,
  onboarding: true,
};

const PREFERENCES_KEY = 'preferences';

const get = () => {
  return kv.get(PREFERENCES_KEY, DEFAULT_PREFERENCES);
};

const set = (updatedPreferences: Partial<UserPreferences>) => {
  const current = get();
  const updated = { ...current, ...updatedPreferences };
  kv.set(PREFERENCES_KEY, updated);
};

const updateLocale = (locale: string) => {
  set({ locale });
};

const updateCurrency = (currency: string) => {
  set({ currency });
};

const updateTheme = (theme: UserPreferences['theme']) => {
  set({ theme });
};

const updateNotifications = (enabled: boolean) => {
  set({ notifications: enabled });
};

const updateOnboarding = (completed: boolean) => {
  set({ onboarding: completed });
};

const reset = () => {
  kv.del(PREFERENCES_KEY);
  set(DEFAULT_PREFERENCES);
};

const getCurrentLocale = (): string => {
  return get().locale;
};

const getCurrentCurrency = (): string => {
  return get().currency;
};

export const initialize = () => {
  if (get() === null) {
    set(DEFAULT_PREFERENCES);
  }
};

export const usePreferences = () => {
  return {
    get: get,
    set: set,
    updateLocale: updateLocale,
    updateCurrency: updateCurrency,
    updateTheme: updateTheme,
    updateNotifications: updateNotifications,
    updateOnboarding: updateOnboarding,
    reset: reset,
    getCurrentLocale: getCurrentLocale,
    getCurrentCurrency: getCurrentCurrency,
  };
};

export const preferences = {
  get,
  set,
  updateLocale,
  updateCurrency,
  updateTheme,
  updateNotifications,
  updateOnboarding,
  reset,
  getCurrentLocale,
  getCurrentCurrency,
};
