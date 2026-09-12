'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ProductCategory } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { ExternalLink, Search, Trash2, Edit2, AlertCircle } from 'lucide-react';

interface ProductManagementTableProps {
  initialProducts: Product[];
}

export function ProductManagementTable({ initialProducts }: ProductManagementTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete formulation "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/product?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete formulation. Please check server logs.');
      }
    } catch {
      alert('Error occurred while deleting formulation.');
    } finally {
      setDeletingId(null);
    }
  };

  const reloadProducts = async () => {
    try {
      const res = await fetch('/api/product?includeUnpublished=true');
      const json = await res.json();
      if (json.products) {
        setProducts(json.products);
      }
      router.refresh();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Search, Category Filter, and Add Product Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#595C54]" />
            <input
              type="text"
              placeholder="Search by name, SKU or subcategory..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-neutral-300 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1F4D3A]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="h-9 rounded-md border border-neutral-300 px-3 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1F4D3A]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="homoeopathy">Homoeopathy</option>
            <option value="cosmetics">Cosmetics & Care</option>
            <option value="homoeovet">Homoeo Vet</option>
          </select>
        </div>

        <div>
          <ProductFormModal onSuccess={reloadProducts} />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-md border border-[rgba(18,21,15,0.08)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[rgba(18,21,15,0.06)] flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#12150F]">
            Formulation Records ({filtered.length})
          </h3>
          <span className="text-[11px] font-mono text-[#595C54]">
            HPI Monograph Master Index
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#595C54] font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Sub-Category</th>
                <th className="p-3">Pack Sizes</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(18,21,15,0.06)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#595C54]">
                    No formulations match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-3 font-mono text-[#595C54]">{p.order}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#12150F]">{p.name}</div>
                      <div className="text-[10px] text-[#595C54] font-mono">{p.slug}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="botanical" className="text-[10px]">
                        {p.category.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono text-[#595C54] uppercase text-[11px]">
                      {p.subCategory}
                    </td>
                    <td className="p-3 font-mono text-xs text-[#595C54]">
                      {p.packSizes?.map((s) => s.size).join(' · ')}
                    </td>
                    <td className="p-3">
                      {p.published !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/products/${p.category}/${p.slug}`}
                          target="_blank"
                          className="p-1 text-[#1F4D3A] hover:bg-[#F0F5F2] rounded transition-colors"
                          title="View live monograph"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <ProductFormModal
                          product={p}
                          onSuccess={reloadProducts}
                          trigger={
                            <button
                              type="button"
                              className="p-1 text-neutral-600 hover:text-[#12150F] hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                              title="Edit formulation"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          }
                        />

                        <button
                          type="button"
                          disabled={deletingId === p.id}
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete formulation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
