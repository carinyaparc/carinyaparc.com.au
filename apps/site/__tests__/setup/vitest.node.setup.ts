import { vi } from 'vitest';

// Mock Next.js modules for Node environment
vi.mock('next/headers', () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

// Mock fs module for tests that need it
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
  readFileSync: vi.fn(),
}));

// Mock path module
vi.mock('path', () => ({
  join: (...args: string[]) => args.join('/'),
  resolve: (...args: string[]) => args.join('/'),
  dirname: (path: string) => path.split('/').slice(0, -1).join('/'),
}));
