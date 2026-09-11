'use client';

import React, { useState } from 'react';
import { EnquiryType } from '@/types';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContactFormProps {
  productNames?: string[];
}

export function ContactForm({ productNames = [] }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'General' as EnquiryType,
    productName: '',
    message: '',
    consent: false,
    honeypot: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.consent) {
      setErrorMessage('Please accept the data processing consent.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting form. Please call our toll-free line.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-lg border border-[rgba(18,21,15,0.08)] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#12150F]">
          Enquiry Successfully Logged
        </h3>
        <p className="text-sm text-[#595C54] max-w-md mx-auto leading-relaxed">
          Thank you. Your communication has been routed to the relevant technical or commercial desk at our Paschim Medinipur plant. An official representative will respond within 24 business hours.
        </p>
        <div className="pt-2">
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                type: 'General',
                productName: '',
                message: '',
                consent: false,
                honeypot: '',
              });
            }}
            variant="outline"
            size="sm"
          >
            Submit Another Query
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-4 shadow-xs"
    >
      <div className="space-y-1 mb-4">
        <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
          Direct Communication Desk
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#12150F]">
          Send a Formal Enquiry
        </h3>
      </div>

      {errorMessage && (
        <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot anti-spam */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label className="block text-xs font-semibold text-[#12150F] mb-1">
          Full Name / Practitioner Name *
        </label>
        <Input
          required
          placeholder="e.g. Dr. A. K. Banerjee"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Email Address *
          </label>
          <Input
            required
            type="email"
            placeholder="practitioner@clinic.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Phone / Mobile Number *
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
          Enquiry Classification *
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as EnquiryType,
            })
          }
          className="w-full text-xs sm:text-sm h-10 rounded-md border border-[rgba(18,21,15,0.15)] bg-white px-3 focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
        >
          <option value="General">General Administrative Enquiry</option>
          <option value="Product Enquiry">Product Formulation & Posology</option>
          <option value="Distributor Enquiry">Stockist & Wholesale Distribution</option>
          <option value="Bulk & Export">Institutional Supply & Export</option>
          <option value="Therapeutic Index Booklet">Therapeutic Index Compendium</option>
          <option value="Pharmacovigilance & Complaint">Pharmacovigilance & Quality Feedback</option>
        </select>
      </div>

      {/* Conditional Product Select if Product Enquiry */}
      {formData.type === 'Product Enquiry' && productNames.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Formulation of Interest
          </label>
          <select
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            className="w-full text-xs sm:text-sm h-10 rounded-md border border-[rgba(18,21,15,0.15)] bg-white px-3 focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
          >
            <option value="">Select Formulation (Optional)</option>
            {productNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#12150F] mb-1">
          Message / Requirement Details *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Please describe your clinical inquiry, quantity requirement, or institutional profile..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-md border border-[rgba(18,21,15,0.15)] p-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
        />
      </div>

      {/* Legal Data Consent */}
      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="consent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-1 rounded border-neutral-300 text-[#1F4D3A] focus:ring-[#1F4D3A]"
          required
        />
        <label htmlFor="consent" className="text-[11px] text-[#595C54] leading-relaxed">
          I consent to PHBL processing my contact details solely for answering this medical/commercial inquiry in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.
        </label>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          size="lg"
          className="w-full gap-2 font-medium"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Transmitting...' : 'Send Official Enquiry'}</span>
        </Button>
      </div>
    </form>
  );
}
