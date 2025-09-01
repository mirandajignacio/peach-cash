import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV({
  id: 'peach-cash',
  encryptionKey: 'peach-cash-secure-key',
});

export const kv = {
  get<T>(key: string, fallback: T): T {
    const raw = mmkv.getString(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    mmkv.set(key, JSON.stringify(value));
  },
  del(key: string) {
    mmkv.delete(key);
  },
  has(key: string) {
    return mmkv.contains(key);
  },
  keys() {
    return mmkv.getAllKeys();
  },
};
