import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { productSchema } from '@/lib/validators';
import { getProducts, saveProduct, deleteProduct } from '@/lib/queries';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const includeUnpublished =
      searchParams.get('all') === 'true' || searchParams.get('includeUnpublished') === 'true';
    const products = await getProducts({ category, includeUnpublished });
    const { adminDb } = require('@/lib/firebase/admin');
    return NextResponse.json(
      { success: true, products, debug: { adminDbInitialized: !!adminDb } },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('API /api/product GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = productSchema.safeParse(body);

    if (!parse.success) {
      const fieldErrors = parse.error.flatten().fieldErrors;
      const errorMsg = Object.entries(fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
        .join('; ');

      return NextResponse.json(
        {
          error: `Validation failed: ${errorMsg}`,
          details: parse.error.flatten(),
        },
        { status: 422 }
      );
    }

    const data = parse.data;
    const now = new Date().toISOString();
    const productData: Product = {
      id: body.id || `prod-${Date.now()}`,
      slug: data.slug,
      name: data.name,
      category: data.category,
      subCategory: data.subCategory,
      shortDescription: data.shortDescription,
      indications: data.indications,
      composition: data.composition,
      dosage: data.dosage,
      packSizes: data.packSizes,
      storage: data.storage,
      caution: data.caution,
      images: body.images?.length ? body.images : ['/images/products/bottle-default.webp'],
      featured: data.featured ?? false,
      isNew: data.isNew ?? false,
      order: data.order ?? 99,
      seo: {
        title: `${data.name} | PHBL Monograph`,
        description: data.shortDescription,
      },
      published: data.published ?? true,
      createdAt: body.createdAt || now,
      updatedAt: now,
    };

    const saved = await saveProduct(productData);

    try {
      revalidatePath('/products');
      revalidatePath('/admin/products');
      revalidatePath('/');
      if (productData.category) {
        revalidatePath(`/products/${productData.category}`);
      }
      if (productData.category && productData.slug) {
        revalidatePath(`/products/${productData.category}/${productData.slug}`);
      }
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, product: saved }, { status: 200 });
  } catch (err: unknown) {
    console.error('API /api/product POST error:', err);
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
        // Body was empty
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await deleteProduct(id);

    try {
      revalidatePath('/products');
      revalidatePath('/admin/products');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (err: unknown) {
    console.error('API /api/product DELETE error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
