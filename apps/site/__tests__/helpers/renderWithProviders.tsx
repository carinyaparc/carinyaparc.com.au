import React from 'react';
import { render, screen, cleanup } from './test-utils';

/**
 * Simple user event mock
 */
const userEvent = {
  setup: () => ({
    click: (element: Element) => {
      if (element instanceof HTMLElement) {
        element.click();
      }
    },
    type: (element: Element, text: string) => {
      if (element instanceof HTMLInputElement) {
        element.value = text;
        // Dispatch input event
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
      }
    },
    tab: () => {
      // Simple tab simulation
    },
  }),
};

/**
 * Custom renderer that wraps components with necessary providers
 */
export function renderWithProviders(ui: React.ReactElement, options?: any) {
  cleanup(); // Clean up before each test

  const rendered = render(ui);

  return {
    user: userEvent.setup(),
    ...rendered,
  };
}

// Add a standalone render function for simplicity
export function renderComponent(ui: React.ReactElement) {
  cleanup(); // Clean up before each test
  return render(ui);
}

// Custom hook testing
export function renderHook(hook: Function, initialProps: any = {}) {
  // A simple implementation for testing hooks
  const result = { current: hook(initialProps) };

  return {
    result,
    rerender: (newProps = {}) => {
      result.current = hook(newProps);
      return result;
    },
  };
}

// Re-export everything from test-utils
export * from './test-utils';
