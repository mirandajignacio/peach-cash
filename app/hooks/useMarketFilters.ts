import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import {
  marketFiltersSchema,
  defaultMarketFilters,
  type MarketFiltersForm,
} from '../schemas/market-filters.schema';

interface UseMarketFiltersOptions {
  onFiltersChange?: (
    filters: MarketFiltersForm & { debouncedSearchText: string },
  ) => void;
  debounceDelay?: number;
}

export const useMarketFilters = (options: UseMarketFiltersOptions = {}) => {
  const { onFiltersChange, debounceDelay = 500 } = options;

  // Configurar react-hook-form con Zod
  const {
    control,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(marketFiltersSchema),
    defaultValues: defaultMarketFilters,
    mode: 'onChange', // Validar en tiempo real
  });

  // Observar todos los valores del formulario
  const formValues = watch();

  // Debounce para el texto de búsqueda
  const debouncedSearchText = useDebounce(
    formValues.searchText || '',
    debounceDelay,
  );

  // Crear el objeto de filtros completo con debounced search
  const filters = useMemo(
    () => ({
      ...formValues,
      debouncedSearchText,
    }),
    [formValues, debouncedSearchText],
  );

  // Notificar cambios de filtros
  useEffect(() => {
    if (onFiltersChange && isValid) {
      onFiltersChange(filters);
    }
  }, [filters, isValid, onFiltersChange]);

  // Funciones de utilidad
  const resetFilters = () => {
    reset(defaultMarketFilters);
  };

  const setSearchText = (text: string) => {
    setValue('searchText', text, { shouldValidate: true });
  };

  const setPriceChangeFilter = (
    filter: MarketFiltersForm['priceChangeFilter'],
  ) => {
    setValue('priceChangeFilter', filter, { shouldValidate: true });
  };

  const setOrderFilter = (filter: MarketFiltersForm['orderFilter']) => {
    setValue('orderFilter', filter, { shouldValidate: true });
  };

  const setPage = (page: number) => {
    setValue('page', page, { shouldValidate: true });
  };

  const resetPage = () => {
    setValue('page', 1, { shouldValidate: true });
  };

  // Resetear página cuando cambian otros filtros (excepto página)
  useEffect(() => {
    // Solo resetear página si no estamos en página 1 y otros filtros cambiaron
    if (formValues.page !== 1) {
      setValue('page', 1, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearchText,
    formValues.priceChangeFilter,
    formValues.orderFilter,
  ]);

  return {
    // Control del formulario
    control,
    errors,
    isValid,

    // Valores actuales
    filters,
    formValues,
    debouncedSearchText,

    // Funciones de actualización
    setSearchText,
    setPriceChangeFilter,
    setOrderFilter,
    setPage,
    resetPage,
    resetFilters,

    // Valores individuales para fácil acceso
    searchText: formValues.searchText || '',
    priceChangeFilter: formValues.priceChangeFilter,
    orderFilter: formValues.orderFilter,
    page: formValues.page,
    perPage: formValues.perPage,

    // Utilidades
    getValues,
    setValue,
  };
};
