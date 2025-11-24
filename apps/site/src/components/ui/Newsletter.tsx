'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setEmail('');
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
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate flex flex-col gap-10 overflow-hidden bg-eucalyptus-600 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:flex-row xl:items-center xl:py-32">
          <div className="flex-1 max-w-xl">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              Stay Connected to Us
            </h2>
            <p className="mt-4 text-lg text-eucalyptus-100">
              Stay updated with our regeneration progress, farm events or product announcements from
              Carinya Parc.
            </p>
          </div>
          <div className="flex-1 flex justify-center xl:justify-end">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md"
              suppressHydrationWarning={true}
            >
              <div className="flex gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  className="min-w-0 flex-auto rounded-md bg-white/10 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-white/75 focus:outline-2 focus:-outline-offset-2 focus:outline-white sm:text-sm/6"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-eucalyptus-600 shadow-xs hover:bg-eucalyptus-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {status === 'success' && (
                <p className="mt-3 text-sm font-medium text-green-100">
                  Thank you for subscribing! You'll receive our updates soon.
                </p>
              )}

              {status === 'error' && (
                <p className="mt-3 text-sm font-medium text-red-300">{errorMessage}</p>
              )}

              <p className="mt-4 text-sm/6 text-eucalyptus-100">
                We promise to respect your privacy and your inbox. Read our{' '}
                <Link href="/legal/privacy-policy" className="font-semibold hover:text-white">
                  privacy&nbsp;policy
                </Link>
                .
              </p>
            </form>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2"
          >
            <circle r={512} cx={512} cy={512} fill="url(#newsletter-gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient
                r={1}
                cx={0}
                cy={0}
                id="newsletter-gradient"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(512 512) rotate(90) scale(512)"
              >
                <stop stopColor="#10B981" />
                <stop offset={1} stopColor="#047857" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
