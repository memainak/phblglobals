import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getGalleryList, saveGalleryItem, deleteGalleryItem } from '@/lib/queries';
import { GalleryItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const gallery = await getGalleryList();
    return NextResponse.json(
      { success: true, gallery },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('API /api/gallery GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.album || !body.caption) {
      return NextResponse.json(
        { error: 'Album and caption are required' },
        { status: 400 }
      );
    }

    const itemData: GalleryItem = {
      id: body.id || `gal-${Date.now()}`,
      album: body.album,
      caption: body.caption,
      imageUrl: body.imageUrl || '/images/cleanroom-bottling.webp',
      width: body.width ? Number(body.width) : 1200,
      height: body.height ? Number(body.height) : 800,
      order: body.order !== undefined ? Number(body.order) : 10,
      published: body.published ?? true,
    };

    const saved = await saveGalleryItem(itemData);

    try {
      revalidatePath('/gallery');
      revalidatePath('/admin/gallery');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, item: saved }, { status: 200 });
  } catch (err) {
    console.error('API /api/gallery POST error:', err);
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
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    await deleteGalleryItem(id);

    try {
      revalidatePath('/gallery');
      revalidatePath('/admin/gallery');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (err) {
    console.error('API /api/gallery DELETE error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
