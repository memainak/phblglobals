import { NextRequest, NextResponse } from 'next/server';
import { distributorEnquirySchema } from '@/lib/validators';
import { createDistributorEnquiry } from '@/lib/queries';
import { sendDistributorNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.honeypot) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    const parseResult = distributorEnquirySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 422 }
      );
    }

    const saved = await createDistributorEnquiry(parseResult.data);

    // Send notifications asynchronously
    sendDistributorNotification(saved).catch((err) => {
      console.warn('Distributor notification failed in background:', err);
    });

    return NextResponse.json({ success: true, distributorId: saved.id }, { status: 201 });
  } catch (err) {
    console.error('API /api/distributor-enquiry error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing distributor application' },
      { status: 500 }
    );
  }
}
