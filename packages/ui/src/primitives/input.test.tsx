/**
 * Input primitive component tests
 * Task: T1.8 - Unit tests for Input with 90%+ coverage
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail } from 'lucide-react';
import { Input } from './input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies error styling when error prop is true', () => {
    render(<Input error placeholder="Email" />);
    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveClass('outline-earth-red');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with left icon', () => {
    const { container } = render(
      <Input icon={<Mail data-testid="mail-icon" />} iconPosition="left" />,
    );
    const icon = screen.getByTestId('mail-icon');
    const iconWrapper = icon.parentElement;
    expect(iconWrapper).toHaveClass('left-0');
    expect(container.querySelector('input')).toHaveClass('pl-10');
  });

  it('renders with right icon', () => {
    const { container } = render(
      <Input icon={<Mail data-testid="mail-icon" />} iconPosition="right" />,
    );
    const icon = screen.getByTestId('mail-icon');
    const iconWrapper = icon.parentElement;
    expect(iconWrapper).toHaveClass('right-0');
    expect(container.querySelector('input')).toHaveClass('pr-10');
  });

  it('defaults icon to left position', () => {
    const { container } = render(<Input icon={<Mail data-testid="mail-icon" />} />);
    const icon = screen.getByTestId('mail-icon');
    const iconWrapper = icon.parentElement;
    expect(iconWrapper).toHaveClass('left-0');
    expect(container.querySelector('input')).toHaveClass('pl-10');
  });

  it('handles user input', async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('supports disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('merges custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });
});
