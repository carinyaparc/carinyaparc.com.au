/**
 * Text primitive component tests
 * Task: T1.4 - Unit tests for Text with 90%+ coverage
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './text';

describe('Text', () => {
  it('renders as paragraph by default', () => {
    const { container } = render(<Text>Paragraph text</Text>);
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(screen.getByText('Paragraph text')).toBeInTheDocument();
  });

  it('renders as span when specified', () => {
    const { container } = render(<Text as="span">Span text</Text>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('renders as div when specified', () => {
    const { container } = render(<Text as="div">Div text</Text>);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { rerender } = render(<Text size="xs">Extra small</Text>);
    expect(screen.getByText('Extra small')).toHaveClass('text-xs');

    rerender(<Text size="xl">Extra large</Text>);
    expect(screen.getByText('Extra large')).toHaveClass('text-xl');
  });

  it('applies weight variants', () => {
    const { rerender } = render(<Text weight="bold">Bold</Text>);
    expect(screen.getByText('Bold')).toHaveClass('font-bold');

    rerender(<Text weight="medium">Medium</Text>);
    expect(screen.getByText('Medium')).toHaveClass('font-medium');
  });

  it('applies color variants', () => {
    const { rerender } = render(<Text color="primary">Primary</Text>);
    expect(screen.getByText('Primary')).toHaveClass('text-eucalyptus-600');

    rerender(<Text color="error">Error</Text>);
    expect(screen.getByText('Error')).toHaveClass('text-earth-red');
  });

  it('applies align variants', () => {
    const { rerender } = render(<Text align="center">Center</Text>);
    expect(screen.getByText('Center')).toHaveClass('text-center');

    rerender(<Text align="right">Right</Text>);
    expect(screen.getByText('Right')).toHaveClass('text-right');
  });

  it('supports asChild prop', () => {
    render(
      <Text asChild>
        <span>Custom span</span>
      </Text>,
    );
    const element = screen.getByText('Custom span');
    expect(element.tagName).toBe('SPAN');
  });

  it('merges custom className', () => {
    render(<Text className="custom-class">Custom</Text>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });
});
