import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    if (adminDb) {
      try {
        const docRef = adminDb.collection('downloads').doc(id);
        await docRef.update({
          downloadCount: FieldValue.increment(1),
        });
      } catch (err) {
        console.warn('Could not update live download count:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true }); // do not fail client
  }
}
