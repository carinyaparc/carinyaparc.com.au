'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONSENT_COOKIE_NAME } from '@/src/lib/constants';

export default function CookiePolicy() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check for cookie consent cookie using document.cookie on initialization
    if (typeof document !== 'undefined') {
      const hasCookieConsent = document.cookie
        .split('; ')
        .some((cookie) => cookie.startsWith(`${CONSENT_COOKIE_NAME}=`));
      return !hasCookieConsent;
    }
    return false;
  });
  const router = useRouter();

  const handleAccept = async () => {
    try {
      // Set consent via API call to use HTTP-only cookies
      const response = await fetch('/api/cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consent: 'accepted' }),
      });

      if (response.ok) {
        setIsVisible(false);
        // Refresh to ensure the cookie is properly applied
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to set cookie consent:', error);
    }
  };

  const handleReject = async () => {
    try {
      // Set rejection via API call to use HTTP-only cookies
      const response = await fetch('/api/cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consent: 'rejected' }),
      });

      if (response.ok) {
        setIsVisible(false);
        // Refresh to ensure the cookie is properly applied
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to set cookie consent:', error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6 z-50">
      <div className="pointer-events-auto ml-auto max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
        <p className="text-sm/6 text-charcoal-600">
          This website uses cookies to supplement a balanced diet and provide a much deserved reward
          to the senses after consuming bland but nutritious meals. Accepting our cookies is
          optional but recommended, as they are delicious. See our{' '}
          <Link href="/legal/privacy-policy" className="font-semibold text-eucalyptus-600">
            cookie policy
          </Link>
          .
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-md bg-charcoal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-charcoal-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal-600"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="text-sm/6 font-semibold text-charcoal-600"
          >
            Reject all
          </button>
        </div>
      </div>
    </div>
  );
}
