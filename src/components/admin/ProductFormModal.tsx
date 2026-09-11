'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Edit2, AlertCircle } from 'lucide-react';

interface ProductFormModalProps {
  product?: Product | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ProductFormModal({ product, onSuccess, trigger }: ProductFormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'homoeopathy' as ProductCategory,
    subCategory: 'Mother Tincture',
    shortDescription: '',
    indications: '',
    compositionText: '',
    dosage: '10 to 15 drops in half a cup of water twice daily, or as directed by a homoeopathic physician.',
    packSizesText: '30 ml, 100 ml, 450 ml',
    storage: 'Store in a cool and dry place protected from direct sunlight.',
    caution: 'To be sold by retail on the prescription of a Registered Homoeopathic Medical Practitioner only.',
    featured: false,
    order: 10,
    published: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category || 'homoeopathy',
        subCategory: product.subCategory || '',
        shortDescription: product.shortDescription || '',
        indications: product.indications || '',
        compositionText: product.composition?.map((c) => `${c.ingredient}: ${c.strength || ''}`).join('\n') || '',
        dosage: product.dosage || '',
        packSizesText: product.packSizes?.map((p) => p.size).join(', ') || '30 ml, 100 ml',
        storage: product.storage || '',
        caution: product.caution || '',
        featured: Boolean(product.featured),
        order: product.order ?? 10,
        published: product.published !== false,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        category: 'homoeopathy',
        subCategory: 'Mother Tincture',
        shortDescription: '',
        indications: '',
        compositionText: '',
        dosage: '10 to 15 drops in half a cup of water twice daily, or as directed by a homoeopathic physician.',
        packSizesText: '30 ml, 100 ml, 450 ml',
        storage: 'Store in a cool and dry place protected from direct sunlight.',
        caution: 'To be sold by retail on the prescription of a Registered Homoeopathic Medical Practitioner only.',
        featured: false,
        order: 10,
        published: true,
      });
    }
  }, [product, open]);

  // Auto-generate slug from name if not manually edited
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEdit && (!formData.slug || formData.slug === formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
      const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, name, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const composition = formData.compositionText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split(':');
          const ingredient = parts[0]?.trim() || line;
          const strength = parts[1]?.trim() || 'Q';
          return {
            ingredient,
            strength,
          };
        });

      const packSizes = formData.packSizesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((size) => ({ size }));

      const payload = {
        id: product?.id,
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        subCategory: formData.subCategory.trim(),
        shortDescription: formData.shortDescription.trim(),
        indications: formData.indications.trim() || 'General pharmacological support per HPI.',
        composition: composition.length ? composition : [{ ingredient: formData.name, strength: 'Q' }],
        dosage: formData.dosage.trim(),
        packSizes: packSizes.length ? packSizes : [{ size: '30 ml' }],
        storage: formData.storage.trim(),
        caution: formData.caution.trim(),
        featured: formData.featured,
        order: Number(formData.order),
        published: formData.published,
      };

      const res = await fetch('/api/product', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save product');
      }

      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : isEdit ? (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          size="sm"
          className="gap-1.5 bg-[#1F4D3A] text-white hover:bg-[#16382A]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(18,21,15,0.08)]">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#12150F]">
                  {isEdit ? `Edit Formulation: ${product?.name}` : 'Create New Product Monograph'}
                </h3>
                <p className="text-xs text-[#595C54] mt-0.5">
                  Formulations are published directly to the public formulary and product catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-sm text-neutral-400 hover:text-[#12150F] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Product Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Arnica Montana Q"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">URL Slug *</label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. arnica-montana-q"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Category *</label>
                  <select
                    className="w-full h-9 rounded-md border border-neutral-300 px-3 py-1 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1F4D3A]"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  >
                    <option value="homoeopathy">Homoeopathy</option>
                    <option value="cosmetics">Cosmetics & Herbal Care</option>
                    <option value="homoeovet">Homoeo Vet</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Sub-Category *</label>
                  <Input
                    required
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="e.g. Mother Tincture, Dilution, Tonic"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Display Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">Short Summary Description *</label>
                <textarea
                  required
                  rows={2}
                  className="w-full rounded-md border border-neutral-300 p-2.5 text-xs focus:ring-1 focus:ring-[#1F4D3A] focus:outline-hidden"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Primary therapeutic description adhering to HPI..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">
                  Clinical Indications (one per line, strictly non-curative per DMRA 1954)
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-neutral-300 p-2.5 text-xs focus:ring-1 focus:ring-[#1F4D3A] focus:outline-hidden"
                  value={formData.indications}
                  onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
                  placeholder="Traumatic shock and mechanical injuries&#10;Post-operative muscular soreness&#10;Bruises and contusions"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">
                  Formulation Composition (format: Ingredient: Potency (Percentage), one per line)
                </label>
                <textarea
                  rows={3}
                  className="w-full font-mono rounded-md border border-neutral-300 p-2.5 text-xs focus:ring-1 focus:ring-[#1F4D3A] focus:outline-hidden"
                  value={formData.compositionText}
                  onChange={(e) => setFormData({ ...formData, compositionText: e.target.value })}
                  placeholder="Arnica Montana: Q (10% v/v)&#10;Extra Neutral Alcohol: 90% (80% v/v)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Posology / Dosage</label>
                  <Input
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Pack Sizes (comma-separated)</label>
                  <Input
                    value={formData.packSizesText}
                    onChange={(e) => setFormData({ ...formData, packSizesText: e.target.value })}
                    placeholder="30 ml, 100 ml, 450 ml"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Storage Requirements</label>
                  <Input
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Statutory Caution Label</label>
                  <Input
                    value={formData.caution}
                    onChange={(e) => setFormData({ ...formData, caution: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded text-[#1F4D3A]"
                  />
                  <span className="font-medium text-[#12150F]">Published on Live Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[#1F4D3A]"
                  />
                  <span className="font-medium text-[#12150F]">Feature on Homepage</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(18,21,15,0.08)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="bg-[#1F4D3A] text-white hover:bg-[#16382A]"
                >
                  {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
