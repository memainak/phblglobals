import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDownloadsList, saveDownload, deleteDownload } from '@/lib/queries';
import { Download } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const downloads = await getDownloadsList();
    return NextResponse.json(
      { success: true, downloads },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('API /api/downloads GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch downloads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.category || !body.fileUrl) {
      return NextResponse.json(
        { error: 'Title, category, and file URL are required' },
        { status: 400 }
      );
    }

    const downloadData: Download = {
      id: body.id || `dl-${Date.now()}`,
      title: body.title,
      category: body.category,
      fileUrl: body.fileUrl,
      fileSize: body.fileSize ? Number(body.fileSize) : 1024 * 500,
      gated: Boolean(body.gated),
      downloadCount: body.downloadCount ? Number(body.downloadCount) : 0,
      updatedAt: body.updatedAt || new Date().toISOString(),
      published: body.published ?? true,
    };

    const saved = await saveDownload(downloadData);

    try {
      revalidatePath('/downloads');
      revalidatePath('/admin/downloads');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, download: saved }, { status: 200 });
  } catch (err) {
    console.error('API /api/downloads POST error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
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
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }

    await deleteDownload(id);

    try {
      revalidatePath('/downloads');
      revalidatePath('/admin/downloads');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (err) {
    console.error('API /api/downloads DELETE error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
