// storage/crypto-images.ts
import { kv } from './mmkv';

export interface CryptoImageData {
  id: string;
  symbol: string;
  image: string;
  updatedAt: number;
}

const CRYPTO_IMAGES_KEY = 'crypto-images';

// Obtener todas las imágenes de criptomonedas
export function getCryptoImages(): CryptoImageData[] {
  const images = kv.get<CryptoImageData[]>(CRYPTO_IMAGES_KEY, []);
  return images;
}

// Obtener imagen de una criptomoneda específica (por ID o símbolo)
export function getCryptoImage(
  cryptoIdOrSymbol: string,
): CryptoImageData | null {
  const images = getCryptoImages();
  // Buscar primero por ID, luego por símbolo (en minúsculas)
  return (
    images.find(
      img =>
        img.id === cryptoIdOrSymbol ||
        img.symbol.toLowerCase() === cryptoIdOrSymbol.toLowerCase(),
    ) || null
  );
}

// Guardar o actualizar imagen de criptomoneda
export function setCryptoImage(data: Omit<CryptoImageData, 'updatedAt'>): void {
  const images = getCryptoImages();
  const existingIndex = images.findIndex(img => img.id === data.id);

  const imageData: CryptoImageData = {
    ...data,
    updatedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    // Actualizar existente
    images[existingIndex] = imageData;
  } else {
    // Agregar nuevo
    images.push(imageData);
  }

  kv.set(CRYPTO_IMAGES_KEY, images);
}

// Guardar múltiples imágenes (útil para batch updates)
export function setCryptoImages(
  cryptoList: Array<{ id: string; symbol: string; image: string }>,
): void {
  const existingImages = getCryptoImages();
  const updatedImages = [...existingImages];
  const now = Date.now();

  cryptoList.forEach(crypto => {
    const existingIndex = updatedImages.findIndex(img => img.id === crypto.id);
    const imageData: CryptoImageData = {
      id: crypto.id,
      symbol: crypto.symbol,
      image: crypto.image,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      // Actualizar existente
      updatedImages[existingIndex] = imageData;
    } else {
      // Agregar nuevo
      updatedImages.push(imageData);
    }
  });

  kv.set(CRYPTO_IMAGES_KEY, updatedImages);
}

// Limpiar imágenes antiguas (opcional, para evitar que crezca mucho)
export function cleanOldCryptoImages(
  maxAgeMs: number = 7 * 24 * 60 * 60 * 1000,
): void {
  const images = getCryptoImages();
  const now = Date.now();
  const filteredImages = images.filter(img => now - img.updatedAt < maxAgeMs);

  if (filteredImages.length !== images.length) {
    kv.set(CRYPTO_IMAGES_KEY, filteredImages);
  }
}

// Limpiar todas las imágenes
export function clearCryptoImages(): void {
  kv.del(CRYPTO_IMAGES_KEY);
}
