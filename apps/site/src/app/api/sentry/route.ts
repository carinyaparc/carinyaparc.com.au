import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
class SentryAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'SentryAPIError';
  }
}
// A faulty API route to test Sentry's error monitoring
export function GET() {
  throw new SentryAPIError('This error is raised on the backend called by the example page.');
  return NextResponse.json({ data: 'Testing Sentry Error...' });
}
