import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Allowed mime types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF allowed.' },
        { status: 400 }
      );
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File exceeds maximum 10MB limit.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${folder}/${Date.now()}_${sanitizedName}`;

    if (adminStorage) {
      const bucket = adminStorage.bucket();
      const storageFile = bucket.file(filename);

      await storageFile.save(buffer, {
        contentType: file.type,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      await storageFile.makePublic().catch(() => {});
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: file.size,
      });
    }

    // Fallback response for local development when Firebase Storage credentials are not supplied
    return NextResponse.json({
      success: true,
      url: `/mock-storage/${filename}`,
      filename,
      size: file.size,
      note: 'Stored via mock handler. Connect Firebase service account in production.',
    });
  } catch (err) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
