/**
 * Contact Page - Server Component
 */

import type { Metadata } from 'next';
import { generateMetadata as generateMetadataHelper } from '@/src/lib/metadata';
import ContactForm from '@/src/components/forms/ContactForm';

// SEO metadata for contact page
export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataHelper({
    pageTitle: 'Contact Us',
    pageDescription:
      'Get in touch with Carinya Parc for inquiries about farm stays, tours, volunteering, or partnership opportunities. We respond to all inquiries within 48 business hours.',
    path: '/contact',
    type: 'website',
  });
}

/**
 * Contact page layout with hero section and form
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pb-12 sm:pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-eucalyptus-600 sm:text-4xl md:text-5xl">
              We'd love to hear from you!
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-charcoal-600">
              Whether you're interested in visiting the farm, learning about regenerative
              agriculture, volunteering, or exploring partnership opportunities, we'd love to hear
              from you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative -mt-4 sm:-mt-8 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl sm:rounded-2xl bg-white px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 shadow-lg ring-1 ring-charcoal-100">
              <div className="mb-8 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-eucalyptus-600">Send Us a Message</h2>
                <p className="mt-3 sm:mt-4 text-base leading-7 text-charcoal-600">
                  We aim to respond to all inquiries within 48 business hours. For urgent matters,
                  you can also reach us directly at{' '}
                  <a
                    href="mailto:contact@carinyaparc.com.au"
                    className="font-semibold text-eucalyptus-600 hover:text-eucalyptus-500"
                  >
                    contact@carinyaparc.com.au
                  </a>
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
