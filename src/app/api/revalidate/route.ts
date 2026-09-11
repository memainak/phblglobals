import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { secret, path } = await req.json();

    // Check optional admin secret if set in env
    const expectedSecret = process.env.ADMIN_REVALIDATE_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized secret' }, { status: 401 });
    }

    // Revalidate given path or global routes
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: 'Global site cache purged and revalidated successfully.',
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
