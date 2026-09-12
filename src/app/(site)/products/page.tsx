import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/queries';
import { ProductCatalogFilter } from '@/components/site/ProductCatalogFilter';
import { Boxes } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formulary & Product Catalogue (350+ SKUs) | PHBL',
  description:
    'Comprehensive catalogue of homoeopathic mother tinctures, patent tonics, clinical drops, biochemic salts, cosmetics, and veterinary medicines. Mfg Lic. HL-792 M.',
};

export const dynamic = 'force-dynamic';

export default async function ProductsIndexPage() {
  const products = await getProducts();

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>Master Pharmaceutical Formulary</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Standardised Pharmaceutical Catalogue
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Browse our complete range of certified homoeopathic, cosmetic, and veterinary formulations manufactured in our bonded laboratory. Every monograph features complete active ingredients, indications, posology, and batch verification ties.
          </p>
        </div>

        {/* Filter & Grid */}
        <ProductCatalogFilter initialProducts={products} />
      </div>
    </div>
  );
}
