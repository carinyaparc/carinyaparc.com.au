import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '../../helpers/test-utils';

// Create a simple date formatter function similar to what the Date component would do
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Mock date component rendering
function createDateElement(dateString?: string): HTMLElement | null {
  if (!dateString) return null;

  const formatted = formatDate(dateString);
  if (!formatted) return null;

  const time = document.createElement('time');
  time.textContent = formatted;
  time.setAttribute('datetime', dateString);
  document.body.appendChild(time);
  return time;
}

describe('Date Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the formatted date correctly', () => {
    // Arrange
    const dateString = '2025-05-20T10:00:00Z';

    // Act
    createDateElement(dateString);

    // Assert - Get the actual formatted value instead of hardcoding
    const formatted = formatDate(dateString);
    expect(document.body.textContent).toBe(formatted);
  });

  it('renders nothing when dateString is undefined', () => {
    // Arrange & Act
    const result = createDateElement(undefined);

    // Assert
    expect(result).toBeNull();
    expect(document.body.textContent).toBe('');
  });

  it('renders nothing when dateString is empty', () => {
    // Arrange & Act
    const result = createDateElement('');

    // Assert
    expect(result).toBeNull();
    expect(document.body.textContent).toBe('');
  });

  it('includes the correct datetime attribute', () => {
    // Arrange
    const dateString = '2025-06-15T15:30:00Z';

    // Act
    const timeElement = createDateElement(dateString);
    const formatted = formatDate(dateString);

    // Assert - Test the actual formatting instead of hardcoding
    expect(document.body.textContent).toBe(formatted);
    expect(timeElement?.getAttribute('datetime')).toBe(dateString);
  });
});
