import { preferences } from '../storage/preferences';

export interface NumberFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  currencyDisplay?: 'symbol' | 'code' | 'name';
}

export interface CurrencyFormatOptions extends NumberFormatOptions {
  showSymbol?: boolean;
  showCode?: boolean;
  compact?: boolean;
}

export const numberFormatter = {
  /**
   * Format a number according to user's locale preferences
   */
  format(value: number, options: NumberFormatOptions = {}): string {
    const userLocale = preferences.getCurrentLocale();
    const {
      minimumFractionDigits = 0,
      maximumFractionDigits = 8,
      useGrouping = true,
      style = 'decimal',
      currency = preferences.getCurrentCurrency(),
      currencyDisplay = 'symbol',
    } = options;

    const formatOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
      style,
    };

    if (style === 'currency') {
      formatOptions.currency = currency;
      formatOptions.currencyDisplay = currencyDisplay;
    }

    return new Intl.NumberFormat(userLocale, formatOptions).format(value);
  },

  /**
   * Format a number as currency
   */
  formatCurrency(value: number, options: CurrencyFormatOptions = {}): string {
    const {
      currency = preferences.get().currency,
      showSymbol = true,
      showCode = false,
      compact = false,
      minimumFractionDigits = 2,
      maximumFractionDigits = 8,
    } = options;

    if (compact && value >= 1000) {
      return this.formatCompactCurrency(value, currency, showSymbol, showCode);
    }

    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
      currencyDisplay: showSymbol ? 'symbol' : 'code',
    };

    const userLocale = preferences.get().locale;
    return new Intl.NumberFormat(userLocale, formatOptions).format(value);
  },

  /**
   * Format large numbers in compact form (1K, 1M, 1B)
   */
  formatCompact(value: number, decimals: number = 1): string {
    const userLocale = preferences.get().locale;

    if (value >= 1e9) {
      return new Intl.NumberFormat(userLocale, {
        notation: 'compact',
        maximumFractionDigits: decimals,
      }).format(value);
    }

    if (value >= 1e6) {
      return new Intl.NumberFormat(userLocale, {
        notation: 'compact',
        maximumFractionDigits: decimals,
      }).format(value);
    }

    if (value >= 1e3) {
      return new Intl.NumberFormat(userLocale, {
        notation: 'compact',
        maximumFractionDigits: decimals,
      }).format(value);
    }

    return this.format(value, { maximumFractionDigits: decimals });
  },

  /**
   * Format currency in compact form
   */
  formatCompactCurrency(
    value: number,
    currency: string,
    showSymbol: boolean,
    showCode: boolean,
  ): string {
    const userLocale = preferences.get().locale;
    const compactNumber = new Intl.NumberFormat(userLocale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

    if (showSymbol && showCode) {
      return `${compactNumber} ${currency}`;
    } else if (showSymbol) {
      return compactNumber;
    } else if (showCode) {
      return `${compactNumber} ${currency}`;
    }

    return compactNumber;
  },

  /**
   * Format crypto amounts with appropriate decimal places
   */
  formatCryptoAmount(
    value: number,
    symbol?: string,
    options: NumberFormatOptions = {},
  ): string {
    let minimumFractionDigits = 8;
    let maximumFractionDigits = 8;

    const formattedNumber = this.format(value, {
      minimumFractionDigits,
      maximumFractionDigits,
      ...options,
    });

    return `${formattedNumber}${symbol ? ` ${symbol}` : ''}`;
  },

  /**
   * Format fiat amounts (USD, EUR, etc.)
   */
  formatFiatAmount(
    value: number,
    currency: string = preferences.get().currency,
    options: NumberFormatOptions = {},
  ): string {
    const formattedNumber = this.formatCurrency(value, {
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    });

    return formattedNumber;
  },

  /**
   * Format percentage values
   */
  formatPercentage(value: number, options: NumberFormatOptions = {}): string {
    return this.format(value, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    });
  },

  /**
   * Get current user currency
   */
  getCurrentCurrency(): string {
    return preferences.get().currency;
  },

  /**
   * Get current user locale
   */
  getCurrentLocale(): string {
    return preferences.get().locale;
  },

  /**
   * Check if current locale uses comma as decimal separator
   */
  usesCommaAsDecimal(): boolean {
    const userLocale = preferences.get().locale;
    return (
      userLocale.startsWith('es') ||
      userLocale.startsWith('fr') ||
      userLocale.startsWith('de')
    );
  },

  /**
   * Parse a formatted number string back to number
   */
  parse(value: string): number {
    const groupSeparator = this.usesCommaAsDecimal() ? '.' : ',';
    const decimalSeparator = this.usesCommaAsDecimal() ? ',' : '.';

    // Remove currency symbols and group separators, replace decimal separator
    const cleanValue = value
      .replace(/[^\d.,-]/g, '') // Remove non-numeric chars except . , -
      .replace(new RegExp(`\\${groupSeparator}`, 'g'), '') // Remove group separators
      .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.'); // Replace decimal separator with .

    return parseFloat(cleanValue) || 0;
  },
};

// Convenience functions for common use cases
export const formatNumber = (value: number, options?: NumberFormatOptions) =>
  numberFormatter.format(value, options);

export const formatCurrency = (
  value: number,
  options?: CurrencyFormatOptions,
) => numberFormatter.formatCurrency(value, options);

export const formatCryptoAmount = (
  value: number,
  symbol?: string,
  options?: NumberFormatOptions,
) => numberFormatter.formatCryptoAmount(value, symbol, options);

export const formatFiatAmount = (
  value: number,
  currency?: string,
  options?: NumberFormatOptions,
) => numberFormatter.formatFiatAmount(value, currency, options);

export const formatPercentage = (
  value: number,
  options?: NumberFormatOptions,
) => numberFormatter.formatPercentage(value, options);

export const formatCompact = (value: number, decimals?: number) =>
  numberFormatter.formatCompact(value, decimals);

export const parseNumber = (value: string) => numberFormatter.parse(value);
