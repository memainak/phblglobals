'use client';

import React, { useState, useEffect } from 'react';
import { Testimonial } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Edit2, Quote, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TestimonialFormModalProps {
  testimonial?: Testimonial | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function TestimonialFormModal({
  testimonial,
  onSuccess,
  trigger,
}: TestimonialFormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(testimonial);

  const [formData, setFormData] = useState({
    author: '',
    role: '',
    clinicOrInstitution: '',
    location: '',
    quote: '',
    order: 1,
    published: true,
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        author: testimonial.author || '',
        role: testimonial.role || '',
        clinicOrInstitution: testimonial.clinicOrInstitution || '',
        location: testimonial.location || '',
        quote: testimonial.quote || '',
        order: testimonial.order ?? 1,
        published: testimonial.published !== false,
      });
    } else {
      setFormData({
        author: '',
        role: '',
        clinicOrInstitution: '',
        location: '',
        quote: '',
        order: 1,
        published: true,
      });
    }
    setError(null);
  }, [testimonial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        id: testimonial?.id,
        author: formData.author.trim(),
        role: formData.role.trim(),
        clinicOrInstitution: formData.clinicOrInstitution.trim() || undefined,
        location: formData.location.trim() || undefined,
        quote: formData.quote.trim(),
        order: Number(formData.order) || 1,
        published: formData.published,
      };

      const res = await fetch('/api/testimonials', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save endorsement');
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
        <div onClick={() => setOpen(true)} className="inline-block">
          {trigger}
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          size="sm"
          className="gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Endorsement</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-xl w-full p-6 space-y-5 relative shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[rgba(18,21,15,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-[#1F4D3A]" />
                <h3 className="font-serif font-bold text-lg text-[#12150F]">
                  {isEdit ? 'Edit Clinical Endorsement' : 'Add New Clinical Endorsement'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[#595C54] hover:text-[#12150F] p-1 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Author / Practitioner Name */}
              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">
                  Practitioner / Partner Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Dr. B. K. Bhattacharya / Shri R. N. Mukherjee"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              {/* Role / Designation */}
              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">
                  Professional Role / Designation *
                </label>
                <Input
                  required
                  placeholder="e.g. Senior Consultant Homoeopath & Former Faculty"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              {/* Clinic or Institution & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">
                    Clinic / Institution / Firm
                  </label>
                  <Input
                    placeholder="e.g. Kolkata Homoeopathic Medical College"
                    value={formData.clinicOrInstitution}
                    onChange={(e) =>
                      setFormData({ ...formData, clinicOrInstitution: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">
                    City / Territory
                  </label>
                  <Input
                    placeholder="e.g. Kolkata, WB / New Delhi & NCR"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Endorsement Quote */}
              <div className="space-y-1">
                <label className="font-semibold text-[#12150F]">
                  Clinical & Trade Endorsement Statement *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. For over 15 years in my clinical practice, PHBL mother tinctures have demonstrated unmatched batch-to-batch consistency..."
                  className="w-full p-2.5 rounded-md border border-neutral-300 bg-white text-xs focus:ring-1 focus:ring-[#1F4D3A] focus:outline-hidden"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                />
                <span className="text-[10px] text-[#595C54]">
                  Highlight standardisation, clinical efficacy, pure ENA, or distribution reliability.
                </span>
              </div>

              {/* Order & Published Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[rgba(18,21,15,0.06)]">
                <div className="space-y-1">
                  <label className="font-semibold text-[#12150F]">Display Sequence Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-24"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="publishedCheck"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-neutral-300 text-[#1F4D3A] focus:ring-[#1F4D3A] h-4 w-4"
                  />
                  <label htmlFor="publishedCheck" className="text-xs font-semibold text-[#12150F] cursor-pointer">
                    Live / Published on Website
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(18,21,15,0.08)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="gap-1.5"
                >
                  {submitting ? 'Saving...' : isEdit ? 'Update Endorsement' : 'Publish Endorsement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default TestimonialFormModal;
