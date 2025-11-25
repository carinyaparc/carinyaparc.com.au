import { describe, it, expect } from 'vitest';

describe('cron route', () => {
  it('should export GET function', async () => {
    const routeModule = await import('@/app/api/cron/route');

    expect(routeModule.GET).toBeDefined();
    expect(typeof routeModule.GET).toBe('function');
  });

  it('should return response with ok status', async () => {
    const { GET } = await import('@/app/api/cron/route');

    const response = await GET();

    expect(response).toBeInstanceOf(Response);
    const json = await response.json();
    expect(json).toHaveProperty('ok', true);
  });

  it('should have correct response status', async () => {
    const { GET } = await import('@/app/api/cron/route');

    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('should return JSON content type', async () => {
    const { GET } = await import('@/app/api/cron/route');

    const response = await GET();

    expect(response.headers.get('content-type')).toContain('application/json');
  });
});
