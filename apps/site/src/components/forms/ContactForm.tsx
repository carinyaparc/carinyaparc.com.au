/**
 * Contact form component with React Hook Form and TanStack Query
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { Label } from '@repo/ui/label';
import { Select } from '@repo/ui/select-native';
import { Alert } from '@repo/ui/alert';
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
 */
async function submitContact(
  data: ContactFormData,
): Promise<{ success: boolean; message: string }> {
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
 */
export default function ContactForm() {
  // Track form load time for anti-bot measures
  const formLoadTime = useRef<number>(Date.now());
  const [isFormReady, setIsFormReady] = useState(false);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormClientData>({
    resolver: zodResolver(contactFormClientSchema),
    mode: 'onBlur',
  });

  // TanStack Query mutation for form submission
  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      trackEvent('contact_form_success');
      reset();
      formLoadTime.current = Date.now();
    },
    onError: (err) => {
      trackEvent('contact_form_error', { error: err.message });
    },
  });

  // Track form view on mount
  useEffect(() => {
    setIsFormReady(true);
    trackEvent('contact_form_viewed');
  }, []);

  // Track when user starts filling form
  const handleFormInteraction = () => {
    trackEvent('contact_form_started');
  };

  /**
   * Handle form submission with anti-bot measures
   */
  const onSubmit = (data: ContactFormClientData) => {
    trackEvent('contact_form_submitted', { inquiry_type: data.inquiryType });

    const submissionTime = Date.now() - formLoadTime.current;
    const sanitizedData = sanitizeContactFormData(data);

    const fullData: ContactFormData = {
      ...sanitizedData,
      inquiryType: sanitizedData.inquiryType as InquiryType,
      website: '',
      submissionTime,
    };

    mutate(fullData);
  };

  // Success state UI
  if (isSuccess) {
    return (
      <Alert variant="success" className="mt-4">
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
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-xl lg:max-w-lg">
      {/* Error state UI */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Unable to send message</p>
            <p className="text-sm mt-1">
              {error?.message ||
                'Please try again or contact us directly at contact@carinyaparc.com.au'}
            </p>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">
              First Name <span className="text-earth-red">*</span>
            </Label>
            <div className="mt-2.5">
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...register('firstName')}
                onFocus={handleFormInteraction}
                disabled={isPending || isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
            </div>
            {errors.firstName && (
              <p id="firstName-error" className="mt-1 text-sm text-earth-red" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">
              Last Name <span className="text-earth-red">*</span>
            </Label>
            <div className="mt-2.5">
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                {...register('lastName')}
                disabled={isPending || isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
            </div>
            {errors.lastName && (
              <p id="lastName-error" className="mt-1 text-sm text-earth-red" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="sm:col-span-2">
            <Label htmlFor="email">
              Email Address <span className="text-earth-red">*</span>
            </Label>
            <div className="mt-2.5">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                disabled={isPending || isSubmitting}
                placeholder="you@example.com"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-earth-red" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number - optional */}
          <div className="sm:col-span-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-sm text-charcoal-400">(optional)</span>
            </Label>
            <div className="mt-2.5">
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+61 4XX XXX XXX"
                {...register('phone')}
                disabled={isPending || isSubmitting}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
            </div>
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-earth-red" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Type of Inquiry */}
          <div className="sm:col-span-2">
            <Label htmlFor="inquiryType">
              Type of Inquiry <span className="text-earth-red">*</span>
            </Label>
            <div className="mt-2.5">
              <Select
                id="inquiryType"
                {...register('inquiryType')}
                disabled={isPending || isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.inquiryType}
                aria-describedby={errors.inquiryType ? 'inquiryType-error' : undefined}
              >
                <option value="">Select your inquiry type</option>
                {inquiryTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'tours' ? 'Farm Tours' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
            {errors.inquiryType && (
              <p id="inquiryType-error" className="mt-1 text-sm text-earth-red" role="alert">
                {errors.inquiryType.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <Label htmlFor="message">
              Message <span className="text-earth-red">*</span>
            </Label>
            <div className="mt-2.5">
              <Textarea
                id="message"
                rows={5}
                {...register('message')}
                disabled={isPending || isSubmitting}
                placeholder="Tell us about your inquiry..."
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                maxLength={500}
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

          {/* Honeypot field - hidden from users */}
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
            <Button
              type="submit"
              disabled={isPending || isSubmitting || !isFormReady}
              className="w-full"
            >
              {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {isPending ? 'Sending Message...' : 'Send Message'}
            </Button>

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
        </div>
      </form>
    </div>
  );
}
