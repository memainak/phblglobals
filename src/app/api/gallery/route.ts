import { NextRequest, NextResponse } from 'next/server';
import { getGalleryList, saveGalleryItem, deleteGalleryItem } from '@/lib/queries';
import { GalleryItem } from '@/types';

export async function GET() {
  try {
    const gallery = await getGalleryList();
    return NextResponse.json({ success: true, gallery }, { status: 200 });
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
    return NextResponse.json({ success: true, item: saved }, { status: 200 });
  } catch (err) {
    console.error('API /api/gallery POST error:', err);
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
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    await deleteGalleryItem(id);
    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (err) {
    console.error('API /api/gallery DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
