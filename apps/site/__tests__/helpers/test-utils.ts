/**
 * Basic test utilities for the CarinyaParc site
 *
 * This minimal implementation avoids complex dependencies
 * that might cause issues with the test runner.
 */

import { expect } from 'vitest';

// For our simple test needs, we can handle the basic DOM manipulation
export function render(ui: any) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Very basic React-like render
  try {
    // @ts-ignore - Simple render
    if (typeof ui.type === 'function') {
      const component = ui.type(ui.props || {});
      container.innerHTML = typeof component === 'string' ? component : '';
    } else {
      container.innerHTML = ui;
    }
  } catch (e) {
    console.error('Render error:', e);
  }

  return { container };
}

export const screen = {
  getByText: (text: string | RegExp) => {
    const textContent =
      typeof text === 'string' ? text : text.source.replace(/\\/g, '').replace(/^\^|\$$/g, '');

    const elements = Array.from(document.querySelectorAll('*')).filter((el) =>
      el.textContent?.includes(textContent),
    );

    if (elements.length === 0) {
      throw new Error(`Could not find text: ${textContent}`);
    }

    return elements[0];
  },

  getByLabelText: (text: string | RegExp) => {
    const textContent =
      typeof text === 'string' ? text : text.source.replace(/\\/g, '').replace(/^\^|\$$/g, '');

    const labels = Array.from(document.querySelectorAll('label')).filter((el) =>
      el.textContent?.includes(textContent),
    );

    if (labels.length === 0) {
      throw new Error(`Could not find label: ${textContent}`);
    }

    const input = document.getElementById(labels[0]!.htmlFor);
    if (!input) {
      throw new Error(`No input found for label: ${textContent}`);
    }

    return input;
  },

  getByRole: (role: string, options: any = {}) => {
    const elements = Array.from(document.querySelectorAll(`[role="${role}"]`));
    if (options.name) {
      const name =
        typeof options.name === 'string'
          ? options.name
          : options.name.source.replace(/\\/g, '').replace(/^\^|\$$/g, '');

      const filtered = elements.filter((el) => el.textContent?.includes(name));
      if (filtered.length) return filtered[0];
    }

    return elements[0];
  },

  getByTestId: (testId: string) => {
    return document.querySelector(`[data-testid="${testId}"]`) as Element;
  },
};

export function waitFor(callback: Function) {
  return Promise.resolve().then(() => callback());
}

export function cleanup() {
  document.body.innerHTML = '';
}

// Add basic matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = Boolean(received && document.body.contains(received));
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
    };
  },

  toHaveClass(received, ...expected) {
    const classList = Array.from(received?.classList || []);
    const pass = expected.every((className) => classList.includes(className));
    return {
      pass,
      message: () =>
        `expected element ${pass ? 'not ' : ''}to have classes: ${expected.join(', ')}`,
    };
  },

  toHaveAttribute(received, attr, value) {
    const hasAttr = received?.hasAttribute(attr);
    const attrValue = received?.getAttribute(attr);
    const pass = hasAttr && (value === undefined || attrValue === value);

    return {
      pass,
      message: () =>
        `expected element ${pass ? 'not ' : ''}to have attribute: ${attr}${value !== undefined ? ` with value ${value}` : ''}`,
    };
  },

  toHaveValue(received, value) {
    // @ts-ignore - Simple check for value
    const pass = received?.value === value;
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to have value: ${value}`,
    };
  },
});
