/**
 * Heading primitive component tests
 * Task: T1.3 - Unit tests for Heading with 90%+ coverage
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heading } from './heading';

describe('Heading', () => {
  it('renders with correct semantic level', () => {
    const { container } = render(<Heading level={1}>Heading 1</Heading>);
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
  });

  it('decouples semantic level from visual size', () => {
    render(
      <Heading level={1} size="3xl">
        H1 styled as H3
      </Heading>,
    );
    const heading = screen.getByText('H1 styled as H3');
    expect(heading.tagName).toBe('H1'); // Semantic level
    expect(heading).toHaveClass('text-3xl'); // Visual size
  });

  it('applies all variant combinations', () => {
    const { rerender } = render(<Heading level={2}>Default</Heading>);
    let heading = screen.getByText('Default');
    expect(heading).toHaveClass('font-semibold'); // Default weight

    rerender(
      <Heading level={2} size="5xl" weight="bold" color="primary">
        Styled
      </Heading>,
    );
    heading = screen.getByText('Styled');
    expect(heading).toHaveClass('text-5xl', 'font-bold', 'text-eucalyptus-600');
  });

  it('supports all heading levels', () => {
    const { container, rerender } = render(<Heading level={1}>H1</Heading>);
    expect(container.querySelector('h1')).toBeInTheDocument();

    rerender(<Heading level={2}>H2</Heading>);
    expect(container.querySelector('h2')).toBeInTheDocument();

    rerender(<Heading level={3}>H3</Heading>);
    expect(container.querySelector('h3')).toBeInTheDocument();

    rerender(<Heading level={4}>H4</Heading>);
    expect(container.querySelector('h4')).toBeInTheDocument();

    rerender(<Heading level={5}>H5</Heading>);
    expect(container.querySelector('h5')).toBeInTheDocument();

    rerender(<Heading level={6}>H6</Heading>);
    expect(container.querySelector('h6')).toBeInTheDocument();
  });

  it('applies color variants', () => {
    const { rerender } = render(
      <Heading level={1} color="primary">
        Primary
      </Heading>,
    );
    expect(screen.getByText('Primary')).toHaveClass('text-eucalyptus-600');

    rerender(
      <Heading level={1} color="muted">
        Muted
      </Heading>,
    );
    expect(screen.getByText('Muted')).toHaveClass('text-charcoal-400');
  });

  it('supports asChild prop', () => {
    render(
      <Heading level={1} asChild>
        <div>Custom element</div>
      </Heading>,
    );
    const element = screen.getByText('Custom element');
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveClass('font-semibold', 'tracking-tight');
  });

  it('merges custom className', () => {
    render(
      <Heading level={1} className="custom-class">
        Custom
      </Heading>,
    );
    const heading = screen.getByText('Custom');
    expect(heading).toHaveClass('custom-class', 'font-semibold');
  });
});
