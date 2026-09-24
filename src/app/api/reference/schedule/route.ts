import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getReferenceSchedule, saveReferenceSchedule } from '@/lib/queries';
import { ReferenceList, ReferenceSchedule, ScheduleRow } from '@/types';

export const dynamic = 'force-dynamic';

const SCHEDULED: ReferenceList[] = ['mother-tincture', 'dilution'];
const isScheduled = (v: string | null): v is ReferenceList =>
  !!v && SCHEDULED.includes(v as ReferenceList);

export async function GET(req: NextRequest) {
  const list = new URL(req.url).searchParams.get('list');
  if (!isScheduled(list)) {
    return NextResponse.json(
      { error: `list must be one of ${SCHEDULED.join(', ')}` },
      { status: 400 }
    );
  }
  const schedule = await getReferenceSchedule(list);
  return NextResponse.json(
    { success: true, schedule },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!isScheduled(body.id)) {
      return NextResponse.json({ error: 'Invalid list' }, { status: 400 });
    }

    const packSizes: string[] = (body.packSizes ?? [])
      .map((s: unknown) => String(s).trim())
      .filter(Boolean);
    if (!packSizes.length) {
      return NextResponse.json({ error: 'At least one pack size is required' }, { status: 422 });
    }

    const rows: ScheduleRow[] = (body.rows ?? []).map((r: Partial<ScheduleRow>) => ({
      key: String(r.key ?? '').trim(),
      packs: packSizes.map((size) => {
        const found = (r.packs ?? []).find((p) => p.size === size);
        const raw = found?.mrp;
        const n = raw === null || raw === undefined || raw === ('' as unknown) ? null : Number(raw);
        return { size, mrp: n === null || Number.isNaN(n) ? null : n };
      }),
    }));

    if (rows.some((r) => !r.key)) {
      return NextResponse.json({ error: 'Every row needs a grade/potency label' }, { status: 422 });
    }
    const keys = rows.map((r) => r.key.toUpperCase());
    if (new Set(keys).size !== keys.length) {
      return NextResponse.json({ error: 'Duplicate grade/potency labels' }, { status: 422 });
    }

    const schedule: ReferenceSchedule = {
      id: body.id,
      packSizes,
      rows,
      ...(body.note ? { note: String(body.note).trim() } : {}),
    };

    await saveReferenceSchedule(schedule);
    revalidatePath('/products/homoeopathy');
    revalidatePath('/products');
    return NextResponse.json({ success: true, schedule }, { status: 200 });
  } catch (err) {
    console.error('API /api/reference/schedule POST error:', err);
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 });
  }
}
