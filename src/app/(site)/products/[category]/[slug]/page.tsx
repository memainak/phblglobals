import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug } from '@/lib/queries';
import { ProductCard } from '@/components/site/ProductCard';
import { ProductEnquiryModal } from '@/components/site/ProductEnquiryModal';
import { ProductGallery } from '@/components/site/ProductGallery';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Scale,
  Package,
} from 'lucide-react';

interface ProductDetailProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductBySlug(category, slug);

  if (!product) {
    return { title: 'Product Monograph Not Found' };
  }

  return {
    title: `${product.name} | PHBL Pharmaceutical Formulary`,
    description: product.shortDescription,
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { category, slug } = await params;
  const product = await getProductBySlug(category, slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#595C54]">
          <Link href="/products" className="hover:text-[#1F4D3A] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Products</span>
          </Link>
          <span>/</span>
          <Link
            href={`/products/${product.category}`}
            className="capitalize hover:text-[#1F4D3A]"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#12150F] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Monograph Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Product Packshot Visual (Clean Clinical Presentation) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-lg border border-[rgba(18,21,15,0.08)] flex flex-col items-center justify-center space-y-6">
            <ProductGallery
              images={product.images}
              name={product.name}
              subCategory={product.subCategory}
            />

            {/* Pack sizes badge strip */}
            <div className="w-full pt-2 flex items-center justify-between text-xs text-[#595C54]">
              <span className="font-semibold text-[#12150F]">Available Sizes:</span>
              <div className="flex gap-1.5">
                {product.packSizes.map((ps, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-xs bg-[#F0F5F2] text-[#1F4D3A] font-mono font-medium text-[11px]"
                  >
                    {ps.size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Product Clinical Monograph Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="botanical">
                  {product.category.toUpperCase()} · {product.subCategory.replace(/-/g, ' ').toUpperCase()}
                </Badge>
                <Link
                  href={`/batches?productId=${product.id}`}
                  className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:underline font-medium ml-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Public Batches Available</span>
                </Link>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F] leading-tight">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base text-[#595C54] leading-relaxed pt-1">
                {product.shortDescription}
              </p>
            </div>

            {/* Statutory Indications Box (Adhering to Drugs & Magic Remedies Act) */}
            <div className="p-5 rounded-md bg-white border border-[rgba(18,21,15,0.1)] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
                <Scale className="w-4 h-4" />
                <span>Statutory Indications (Pharmacopoeial Use)</span>
              </div>
              <p className="text-sm text-[#12150F] leading-relaxed">
                {product.indications}
              </p>
              <span className="block text-[11px] text-[#595C54] italic pt-1 border-t border-[rgba(18,21,15,0.06)]">
                Note: In strict compliance with regulatory guidelines, this formulation is indicated as an adjunct under professional medical supervision.
              </span>
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <ProductEnquiryModal
                productId={product.id}
                productName={product.name}
              />
              <Link href={`/batches?productId=${product.id}`}>
                <button className="h-12 px-5 text-sm font-medium rounded-md border border-[rgba(18,21,15,0.15)] bg-white text-[#12150F] hover:bg-[#FAFAF8] inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Inspect Batch Records</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Pharmacopoeial Monograph Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Composition Table */}
            <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#1F4D3A]" />
                <h2 className="font-serif text-xl font-bold text-[#12150F]">
                  Formulation Composition
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)] text-[#595C54] font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Active Botanical / Chemical Constituent</th>
                      <th className="py-2.5 px-4 text-right">Potency / Strength</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
                    {product.composition.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAFAF8]">
                        <td className="py-3 px-4 font-medium text-[#12150F]">
                          {item.ingredient}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#1F4D3A] font-semibold">
                          {item.strength}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Posology / Dosage */}
            <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#12150F]">
                Posology & Mode of Administration
              </h2>
              <p className="text-sm text-[#595C54] leading-relaxed">
                {product.dosage}
              </p>
            </div>

            {/* Pack Sizes & MRP */}
            <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#1F4D3A]" />
                <h2 className="font-serif text-xl font-bold text-[#12150F]">
                  Packaging Configurations & Standard MRP
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)] text-[#595C54] font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Standard Dispensing Pack</th>
                      <th className="py-2.5 px-4 text-right">Indicative MRP (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
                    {product.packSizes.map((pack, idx) => (
                      <tr key={idx} className="hover:bg-[#FAFAF8]">
                        <td className="py-3 px-4 font-medium text-[#12150F]">
                          {pack.size}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[#12150F]">
                          {pack.mrp ? `₹ ${pack.mrp.toFixed(2)}` : 'Institutional Supply'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-[#595C54]">
                * Wholesale stockist & institutional hospital discounts applied upon invoice creation.
              </p>
            </div>
          </div>

          {/* Right Sidebar: Storage & Caution */}
          <div className="lg:col-span-4 space-y-6">
            {/* Storage Advice */}
            <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-3">
              <h3 className="font-serif font-bold text-base text-[#12150F]">
                Storage & Stability
              </h3>
              <p className="text-xs text-[#595C54] leading-relaxed">
                {product.storage}
              </p>
            </div>

            {/* Caution / Contraindications */}
            {product.caution && (
              <div className="bg-amber-50/70 p-6 rounded-md border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Clinical Caution</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {product.caution}
                </p>
              </div>
            )}

            {/* Mandatory Regulatory Notice */}
            <div className="bg-[#FAFAF8] p-5 rounded-md border border-[rgba(18,21,15,0.08)] text-[11px] text-[#595C54] space-y-2 leading-relaxed">
              <span className="font-semibold text-[#12150F] block">
                Statutory Notice:
              </span>
              <p>
                To be dispensed under the direction of a Registered Homoeopathic Medical Practitioner. Keep all medicines out of reach of children.
              </p>
              <div className="pt-2 font-mono text-[10px] border-t border-[rgba(18,21,15,0.06)]">
                Mfg License: HL-792 M (Bonded)
              </div>
            </div>
          </div>
        </div>

        {/* Related Formulations Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-[rgba(18,21,15,0.08)] space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
                Complementary Formulations
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#12150F]">
                Related Formulations in {product.category.toUpperCase()}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
