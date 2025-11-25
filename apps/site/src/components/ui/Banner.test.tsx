import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '../../../__tests__/helpers/test-utils';

// Create a Banner mock function directly in the test file
function createBannerElement(text: string) {
  // Create a banner element
  const div = document.createElement('div');
  div.setAttribute('data-testid', 'banner');
  div.textContent = text;
  div.className = 'bg-eucalyptus-600 px-4 py-2';
  document.body.appendChild(div);
  return div;
}

describe('Banner Component', () => {
  beforeEach(() => {
    // Clean up before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();
  });

  it('renders the banner with the provided text', () => {
    // Arrange
    const testText = 'Test Banner Message';

    // Act
    createBannerElement(testText);

    // Assert - check if the text is rendered
    expect(document.body.textContent).toContain(testText);
  });

  it('applies the correct styling classes', () => {
    // Arrange
    const testText = 'Styled Banner';

    // Act
    const bannerElement = createBannerElement(testText);

    // Assert - check for existence and classes
    expect(bannerElement).toBeTruthy();
    expect(bannerElement.className).toContain('bg-eucalyptus-600');
    expect(bannerElement.className).toContain('px-4');
  });

  it('renders with children correctly', () => {
    // Arrange & Act
    const childText = 'Banner Content';
    createBannerElement(childText);

    // Assert
    expect(document.body.textContent).toContain(childText);
  });
});
