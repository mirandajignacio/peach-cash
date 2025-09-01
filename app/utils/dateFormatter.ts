import { preferences } from '../storage/preferences';

export interface DateFormatOptions {
  includeTime?: boolean;
  includeYear?: boolean;
  short?: boolean;
  relative?: boolean;
}

export const dateFormatter = {
  /**
   * Format a timestamp to a localized date string
   */
  format(
    timestamp: number | string | Date,
    options: DateFormatOptions = {},
  ): string {
    const date = new Date(timestamp);
    const userLocale = preferences.get().locale;

    const {
      includeTime = true,
      includeYear = true,
      short = false,
      relative = false,
    } = options;

    if (relative) {
      return this.formatRelative(date);
    }

    if (short) {
      return this.formatShort(date, userLocale, includeTime);
    }

    return this.formatFull(date, userLocale, includeTime, includeYear);
  },

  /**
   * Format date in short format (e.g., "15 Mar" or "15 Mar 15:30")
   */
  formatShort(date: Date, locale: string, includeTime: boolean): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return date.toLocaleDateString(locale, options);
  },

  /**
   * Format date in full format (e.g., "15 de marzo de 2024 a las 15:30")
   */
  formatFull(
    date: Date,
    locale: string,
    includeTime: boolean,
    includeYear: boolean,
  ): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
    };

    if (includeYear) {
      options.year = 'numeric';
    }

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return date.toLocaleDateString(locale, options);
  },

  /**
   * Format date in relative format (e.g., "hace 2 horas", "ayer", "hoy")
   */
  formatRelative(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const userLocale = preferences.get().locale;
    const isSpanish = userLocale.startsWith('es');

    if (diffInMinutes < 1) {
      return isSpanish ? 'ahora mismo' : 'just now';
    }

    if (diffInMinutes < 60) {
      if (diffInMinutes === 1) {
        return isSpanish ? 'hace 1 minuto' : '1 minute ago';
      }
      return isSpanish
        ? `hace ${diffInMinutes} minutos`
        : `${diffInMinutes} minutes ago`;
    }

    if (diffInHours < 24) {
      if (diffInHours === 1) {
        return isSpanish ? 'hace 1 hora' : '1 hour ago';
      }
      return isSpanish
        ? `hace ${diffInHours} horas`
        : `${diffInHours} hours ago`;
    }

    if (diffInDays === 1) {
      return isSpanish ? 'ayer' : 'yesterday';
    }

    if (diffInDays < 7) {
      return isSpanish ? `hace ${diffInDays} días` : `${diffInDays} days ago`;
    }

    // For older dates, use the short format
    return this.formatShort(date, userLocale, false);
  },

  /**
   * Format date for transactions (compact format)
   */
  formatTransaction(timestamp: number | string | Date): string {
    return this.format(timestamp, { short: true, includeTime: true });
  },

  /**
   * Format date for wallet scanning (DD/MM/YY HH:MM format)
   */
  formatWalletScan(timestamp: number | string | Date): string {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  },

  /**
   * Format date for crypto details (short format without time)
   */
  formatCryptoDetail(timestamp: number | string | Date): string {
    return this.format(timestamp, { short: true, includeTime: false });
  },

  /**
   * Get current user locale
   */
  getCurrentLocale(): string {
    return preferences.get().locale;
  },

  /**
   * Check if current locale is Spanish
   */
  isSpanish(): boolean {
    return this.getCurrentLocale().startsWith('es');
  },
};

// Convenience functions for common use cases
export const formatDate = (
  timestamp: number | string | Date,
  options?: DateFormatOptions,
) => dateFormatter.format(timestamp, options);

export const formatTransactionDate = (timestamp: number | string | Date) =>
  dateFormatter.formatTransaction(timestamp);

export const formatWalletScanDate = (timestamp: number | string | Date) =>
  dateFormatter.formatWalletScan(timestamp);

export const formatCryptoDetailDate = (timestamp: number | string | Date) =>
  dateFormatter.formatCryptoDetail(timestamp);
