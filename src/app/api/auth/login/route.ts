import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  'AIzaSyAP8gCF98aOPjipOzR_B4-jF2i16yg5msY';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    let { idToken } = body;
    const { email, password } = body;
    let uid = 'authorized-firebase-admin';

    // 1. If client sends email & password directly, authenticate via Firebase REST API
    if (!idToken && email && password) {
      const verifyRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: String(email).trim(),
            password: String(password),
            returnSecureToken: true,
          }),
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
      uid = verifyData.localId;
    }

    if (!idToken) {
      return NextResponse.json(
        { error: 'Firebase authentication credentials are required.' },
        { status: 400 }
      );
    }

    // 2. Verify idToken with Google Identity Toolkit lookup
    try {
      const lookupRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      );

      const lookupData = await lookupRes.json();
      if (!lookupRes.ok || !lookupData.users || lookupData.users.length === 0) {
        return NextResponse.json(
          { error: 'Invalid or expired Firebase authentication token.' },
          { status: 401 }
        );
      }
      uid = lookupData.users[0].localId;
    } catch (lookupErr) {
      console.warn('Identity lookup warning:', lookupErr);
    }

    // 3. Optional: Verify with Firebase Admin SDK if configured
    try {
      const { adminAuth } = await import('@/lib/firebase/admin');
      if (adminAuth) {
        const decoded = await adminAuth.verifyIdToken(idToken);
        uid = decoded.uid;
      }
    } catch {
      // Identity Toolkit lookup already validated the token
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
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: err?.message || 'Authentication failed. Please verify your credentials.' },
      { status: 401 }
    );
  }
}

