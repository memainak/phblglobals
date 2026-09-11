import { NextRequest, NextResponse } from 'next/server';
import { enquirySchema } from '@/lib/validators';
import {
  createEnquiry,
  getEnquiriesList,
  updateEnquiryStatus,
  deleteEnquiry,
  getDistributorEnquiriesList,
  updateDistributorEnquiryStatus,
  deleteDistributorEnquiry,
} from '@/lib/queries';
import { sendEnquiryNotification } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('type') === 'distributor') {
      const distributorEnquiries = await getDistributorEnquiriesList();
      return NextResponse.json({ success: true, distributorEnquiries }, { status: 200 });
    }
    const enquiries = await getEnquiriesList();
    return NextResponse.json({ success: true, enquiries }, { status: 200 });
  } catch (err) {
    console.error('API /api/enquiry GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    const parseResult = enquirySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 422 }
      );
    }

    const { type, name, email, phone, productId, productName, message } =
      parseResult.data;

    const saved = await createEnquiry({
      type,
      name,
      email,
      phone,
      productId,
      productName,
      message,
      source: 'web-contact-form',
    });

    // Send notifications asynchronously (does not block HTTP response)
    sendEnquiryNotification(saved).catch((err) => {
      console.warn('Enquiry notification failed in background:', err);
    });

    return NextResponse.json({ success: true, enquiryId: saved.id }, { status: 201 });
  } catch (err) {
    console.error('API /api/enquiry error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing enquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, isDistributor } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    if (isDistributor) {
      await updateDistributorEnquiryStatus(id, status);
    } else {
      await updateEnquiryStatus(id, status);
    }

    return NextResponse.json({ success: true, id, status }, { status: 200 });
  } catch (err) {
    console.error('API /api/enquiry PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    const isDistributor = searchParams.get('isDistributor') === 'true';

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // empty
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    if (isDistributor) {
      await deleteDistributorEnquiry(id);
    } else {
      await deleteEnquiry(id);
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (err) {
    console.error('API /api/enquiry DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
