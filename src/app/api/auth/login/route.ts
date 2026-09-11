import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { idToken } = body;
    const { email, password } = body;

    // If client sends email & password directly, authenticate via Firebase Identity Toolkit REST API
    if (!idToken && email && password) {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'Firebase authentication configuration missing.' },
          { status: 500 }
        );
      }

      const verifyRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password, returnSecureToken: true }),
        }
      );

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        const errorMsg =
          verifyData?.error?.message === 'EMAIL_NOT_FOUND' ||
          verifyData?.error?.message === 'INVALID_PASSWORD' ||
          verifyData?.error?.message === 'INVALID_LOGIN_CREDENTIALS'
            ? 'Invalid authorized email or password.'
            : verifyData?.error?.message || 'Firebase authentication failed.';

        return NextResponse.json({ error: errorMsg }, { status: 401 });
      }

      idToken = verifyData.idToken;
    }

    if (!idToken) {
      return NextResponse.json(
        { error: 'Firebase authentication credentials are required.' },
        { status: 400 }
      );
    }

    // Verify token with Firebase Admin SDK if initialized
    let uid = 'authorized-firebase-admin';
    if (adminAuth) {
      try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        uid = decoded.uid;
      } catch (verifyErr) {
        console.error('Firebase Admin ID token verification error:', verifyErr);
        return NextResponse.json(
          { error: 'Invalid or expired Firebase authentication token.' },
          { status: 401 }
        );
      }
    }

    // Set secure HTTP-only admin session cookie
    const res = NextResponse.json({ success: true, uid });
    res.cookies.set('phbl_admin_session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Authentication failed. Please verify your Firebase credentials.' },
      { status: 401 }
    );
  }
}
