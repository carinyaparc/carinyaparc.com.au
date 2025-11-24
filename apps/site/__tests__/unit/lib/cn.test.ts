import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/cn';

describe('cn', () => {
  it('should combine class names correctly', () => {
    // Test with simple string classes
    expect(cn('class1', 'class2')).toBe('class1 class2');

    // Test with conditional classes
    expect(cn('base', true && 'visible', false && 'hidden')).toBe('base visible');

    // Test with class objects
    expect(cn('base', { visible: true, hidden: false })).toBe('base visible');

    // Test with array of classes
    expect(cn('base', ['extra', 'classes'])).toBe('base extra classes');
  });

  it('should merge tailwind classes correctly', () => {
    // Test class merging
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');

    // Test with conditional Tailwind classes
    expect(cn('text-red-500', true && 'text-blue-500')).toBe('text-blue-500');
  });
});
