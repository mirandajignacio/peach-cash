import { z } from 'zod';

// Definir los tipos válidos para los filtros
export const priceChangeFilterSchema = z.enum(['1h', '24h', '7d', '30d']);

export const orderFilterSchema = z.enum([
  'market_cap_desc',
  'market_cap_asc',
  'volume_desc',
  'volume_asc',
  'price_desc',
  'price_asc',
]);

// Schema principal para los filtros del mercado
export const marketFiltersSchema = z.object({
  searchText: z
    .string()
    .min(0, 'El texto de búsqueda no puede ser negativo')
    .max(100, 'El texto de búsqueda no puede exceder 100 caracteres'),

  priceChangeFilter: priceChangeFilterSchema,

  orderFilter: orderFilterSchema,

  page: z
    .number()
    .int('La página debe ser un número entero')
    .min(1, 'La página debe ser mayor a 0'),

  perPage: z
    .number()
    .int('Los elementos por página deben ser un número entero')
    .min(1, 'Debe mostrar al menos 1 elemento por página')
    .max(250, 'No se pueden mostrar más de 250 elementos por página'),
});

// Tipos TypeScript derivados del schema
export type PriceChangeFilter = z.infer<typeof priceChangeFilterSchema>;
export type OrderFilter = z.infer<typeof orderFilterSchema>;
export type MarketFiltersForm = z.infer<typeof marketFiltersSchema>;

// Valores por defecto
export const defaultMarketFilters: MarketFiltersForm = {
  searchText: '',
  priceChangeFilter: '24h',
  orderFilter: 'market_cap_desc',
  page: 1,
  perPage: 10,
};

// Opciones para los filtros (para UI)
export const priceChangeOptions: { value: PriceChangeFilter; label: string }[] =
  [
    { value: '1h', label: '1h' },
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
  ];

export const orderOptions: { value: OrderFilter; label: string }[] = [
  { value: 'market_cap_desc', label: 'Market Cap ↓' },
  { value: 'market_cap_asc', label: 'Market Cap ↑' },
  { value: 'volume_desc', label: 'Volume ↓' },
  { value: 'volume_asc', label: 'Volume ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'price_asc', label: 'Price ↑' },
];
