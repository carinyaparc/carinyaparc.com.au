import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Breadcrumb Component - Smoke Tests', () => {
  it('should render without crashing when given custom items', () => {
    const customItems = [
      { name: 'Home', url: '/' },
      { name: 'Custom Page', url: '/custom' },
    ];

    const { container } = render(<Breadcrumb items={customItems} />);
    expect(container.querySelector('nav')).toBeTruthy();
  });

  it('should accept className prop', () => {
    const customItems = [
      { name: 'Home', url: '/' },
      { name: 'Test', url: '/test' },
    ];

    const { container } = render(<Breadcrumb items={customItems} className="custom-class" />);
    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should handle showOnHome prop', () => {
    const customItems = [{ name: 'Home', url: '/' }];
    const { container } = render(<Breadcrumb items={customItems} showOnHome={true} />);
    expect(container.querySelector('nav')).toBeTruthy();
  });
});
