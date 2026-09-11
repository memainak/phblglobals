import { NextRequest, NextResponse } from 'next/server';
import { getCertificationsList, saveCertification, deleteCertification } from '@/lib/queries';
import { Certification } from '@/types';

export async function GET() {
  try {
    const certifications = await getCertificationsList();
    return NextResponse.json({ success: true, certifications }, { status: 200 });
  } catch (err) {
    console.error('API /api/certifications GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.issuingBody) {
      return NextResponse.json(
        { error: 'Title and Issuing Body are required' },
        { status: 400 }
      );
    }

    const certData: Certification = {
      id: body.id || `cert-${Date.now()}`,
      title: body.title,
      issuingBody: body.issuingBody,
      certificateNo: body.certificateNo || 'N.A.',
      issuedOn: body.issuedOn || new Date().toISOString().split('T')[0],
      validUntil: body.validUntil || null,
      fileUrl: body.fileUrl || '/images/certificates/sample-certificate.pdf',
      thumbnailUrl: body.thumbnailUrl || '/images/certificates/sample-cert-thumb.webp',
      order: body.order ?? 10,
      published: body.published ?? true,
    };

    const saved = await saveCertification(certData);
    return NextResponse.json({ success: true, certification: saved }, { status: 200 });
  } catch (err) {
    console.error('API /api/certifications POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // empty body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Certification ID is required' }, { status: 400 });
    }

    await deleteCertification(id);
    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (err) {
    console.error('API /api/certifications DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
