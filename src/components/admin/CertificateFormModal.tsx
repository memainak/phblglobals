'use client';

import React, { useState, useEffect } from 'react';
import { Certification } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Edit2, AlertCircle, Award } from 'lucide-react';

interface CertificateFormModalProps {
  certification?: Certification | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CertificateFormModal({ certification, onSuccess, trigger }: CertificateFormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(certification);

  const [formData, setFormData] = useState({
    title: '',
    issuingBody: '',
    certificateNo: '',
    issuedOn: new Date().toISOString().slice(0, 10),
    validUntil: '',
    fileUrl: '/images/certificates/sample-certificate.pdf',
    thumbnailUrl: '/images/certificates/sample-cert-thumb.webp',
    order: 1,
    published: true,
  });

  useEffect(() => {
    if (certification) {
      setFormData({
        title: certification.title || '',
        issuingBody: certification.issuingBody || '',
        certificateNo: certification.certificateNo || '',
        issuedOn: certification.issuedOn || '',
        validUntil: certification.validUntil || '',
        fileUrl: certification.fileUrl || '',
        thumbnailUrl: certification.thumbnailUrl || '',
        order: certification.order ?? 1,
        published: certification.published !== false,
      });
    } else {
      setFormData({
        title: '',
        issuingBody: '',
        certificateNo: '',
        issuedOn: new Date().toISOString().slice(0, 10),
        validUntil: '',
        fileUrl: '/images/certificates/sample-certificate.pdf',
        thumbnailUrl: '/images/certificates/sample-cert-thumb.webp',
        order: 1,
        published: true,
      });
    }
  }, [certification, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        id: certification?.id,
        title: formData.title.trim(),
        issuingBody: formData.issuingBody.trim(),
        certificateNo: formData.certificateNo.trim(),
        issuedOn: formData.issuedOn.trim(),
        validUntil: formData.validUntil.trim() || null,
        fileUrl: formData.fileUrl.trim(),
        thumbnailUrl: formData.thumbnailUrl.trim(),
        order: Number(formData.order),
        published: formData.published,
      };

      const res = await fetch('/api/certifications', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save certificate');
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
          <span>Upload Certificate</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(18,21,15,0.08)]">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#12150F]">
                  {isEdit ? `Edit Certificate: ${certification?.title}` : 'Add Accreditation Certificate'}
                </h3>
                <p className="text-xs text-[#595C54] mt-0.5">
                  Published on the public certifications & compliance showcase.
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">Certificate Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ISO 9001:2015 Quality Management System"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Issuing Body / Registrar *</label>
                  <Input
                    required
                    value={formData.issuingBody}
                    onChange={(e) => setFormData({ ...formData, issuingBody: e.target.value })}
                    placeholder="e.g. International Standards Certification"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Certificate / License No.</label>
                  <Input
                    value={formData.certificateNo}
                    onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
                    placeholder="e.g. QMS-2023-9081"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Issue Date</label>
                  <Input
                    type="date"
                    value={formData.issuedOn}
                    onChange={(e) => setFormData({ ...formData, issuedOn: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Valid Until (Expiry)</label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">Certificate PDF / Document URL</label>
                <Input
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="/images/certificates/iso-9001.pdf"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Thumbnail Image URL</label>
                  <Input
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
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

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cert-published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded text-[#1F4D3A]"
                />
                <label htmlFor="cert-published" className="font-medium text-[#12150F] cursor-pointer">
                  Published on Public Certifications Page
                </label>
              </div>

              {/* Footer */}
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
                  {submitting ? 'Saving...' : isEdit ? 'Update Certificate' : 'Save Certificate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
