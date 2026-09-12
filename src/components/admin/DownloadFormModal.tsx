'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Edit2, AlertCircle, FileDown, UploadCloud, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface DownloadFormModalProps {
  download?: Download | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const CATEGORIES: Download['category'][] = [
  'Therapeutic Index',
  'Price List',
  'MSDS',
  'Product Catalogue',
  'Compliance',
];

export function DownloadFormModal({ download, onSuccess, trigger }: DownloadFormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(download);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Therapeutic Index' as Download['category'],
    fileUrl: '',
    fileSize: 1024 * 500,
    gated: false,
    downloadCount: 0,
    published: true,
  });

  useEffect(() => {
    if (download) {
      setFormData({
        title: download.title || '',
        category: download.category || 'Therapeutic Index',
        fileUrl: download.fileUrl || '',
        fileSize: download.fileSize || 1024 * 500,
        gated: Boolean(download.gated),
        downloadCount: download.downloadCount || 0,
        published: download.published !== false,
      });
    } else {
      setFormData({
        title: '',
        category: 'Therapeutic Index',
        fileUrl: '',
        fileSize: 1024 * 500,
        gated: false,
        downloadCount: 0,
        published: true,
      });
    }
    setUploadSuccess(false);
    setError(null);
  }, [download, open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'downloads');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || 'Failed to upload file');
      }

      setFormData((prev) => ({
        ...prev,
        fileUrl: json.url,
        fileSize: json.size || file.size,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      setUploadSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.fileUrl.trim()) {
        throw new Error('Please upload a file or enter a valid file URL.');
      }

      const payload = {
        id: download?.id,
        title: formData.title.trim(),
        category: formData.category,
        fileUrl: formData.fileUrl.trim(),
        fileSize: Number(formData.fileSize),
        gated: formData.gated,
        downloadCount: Number(formData.downloadCount),
        published: formData.published,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/downloads', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save download file');
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
          title="Edit Download Record"
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
          <span>Upload New Publication</span>
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
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#12150F]">
                  {isEdit ? 'Edit Downloadable Publication' : 'Upload New Downloadable Publication'}
                </h3>
                <p className="text-xs text-[#595C54]">
                  Official document will be available for clinics and distributors on /downloads.
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

              {/* Direct File Uploader */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#12150F] block">
                  Select Document File (PDF, Spec Sheet)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.webp"
                    onChange={handleFileUpload}
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
                    <span>{uploading ? 'Uploading...' : 'Choose File to Upload'}</span>
                  </Button>
                  {uploadSuccess && (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Uploaded ({formatBytes(formData.fileSize)})</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">Publication Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Standardised Product Formulary & Retail Price List"
                />
              </div>

              {/* Category & Gated Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Download['category'],
                      })
                    }
                    className="w-full text-xs px-3 py-2 border rounded-md bg-white border-neutral-300 focus:outline-hidden focus:border-[#1F4D3A] focus:ring-1 focus:ring-[#1F4D3A]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Access Protection</label>
                  <select
                    value={formData.gated ? 'gated' : 'open'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gated: e.target.value === 'gated',
                      })
                    }
                    className="w-full text-xs px-3 py-2 border rounded-md bg-white border-neutral-300 focus:outline-hidden focus:border-[#1F4D3A] focus:ring-1 focus:ring-[#1F4D3A]"
                  >
                    <option value="open">Direct Open Download</option>
                    <option value="gated">Gated (Requires Clinician Name & Email)</option>
                  </select>
                </div>
              </div>

              {/* File URL & File Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-[#12150F]">File URL *</label>
                  <Input
                    required
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="/downloads/price-list.pdf or https://..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">File Size (bytes)</label>
                  <Input
                    type="number"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: Number(e.target.value) })}
                  />
                  <span className="text-[10px] text-[#595C54] block">
                    ≈ {formatBytes(formData.fileSize)}
                  </span>
                </div>
              </div>

              {/* Published & Download Count */}
              <div className="flex items-center justify-between pt-2 border-t border-[rgba(18,21,15,0.06)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-neutral-300 text-[#1F4D3A] focus:ring-[#1F4D3A]"
                  />
                  <span className="font-medium text-[#12150F]">Publish on Website</span>
                </label>

                <div className="text-[11px] text-[#595C54] font-mono">
                  Recorded Downloads: {formData.downloadCount}
                </div>
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
                  {submitting ? 'Saving...' : isEdit ? 'Update Document' : 'Publish Document'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
