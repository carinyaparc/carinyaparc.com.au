/**
 * Security module main exports
 * Implements: SEC-007
 */

// Export types
export type * from './types';

// Export CSP utilities
export { generateNonce, formatNonceForCSP, buildCSPHeader, validateCSPConfig } from './csp';

// Export cache control utilities
export {
  matchesAnyPattern,
  isSensitiveRoute,
  isAuthRoute,
  isPublicRoute,
  generateCacheControl,
  getSensitiveCacheDirectives,
  getAuthCacheDirectives,
  getPublicCacheDirectives,
  getDefaultCacheDirectives,
  createDefaultCacheConfig,
} from './cache';

// Export security headers utilities
export {
  generateSecurityHeaders,
  createSecurityHeadersConfig,
  validateSecurityHeadersConfig,
} from './headers';

// Export constants
export { CSP_DIRECTIVES, SECURITY_HEADER_PRESETS, DEFAULT_CACHE_PATTERNS } from './constants';
