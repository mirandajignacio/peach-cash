import { z } from 'zod';

// Schema para market_data que coincide con el componente Graphs
export const MarketDataSchema = z.object({
  current_price: z.record(z.string(), z.number()),
  high_24h: z.record(z.string(), z.number()),
  low_24h: z.record(z.string(), z.number()),
  ath: z.record(z.string(), z.number()),
  ath_change_percentage: z.record(z.string(), z.number()),
  ath_date: z.record(z.string(), z.string()).optional(),
  fully_diluted_valuation: z.record(z.string(), z.number()).optional(),
  market_cap: z.record(z.string(), z.number()),
  total_volume: z.record(z.string(), z.number()),
  circulating_supply: z.number().optional(),
  max_supply: z.number().nullable().optional(),
  max_supply_infinite: z.boolean().optional(),
  price_change_percentage_1h_in_currency: z
    .record(z.string(), z.number())
    .optional(),
  price_change_percentage_24h_in_currency: z
    .record(z.string(), z.number())
    .optional(),
  price_change_percentage_7d_in_currency: z
    .record(z.string(), z.number())
    .optional(),
  price_change_percentage_30d_in_currency: z
    .record(z.string(), z.number())
    .optional(),
  price_change_percentage_1y_in_currency: z
    .record(z.string(), z.number())
    .optional(),
});

// Schema para ROI
export const ROISchema = z
  .object({
    times: z.number(),
    currency: z.string(),
    percentage: z.number(),
  })
  .nullable();

// Schema principal para el detalle de crypto
export const CryptoDetailSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  description: z.record(z.string(), z.string()).optional(),
  image: z
    .object({
      thumb: z.string().optional(),
      small: z.string().optional(),
      large: z.string().optional(),
    })
    .optional(),
  market_data: MarketDataSchema.optional(),
  sentiment_votes_up_percentage: z.number().optional(),
  sentiment_votes_down_percentage: z.number().optional(),
  market_cap_rank: z.number().optional(),
  coingecko_rank: z.number().optional(),
  coingecko_score: z.number().optional(),
  developer_score: z.number().optional(),
  community_score: z.number().optional(),
  liquidity_score: z.number().optional(),
  public_interest_score: z.number().optional(),
  status_updates: z.array(z.any()).optional(),
  last_updated: z.string().optional(),
});

export type CryptoDetail = z.infer<typeof CryptoDetailSchema>;
