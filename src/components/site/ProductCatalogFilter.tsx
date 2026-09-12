'use client';

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/site/ProductCard';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductCatalogFilterProps {
  initialProducts: Product[];
  initialCategory?: ProductCategory | 'all';
}

export function ProductCatalogFilter({
  initialProducts,
  initialCategory = 'all',
}: ProductCatalogFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedPackSize, setSelectedPackSize] = useState<string>('all');

  // Derive available subcategories and pack sizes
  const subCategories = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (selectedCategory === 'all' || p.category === selectedCategory) {
        set.add(p.subCategory);
      }
    });
    return Array.from(set);
  }, [initialProducts, selectedCategory]);

  const packSizes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      p.packSizes.forEach((ps) => set.add(ps.size));
    });
    return Array.from(set);
  }, [initialProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Sub-category filter
      if (selectedSubCategory !== 'all' && product.subCategory !== selectedSubCategory) {
        return false;
      }

      // Pack size filter
      if (selectedPackSize !== 'all') {
        const hasPackSize = product.packSizes.some((ps) => ps.size.includes(selectedPackSize));
        if (!hasPackSize) return false;
      }

      // Search query (name, indication, ingredient)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesIndication = product.indications.toLowerCase().includes(q);
        const matchesIngredient = product.composition.some((c) =>
          c.ingredient.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesIndication && !matchesIngredient) {
          return false;
        }
      }

      return true;
    });
  }, [initialProducts, selectedCategory, selectedSubCategory, selectedPackSize, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSelectedPackSize('all');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-3 bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-6 sticky top-28">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(18,21,15,0.08)]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#12150F]">
            <Filter className="w-3.5 h-3.5 text-[#1F4D3A]" />
            <span>Formulary Filters</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-[11px] text-[#595C54] hover:text-[#1F4D3A] flex items-center gap-1"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Search Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#12150F]">
            Search Formulary
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#595C54] absolute left-3 top-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Name, active, indication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>

        {/* Category Radio/Pill Filter */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#12150F]">
            Primary Range
          </label>
          <div className="space-y-1 text-xs">
            {[
              { id: 'all', label: 'All Ranges' },
              { id: 'homoeopathy', label: 'Homoeopathic Formulations' },
              { id: 'cosmetics', label: 'Cosmetics & Personal Care' },
              { id: 'homoeovet', label: 'Veterinary Care (Homoeo Vet)' },
            ].map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#F0F5F2] text-[#1F4D3A] font-medium'
                    : 'text-[#595C54] hover:bg-[#FAFAF8]'
                }`}
              >
                <span>{cat.label}</span>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.id}
                  onChange={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubCategory('all');
                  }}
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Sub-Category Filter */}
        {subCategories.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[rgba(18,21,15,0.06)]">
            <label className="block text-xs font-semibold text-[#12150F]">
              Dosage Form / Sub-Category
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full text-xs h-9 rounded-md border border-[rgba(18,21,15,0.15)] bg-white px-2.5 focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
            >
              <option value="all">All Dosage Forms</option>
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub.replace(/-/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pack Size Filter */}
        {packSizes.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[rgba(18,21,15,0.06)]">
            <label className="block text-xs font-semibold text-[#12150F]">
              Packaging / Dispensing Pack
            </label>
            <select
              value={selectedPackSize}
              onChange={(e) => setSelectedPackSize(e.target.value)}
              className="w-full text-xs h-9 rounded-md border border-[rgba(18,21,15,0.15)] bg-white px-2.5 focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
            >
              <option value="all">All Pack Sizes</option>
              {packSizes.map((ps) => (
                <option key={ps} value={ps}>
                  {ps}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Regulatory Note */}
        <div className="p-3 rounded bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] text-[11px] text-[#595C54] leading-relaxed">
          <strong>Practitioner Note:</strong> All mother tinctures and potentised dilutions are manufactured strictly to HPI/GHP standards with bonded ENA.
        </div>
      </aside>

      {/* Main Results Grid */}
      <main className="lg:col-span-9 space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between px-2 text-xs text-[#595C54]">
          <span>
            Displaying <strong>{filteredProducts.length}</strong> standardised pharmaceutical products
          </span>
          <span className="font-mono">Bonded Lic: HL-792 M</span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-md border border-[rgba(18,21,15,0.08)] space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#12150F]">
              No Formulations Match Your Search
            </h3>
            <p className="text-xs text-[#595C54] max-w-sm mx-auto">
              Please adjust your keyword or reset filters to view our full therapeutic catalogue.
            </p>
            <Button onClick={resetFilters} variant="primary" size="sm">
              Reset All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
