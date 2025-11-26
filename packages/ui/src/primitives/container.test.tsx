/**
 * Container layout primitive tests
 * Task: T1.10 - Unit tests for Container with 90%+ coverage
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default size (xl)', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toHaveClass('max-w-7xl');
  });

  it('applies size variants', () => {
    const { rerender } = render(<Container size="sm">Small</Container>);
    expect(screen.getByText('Small')).toHaveClass('max-w-2xl');

    rerender(<Container size="lg">Large</Container>);
    expect(screen.getByText('Large')).toHaveClass('max-w-5xl');

    rerender(<Container size="full">Full</Container>);
    expect(screen.getByText('Full')).toHaveClass('max-w-full');
  });

  it('applies responsive padding', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toHaveClass('px-4', 'sm:px-6');
  });

  it('centers content with mx-auto', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toHaveClass('mx-auto');
  });

  it('merges custom className', () => {
    render(<Container className="custom-class">Custom</Container>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class', 'mx-auto');
  });
});
