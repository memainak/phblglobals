import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/queries';
import { ProductCatalogFilter } from '@/components/site/ProductCatalogFilter';
import { ProductCategory } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Boxes } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const categoryMeta: Record<
  ProductCategory,
  { title: string; subtitle: string; description: string }
> = {
  homoeopathy: {
    title: 'Homoeopathic Formulations',
    subtitle: 'Mother Tinctures, Patent Tonics, Specialty Drops & Biochemics',
    description:
      'Classical and patent homoeopathic medicines prepared in strict accordance with the Homoeopathic Pharmacopoeia of India (HPI) using 100% pure Extra Neutral Alcohol (ENA).',
  },
  cosmetics: {
    title: 'Therapeutic Cosmetics & Hand Care',
    subtitle: 'Protectin Sanitizer Rub & Puro Herbal Body Oil',
    description:
      'Dermatologist-formulated herbal antiseptic and skin-nourishment preparations combining pharmacological ethanol purity with active botanicals.',
  },
  homoeovet: {
    title: 'Homoeo Vet Animal Health Range',
    subtitle: 'Veterinary Homoeopathic Formulations for Livestock & Bovine Care',
    description:
      'Residue-free, organic veterinary homoeopathy for mastitis, lactation optimization, and animal vitality without synthetic hormones or antibiotics.',
  },
};

export async function generateStaticParams() {
  return [
    { category: 'homoeopathy' },
    { category: 'cosmetics' },
    { category: 'homoeovet' },
  ];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const validCategory = category as ProductCategory;
  const meta = categoryMeta[validCategory];

  if (!meta) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${meta.title} | PHBL Formulary`,
    description: meta.description,
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const validCategory = category as ProductCategory;
  const meta = categoryMeta[validCategory];

  if (!meta) {
    notFound();
  }

  const allProducts = await getProducts();

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Categories</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-2 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>{meta.subtitle}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            {meta.title}
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            {meta.description}
          </p>
        </div>

        {/* Catalog Filter with initialCategory set */}
        <ProductCatalogFilter
          initialProducts={allProducts}
          initialCategory={validCategory}
        />
      </div>
    </div>
  );
}
