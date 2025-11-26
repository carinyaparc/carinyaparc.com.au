/**
 * ContactForm Client Component
 * Implements: T2.2, T2.3, T2.4, T2.5, T2.6, FR-002, FR-003, FR-004, FR-007, FR-008, FR-011
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/cn';
import Link from 'next/link';
import {
  contactFormClientSchema,
  type ContactFormClientData,
  type ContactFormData,
  inquiryTypes,
  type InquiryType,
} from '@/src/lib/validation/contact-schema';
import { sanitizeContactFormData } from '@/src/lib/validation/sanitize';

// Vercel Analytics tracking (if available)
const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && 'va' in window) {
    (window as any).va('track', eventName, properties);
  }
};

/**
 * Submit contact form data to API endpoint
 * FR-004: Form submission must POST to `/api/contact`
 */
async function submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to submit form');
  }

  return result;
}

/**
 * Contact form component with React Hook Form and TanStack Query
 * FR-002: Implements all required form fields
 * FR-003: Client-side validation via zodResolver
 * NFR-002: Fully keyboard navigable and accessible
 */
export default function ContactForm() {
  // Track form load time for anti-bot measures (FR-011)
  const formLoadTime = useRef<number>(Date.now());
  const [isFormReady, setIsFormReady] = useState(false);

  // React Hook Form setup with Zod validation (T2.3)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormClientData>({
    resolver: zodResolver(contactFormClientSchema),
    mode: 'onBlur', // Real-time validation on blur
  });

  // TanStack Query mutation for form submission (T2.4)
  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      // Track success event (T2.6)
      trackEvent('contact_form_success');
      // Reset form after successful submission
      reset();
      // Reset form load time for next submission
      formLoadTime.current = Date.now();
    },
    onError: (err) => {
      // Track error event (T2.6)
      trackEvent('contact_form_error', { error: err.message });
    },
  });

  // Track form view on mount (T2.6)
  useEffect(() => {
    setIsFormReady(true);
    trackEvent('contact_form_viewed');
  }, []);

  // Track when user starts filling form (T2.6)
  const handleFormInteraction = () => {
    trackEvent('contact_form_started');
  };

  /**
   * Handle form submission with anti-bot measures
   * FR-011: Implements spam protection
   */
  const onSubmit = (data: ContactFormClientData) => {
    // Track submission attempt (T2.6)
    trackEvent('contact_form_submitted', { inquiry_type: data.inquiryType });

    // Calculate submission time (anti-bot measure)
    const submissionTime = Date.now() - formLoadTime.current;

    // Sanitize form data before submission
    const sanitizedData = sanitizeContactFormData(data);

    // Prepare full submission data with anti-bot fields
    const fullData: ContactFormData = {
      ...sanitizedData,
      inquiryType: sanitizedData.inquiryType as InquiryType, // Ensure type safety
      website: '', // Honeypot field (should remain empty)
      submissionTime,
    };

    // Submit via mutation
    mutate(fullData);
  };

  // Success state UI (T2.5, FR-007)
  if (isSuccess) {
    return (
      <div className="mt-4 p-3 rounded-md bg-eucalyptus-50 text-eucalyptus-800 border border-eucalyptus-200 flex items-start">
        <CheckCircle className="h-5 w-5 text-eucalyptus-500 mr-2 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Thank you for your inquiry!</p>
          <p className="text-sm mt-1">
            We've received your message and will respond within 48 business hours.
          </p>
          <button
            onClick={() => {
              reset();
              formLoadTime.current = Date.now();
            }}
            className="mt-3 text-sm font-semibold text-eucalyptus-600 hover:text-eucalyptus-500 underline"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl lg:max-w-lg">
      {/* Error state UI (T2.5, FR-008) */}
      {isError && (
        <div className="mb-6 p-3 rounded-md bg-red-50 text-red-800 border border-red-200 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Unable to send message</p>
            <p className="text-sm mt-1">
              {error?.message || 'Please try again or contact us directly at contact@carinyaparc.com.au'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* First Name (FR-002) */}
          <div>
          <label htmlFor="firstName" className="block text-sm/6 font-semibold text-charcoal-600">
            First Name <span className="text-earth-red">*</span>
          </label>
          <div className="mt-2.5">
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register('firstName')}
              onFocus={handleFormInteraction}
              disabled={isPending || isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 placeholder:text-charcoal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
            />
          </div>
          {errors.firstName && (
            <p id="firstName-error" className="mt-1 text-sm text-earth-red" role="alert">
              {errors.firstName.message}
            </p>
          )}
          </div>

          {/* Last Name (FR-002) */}
          <div>
          <label htmlFor="lastName" className="block text-sm/6 font-semibold text-charcoal-600">
            Last Name <span className="text-earth-red">*</span>
          </label>
          <div className="mt-2.5">
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register('lastName')}
              disabled={isPending || isSubmitting}
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 placeholder:text-charcoal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
            />
          </div>
          {errors.lastName && (
            <p id="lastName-error" className="mt-1 text-sm text-earth-red" role="alert">
              {errors.lastName.message}
            </p>
          )}
          </div>

          {/* Email field (FR-002) */}
          <div className="sm:col-span-2">
        <label htmlFor="email" className="block text-sm/6 font-semibold text-charcoal-600">
          Email Address <span className="text-earth-red">*</span>
        </label>
        <div className="mt-2.5">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            disabled={isPending || isSubmitting}
            placeholder="you@example.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 placeholder:text-charcoal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
          />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-earth-red" role="alert">
            {errors.email.message}
          </p>
        )}
          </div>

          {/* Phone field - optional (FR-002) */}
          <div className="sm:col-span-2">
        <label htmlFor="phone" className="block text-sm/6 font-semibold text-charcoal-600">
          Phone Number <span className="text-sm text-charcoal-400">(optional)</span>
        </label>
        <div className="mt-2.5">
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+61 4XX XXX XXX"
            {...register('phone')}
            disabled={isPending || isSubmitting}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 placeholder:text-charcoal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
          />
        </div>
        {errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-earth-red" role="alert">
            {errors.phone.message}
          </p>
        )}
          </div>

          {/* Inquiry Type (FR-002) */}
          <div className="sm:col-span-2">
        <label htmlFor="inquiryType" className="block text-sm/6 font-semibold text-charcoal-600">
          Type of Inquiry <span className="text-earth-red">*</span>
        </label>
        <div className="mt-2.5">
          <select
            id="inquiryType"
            {...register('inquiryType')}
            disabled={isPending || isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.inquiryType}
            aria-describedby={errors.inquiryType ? 'inquiryType-error' : undefined}
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
          >
            <option value="">Select your inquiry type</option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'tours' ? 'Farm Tours' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {errors.inquiryType && (
          <p id="inquiryType-error" className="mt-1 text-sm text-earth-red" role="alert">
            {errors.inquiryType.message}
          </p>
        )}
          </div>

          {/* Message field with character counter (FR-002) */}
          <div className="sm:col-span-2">
        <label htmlFor="message" className="block text-sm/6 font-semibold text-charcoal-600">
          Message <span className="text-earth-red">*</span>
        </label>
        <div className="mt-2.5">
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            disabled={isPending || isSubmitting}
            placeholder="Tell us about your inquiry..."
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : 'message-hint'}
            maxLength={500}
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 placeholder:text-charcoal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50 resize-y"
          />
        </div>
        <p id="message-hint" className="mt-1 text-sm text-charcoal-400">
          Please provide details about your inquiry (50-500 characters)
        </p>
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-earth-red" role="alert">
            {errors.message.message}
          </p>
        )}
          </div>

          {/* Honeypot field - hidden from users (FR-011) */}
          <div className="sm:col-span-2" aria-hidden="true" style={{ display: 'none' }}>
            <label htmlFor="website" className="block text-sm/6 font-semibold text-charcoal-600">
              Website
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3.5 py-2"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-8 sm:col-span-2">
        <button
          type="submit"
          disabled={isPending || isSubmitting || !isFormReady}
          className={cn(
            'w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus-600 disabled:opacity-70 flex items-center justify-center',
            isPending || !isFormReady
              ? 'bg-eucalyptus-400'
              : 'bg-eucalyptus-600 hover:bg-eucalyptus-500',
          )}
        >
          {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {isPending ? 'Sending Message...' : 'Send Message'}
        </button>

        {/* Additional help text */}
        <p className="mt-4 text-sm/6 text-charcoal-400 text-center">
          By submitting this form, you agree to our{' '}
          <Link
            href="/legal/privacy-policy"
            className="font-semibold text-eucalyptus-600 hover:text-eucalyptus-500"
          >
            Privacy Policy
          </Link>
          .
        </p>
        </div>
      </form>
    </div>
  );
}
