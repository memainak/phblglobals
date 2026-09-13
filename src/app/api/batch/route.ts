import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { batchSchema } from '@/lib/validators';
import { getBatches, saveBatch, deleteBatch } from '@/lib/queries';
import { Batch } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeUnpublished =
      searchParams.get('all') === 'true' || searchParams.get('includeUnpublished') === 'true';
    const authority = searchParams.get('authority') || undefined;
    const query = searchParams.get('query') || undefined;
    const productId = searchParams.get('productId') || undefined;

    const result = await getBatches({
      authority,
      query,
      productId,
      page: 1,
      pageSize: 500,
      includeUnpublished,
    });

    return NextResponse.json(
      { success: true, batches: result.batches, total: result.total },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
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
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errorMsg = Object.entries(fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
        .join('; ');

      return NextResponse.json(
        { error: `Validation failed: ${errorMsg}`, details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const batchData: Batch = {
      ...parsed.data,
      id: body.id || `batch-${Date.now()}`,
      expDate: parsed.data.expDate || null,
      expiryNote: parsed.data.expiryNote || undefined,
    };

    // If batchNo was renamed during edit, remove the old document
    if (body.originalBatchNo && body.originalBatchNo !== batchData.batchNo) {
      try {
        await deleteBatch(body.originalBatchNo);
      } catch (err) {
        console.warn('Failed removing previous batch document after rename:', err);
      }
    }

    const saved = await saveBatch(batchData);

    try {
      revalidatePath('/batches');
      revalidatePath('/admin/batches');
      revalidatePath('/');
      if (batchData.batchNo) {
        revalidatePath(`/batches/${batchData.batchNo}`);
      }
      if (body.originalBatchNo && body.originalBatchNo !== batchData.batchNo) {
        revalidatePath(`/batches/${body.originalBatchNo}`);
      }
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, batch: saved }, { status: 200 });
  } catch (err) {
    console.error('API /api/batch POST error:', err);
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
    let batchNo = searchParams.get('batchNo') || searchParams.get('id');

    if (!batchNo) {
      try {
        const body = await req.json();
        batchNo = body.batchNo || body.id;
      } catch {
        // empty body
      }
    }

    if (!batchNo) {
      return NextResponse.json({ error: 'Batch Number (batchNo) is required' }, { status: 400 });
    }

    await deleteBatch(batchNo);

    try {
      revalidatePath('/batches');
      revalidatePath('/admin/batches');
      revalidatePath('/');
      revalidatePath(`/batches/${batchNo}`);
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, deletedBatchNo: batchNo }, { status: 200 });
  } catch (err) {
    console.error('API /api/batch DELETE error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
