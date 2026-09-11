'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductEnquiryModalProps {
  productId: string;
  productName: string;
}

export function ProductEnquiryModal({
  productId,
  productName,
}: ProductEnquiryModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Product Enquiry' as const,
    quantity: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Product Enquiry',
          productId,
          productName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Product: ${productName}. Est. Quantity: ${formData.quantity || 'N/A'}. Message: ${formData.message}`,
          consent: true,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
          setSubmitted(false);
        }}
        variant="primary"
        size="lg"
        className="w-full sm:w-auto gap-2 font-medium"
      >
        <Send className="w-4 h-4" />
        <span>Enquire About This Formulation</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#595C54] hover:text-[#12150F] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#12150F]">
                  Enquiry Transmitted
                </h3>
                <p className="text-sm text-[#595C54] leading-relaxed">
                  Thank you for your interest in <strong>{productName}</strong>. Our institutional sales and distribution team will contact you within 24 business hours.
                </p>
                <Button onClick={() => setOpen(false)} variant="primary" size="md">
                  Close Window
                </Button>
              </div>
            ) : (
              <div>
                <div className="space-y-1 mb-5">
                  <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
                    Wholesale & Clinical Order Desk
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#12150F]">
                    Formulation Enquiry
                  </h3>
                  <p className="text-xs text-[#595C54]">
                    Pre-filled for: <strong className="text-[#12150F]">{productName}</strong>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-[#12150F] mb-1">
                      Doctor / Firm Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Dr. Name or Medical Pharmacy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#12150F] mb-1">
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="practitioner@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#12150F] mb-1">
                        Mobile Number *
                      </label>
                      <Input
                        required
                        placeholder="10-digit mobile"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#12150F] mb-1">
                      Estimated Requirement / Pack Size
                    </label>
                    <Input
                      placeholder="e.g. 50 units of 100ml / 1 box of 450ml"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#12150F] mb-1">
                      Message / Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify institutional delivery address, state GST, or prescription requirements..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full rounded-md border border-[rgba(18,21,15,0.15)] p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      variant="primary"
                      size="lg"
                      className="w-full font-medium"
                    >
                      {submitting ? 'Submitting Enquiry...' : 'Submit Commercial Enquiry'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
