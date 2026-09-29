import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry, getTherapeuticBrochure, getDownloadsList, saveDownload } from '@/lib/queries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Validation
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').trim().replace(/[^\d+]/g, '');
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid name (at least 2 characters).' },
        { status: 422 }
      );
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Please provide a valid 10-digit mobile number for dispatch.' },
        { status: 422 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 422 }
      );
    }

    // Save lead to backend database (Enquiries collection)
    const savedEnquiry = await createEnquiry({
      type: 'Therapeutic Index Booklet',
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      message: 'Requested official 44-Page Therapeutic Index brochure download from Landing Page.',
      source: 'landing-page-brochure',
    });

    // Increment download count for the brochure in downloads table if found
    try {
      const allDownloads = await getDownloadsList();
      const brochureItem = allDownloads.find(
        (d) => d.category === 'Therapeutic Index' || d.id === 'dl-01'
      );
      if (brochureItem) {
        await saveDownload({
          ...brochureItem,
          downloadCount: (brochureItem.downloadCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (countErr) {
      console.warn('Could not increment download count:', countErr);
    }

    // Fetch the active brochure configured in backend
    const brochure = await getTherapeuticBrochure();

    return NextResponse.json(
      {
        success: true,
        enquiryId: savedEnquiry.id,
        downloadUrl: brochure.fileUrl,
        fileName: 'PHBL-Therapeutic-Index-Brochure.pdf',
        brochure: {
          title: brochure.title,
          fileUrl: brochure.fileUrl,
          fileSize: brochure.fileSize,
          totalPages: brochure.totalPages,
          edition: brochure.edition,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('API /api/brochure-download error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing brochure request.' },
      { status: 500 }
    );
  }
}
