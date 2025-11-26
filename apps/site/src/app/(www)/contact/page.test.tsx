/**
 * Unit tests for Contact Page
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactPage, { generateMetadata } from './page';

// Mock the ContactForm component
vi.mock('@/src/components/forms/ContactForm', () => ({
  default: () => <div data-testid="contact-form">Contact Form Mock</div>,
}));

describe('ContactPage', () => {
  describe('page render', () => {
    it('should render the contact page with all sections', () => {
      render(<ContactPage />);

      expect(screen.getByRole('heading', { name: /we'd love to hear from you/i, level: 1 })).toBeInTheDocument();
      expect(
        screen.getByText(/whether you're interested in visiting the farm/i)
      ).toBeInTheDocument();

      expect(screen.getByRole('heading', { name: /send us a message/i, level: 2 })).toBeInTheDocument();
      expect(screen.getByText(/48 business hours/i)).toBeInTheDocument();

      const emailLink = screen.getByRole('link', { name: /contact@carinyaparc\.com\.au/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:contact@carinyaparc.com.au');

      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

  });

  describe('generateMetadata', () => {
    it('should generate correct metadata for SEO', async () => {
      const metadata = await generateMetadata();

      // Check basic metadata
      expect(metadata.title).toContain('Contact Us');
      expect(metadata.description).toContain('Get in touch with Carinya Parc');
      expect(metadata.description).toContain('farm stays');
      expect(metadata.description).toContain('tours');
      expect(metadata.description).toContain('volunteering');
      expect(metadata.description).toContain('partnership');

      // Check Open Graph metadata
      expect(metadata.openGraph?.title).toContain('Contact Carinya Parc');
      expect(metadata.openGraph?.description).toContain('48 business hours');
    });
  });
});
