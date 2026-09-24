import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getReferenceItems,
  saveReferenceItem,
  deleteReferenceItem,
  replaceReferenceList,
} from '@/lib/queries';
import { ReferenceItem, ReferenceList } from '@/types';

export const dynamic = 'force-dynamic';

const LISTS: ReferenceList[] = ['mother-tincture', 'dilution', 'biochemic'];

const isList = (v: string | null): v is ReferenceList =>
  !!v && LISTS.includes(v as ReferenceList);

function revalidate() {
  revalidatePath('/products/homoeopathy');
  revalidatePath('/products');
}

export async function GET(req: NextRequest) {
  const list = new URL(req.url).searchParams.get('list');
  if (!isList(list)) {
    return NextResponse.json({ error: `list must be one of ${LISTS.join(', ')}` }, { status: 400 });
  }
  const items = await getReferenceItems(list);
  return NextResponse.json(
    { success: true, items, total: items.length },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Bulk replace: { list, items: [...] }
    if (Array.isArray(body.items)) {
      if (!isList(body.list)) {
        return NextResponse.json({ error: 'Invalid list' }, { status: 400 });
      }
      const items: ReferenceItem[] = body.items.map(
        (raw: Partial<ReferenceItem>, i: number) => ({
          id: raw.id || `${body.list}-${i + 1}`,
          list: body.list as ReferenceList,
          sl: Number(raw.sl ?? i + 1),
          name: String(raw.name ?? '').trim(),
          ...(raw.cat ? { cat: String(raw.cat).trim().toUpperCase() } : {}),
          ...(raw.potencies ? { potencies: String(raw.potencies).trim() } : {}),
        })
      );

      const invalid = items.filter((i) => !i.name || Number.isNaN(i.sl));
      if (invalid.length) {
        return NextResponse.json(
          { error: `${invalid.length} row(s) have a missing name or bad SL number.` },
          { status: 422 }
        );
      }

      const count = await replaceReferenceList(body.list as ReferenceList, items);
      revalidate();
      return NextResponse.json({ success: true, count }, { status: 200 });
    }

    // Single upsert
    if (!isList(body.list)) {
      return NextResponse.json({ error: 'Invalid list' }, { status: 400 });
    }
    const name = String(body.name ?? '').trim();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 422 });
    }
    const sl = Number(body.sl);
    if (Number.isNaN(sl)) {
      return NextResponse.json({ error: 'SL must be a number' }, { status: 422 });
    }

    const item: ReferenceItem = {
      id: body.id || `${body.list}-${sl}`,
      list: body.list,
      sl,
      name,
      ...(body.cat ? { cat: String(body.cat).trim().toUpperCase() } : {}),
      ...(body.potencies ? { potencies: String(body.potencies).trim() } : {}),
    };

    await saveReferenceItem(item);
    revalidate();
    return NextResponse.json({ success: true, item }, { status: 200 });
  } catch (err) {
    console.error('API /api/reference POST error:', err);
    return NextResponse.json({ error: 'Failed to save reference item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }
  const ok = await deleteReferenceItem(id);
  revalidate();
  return NextResponse.json({ success: ok }, { status: ok ? 200 : 500 });
}
