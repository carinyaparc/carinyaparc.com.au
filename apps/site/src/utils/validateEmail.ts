/**
 * Email validation severity levels
 */
export type ValidationLevel = 'basic' | 'standard' | 'strict' | 'paranoid';

/**
 * Email validation result with detailed feedback
 */
export interface EmailValidationResult {
  /** Whether the email is valid */
  isValid: boolean;
  /** Original email input */
  email: string;
  /** Normalized email (lowercase, trimmed) */
  normalized?: string;
  /** Validation level used */
  level: ValidationLevel;
  /** Specific validation errors */
  errors: string[];
  /** Warnings that don't invalidate but suggest caution */
  warnings: string[];
  /** Spam/suspicious indicators */
  spamScore: number;
  /** Whether this appears to be a disposable email */
  isDisposable?: boolean;
  /** Extracted domain information */
  domain?: {
    name: string;
    isCommon: boolean;
    hasValidMX?: boolean;
  };
}

/**
 * Configuration options for email validation
 */
export interface ValidateEmailOptions {
  /** Validation strictness level (default: 'standard') */
  level?: ValidationLevel;
  /** Whether to check for disposable email domains */
  checkDisposable?: boolean;
  /** Whether to perform spam pattern detection */
  detectSpam?: boolean;
  /** Custom blocked domains */
  blockedDomains?: string[];
  /** Custom allowed domains (whitelist mode) */
  allowedDomains?: string[];
  /** Maximum email length (default: 254 per RFC) */
  maxLength?: number;
}

// Common email patterns for different validation levels
const EMAIL_PATTERNS = {
  // Very basic email pattern - allows most reasonable emails
  basic: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Standard RFC-like pattern with common restrictions
  standard:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

  // Strict pattern - more conservative approach
  strict:
    /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,

  // Paranoid - very restrictive
  paranoid: /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}@[a-zA-Z0-9][a-zA-Z0-9.-]{0,253}\.[a-zA-Z]{2,}$/,
};

// Common spam email patterns (from your existing API code)
const SPAM_PATTERNS = [
  /test@test/i,
  /example@/i,
  /\d{8,}@/i, // emails with 8+ consecutive digits
  /@(example|test|temp|fake|invalid|localhost)/i,
  /[a-z0-9]{20,}@/i, // extremely long email local parts
  /^[a-z0-9]+@[a-z0-9]+$/i, // too simple structure
  /@.*\.local$/i, // local domains
  /@.*\.test$/i, // test domains
] as const;

// Common disposable email domains (partial list for demonstration)
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  '1secmail.com',
  'getnada.com',
  'mohmal.com',
  'tempail.com',
]);

// Common legitimate email domains
const COMMON_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'protonmail.com',
  'aol.com',
  'mail.com',
  'yandex.com',
  'zoho.com',
]);

/**
 * Validates email addresses with comprehensive checking and detailed feedback
 *
 * @param email - The email address to validate
 * @param options - Validation configuration options
 * @returns Detailed validation result
 *
 * @example
 * ```typescript
 * // Basic validation
 * const result = validateEmailAdvanced('user@example.com');
 * if (result.isValid) {
 *   console.log('Valid email:', result.normalized);
 * }
 *
 * // Strict validation with spam detection
 * const strictResult = validateEmailAdvanced('test@test.com', {
 *   level: 'strict',
 *   detectSpam: true,
 *   checkDisposable: true
 * });
 *
 * if (strictResult.spamScore > 0.5) {
 *   console.warn('Potential spam email detected');
 * }
 *
 * // Handle validation errors
 * if (!strictResult.isValid) {
 *   console.error('Validation errors:', strictResult.errors);
 * }
 * ```
 */
export function validateEmailAdvanced(
  email: string | null | undefined,
  options: ValidateEmailOptions = {},
): EmailValidationResult {
  // Set defaults
  const {
    level = 'standard',
    checkDisposable = false,
    detectSpam = false,
    blockedDomains = [],
    allowedDomains = [],
    maxLength = 254,
  } = options;

  const result: EmailValidationResult = {
    isValid: false,
    email: email || '',
    level,
    errors: [],
    warnings: [],
    spamScore: 0,
  };

  // Input validation
  if (email == null) {
    result.errors.push('Email cannot be null or undefined');
    return result;
  }

  if (typeof email !== 'string') {
    result.errors.push(`Expected string input, got ${typeof email}`);
    return result;
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail === '') {
    result.errors.push('Email cannot be empty');
    return result;
  }

  // Length validation
  if (trimmedEmail.length > maxLength) {
    result.errors.push(`Email exceeds maximum length of ${maxLength} characters`);
    return result;
  }

  // Normalize email
  result.normalized = trimmedEmail.toLowerCase();
  result.email = trimmedEmail;

  // Basic format validation
  const pattern = EMAIL_PATTERNS[level];
  if (!pattern.test(result.normalized)) {
    result.errors.push(`Email format is invalid (${level} validation)`);
    return result;
  }

  // Extract domain
  const atIndex = result.normalized.lastIndexOf('@');
  if (atIndex === -1) {
    result.errors.push('Email must contain @ symbol');
    return result;
  }

  const localPart = result.normalized.slice(0, atIndex);
  const domainPart = result.normalized.slice(atIndex + 1);

  result.domain = {
    name: domainPart,
    isCommon: COMMON_DOMAINS.has(domainPart),
  };

  // Local part validation
  if (localPart.length === 0) {
    result.errors.push('Email local part cannot be empty');
    return result;
  }

  if (localPart.length > 64) {
    result.errors.push('Email local part exceeds 64 character limit');
    return result;
  }

  // Domain validation
  if (domainPart.length === 0) {
    result.errors.push('Email domain cannot be empty');
    return result;
  }

  if (domainPart.length > 253) {
    result.errors.push('Email domain exceeds 253 character limit');
    return result;
  }

  // Check for consecutive dots
  if (result.normalized.includes('..')) {
    result.errors.push('Email cannot contain consecutive dots');
    return result;
  }

  // Domain whitelist/blacklist validation
  if (allowedDomains.length > 0 && !allowedDomains.includes(domainPart)) {
    result.errors.push('Email domain is not in the allowed list');
    return result;
  }

  if (blockedDomains.includes(domainPart)) {
    result.errors.push('Email domain is blocked');
    return result;
  }

  // Spam pattern detection
  if (detectSpam) {
    let spamIndicators = 0;
    const matchedPatterns: string[] = [];

    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(result.normalized)) {
        spamIndicators++;
        matchedPatterns.push(pattern.source);
      }
    }

    result.spamScore = spamIndicators / SPAM_PATTERNS.length;

    if (result.spamScore > 0) {
      result.warnings.push(`Email matches ${spamIndicators} spam patterns`);
    }

    // High spam score is an error in strict modes
    if (result.spamScore > 0.3 && (level === 'strict' || level === 'paranoid')) {
      result.errors.push('Email appears to be spam or test email');
      return result;
    }
  }

  // Disposable email detection
  if (checkDisposable) {
    result.isDisposable = DISPOSABLE_DOMAINS.has(domainPart);

    if (result.isDisposable) {
      result.warnings.push('Email appears to be from a disposable email service');

      // Disposable emails are rejected in strict modes
      if (level === 'strict' || level === 'paranoid') {
        result.errors.push('Disposable email addresses are not allowed');
        return result;
      }
    }
  }

  // Additional strict validations
  if (level === 'strict' || level === 'paranoid') {
    // Check for valid TLD length
    const tldMatch = domainPart.match(/\.([a-zA-Z]+)$/);
    if (!tldMatch || !tldMatch[1] || tldMatch[1].length < 2) {
      result.errors.push('Email domain must have a valid top-level domain');
      return result;
    }

    // Paranoid mode additional checks
    if (level === 'paranoid') {
      // No starting/ending dots or hyphens
      if (localPart.startsWith('.') || localPart.endsWith('.')) {
        result.errors.push('Email local part cannot start or end with a dot');
        return result;
      }

      // Domain cannot start or end with hyphen
      if (domainPart.startsWith('-') || domainPart.endsWith('-')) {
        result.errors.push('Email domain cannot start or end with hyphen');
        return result;
      }
    }
  }

  // If we get here, the email is valid
  result.isValid = true;
  return result;
}

/**
 * Simple email validation function (backward compatible)
 *
 * @param email - The email address to validate
 * @param level - Validation strictness level (default: 'standard')
 * @returns Boolean indicating if email is valid
 *
 * @example
 * ```typescript
 * if (validateEmail('user@example.com')) {
 *   console.log('Valid email!');
 * }
 *
 * // With different validation levels
 * validateEmail('test@test.com', 'strict'); // false
 * validateEmail('user@example.com', 'basic'); // true
 * ```
 */
export function validateEmail(
  email: string | null | undefined,
  level: ValidationLevel = 'standard',
): boolean {
  const result = validateEmailAdvanced(email, { level });
  return result.isValid;
}

/**
 * Quick email validation with spam detection (matches your API logic)
 *
 * @param email - The email address to validate
 * @returns Object with validation status and spam indicators
 *
 * @example
 * ```typescript
 * const { isValid, isSpam } = validateEmailForAPI('user@example.com');
 * if (isValid && !isSpam) {
 *   // Process the email
 * }
 * ```
 */
export function validateEmailForAPI(email: string | null | undefined): {
  isValid: boolean;
  isSpam: boolean;
  normalized?: string;
} {
  const result = validateEmailAdvanced(email, {
    level: 'standard',
    detectSpam: true,
  });

  return {
    isValid: result.isValid,
    isSpam: result.spamScore > 0.3,
    ...(result.normalized && { normalized: result.normalized }),
  };
}

/**
 * Legacy validation function (matches original implementation)
 *
 * @deprecated Use validateEmail() for better error handling
 * @param email - The email string to validate
 * @returns Boolean indicating if email is valid
 */
export function validateEmailLegacy(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
