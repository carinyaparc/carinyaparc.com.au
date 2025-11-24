import type { JWTPayload } from 'jose';

/**
 * Session payload containing user information stored in JWT tokens
 */
export interface SessionPayload extends JWTPayload {
  /** User unique identifier */
  id: string;
  /** User email address */
  email?: string;
  /** User display name */
  name?: string;
  /** User role/permission level */
  role?: string;
  /** JWT issued at timestamp */
  iat?: number;
  /** JWT expiration timestamp */
  exp?: number;
}

/**
 * User information structure
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Session configuration options
 */
export interface SessionConfig {
  /** Session duration in seconds (default: 7 days) */
  maxAge?: number;
  /** Cookie name for session storage */
  cookieName?: string;
  /** Whether to use secure cookies */
  secure?: boolean;
}
