'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/site/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductShowcaseProps {
  products: Product[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'all' | ProductCategory>('cosmetics');

  const filteredProducts =
    activeTab === 'all'
      ? [...products].sort((a, b) => (a.category === 'cosmetics' ? -1 : b.category === 'cosmetics' ? 1 : 0))
      : products.filter((p) => p.category === activeTab);

  const tabs: { id: 'all' | ProductCategory; label: string }[] = [
    { id: 'cosmetics', label: 'PHBL Naturals Cosmetics (New Launch)' },
    { id: 'all', label: 'All Formulations' },
    { id: 'homoeopathy', label: 'Homoeopathy (Tinctures & Tonics)' },
    { id: 'homoeovet', label: 'Homoeo Vet Care' },
  ];

  return (
    <section className="py-20 bg-white border-b border-[rgba(18,21,15,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[rgba(18,21,15,0.08)]">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
              Standardised Pharmacopoeial Formulary
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F]">
              Featured Pharmaceutical Formulations
            </h2>
            <p className="text-sm text-[#595C54] max-w-xl">
              Manufactured with authentic botanical actives, pure ENA, and zero artificial stabilizers. Every batch meets HPI / GHP specifications.
            </p>
          </div>

          <Link href="/products">
            <Button variant="outline" size="md" className="gap-2 shrink-0">
              <span>View Full 350+ Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Tab Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1F4D3A] text-white'
                  : 'bg-[#F5F5F2] text-[#595C54] hover:text-[#12150F] hover:bg-[#EFEFEA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Explorer Link */}
        <div className="mt-12 text-center pt-8 border-t border-[rgba(18,21,15,0.06)]">
          <p className="text-xs text-[#595C54] mb-3">
            Looking for specific mother tinctures, rare dilutions (Q, 30C, 200C, 1M, CM), or institutional dispensing packs?
          </p>
          <Link href="/products">
            <Button variant="primary" size="md" className="gap-2">
              <span>Browse The Complete Therapeutic Index</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
