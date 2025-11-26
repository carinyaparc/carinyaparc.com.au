/**
 * Stack layout primitive tests
 * Task: T1.11 - Unit tests for Stack with 90%+ coverage
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './stack';

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack>Content</Stack>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('defaults to vertical direction', () => {
    render(<Stack>Content</Stack>);
    expect(screen.getByText('Content')).toHaveClass('flex-col');
  });

  it('applies horizontal direction', () => {
    render(<Stack direction="horizontal">Content</Stack>);
    expect(screen.getByText('Content')).toHaveClass('flex-row');
  });

  it('applies spacing variants', () => {
    const { rerender } = render(<Stack spacing="sm">Small gap</Stack>);
    expect(screen.getByText('Small gap')).toHaveClass('gap-2');

    rerender(<Stack spacing="xl">Large gap</Stack>);
    expect(screen.getByText('Large gap')).toHaveClass('gap-8');
  });

  it('applies align variants', () => {
    const { rerender } = render(<Stack align="center">Center</Stack>);
    expect(screen.getByText('Center')).toHaveClass('items-center');

    rerender(<Stack align="end">End</Stack>);
    expect(screen.getByText('End')).toHaveClass('items-end');
  });

  it('applies justify variants', () => {
    const { rerender } = render(<Stack justify="between">Between</Stack>);
    expect(screen.getByText('Between')).toHaveClass('justify-between');

    rerender(<Stack justify="center">Center</Stack>);
    expect(screen.getByText('Center')).toHaveClass('justify-center');
  });

  it('merges custom className', () => {
    render(<Stack className="custom-class">Custom</Stack>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class', 'flex');
  });
});
