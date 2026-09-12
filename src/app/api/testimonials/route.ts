import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '@/lib/queries';
import { testimonialSchema } from '@/lib/validators';
import { Testimonial } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeUnpublished =
      searchParams.get('all') === 'true' || searchParams.get('includeUnpublished') === 'true';

    const testimonials = await getTestimonials({ includeUnpublished });
    return NextResponse.json({ success: true, testimonials }, { status: 200 });
  } catch (err) {
    console.error('API /api/testimonials GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = testimonialSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parse.error.flatten() },
        { status: 422 }
      );
    }

    const data = parse.data;
    const testimonialData: Testimonial = {
      id: body.id || `test-${Date.now()}`,
      quote: data.quote,
      author: data.author,
      role: data.role,
      clinicOrInstitution: data.clinicOrInstitution || undefined,
      location: data.location || undefined,
      order: data.order ?? 1,
      published: data.published ?? true,
    };

    const saved = await saveTestimonial(testimonialData);

    try {
      revalidatePath('/');
      revalidatePath('/admin/testimonials');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, testimonial: saved }, { status: 200 });
  } catch (err) {
    console.error('API /api/testimonials POST error:', err);
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
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    await deleteTestimonial(id);

    try {
      revalidatePath('/');
      revalidatePath('/admin/testimonials');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (err) {
    console.error('API /api/testimonials DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
