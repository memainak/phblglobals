import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase/admin';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder =
      (formData.get('folder') as string) ||
      req.nextUrl.searchParams.get('folder') ||
      'uploads';

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

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    let processedBuffer = rawBuffer;
    let contentType = file.type;

    // Optimize images with sharp (resize to max 1200px and convert to compressed WebP)
    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        processedBuffer = await sharp(rawBuffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        contentType = 'image/webp';
      } catch (sharpErr) {
        console.warn('Sharp optimization note:', sharpErr);
        processedBuffer = rawBuffer;
      }
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = contentType === 'image/webp' ? '.webp' : path.extname(sanitizedName) || '';
    const baseName = path.parse(sanitizedName).name;
    const filename = `${folder}/${Date.now()}_${baseName}${ext}`;

    // 1. Try Firebase Storage if bucket is configured and accessible
    if (adminStorage) {
      try {
        const bucket = adminStorage.bucket();
        const [exists] = await bucket.exists().catch(() => [false]);
        if (exists) {
          const storageFile = bucket.file(filename);
          await storageFile.save(processedBuffer, {
            contentType,
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
            size: processedBuffer.length,
          });
        }
      } catch (storageErr) {
        console.warn('Firebase Storage upload failed:', storageErr);
      }
    }

    // 2. Try writing to public directory (works in local development)
    if (!process.env.VERCEL) {
      try {
        const targetDir = path.join(process.cwd(), 'public', folder);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const diskFilename = `${Date.now()}_${baseName}${ext}`;
        const filePath = path.join(targetDir, diskFilename);
        fs.writeFileSync(filePath, processedBuffer);

        const localUrl = `/${folder}/${diskFilename}`;
        return NextResponse.json({
          success: true,
          url: localUrl,
          filename: `${folder}/${diskFilename}`,
          size: processedBuffer.length,
        });
      } catch (fsErr) {
        console.warn('Local disk write failed, falling back to data URI:', fsErr);
      }
    }

    // 3. Fallback: Return optimized Base64 Data URI
    // Guarantees 100% upload reliability on Vercel serverless without requiring read-write disk
    const base64String = processedBuffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64String}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: `${baseName}${ext}`,
      size: processedBuffer.length,
    });
  } catch (err) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
