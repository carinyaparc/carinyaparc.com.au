/**
 * Grid layout primitive tests
 * Task: T1.12 - Unit tests for Grid with 90%+ coverage
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid } from './grid';

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid>Content</Grid>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default 3-column responsive grid', () => {
    render(<Grid>Content</Grid>);
    const grid = screen.getByText('Content');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
  });

  it('applies different column counts', () => {
    const { rerender } = render(<Grid cols={2}>Two cols</Grid>);
    expect(screen.getByText('Two cols')).toHaveClass('grid-cols-1', 'sm:grid-cols-2');

    rerender(<Grid cols={4}>Four cols</Grid>);
    expect(screen.getByText('Four cols')).toHaveClass('lg:grid-cols-4');

    rerender(<Grid cols={1}>One col</Grid>);
    expect(screen.getByText('One col')).toHaveClass('grid-cols-1');
  });

  it('applies gap variants', () => {
    const { rerender } = render(<Grid gap="sm">Small gap</Grid>);
    expect(screen.getByText('Small gap')).toHaveClass('gap-2');

    rerender(<Grid gap="xl">Large gap</Grid>);
    expect(screen.getByText('Large gap')).toHaveClass('gap-8');
  });

  it('applies align variants', () => {
    const { rerender } = render(<Grid align="center">Center</Grid>);
    expect(screen.getByText('Center')).toHaveClass('items-center');

    rerender(<Grid align="start">Start</Grid>);
    expect(screen.getByText('Start')).toHaveClass('items-start');
  });

  it('merges custom className', () => {
    render(<Grid className="custom-class">Custom</Grid>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class', 'grid');
  });
});
