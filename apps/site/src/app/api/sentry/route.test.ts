import { describe, it, expect, vi } from 'vitest';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn(
      (data, init) =>
        new Response(JSON.stringify(data), {
          ...init,
          headers: {
            'content-type': 'application/json',
            ...(init?.headers || {}),
          },
        }),
    ),
  },
}));

describe('sentry route', () => {
  it('should export GET function', async () => {
    const routeModule = await import('@/app/api/sentry/route');

    expect(routeModule.GET).toBeDefined();
    expect(typeof routeModule.GET).toBe('function');
  });

  it('should handle requests with error parameter', async () => {
    const { GET } = await import('@/app/api/sentry/route');

    try {
      await GET();
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should always throw SentryExampleAPIError', async () => {
    const { GET } = await import('@/app/api/sentry/route');

    // The GET function always throws an error synchronously
    expect(() => GET()).toThrow('This error is raised on the backend');
  });

  it('should throw error with correct error type', async () => {
    const { GET } = await import('@/app/api/sentry/route');

    try {
      await GET();
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('backend called by the example page');
    }
  });
});
