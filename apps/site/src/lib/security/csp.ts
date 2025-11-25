/**
 * Content Security Policy (CSP) utilities
 * Implements: T1.3, T1.4, SEC-001
 */

import { randomUUID } from 'crypto';
import type { NonceContext, CSPConfig, CSPResult } from './types';

/**
 * Generate a cryptographically secure nonce for CSP
 * Implements: T1.3, SEC-001
 *
 * @param requestId - Optional request correlation ID
 * @returns NonceContext with uuid v4 nonce and metadata
 */
export function generateNonce(requestId?: string): NonceContext {
  return {
    nonce: randomUUID(),
    timestamp: Date.now(),
    requestId,
  };
}

/**
 * Format nonce for CSP directive value
 *
 * @param nonce - The nonce string
 * @returns Formatted nonce (e.g., 'nonce-abc123')
 */
export function formatNonceForCSP(nonce: string): string {
  return `'nonce-${nonce}'`;
}

/**
 * Inject nonce into CSP directives
 * Adds nonce to script-src and style-src directives
 *
 * @param directives - Original CSP directives
 * @param nonce - Nonce to inject
 * @returns Updated directives with nonce
 */
function injectNonceIntoDirectives(
  directives: Record<string, string[]>,
  nonce: string,
): Record<string, string[]> {
  const updated = { ...directives };
  const formattedNonce = formatNonceForCSP(nonce);

  // Inject nonce into script-src if present
  if (updated['script-src']) {
    updated['script-src'] = [formattedNonce, ...updated['script-src']];
  }

  // Inject nonce into style-src if present
  if (updated['style-src']) {
    updated['style-src'] = [formattedNonce, ...updated['style-src']];
  }

  return updated;
}

/**
 * Build CSP header value from directives
 *
 * @param directives - CSP directives to build from
 * @returns Complete CSP header value string
 */
function buildCSPHeaderValue(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * Build complete CSP header with nonce injection
 * Implements: T1.4, SEC-001
 *
 * @param config - CSP configuration
 * @param nonce - Nonce to inject into directives
 * @returns CSP result with header name, value, and nonce
 */
export function buildCSPHeader(config: CSPConfig, nonce: string): CSPResult {
  // Inject nonce into directives
  const directivesWithNonce = injectNonceIntoDirectives(config.directives, nonce);

  // Build header value
  let headerValue = buildCSPHeaderValue(directivesWithNonce);

  // Add report URI if configured
  if (config.reportUri) {
    headerValue += `; report-uri ${config.reportUri}`;
  }

  // Determine header name based on report-only mode
  const headerName = config.reportOnly
    ? 'Content-Security-Policy-Report-Only'
    : 'Content-Security-Policy';

  return {
    headerName,
    headerValue,
    nonce,
  };
}

/**
 * Validate CSP configuration
 *
 * @param config - CSP configuration to validate
 * @returns true if valid, false otherwise
 */
export function validateCSPConfig(config: CSPConfig): boolean {
  if (!config.directives || typeof config.directives !== 'object') {
    return false;
  }

  // Ensure at least default-src is present
  if (!config.directives['default-src']) {
    return false;
  }

  return true;
}
