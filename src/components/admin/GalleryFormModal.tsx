'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Edit2, AlertCircle, Camera, UploadCloud, CheckCircle2, ImageIcon } from 'lucide-react';

interface GalleryFormModalProps {
  item?: GalleryItem | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const ALBUMS: GalleryItem['album'][] = [
  'Factory',
  'Laboratory',
  'Products',
  'Exhibitions',
  'Events',
];

export function GalleryFormModal({ item, onSuccess, trigger }: GalleryFormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(item);

  const [formData, setFormData] = useState({
    album: 'Factory' as GalleryItem['album'],
    caption: '',
    imageUrl: '',
    width: 1200,
    height: 800,
    order: 1,
    published: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        album: item.album || 'Factory',
        caption: item.caption || '',
        imageUrl: item.imageUrl || '',
        width: item.width || 1200,
        height: item.height || 800,
        order: item.order ?? 1,
        published: item.published !== false,
      });
    } else {
      setFormData({
        album: 'Factory',
        caption: '',
        imageUrl: '',
        width: 1200,
        height: 800,
        order: 1,
        published: true,
      });
    }
    setError(null);
  }, [item, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'gallery');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Failed to upload image');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: json.url,
        caption: prev.caption || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.imageUrl.trim()) {
        throw new Error('Please upload an image or provide an image URL.');
      }

      const payload = {
        id: item?.id,
        album: formData.album,
        caption: formData.caption.trim(),
        imageUrl: formData.imageUrl.trim(),
        width: Number(formData.width),
        height: Number(formData.height),
        order: Number(formData.order),
        published: formData.published,
      };

      const res = await fetch('/api/gallery', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save gallery photo');
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
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 text-[#595C54] hover:text-[#1F4D3A] rounded hover:bg-[#FAFAF8] transition-colors"
          title="Edit Photo Record"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          size="sm"
          className="gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Gallery Photo</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl my-8">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#595C54] hover:text-[#12150F] p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-3 border-b border-[rgba(18,21,15,0.08)]">
              <div className="w-9 h-9 rounded-md bg-[#1F4D3A]/10 text-[#1F4D3A] flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#12150F]">
                  {isEdit ? 'Edit Gallery Photo' : 'Upload Plant & Lab Photo'}
                </h3>
                <p className="text-xs text-[#595C54]">
                  Image will appear in the public visual archive on /gallery.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Photo Upload & Preview */}
              <div className="space-y-2">
                <label className="font-semibold text-[#12150F] block">Photo File</label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="gap-2"
                  >
                    <UploadCloud className="w-4 h-4 text-[#1F4D3A]" />
                    <span>{uploading ? 'Uploading...' : 'Choose Image File'}</span>
                  </Button>

                  {formData.imageUrl && (
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-10 rounded border border-neutral-300 overflow-hidden relative bg-neutral-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-emerald-600 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Album & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Album / Division *</label>
                  <select
                    value={formData.album}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        album: e.target.value as GalleryItem['album'],
                      })
                    }
                    className="w-full text-xs px-3 py-2 border rounded-md bg-white border-neutral-300 focus:outline-hidden focus:border-[#1F4D3A] focus:ring-1 focus:ring-[#1F4D3A]"
                  >
                    {ALBUMS.map((alb) => (
                      <option key={alb} value={alb}>
                        {alb} Division
                      </option>
                    ))}
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

              {/* Caption */}
              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">Caption / Description *</label>
                <Input
                  required
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Stainless Steel SS-316 Maceration Vessels with Agitators"
                />
              </div>

              {/* Image URL Manual Override */}
              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">Image URL / Path</label>
                <Input
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/images/gallery/maceration-tanks.webp or https://..."
                />
              </div>

              {/* Published checkbox */}
              <div className="pt-2 border-t border-[rgba(18,21,15,0.06)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-neutral-300 text-[#1F4D3A] focus:ring-[#1F4D3A]"
                  />
                  <span className="font-medium text-[#12150F]">Visible in Public Gallery</span>
                </label>
              </div>

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
                  disabled={submitting || uploading}
                >
                  {submitting ? 'Saving...' : isEdit ? 'Update Photo' : 'Add Photo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
