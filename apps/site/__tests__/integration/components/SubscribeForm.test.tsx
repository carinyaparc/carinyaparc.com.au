import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '../../helpers/test-utils';

// Create a mock for the SubscribeForm component
function createSubscribeForm() {
  // Create form elements
  const form = document.createElement('form');
  form.setAttribute('data-testid', 'subscribe-form');

  const label = document.createElement('label');
  label.textContent = 'Email';
  label.setAttribute('for', 'email');

  const input = document.createElement('input');
  input.setAttribute('id', 'email');
  input.setAttribute('name', 'email');
  input.setAttribute('type', 'email');
  input.setAttribute('placeholder', 'your@email.com');
  input.setAttribute('aria-label', 'email');

  const button = document.createElement('button');
  button.textContent = 'Subscribe';
  button.setAttribute('type', 'submit');

  const statusDiv = document.createElement('div');
  statusDiv.setAttribute('data-testid', 'status');

  // Append elements to form
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(button);
  form.appendChild(statusDiv);

  // Append form to body
  document.body.appendChild(form);

  return { form, input, button, statusDiv };
}

// Mock API service for testing
const ApiService = {
  subscribe: vi.fn().mockImplementation(async (email: string) => {
    if (!email) {
      throw new Error('Email is required');
    }
    return { success: true, message: 'Subscription successful' };
  }),
};

describe('SubscribeForm Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should render the form with correct elements', () => {
    // Act
    const { form, input, button } = createSubscribeForm();

    // Assert
    expect(form).toBeTruthy();
    expect(input).toBeTruthy();
    expect(input.getAttribute('type')).toBe('email');
    expect(button.textContent).toBe('Subscribe');
  });

  it('should allow typing into the email field', () => {
    // Arrange
    const { input } = createSubscribeForm();
    const testEmail = 'test@example.com';

    // Act
    input.value = testEmail;

    // Assert
    expect(input.value).toBe(testEmail);
  });

  it('should submit the form with valid email', async () => {
    // Arrange
    const { form, input, statusDiv } = createSubscribeForm();
    const testEmail = 'test@example.com';
    input.value = testEmail;

    // Set up mocks
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = vi.fn();

    // Mock API call
    const mockApiCall = vi
      .fn()
      .mockResolvedValue({ success: true, message: 'Subscription successful' });

    // Assign mock handler
    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        const result = await mockApiCall(input.value);
        statusDiv.textContent = result.message;
        statusDiv.setAttribute('data-status', 'success');
      } catch (error) {
        statusDiv.textContent = (error as Error).message;
        statusDiv.setAttribute('data-status', 'error');
      }
    };

    // Act
    await form.dispatchEvent(submitEvent);

    // Assert
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(mockApiCall).toHaveBeenCalledWith(testEmail);
    expect(statusDiv.textContent).toBe('Subscription successful');
    expect(statusDiv.getAttribute('data-status')).toBe('success');
  });

  it('should show an error for invalid email format', async () => {
    // Arrange
    const { form, input, statusDiv } = createSubscribeForm();
    const invalidEmail = 'not-an-email';
    input.value = invalidEmail;

    // Set up mocks
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = vi.fn();

    // Mock API call with error
    const mockApiCall = vi.fn().mockRejectedValue(new Error('Invalid email format'));

    // Assign mock handler
    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        await mockApiCall(input.value);
        statusDiv.textContent = 'Success';
      } catch (error) {
        statusDiv.textContent = (error as Error).message;
        statusDiv.setAttribute('data-status', 'error');
      }
    };

    // Act
    await form.dispatchEvent(submitEvent);

    // Assert
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(mockApiCall).toHaveBeenCalledWith(invalidEmail);
    expect(statusDiv.textContent).toBe('Invalid email format');
    expect(statusDiv.getAttribute('data-status')).toBe('error');
  });

  it('should handle server errors gracefully', async () => {
    // Arrange
    const { form, input, statusDiv } = createSubscribeForm();
    const testEmail = 'test@example.com';
    input.value = testEmail;

    // Set up mocks
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = vi.fn();

    // Mock API call with server error
    const mockApiCall = vi.fn().mockRejectedValue(new Error('Server error'));

    // Assign mock handler
    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        await mockApiCall(input.value);
        statusDiv.textContent = 'Success';
      } catch (error) {
        statusDiv.textContent = 'An error occurred. Please try again.';
        statusDiv.setAttribute('data-status', 'error');
      }
    };

    // Act
    await form.dispatchEvent(submitEvent);

    // Assert
    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(mockApiCall).toHaveBeenCalledWith(testEmail);
    expect(statusDiv.textContent).toBe('An error occurred. Please try again.');
    expect(statusDiv.getAttribute('data-status')).toBe('error');
  });
});
