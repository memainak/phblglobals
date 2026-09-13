'use client';

import React, { useState } from 'react';
import { Batch } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface BatchFormModalProps {
  batch?: Batch | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

function safeDateSlice(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return '';
  }
  try {
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

export function BatchFormModal({ batch, onSuccess, trigger }: BatchFormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(batch);

  const [formData, setFormData] = useState({
    batchNo: '',
    apiName: '',
    brandName: '',
    uniqueProductCode: '',
    manufacturerName: 'Purusottam Homoeo Bikash Laboratory (Bonded)',
    manufacturerAddress: 'L/3, Saratpally, Paschim Medinipur, Pin 721101, West Bengal, India',
    batchSize: '450 Litres',
    mfgDate: new Date().toISOString().slice(0, 10),
    expDate: '',
    expiryNote: '5 years from manufacturing date',
    shippingContainerCode: 'SSCC-0890123456789',
    mfgLicenseNo: 'HL-792 M',
    storageConditions: 'Store in a cool and dry place protected from light and moisture',
    authority: 'GNCT DELHI',
    published: true,
  });

  React.useEffect(() => {
    if (batch) {
      setFormData({
        batchNo: batch.batchNo || '',
        apiName: batch.apiName || '',
        brandName: batch.brandName || '',
        uniqueProductCode: batch.uniqueProductCode || '',
        manufacturerName: batch.manufacturerName || 'Purusottam Homoeo Bikash Laboratory (Bonded)',
        manufacturerAddress:
          batch.manufacturerAddress ||
          'L/3, Saratpally, Paschim Medinipur, Pin 721101, West Bengal, India',
        batchSize: batch.batchSize || '450 Litres',
        mfgDate: safeDateSlice(batch.mfgDate),
        expDate: safeDateSlice(batch.expDate),
        expiryNote: batch.expiryNote || '',
        shippingContainerCode: batch.shippingContainerCode || '',
        mfgLicenseNo: batch.mfgLicenseNo || 'HL-792 M',
        storageConditions: batch.storageConditions || '',
        authority: batch.authority || 'GNCT DELHI',
        published: batch.published !== false,
      });
    } else {
      setFormData({
        batchNo: '',
        apiName: '',
        brandName: '',
        uniqueProductCode: '',
        manufacturerName: 'Purusottam Homoeo Bikash Laboratory (Bonded)',
        manufacturerAddress:
          'L/3, Saratpally, Paschim Medinipur, Pin 721101, West Bengal, India',
        batchSize: '450 Litres',
        mfgDate: new Date().toISOString().slice(0, 10),
        expDate: '',
        expiryNote: '5 years from manufacturing date',
        shippingContainerCode: 'SSCC-0890123456789',
        mfgLicenseNo: 'HL-792 M',
        storageConditions: 'Store in a cool and dry place protected from light and moisture',
        authority: 'GNCT DELHI',
        published: true,
      });
    }
  }, [batch, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/batch', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          batchNo: formData.batchNo.trim().toUpperCase(),
          expDate: formData.expDate || null,
          originalBatchNo: batch?.batchNo,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save batch record');
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
          <span>Add Single Batch</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-2xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#595C54] hover:text-[#12150F] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
                Regulatory Monograph Entry
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#12150F]">
                {isEdit ? `Edit Batch Record: ${batch?.batchNo}` : 'Create Statutory Batch Record'}
              </h3>
            </div>

            {error && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Batch Number *
                  </label>
                  <Input
                    required
                    placeholder="e.g. BL-2024-0501"
                    value={formData.batchNo}
                    onChange={(e) =>
                      setFormData({ ...formData, batchNo: e.target.value })
                    }
                    className="font-mono uppercase text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Unique Product Code *
                  </label>
                  <Input
                    required
                    placeholder="e.g. UPC-HOM-ARN-001"
                    value={formData.uniqueProductCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        uniqueProductCode: e.target.value,
                      })
                    }
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Brand / Product Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Arnica Montana Mother Tincture"
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Active API Constituent *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Arnica Montana Ø (ENA Extract)"
                    value={formData.apiName}
                    onChange={(e) =>
                      setFormData({ ...formData, apiName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Batch Size / Volume *
                  </label>
                  <Input
                    required
                    placeholder="e.g. 450 Litres / 300 KG"
                    value={formData.batchSize}
                    onChange={(e) =>
                      setFormData({ ...formData, batchSize: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Manufacturing Date *
                  </label>
                  <Input
                    required
                    type="date"
                    value={formData.mfgDate}
                    onChange={(e) =>
                      setFormData({ ...formData, mfgDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Expiration Date
                  </label>
                  <Input
                    type="date"
                    value={formData.expDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Manufacturer Name *
                  </label>
                  <Input
                    required
                    value={formData.manufacturerName}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturerName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Manufacturing License No *
                  </label>
                  <Input
                    required
                    value={formData.mfgLicenseNo}
                    onChange={(e) =>
                      setFormData({ ...formData, mfgLicenseNo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#12150F] mb-1">
                  Manufacturer Address *
                </label>
                <Input
                  required
                  value={formData.manufacturerAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturerAddress: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Expiry Pharmacopoeial Rule / Note
                  </label>
                  <Input
                    placeholder="e.g. 5 years from mfg date"
                    value={formData.expiryNote}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryNote: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#12150F] mb-1">
                    Governing Drug Authority *
                  </label>
                  <Input
                    required
                    placeholder="e.g. GNCT DELHI / WB AYUSH"
                    value={formData.authority}
                    onChange={(e) =>
                      setFormData({ ...formData, authority: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#12150F] mb-1">
                  Serial Shipping Container Code (SSCC)
                </label>
                <Input
                  placeholder="e.g. SSCC-0890123456789012"
                  value={formData.shippingContainerCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingContainerCode: e.target.value,
                    })
                  }
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#12150F] mb-1">
                  Special Storage Conditions
                </label>
                <Input
                  value={formData.storageConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storageConditions: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="rounded text-[#1F4D3A]"
                  />
                  <span className="font-semibold text-[#12150F]">
                    Published in Public Master Index (Searchable via QR / COA)
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[rgba(18,21,15,0.08)]">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  variant="outline"
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  size="md"
                >
                  {submitting ? 'Saving Monograph...' : isEdit ? 'Update Batch Record' : 'Save & Publish Batch'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
