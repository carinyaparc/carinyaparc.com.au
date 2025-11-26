/**
 * Unit tests for Contact Page
 * Implements: T2.8, tests for FR-001, FR-009, FR-010
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

      // Check hero section
      expect(screen.getByRole('heading', { name: /get in touch/i, level: 1 })).toBeInTheDocument();
      expect(
        screen.getByText(/whether you're interested in visiting the farm/i)
      ).toBeInTheDocument();

      // Check introductory text (FR-009)
      expect(screen.getByRole('heading', { name: /send us a message/i, level: 2 })).toBeInTheDocument();
      expect(screen.getByText(/48 business hours/i)).toBeInTheDocument();

      // Check fallback email is displayed (FR-010)
      const emailLink = screen.getByRole('link', { name: /contact@carinyaparc\.com\.au/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:contact@carinyaparc.com.au');

      // Check contact form is rendered
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

    it('should display additional information cards', () => {
      render(<ContactPage />);

      // Check response time card
      expect(screen.getByRole('heading', { name: /response time/i, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(/typically respond within 48 business hours/i)).toBeInTheDocument();

      // Check location card
      expect(screen.getByRole('heading', { name: /location/i, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(/moss vale region/i)).toBeInTheDocument();

      // Check international card
      expect(screen.getByRole('heading', { name: /international/i, level: 3 })).toBeInTheDocument();
      expect(screen.getByText(/welcome inquiries from around the world/i)).toBeInTheDocument();
    });
  });

  describe('generateMetadata', () => {
    it('should generate correct metadata for SEO (FR-001)', async () => {
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
