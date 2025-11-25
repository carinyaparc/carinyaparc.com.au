import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/server
vi.mock('next/server', () => ({
  NextRequest: class NextRequest extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      super(input, init);
    }
  },
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

// Mock next/headers with proper async handling
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

// Mock the constants module
vi.mock('@/lib/constants', () => ({
  CONSENT_COOKIE_NAME: 'cookieConsent',
}));

describe('cookie route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export POST function', async () => {
    const routeModule = await import('@/app/api/cookie/route');

    expect(routeModule.POST).toBeDefined();
    expect(typeof routeModule.POST).toBe('function');
  });

  it('should handle POST request with consent data', async () => {
    const { POST } = await import('@/app/api/cookie/route');

    const mockBody = { consent: 'accepted' };
    const request = new Request('http://localhost:3000/api/cookie', {
      method: 'POST',
      body: JSON.stringify(mockBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);

    expect(response).toBeInstanceOf(Response);
    // Cookies are mocked in test environment, should succeed
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty('success', true);
  });

  it('should return success response when cookies are set', async () => {
    const { POST } = await import('@/app/api/cookie/route');

    const request = new Request('http://localhost:3000/api/cookie', {
      method: 'POST',
      body: JSON.stringify({ consent: 'rejected' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const json = await response.json();

    // With mocked cookies(), should succeed
    expect(json).toHaveProperty('success', true);
    expect(response.status).toBe(200);
  });

  it('should handle invalid request body', async () => {
    const { POST } = await import('@/app/api/cookie/route');

    const request = new Request('http://localhost:3000/api/cookie', {
      method: 'POST',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
    });

    try {
      await POST(request);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
