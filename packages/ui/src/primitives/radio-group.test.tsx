/**
 * RadioGroup primitive component tests
 * Task: T1.9 - Unit tests for RadioGroup with 90%+ coverage
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  it('renders radio group with items', () => {
    render(
      <RadioGroup>
        <div>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>,
    );
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  it('handles value change', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <div>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByLabelText('Option 1'));
    expect(onValueChange).toHaveBeenCalledWith('option1');
  });

  it('supports disabled state', () => {
    render(
      <RadioGroup>
        <div>
          <RadioGroupItem value="option1" id="option1" disabled />
          <label htmlFor="option1">Disabled Option</label>
        </div>
      </RadioGroup>,
    );
    expect(screen.getByLabelText('Disabled Option')).toBeDisabled();
  });

  it('supports controlled value', () => {
    render(
      <RadioGroup value="option2">
        <div>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>,
    );
    const option2 = screen.getByLabelText('Option 2');
    expect(option2).toHaveAttribute('data-state', 'checked');
  });

  it('applies custom className to group', () => {
    render(<RadioGroup className="custom-class">Content</RadioGroup>);
    expect(screen.getByText('Content')).toHaveClass('custom-class', 'grid');
  });

  it('applies custom className to item', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="test" className="custom-item" id="test" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio')).toHaveClass('custom-item');
  });
});
