import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param value - Valor a hacer debounce
 * @param delay - Delay en milisegundos
 * @returns Valor con debounce aplicado
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
