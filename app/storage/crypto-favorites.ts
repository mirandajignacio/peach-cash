import { kv } from './mmkv';

function keyFavs() {
  return `crypto_favorites`;
}

export function getFavorites(): string[] {
  return kv.get<string[]>(keyFavs(), []);
}

export function isFavorite(id: string) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string) {
  const set = new Set(getFavorites());
  set.has(id) ? set.delete(id) : set.add(id);
  kv.set(keyFavs(), Array.from(set));
}

export function clearFavorites() {
  kv.del(keyFavs());
}
