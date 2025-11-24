import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Next.js modules
vi.mock('next/headers', () => ({
  draftMode: vi.fn(),
  cookies: vi.fn(),
}));

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: vi.fn(({ gtmId }) => <script data-testid="gtm" data-gtm-id={gtmId} />),
}));

vi.mock('@vercel/analytics/next', () => ({
  Analytics: vi.fn(() => <script data-testid="vercel-analytics" />),
}));

// Mock font module
vi.mock('@/lib/font', () => ({
  fontClassNames: 'font-raleway',
}));

// Mock constants
vi.mock('@/lib/constants', () => ({
  CONSENT_COOKIE_NAME: 'cookieConsent',
}));

// Mock navigation
vi.mock('@/app/navigation', () => ({
  navigation: [
    { href: '/', label: 'Home', visible: false },
    { href: '/about', verb: 'Discover', rest: 'Our Story', visible: true },
  ],
}));

// Mock generateMetadata
vi.mock('@/lib/generateMetadata', () => ({
  generateMetadata: vi.fn(),
  viewport: vi.fn(),
}));

// Mock components
vi.mock('@/components/ui/Banner', () => ({
  default: vi.fn(() => <div data-testid="banner">Banner</div>),
}));

vi.mock('@/components/layouts/Header', () => ({
  default: vi.fn(({ navigation }) => (
    <header data-testid="header" data-nav-length={navigation?.length}>
      Header
    </header>
  )),
}));

vi.mock('@/components/ui/Newsletter', () => ({
  default: vi.fn(() => <div data-testid="newsletter">Newsletter</div>),
}));

vi.mock('@/components/layouts/Footer', () => ({
  default: vi.fn(() => <footer data-testid="footer">Footer</footer>),
}));

vi.mock('@/components/ui/Policy', () => ({
  default: vi.fn(() => <div data-testid="policy">Policy</div>),
}));

vi.mock('@repo/ui/toaster', () => ({
  Toaster: vi.fn(() => <div data-testid="toaster">Toaster</div>),
}));

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_GTM_ID: 'GTM-TEST123',
  NODE_ENV: 'test',
};

vi.stubGlobal('process', {
  ...process,
  env: mockEnv,
});

describe('RootLayout', () => {
  const mockCookieStore = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (draftMode as any).mockResolvedValue(undefined);
    (cookies as any).mockResolvedValue(mockCookieStore);
    mockCookieStore.get.mockReturnValue(undefined);
  });

  it('should render basic layout structure', async () => {
    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div data-testid="children">Test Content</div>,
      }),
    );

    expect(screen.getByTestId('banner')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('children')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('policy')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('should pass navigation to Header component', async () => {
    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-nav-length', '2');
  });

  it('should not load analytics without consent', async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    expect(screen.queryByTestId('gtm')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
  });

  it('should load analytics with consent', async () => {
    mockCookieStore.get.mockReturnValue({ value: 'accepted' });

    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    expect(screen.getByTestId('gtm')).toBeInTheDocument();
    expect(screen.getByTestId('gtm')).toHaveAttribute('data-gtm-id', 'GTM-TEST123');
    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
  });

  it('should handle consent cookie with different values', async () => {
    // Test with rejected consent
    mockCookieStore.get.mockReturnValue({ value: 'rejected' });

    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    expect(screen.queryByTestId('gtm')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
  });

  it('should handle empty GTM ID', async () => {
    // Mock empty GTM ID
    process.env.NEXT_PUBLIC_GTM_ID = '';
    mockCookieStore.get.mockReturnValue({ value: 'accepted' });

    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    const gtm = screen.getByTestId('gtm');
    expect(gtm).toHaveAttribute('data-gtm-id', '');

    // Restore
    process.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST123';
  });

  it('should have correct HTML attributes', async () => {
    const RootLayout = await import('@/app/layout').then((m) => m.default);

    const result = render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    const html = result.container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
    expect(html).toHaveAttribute('class', 'font-raleway');
    expect(html).toHaveAttribute('suppressHydrationWarning');
  });

  it('should have proper semantic HTML structure', async () => {
    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    const body = document.querySelector('body');
    expect(body).toHaveClass('flex', 'flex-col', 'min-h-screen');

    const main = document.querySelector('main');
    expect(main).toHaveClass('flex-1');
  });

  it('should call draftMode during render', async () => {
    const RootLayout = await import('@/app/layout').then((m) => m.default);

    await RootLayout({
      children: <div>Test Content</div>,
    });

    expect(draftMode).toHaveBeenCalled();
  });

  it('should call cookies to get consent status', async () => {
    const RootLayout = await import('@/app/layout').then((m) => m.default);

    await RootLayout({
      children: <div>Test Content</div>,
    });

    expect(cookies).toHaveBeenCalled();
    expect(mockCookieStore.get).toHaveBeenCalledWith('cookieConsent');
  });

  it('should export generateMetadata and viewport', async () => {
    const layoutModule = await import('@/app/layout');

    expect(layoutModule.generateMetadata).toBeDefined();
    expect(layoutModule.viewport).toBeDefined();
  });

  it('should include critical CSS in head', async () => {
    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    const styleElement = document.querySelector('head style');
    expect(styleElement).toBeInTheDocument();

    const cssContent = styleElement?.innerHTML;
    expect(cssContent).toContain(':root');
    expect(cssContent).toContain('--font-sans');
    expect(cssContent).toContain('--color-background');
  });

  it('should handle errors gracefully', async () => {
    // Mock cookies to throw an error
    (cookies as any).mockRejectedValue(new Error('Cookie error'));

    const RootLayout = await import('@/app/layout').then((m) => m.default);

    // Should not throw
    await expect(
      RootLayout({
        children: <div>Test Content</div>,
      }),
    ).resolves.toBeDefined();
  });

  it('should handle missing consent cookie gracefully', async () => {
    mockCookieStore.get.mockReturnValue(null);

    const RootLayout = await import('@/app/layout').then((m) => m.default);

    render(
      await RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    expect(screen.queryByTestId('gtm')).not.toBeInTheDocument();
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
  });
});
