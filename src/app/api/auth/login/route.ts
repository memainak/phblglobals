import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { idToken, email, password } = await req.json();

    // In production with Firebase Client SDK, client sends idToken after signInWithEmailAndPassword
    if (idToken && adminAuth) {
      const decoded = await adminAuth.verifyIdToken(idToken);

      // Verify that UID exists in the 'admins' collection
      if (adminDb) {
        const adminDoc = await adminDb.collection('admins').doc(decoded.uid).get();
        if (!adminDoc.exists) {
          return NextResponse.json(
            { error: 'Unauthorized: User is not designated in the admins registry.' },
            { status: 403 }
          );
        }
      }

      const res = NextResponse.json({ success: true, uid: decoded.uid });
      res.cookies.set('phbl_admin_session', decoded.uid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return res;
    }

    // Local development fallback authentication when Firebase Auth credentials are not yet deployed
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@phblglobals.com';
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'phbl@2024';

    if (email === adminEmail && password === adminPass) {
      const res = NextResponse.json({ success: true, role: 'superadmin' });
      res.cookies.set('phbl_admin_session', 'phbl-admin-authorized-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    return NextResponse.json(
      { error: 'Invalid administrator email or password.' },
      { status: 401 }
    );
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
