'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, CheckCircle2, AlertCircle, Building, ShieldCheck } from 'lucide-react';

export function DistributorForm() {
  const [formData, setFormData] = useState({
    firmName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    drugLicenseNo: '',
    city: '',
    state: '',
    yearsInTrade: 5,
    existingBrandsCarried: '',
    territoryOfInterest: '',
    monthlyVolumeEstimate: '₹ 2 - 5 Lakhs',
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
      setErrorMessage('Please accept the pharmaceutical terms and trade consent.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/distributor-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.error || 'Validation error: please check GSTIN and Drug License format.'
        );
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting application.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-lg border border-[rgba(18,21,15,0.08)] text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
          Distributor Application Submitted
        </h3>
        <p className="text-sm text-[#595C54] max-w-lg mx-auto leading-relaxed">
          Thank you. Your wholesale commercial application for <strong>{formData.firmName}</strong> has been forwarded to the Directorate of Commercial Operations. Our Regional Distribution Manager will verify your drug license details and contact you within 48 business hours.
        </p>
        <div className="pt-4">
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            size="md"
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 sm:p-10 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-6 shadow-xs"
    >
      <div className="space-y-1 mb-2">
        <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
          Commercial Onboarding
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
          Authorized Distributor Application
        </h3>
        <p className="text-xs text-[#595C54]">
          For registered pharmaceutical distributors, wholesale stockists, and hospital suppliers.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Firm & Contact Person */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Registered Firm / Agency Name *
          </label>
          <Input
            required
            placeholder="e.g. Bengal Homoeo Distributing Co."
            value={formData.firmName}
            onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Authorized Contact Person *
          </label>
          <Input
            required
            placeholder="Managing Partner / Director"
            value={formData.contactPerson}
            onChange={(e) =>
              setFormData({ ...formData, contactPerson: e.target.value })
            }
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Official Email Address *
          </label>
          <Input
            required
            type="email"
            placeholder="distributor@agency.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Primary Mobile Number *
          </label>
          <Input
            required
            placeholder="10-digit mobile"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Statutory Licensing (GSTIN & Drug License) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-md bg-[#FAFAF8] border border-[rgba(18,21,15,0.06)]">
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            GSTIN (15-digit Tax Identification) *
          </label>
          <Input
            required
            placeholder="e.g. 19AAAAA0000A1Z5"
            value={formData.gstin}
            onChange={(e) =>
              setFormData({ ...formData, gstin: e.target.value.toUpperCase() })
            }
            className="font-mono text-xs uppercase"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Wholesale Drug License No. (Form 20B/21B) *
          </label>
          <Input
            required
            placeholder="e.g. DL-WB-MED-00123"
            value={formData.drugLicenseNo}
            onChange={(e) =>
              setFormData({ ...formData, drugLicenseNo: e.target.value })
            }
            className="font-mono text-xs"
          />
        </div>
      </div>

      {/* Territory & Geography */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            City / Headquarter *
          </label>
          <Input
            required
            placeholder="e.g. Medinipur / Kolkata"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            State / Region *
          </label>
          <Input
            required
            placeholder="e.g. West Bengal"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Years in Pharma Trade *
          </label>
          <Input
            required
            type="number"
            min={0}
            value={formData.yearsInTrade}
            onChange={(e) =>
              setFormData({ ...formData, yearsInTrade: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Distribution Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Existing Pharmaceutical Brands Carried *
          </label>
          <Input
            required
            placeholder="e.g. Major homoeopathic / allopathic brands"
            value={formData.existingBrandsCarried}
            onChange={(e) =>
              setFormData({ ...formData, existingBrandsCarried: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#12150F] mb-1">
            Target Territory / Districts Requested *
          </label>
          <Input
            required
            placeholder="e.g. Paschim Medinipur, Jhargram, Bankura"
            value={formData.territoryOfInterest}
            onChange={(e) =>
              setFormData({ ...formData, territoryOfInterest: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#12150F] mb-1">
          Estimated Monthly Turnover / Procurement Volume *
        </label>
        <select
          value={formData.monthlyVolumeEstimate}
          onChange={(e) =>
            setFormData({ ...formData, monthlyVolumeEstimate: e.target.value })
          }
          className="w-full text-xs sm:text-sm h-10 rounded-md border border-[rgba(18,21,15,0.15)] bg-white px-3 focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
        >
          <option value="Under ₹ 1 Lakh">Under ₹ 1 Lakh / month</option>
          <option value="₹ 1 - 3 Lakhs">₹ 1 - 3 Lakhs / month</option>
          <option value="₹ 3 - 7 Lakhs">₹ 3 - 7 Lakhs / month</option>
          <option value="₹ 7 - 15 Lakhs">₹ 7 - 15 Lakhs / month</option>
          <option value="Above ₹ 15 Lakhs">Above ₹ 15 Lakhs / month</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#12150F] mb-1">
          Additional Commercial Information / Retail Network
        </label>
        <textarea
          rows={3}
          placeholder="Number of retail chemist counters serviced, field representative strength, warehousing capacity..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-md border border-[rgba(18,21,15,0.15)] p-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
        />
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="distConsent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-1 rounded border-neutral-300 text-[#1F4D3A] focus:ring-[#1F4D3A]"
          required
        />
        <label htmlFor="distConsent" className="text-[11px] text-[#595C54] leading-relaxed">
          I affirm that the Drug License and GSTIN provided above are valid and active under state drug regulations. I consent to PHBL conducting commercial trade verification.
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
          <Building className="w-4 h-4" />
          <span>{submitting ? 'Submitting Application...' : 'Submit Distributor Application'}</span>
        </Button>
      </div>
    </form>
  );
}
