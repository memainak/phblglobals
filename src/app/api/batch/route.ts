import { NextRequest, NextResponse } from 'next/server';
import { batchSchema } from '@/lib/validators';
import { getBatches, saveBatch, deleteBatch } from '@/lib/queries';
import { Batch } from '@/types';

export async function GET() {
  try {
    const batches = await getBatches();
    return NextResponse.json({ success: true, batches }, { status: 200 });
  } catch (err) {
    console.error('API /api/batch GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = batchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const batchData: Batch = {
      ...parsed.data,
      id: body.id || `batch-${Date.now()}`,
      expDate: parsed.data.expDate || null,
      expiryNote: parsed.data.expiryNote || undefined,
    };

    const saved = await saveBatch(batchData);
    return NextResponse.json({ success: true, batch: saved }, { status: 200 });
  } catch (err) {
    console.error('API /api/batch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let batchNo = searchParams.get('batchNo');

    if (!batchNo) {
      try {
        const body = await req.json();
        batchNo = body.batchNo;
      } catch {
        // empty body
      }
    }

    if (!batchNo) {
      return NextResponse.json({ error: 'Batch Number (batchNo) is required' }, { status: 400 });
    }

    await deleteBatch(batchNo);
    return NextResponse.json({ success: true, deletedBatchNo: batchNo }, { status: 200 });
  } catch (err) {
    console.error('API /api/batch DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
