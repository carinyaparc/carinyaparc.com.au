/**
 * Configuration options for text truncation
 */
export interface TruncateOptions {
  /** Maximum length of the truncated text (default: 150) */
  maxLength?: number;
  /** String to append when text is truncated (default: '...') */
  ellipsis?: string;
  /** Whether to break at word boundaries to avoid cutting words (default: true) */
  wordBoundary?: boolean;
  /** Whether to preserve complete sentences when possible (default: false) */
  preserveSentences?: boolean;
  /** Custom word separators (default: standard whitespace and punctuation) */
  separators?: RegExp;
}

/**
 * Result of text truncation operation
 */
export interface TruncateResult {
  /** The truncated or original text */
  text: string;
  /** Whether the text was actually truncated */
  wasTruncated: boolean;
  /** Original text length */
  originalLength: number;
  /** Final text length (including ellipsis) */
  finalLength: number;
}

/**
 * Internal implementation that handles the actual truncation logic
 */
function truncateTextImpl(text: string, config: Required<TruncateOptions>): string {
  const { maxLength, ellipsis, wordBoundary, preserveSentences, separators } = config;

  // If text is already short enough, return as-is
  if (text.length <= maxLength) {
    return text;
  }

  // Calculate available space for content (accounting for ellipsis)
  const availableLength = Math.max(0, maxLength - ellipsis.length);

  if (availableLength === 0) {
    return ellipsis.slice(0, maxLength);
  }

  let truncated = text.slice(0, availableLength);

  // Handle sentence preservation first (if requested)
  if (preserveSentences) {
    const sentenceEnders = /[.!?]/g;
    let lastSentenceEnd = -1;
    let match;

    while ((match = sentenceEnders.exec(truncated)) !== null) {
      lastSentenceEnd = match.index + 1;
    }

    if (lastSentenceEnd > 0 && lastSentenceEnd < truncated.length * 0.7) {
      // Only use sentence boundary if it's not too short (< 70% of available space)
      truncated = truncated.slice(0, lastSentenceEnd).trim();
      return (
        truncated +
        (truncated.endsWith('.') || truncated.endsWith('!') || truncated.endsWith('?')
          ? ''
          : ellipsis)
      );
    }
  }

  // Handle word boundary preservation
  if (wordBoundary && availableLength < text.length) {
    // Find the last word boundary within available length
    let lastSeparatorIndex = -1;

    for (let i = availableLength - 1; i >= 0; i--) {
      const char = truncated[i];
      if (char && separators.test(char)) {
        lastSeparatorIndex = i;
        break;
      }
    }

    // Only use word boundary if it's not too short (> 50% of available space)
    if (lastSeparatorIndex > availableLength * 0.5) {
      truncated = truncated.slice(0, lastSeparatorIndex);
    }
  }

  // Clean up and add ellipsis
  return truncated.trim() + ellipsis;
}

/**
 * Safely truncates text to a specified maximum length with intelligent word boundary handling
 *
 * @param text - The text to truncate
 * @param options - Truncation options or just maxLength for backward compatibility
 * @returns Truncated text string
 * @throws {Error} If inputs are invalid
 *
 * @example
 * ```typescript
 * // Basic usage (backward compatible)
 * truncateText('This is a long sentence', 10); // "This is a..."
 *
 * // With word boundaries (default behavior)
 * truncateText('This is a long sentence', {
 *   maxLength: 10,
 *   wordBoundary: true
 * }); // "This is..."
 *
 * // Custom ellipsis
 * truncateText('Long text here', {
 *   maxLength: 10,
 *   ellipsis: ' [more]'
 * }); // "Long text [more]"
 *
 * // Preserve sentences
 * truncateText('First sentence. Second sentence. Third one.', {
 *   maxLength: 30,
 *   preserveSentences: true
 * }); // "First sentence. Second sentence."
 * ```
 */
export function truncateText(
  text: string | null | undefined,
  options: TruncateOptions | number = {},
): string {
  // Input validation and normalization
  if (text == null) {
    return '';
  }

  if (typeof text !== 'string') {
    throw new Error(`Expected string input, got ${typeof text}`);
  }

  // Handle legacy API (maxLength as second parameter)
  const config: TruncateOptions = typeof options === 'number' ? { maxLength: options } : options;

  // Set defaults
  const fullConfig: Required<TruncateOptions> = {
    maxLength: config.maxLength ?? 150,
    ellipsis: config.ellipsis ?? '...',
    wordBoundary: config.wordBoundary ?? true,
    preserveSentences: config.preserveSentences ?? false,
    separators: config.separators ?? /[\s\-–—,.;:!?]/,
  };

  // Validate maxLength
  if (fullConfig.maxLength < 0) {
    throw new Error('maxLength must be non-negative');
  }

  if (fullConfig.maxLength === 0) {
    return '';
  }

  return truncateTextImpl(text as string, fullConfig);
}

/**
 * Enhanced version that returns detailed information about the truncation
 *
 * @param text - The text to truncate
 * @param options - Truncation options
 * @returns Detailed truncation result
 *
 * @example
 * ```typescript
 * const result = truncateTextDetailed('This is a very long sentence', { maxLength: 15 });
 * console.log(result.text); // "This is a very..."
 * console.log(result.wasTruncated); // true
 * console.log(result.originalLength); // 29
 * console.log(result.finalLength); // 18
 * ```
 */
export function truncateTextDetailed(
  text: string | null | undefined,
  options: TruncateOptions | number = {},
): TruncateResult {
  const originalText = text ?? '';
  const truncatedText = truncateText(originalText, options);

  return {
    text: truncatedText,
    wasTruncated: truncatedText.length < originalText.length,
    originalLength: originalText.length,
    finalLength: truncatedText.length,
  };
}

/**
 * Simple truncation without word boundary awareness (legacy compatibility)
 *
 * @deprecated Use truncateText() with wordBoundary: false instead
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 150)
 * @returns Truncated text
 */
export function truncateTextLegacy(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
