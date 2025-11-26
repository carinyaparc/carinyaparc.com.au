/**
 * Input sanitization utilities using DOMPurify
 * Implements: T1.3, NFR-004 (XSS prevention)
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitization configuration for different contexts
 */
const SANITIZE_CONFIGS = {
  // Strip all HTML tags - for form inputs that should be plain text
  plainText: {
    ALLOWED_TAGS: [] as string[],
    ALLOWED_ATTR: [] as string[],
    KEEP_CONTENT: true,
  },

  // For email body - allow basic formatting but strip dangerous content
  email: {
    ALLOWED_TAGS: ['br', 'p', 'strong', 'em'] as string[],
    ALLOWED_ATTR: [] as string[],
    KEEP_CONTENT: true,
  },
};

/**
 * Sanitize text input for plain text contexts (form fields, names, etc.)
 * Strips all HTML tags and dangerous characters
 *
 * @param input - Raw user input string
 * @returns Sanitized plain text string safe for display and storage
 *
 * @example
 * ```typescript
 * const name = sanitizePlainText('<script>alert("xss")</script>John');
 * // Returns: "John"
 * ```
 */
export function sanitizePlainText(input: string | null | undefined): string {
  if (!input) return '';

  const sanitized = DOMPurify.sanitize(input, SANITIZE_CONFIGS.plainText);
  return sanitized.trim();
}

/**
 * Sanitize text for email body inclusion
 * Preserves basic formatting (line breaks, emphasis) but strips dangerous content
 *
 * @param input - Raw user input string
 * @returns Sanitized HTML string safe for email body
 *
 * @example
 * ```typescript
 * const message = sanitizeForEmail('Hello\n\nThis is a message');
 * // Returns: "Hello<br><br>This is a message" (with line breaks)
 * ```
 */
export function sanitizeForEmail(input: string | null | undefined): string {
  if (!input) return '';

  // Convert line breaks to <br> tags before sanitization
  const withBreaks = input.replace(/\n/g, '<br>');

  const sanitized = DOMPurify.sanitize(withBreaks, SANITIZE_CONFIGS.email);
  return sanitized.trim();
}

/**
 * Sanitize all fields in contact form data
 * Applies appropriate sanitization based on field type
 *
 * @param data - Raw contact form data
 * @returns Sanitized contact form data safe for processing
 */
export interface ContactFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}

export function sanitizeContactFormData(data: ContactFormInput): ContactFormInput {
  return {
    firstName: sanitizePlainText(data.firstName),
    lastName: sanitizePlainText(data.lastName),
    email: sanitizePlainText(data.email),
    phone: data.phone ? sanitizePlainText(data.phone) : undefined,
    inquiryType: sanitizePlainText(data.inquiryType),
    message: sanitizePlainText(data.message), // Plain text for form display
  };
}

/**
 * Sanitize contact form data for email generation
 * Uses email-safe sanitization that preserves formatting
 */
export function sanitizeForEmailGeneration(data: ContactFormInput): ContactFormInput {
  return {
    firstName: sanitizePlainText(data.firstName),
    lastName: sanitizePlainText(data.lastName),
    email: sanitizePlainText(data.email),
    phone: data.phone ? sanitizePlainText(data.phone) : undefined,
    inquiryType: sanitizePlainText(data.inquiryType),
    message: sanitizeForEmail(data.message), // Preserve line breaks in email
  };
}

