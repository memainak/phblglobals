'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subCategoriesFor, defaultSubCategoryFor } from '@/lib/data/subCategories';
import { Plus, X, Edit2, AlertCircle, Upload, Trash2, Image as ImageIcon, Star, Loader2 } from 'lucide-react';

interface ProductFormModalProps {
  product?: Product | null;
  onSuccess?: (savedProduct?: Product) => void;
  trigger?: React.ReactNode;
}

export function ProductFormModal({ product, onSuccess, trigger }: ProductFormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isEdit = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'homoeopathy' as ProductCategory,
    subCategory: defaultSubCategoryFor('homoeopathy'),
    shortDescription: '',
    indications: '',
    compositionText: '',
    dosage: '10 to 15 drops in half a cup of water twice daily, or as directed by a homoeopathic physician.',
    packSizesText: '30 ml, 100 ml, 450 ml',
    storage: 'Store in a cool and dry place protected from direct sunlight.',
    caution: 'To be sold by retail on the prescription of a Registered Homoeopathic Medical Practitioner only.',
    images: [] as string[],
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
        packSizesText: product.packSizes?.map((p) => p.mrp ? `${p.size}: ${p.mrp}` : p.size).join(', ') || '30 ml, 100 ml',
        storage: product.storage || '',
        caution: product.caution || '',
        images: product.images || [],
        featured: Boolean(product.featured),
        order: product.order ?? 10,
        published: product.published !== false,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        category: 'homoeopathy',
        subCategory: defaultSubCategoryFor('homoeopathy'),
        shortDescription: '',
        indications: '',
        compositionText: '',
        dosage: '10 to 15 drops in half a cup of water twice daily, or as directed by a homoeopathic physician.',
        packSizesText: '30 ml, 100 ml, 450 ml',
        storage: 'Store in a cool and dry place protected from direct sunlight.',
        caution: 'To be sold by retail on the prescription of a Registered Homoeopathic Medical Practitioner only.',
        images: [],
        featured: false,
        order: 10,
        published: true,
      });
    }
    setNewImageUrl('');
    setUploadError(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload?folder=products', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Failed to upload image');
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, json.url],
      }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetPrimary = (indexToPromote: number) => {
    setFormData((prev) => {
      const copy = [...prev.images];
      const [promoted] = copy.splice(indexToPromote, 1);
      return {
        ...prev,
        images: [promoted, ...copy],
      };
    });
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
        .map((sizeStr) => {
          const parts = sizeStr.split(/[:\-]/);
          const size = parts[0]?.trim() || sizeStr;
          const mrpRaw = parts[1]?.trim();
          const mrp = mrpRaw ? Number(mrpRaw.replace(/[^0-9.]/g, '')) : undefined;
          return { size, ...(mrp !== undefined && !isNaN(mrp) ? { mrp } : {}) };
        });

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
        images: formData.images,
        featured: formData.featured,
        isNew: product?.isNew ?? false,
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
        let msg = json.error || 'Failed to save product';
        if (json.details?.fieldErrors) {
          const fields = Object.entries(json.details.fieldErrors)
            .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
            .join('; ');
          msg = `Validation failed: ${fields}`;
        }
        throw new Error(msg);
      }

      setOpen(false);
      if (onSuccess) onSuccess(json.product);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {trigger ? (
        React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              setOpen(true);
            },
          })
        ) : (
          <div onClick={() => setOpen(true)}>{trigger}</div>
        )
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
                    onChange={(e) => {
                      const category = e.target.value as ProductCategory;
                      const options = subCategoriesFor(category);
                      const keep = options.some((o) => o.value === formData.subCategory);
                      setFormData({
                        ...formData,
                        category,
                        subCategory: keep ? formData.subCategory : defaultSubCategoryFor(category),
                      });
                    }}
                  >
                    <option value="homoeopathy">Homoeopathy</option>
                    <option value="cosmetics">Cosmetics & Herbal Care</option>
                    <option value="homoeovet">Homoeo Vet</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Sub-Category *</label>
                  <select
                    required
                    className="w-full h-9 rounded-md border border-neutral-300 px-3 py-1 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1F4D3A]"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  >
                    {subCategoriesFor(formData.category).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    {formData.subCategory &&
                      !subCategoriesFor(formData.category).some(
                        (o) => o.value === formData.subCategory
                      ) && (
                        <option value={formData.subCategory}>
                          {formData.subCategory} (not a standard form)
                        </option>
                      )}
                  </select>
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

              {/* Product Packshot Images Management */}
              <div className="space-y-3 p-4 bg-[#F7F7F5] rounded-md border border-[rgba(18,21,15,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#1F4D3A]" />
                    <span className="font-semibold text-[#12150F]">Product Packshot Images</span>
                    <span className="text-[10px] text-[#595C54]">({formData.images.length} attached)</span>
                  </div>
                  <span className="text-[10px] text-[#595C54]">
                    The first image is the primary packshot shown on cards & monograph.
                  </span>
                </div>

                {uploadError && (
                  <p className="text-rose-600 text-[11px] bg-rose-50 p-2 rounded border border-rose-200">
                    {uploadError}
                  </p>
                )}

                {/* Upload & Add URL controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium text-[#12150F] hover:bg-neutral-50 cursor-pointer transition-colors shrink-0 shadow-xs">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1F4D3A]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#1F4D3A]" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                    />
                  </label>

                  <div className="flex items-center gap-1.5 flex-1">
                    <Input
                      placeholder="Or paste image URL (e.g. /images/products/arnica-q.webp)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="h-8 text-xs bg-white flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddImageUrl}
                      disabled={!newImageUrl.trim()}
                      className="h-8 text-xs shrink-0"
                    >
                      Add URL
                    </Button>
                  </div>
                </div>

                {/* Gallery Thumbnails List */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative group bg-white rounded border p-2 flex flex-col items-center justify-between gap-1.5 text-center transition-all ${
                          idx === 0
                            ? 'border-[#1F4D3A] ring-1 ring-[#1F4D3A]/30 shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="relative w-full aspect-square bg-[#FAFAFA] rounded flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`Packshot ${idx + 1}`}
                            className="max-h-full max-w-full object-contain p-1"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#1F4D3A] text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs font-semibold">
                              Primary
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] font-mono text-neutral-500 truncate w-full text-center" title={imgUrl}>
                          {imgUrl.split('/').pop() || imgUrl}
                        </p>

                        <div className="flex items-center justify-between w-full pt-1 border-t border-neutral-100 gap-1">
                          {idx > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              title="Make primary image"
                              className="text-[10px] text-[#1F4D3A] hover:underline flex items-center gap-0.5"
                            >
                              <Star className="w-3 h-3 text-[#1F4D3A]" />
                              <span>Set Primary</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#1F4D3A] font-semibold">Main Cover</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Delete image"
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-400 italic py-2 text-center bg-white rounded border border-dashed border-neutral-200">
                    No custom images attached yet. You can upload an image or paste a URL above.
                  </p>
                )}
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
