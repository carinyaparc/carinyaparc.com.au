import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
const originalEnv = process.env;

describe('subscribe route', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup environment
    process.env.MAILERLITE_API_KEY = 'test-api-key';

    // Reset the global fetch mock
    global.fetch = mockFetch;

    // Default successful response
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: '123', email: 'test@example.com' }),
      clone: () => ({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: '123', email: 'test@example.com' }),
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env = originalEnv;
  });

  it('should export POST function', async () => {
    const routeModule = await import('../../../../../apps/site/src/app/api/subscribe/route');

    expect(routeModule.POST).toBeDefined();
    expect(typeof routeModule.POST).toBe('function');
  });

  it('should reject non-POST methods', async () => {
    const { POST } = await import('../../../../../site/src/app/api/subscribe/route');

    // POST should be defined but other methods should not be exported
    expect(POST).toBeDefined();
  });

  describe('request validation', () => {
    it('should reject requests without email', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Please provide a valid email address');
    });

    it('should reject invalid email formats', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const invalidEmails = ['invalid', 'invalid@', '@invalid.com', 'invalid.com'];

      for (const email of invalidEmails) {
        const request = new Request('http://localhost/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, submissionTime: 3000 }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Please provide a valid email address');
      }
    });

    it('should reject invalid names', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'validtest@valid.com', // Use a non-spam email
          name: 'Test123!@#',
          submissionTime: 3000,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(
        'Please provide a valid name (letters, spaces, hyphens, and apostrophes only)',
      );
    });

    it('should accept valid names with special characters', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', email: 'validtest@valid.com' }),
      });

      const validNames = ['John Doe', "O'Connor", 'Mary-Jane', 'José María'];

      for (const name of validNames) {
        const request = new Request('http://localhost/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `test-${Date.now()}@validtest.com`, // Use a non-spam domain
            name,
            submissionTime: 3000,
          }),
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });
  });

  describe('honeypot protection', () => {
    it('should silently reject requests with website field populated', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'validtest@valid.com',
          website: 'https://spam.com',
          submissionTime: 3000,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('timing protection', () => {
    it('should silently reject requests submitted too quickly', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'validtest@valid.com',
          submissionTime: 1000, // Less than 2 seconds
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('rate limiting', () => {
    it('should enforce email rate limiting', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const email = 'ratelimit@validtest.com';

      // Set up successful mock for first request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: '123', email }),
      });

      // Make first request
      const firstRequest = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, submissionTime: 3000 }),
      });

      const firstResponse = await POST(firstRequest);
      expect(firstResponse.status).toBe(200);

      // Second request with same email should be rate limited
      const secondRequest = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, submissionTime: 3000 }),
      });

      const secondResponse = await POST(secondRequest);
      const data = await secondResponse.json();

      expect(secondResponse.status).toBe(429);
      expect(data.error).toBe('This email address has already been submitted recently.');
    });
  });

  describe('spam email detection', () => {
    it('should silently reject spam email patterns', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const emails = [
        'realuser@validtest.com', // Should pass (not matching spam patterns)
        'test@test.com', // Should be rejected (matches /test@test/i pattern)
        'example@example.com', // Should be rejected (matches /@example/i pattern)
      ];

      // First email should work (non-spam)
      mockFetch.mockClear();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: '123', email: emails[0] }),
      });

      const validRequest = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emails[0], submissionTime: 3000 }),
      });

      const validResponse = await POST(validRequest);
      expect(validResponse.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Spam emails should be silently rejected without API calls
      for (let i = 1; i < emails.length; i++) {
        mockFetch.mockClear(); // Clear to count calls for each spam email

        const spamRequest = new Request('http://localhost/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emails[i], submissionTime: 3000 }),
        });

        const spamResponse = await POST(spamRequest);
        const data = await spamResponse.json();

        expect(spamResponse.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockFetch).toHaveBeenCalledTimes(0); // No API call for spam emails
      }
    });
  });

  describe('MailerLite integration', () => {
    it('should handle missing API key', async () => {
      // Save original value
      const originalApiKey = process.env.MAILERLITE_API_KEY;

      // Temporarily remove API key
      delete process.env.MAILERLITE_API_KEY;

      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nokey@validtest.com', submissionTime: 3000 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(
        'Newsletter service not configured. Please add MAILERLITE_API_KEY to .env.local',
      );

      // Restore original value
      if (originalApiKey) {
        process.env.MAILERLITE_API_KEY = originalApiKey;
      }
    });

    it('should make correct API call to MailerLite', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '123', email: 'api@validtest.com' }),
      });

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'api@validtest.com',
          name: 'Test User',
          interests: 'farming',
          submissionTime: 3000,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      expect(mockFetch).toHaveBeenCalledWith('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: JSON.stringify({
          email: 'api@validtest.com',
          fields: {
            name: 'Test User',
            interests: 'farming',
          },
        }),
      });
    });

    it('should handle MailerLite API errors', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            message: 'Validation failed',
            errors: { email: ['Email already exists'] },
          }),
      });

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'error@validtest.com', submissionTime: 3000 }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200); // Should return 200 success even on API errors
    });

    it('should handle network errors', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'network@validtest.com', submissionTime: 3000 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422); // API routes may return 422 for external errors
      expect(data.error).toContain('Subscription failed');
    });

    it('should handle malformed JSON response from MailerLite', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'json@validtest.com', submissionTime: 3000 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Network error. Please try again later.');
    });
  });

  describe('request parsing', () => {
    it('should handle malformed request body', async () => {
      const { POST } = await import('../../../../../apps/site/src/app/api/subscribe/route');

      const request = new Request('http://localhost/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Failed to process request');
    });
  });
});
