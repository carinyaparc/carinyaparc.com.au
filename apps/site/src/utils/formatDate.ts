/**
 * Configuration options for date formatting
 */
export interface DateFormatOptions {
  /** Locale to use for formatting (defaults to 'en-AU' for Australian format) */
  locale?: string;
  /** Year format: 'numeric' (2024) or '2-digit' (24) */
  year?: 'numeric' | '2-digit';
  /** Month format: 'numeric' (1), '2-digit' (01), 'long' (January), 'short' (Jan), 'narrow' (J) */
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  /** Day format: 'numeric' (1) or '2-digit' (01) */
  day?: 'numeric' | '2-digit';
  /** Include weekday in output */
  weekday?: 'long' | 'short' | 'narrow';
}

/**
 * Result of date formatting operation
 */
export interface FormatDateResult {
  /** Whether the formatting was successful */
  success: boolean;
  /** Formatted date string (only present if success is true) */
  formatted?: string;
  /** Error message (only present if success is false) */
  error?: string;
  /** The original Date object (only present if success is true) */
  date?: Date;
}

/**
 * Safely formats a date string or Date object using Intl.DateTimeFormat
 *
 * @param dateInput - The date string, Date object, or timestamp to format
 * @param options - Formatting options (defaults to Australian long format)
 * @returns Formatted date string
 * @throws {Error} If the date is invalid or formatting fails
 *
 * @example
 * ```typescript
 * // Basic usage (Australian format)
 * formatDate('2024-01-15'); // "15 January 2024"
 * formatDate(new Date(2024, 0, 15)); // "15 January 2024"
 *
 * // Custom formatting
 * formatDate('2024-01-15', {
 *   locale: 'en-US',
 *   month: 'short'
 * }); // "Jan 15, 2024"
 *
 * // With weekday
 * formatDate('2024-01-15', {
 *   weekday: 'long'
 * }); // "Monday, 15 January 2024"
 * ```
 */
export function formatDate(
  dateInput: string | Date | number,
  options: DateFormatOptions = {},
): string {
  // Input validation
  if (dateInput == null) {
    throw new Error('Date input cannot be null or undefined');
  }

  let date: Date;

  try {
    // Handle different input types
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    } else if (typeof dateInput === 'string') {
      // Handle empty strings
      if (dateInput.trim() === '') {
        throw new Error('Date string cannot be empty');
      }
      date = new Date(dateInput);
    } else {
      throw new Error(`Invalid date input type: ${typeof dateInput}`);
    }

    // Check if the resulting date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${dateInput}`);
    }

    // Default options for Australian format
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: options.year || 'numeric',
      month: options.month || 'long',
      day: options.day || 'numeric',
      ...(options.weekday && { weekday: options.weekday }),
    };

    const locale = options.locale || 'en-AU';

    // Format the date
    const formatter = new Intl.DateTimeFormat(locale, formatOptions);
    return formatter.format(date);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to format date: ${message}`);
  }
}

/**
 * Safe version of formatDate that returns a result object instead of throwing
 *
 * @param dateInput - The date string, Date object, or timestamp to format
 * @param options - Formatting options (defaults to Australian long format)
 * @returns Result object with success status and formatted date or error message
 *
 * @example
 * ```typescript
 * const result = formatDateSafe('2024-01-15');
 * if (result.success) {
 *   console.log(result.formatted); // "15 January 2024"
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function formatDateSafe(
  dateInput: string | Date | number,
  options: DateFormatOptions = {},
): FormatDateResult {
  try {
    const formatted = formatDate(dateInput, options);
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    return {
      success: true,
      formatted,
      date,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';

    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Convenience function for common Australian date format (legacy compatibility)
 *
 * @deprecated Use formatDate() instead for better error handling
 * @param dateString - The date string to format
 * @returns Formatted date string or "Invalid date" for errors
 */
export function formatDateLegacy(dateString: string): string {
  const result = formatDateSafe(dateString);
  return result.success ? result.formatted! : 'Invalid date';
}
