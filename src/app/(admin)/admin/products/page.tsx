import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/queries';
import { ProductManagementTable } from '@/components/admin/ProductManagementTable';

export const metadata: Metadata = {
  title: 'Formulary & Product Management | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getProducts({ includeUnpublished: true }).catch(() => []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Product Catalogue CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Formulary Monograph Management
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          Create, edit, update and delete product monographs, active compositions, and packaging sizes.
        </p>
      </div>

      {/* Interactive Products Table with Add, Edit, Delete */}
      <ProductManagementTable initialProducts={products} />
    </div>
  );
}
