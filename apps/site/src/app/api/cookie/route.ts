import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CONSENT_COOKIE_NAME } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const { consent } = await req.json();

    if (!consent || !['accepted', 'rejected'].includes(consent)) {
      return NextResponse.json({ error: 'Invalid consent value' }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set(CONSENT_COOKIE_NAME, consent, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting cookie consent:', error);
    return NextResponse.json({ error: 'Failed to set cookie consent' }, { status: 500 });
  }
}
