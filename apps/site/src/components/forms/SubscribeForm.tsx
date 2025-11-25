'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/cn';

export interface FormData {
  email: string;
  name: string;
  interests: string;
  website?: string; // honeypot field
  submissionTime?: number;
}

interface SubscribeFormProps {
  showName?: boolean;
  showInterests?: boolean;
}

export default function SubscribeForm({
  showName = true,
  showInterests = true,
}: SubscribeFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    interests: '',
    website: '', // honeypot field
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formLoadTime] = useState<number>(() => Date.now());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Check for honeypot field
    if (formData.website) {
      // Honeypot triggered - simulate success but don't submit
      // Wait a bit to simulate submission
      setTimeout(() => {
        setStatus('success');
        setFormData({ email: '', name: '', interests: '', website: '' });
      }, 1000);
      return;
    }

    // Add submission time for anti-bot checks
    const submissionData = {
      ...formData,
      submissionTime: Date.now() - formLoadTime,
    };

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData({ email: '', name: '', interests: '', website: '' });
      } else {
        console.error('Subscription failed:', data.error);
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe. Please try again later.');
      }
    } catch (err) {
      console.error('Error:', err);
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-8">
      <div className="mx-auto max-w-xl lg:max-w-lg">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* Honeypot field - hidden from humans but visible to bots */}
          <div className="sm:col-span-2" aria-hidden="true" style={{ display: 'none' }}>
            <label htmlFor="website" className="block text-sm/6 font-semibold text-charcoal-600">
              Website
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="website"
                id="website"
                value={formData.website}
                onChange={handleInputChange}
                tabIndex={-1}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3.5 py-2"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-charcoal-600">
              Email Address*
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={status === 'loading' || status === 'success'}
                placeholder="you@example.com"
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
              />
            </div>
          </div>
          {showName && (
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm/6 font-semibold text-charcoal-600">
                Your Name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={status === 'loading' || status === 'success'}
                  placeholder="Your name"
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 placeholder:text-charcoal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
                />
              </div>
            </div>
          )}
          {showInterests && (
            <div className="sm:col-span-2">
              <label
                htmlFor="interests"
                className="block text-sm/6 font-semibold text-charcoal-600"
              >
                What interests you most about Carinya Parc?
              </label>
              <div className="mt-2.5">
                <select
                  name="interests"
                  id="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  disabled={status === 'loading' || status === 'success'}
                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-charcoal-600 outline-1 -outline-offset-1 outline-charcoal-300 placeholder:text-charcoal-400 focus:outline-2 focus:-outline-offset-2 focus:outline-eucalyptus-600 disabled:bg-gray-50"
                >
                  <option value="">Select your main interest</option>
                  <option value="regeneration">Ecological restoration</option>
                  <option value="farming">Regenerative farming</option>
                  <option value="community">Community involvement</option>
                  <option value="produce">Future produce</option>
                  <option value="learning">Learning opportunities</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col">
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eucalyptus-600 disabled:opacity-70 flex items-center justify-center',
              status === 'success'
                ? 'bg-eucalyptus-400'
                : 'bg-eucalyptus-600 hover:bg-eucalyptus-500',
            )}
          >
            {status === 'loading' && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {status === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
            {status === 'loading'
              ? 'Subscribing...'
              : status === 'success'
                ? 'Subscribed!'
                : 'Subscribe to Our Newsletter'}
          </button>

          {status === 'success' && (
            <div className="mt-4 p-3 rounded-md bg-eucalyptus-50 text-eucalyptus-800 border border-eucalyptus-200 flex items-start">
              <CheckCircle className="h-5 w-5 text-eucalyptus-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Thank you for subscribing! We've sent a confirmation email to your inbox. Please
                check your email to complete your subscription.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800 border border-red-200 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <p className="mt-4 text-sm/6 text-gray-500">
            We promise to respect your privacy and your inbox. Read our{' '}
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
  );
}
