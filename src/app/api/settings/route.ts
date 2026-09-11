import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/queries';
import { SiteSettings } from '@/types';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (err) {
    console.error('API /api/settings GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const updates: Partial<SiteSettings> = await req.json();

    if (!updates.name && !updates.email && !updates.phones) {
      return NextResponse.json({ error: 'No valid setting updates provided' }, { status: 400 });
    }

    const updated = await saveSiteSettings(updates);
    return NextResponse.json({ success: true, settings: updated }, { status: 200 });
  } catch (err) {
    console.error('API /api/settings POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
