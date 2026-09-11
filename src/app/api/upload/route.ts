import fs from 'fs';
import path from 'path';
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
      'image/svg+xml',
      'application/pdf',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, SVG, and PDF allowed.' },
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

    // 1. Try Firebase Storage if bucket is configured
    if (adminStorage) {
      try {
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
      } catch (storageErr) {
        console.warn('Firebase Storage upload failed, writing to public directory:', storageErr);
      }
    }

    // 2. Local public storage fallback (Instant, zero-config image serving)
    try {
      const targetDir = path.join(process.cwd(), 'public', folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const diskFilename = `${Date.now()}_${sanitizedName}`;
      const filePath = path.join(targetDir, diskFilename);
      fs.writeFileSync(filePath, buffer);

      const localUrl = `/${folder}/${diskFilename}`;
      return NextResponse.json({
        success: true,
        url: localUrl,
        filename: `${folder}/${diskFilename}`,
        size: file.size,
      });
    } catch (fsErr) {
      console.error('File system write error:', fsErr);
      return NextResponse.json({ error: 'Failed to write file to disk' }, { status: 500 });
    }
  } catch (err) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
