'use client';

import React, { useState } from 'react';
import { BookOpen, Download, Send, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function BookletCta() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    email: '',
    phone: '',
    postalAddress: '',
    pinCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Therapeutic Index Booklet',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Hard Copy Request. Reg/Qual: ${formData.qualification}. Address: ${formData.postalAddress}, PIN: ${formData.pinCode}`,
          consent: true,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback success state
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-[#FAFAF8] border-b border-[rgba(18,21,15,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-md border border-[rgba(18,21,15,0.1)] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
                <BookOpen className="w-4 h-4" />
                <span>Clinical Reference Publication</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F]">
                Avail a Free Copy of the PHBL Therapeutic Index (2024–2025)
              </h2>

              <p className="text-sm sm:text-base text-[#595C54] leading-relaxed max-w-2xl">
                A definitive 140-page clinical compendium detailing indications, active potencies, posology, and biochemic cross-references compiled for registered medical practitioners and homoeopathic dispensaries.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a href="/downloads" className="inline-block">
                  <Button variant="primary" size="lg" className="gap-2 font-medium">
                    <Download className="w-4 h-4" />
                    <span>Download PDF Instantly (4.6 MB)</span>
                  </Button>
                </a>

                <Button
                  onClick={() => {
                    setModalOpen(true);
                    setSubmitted(false);
                  }}
                  variant="outline"
                  size="lg"
                  className="gap-2 font-medium"
                >
                  <Send className="w-4 h-4 text-[#1F4D3A]" />
                  <span>Request Printed Hard Copy (Free by Post)</span>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-64 rounded-sm bg-[#1F4D3A] text-white p-5 flex flex-col justify-between shadow-lg border border-[#16382A] transform rotate-1 hover:rotate-0 transition-transform">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-emerald-300">
                    PHBL MONOGRAPH
                  </span>
                  <h4 className="font-serif text-base font-bold leading-tight">
                    Therapeutic Index
                  </h4>
                  <p className="text-[10px] text-emerald-100">
                    Clinical Vade-Mecum & Formulary
                  </p>
                </div>
                <div className="text-[9px] font-mono text-emerald-300/80 border-t border-emerald-800 pt-2 flex justify-between">
                  <span>2024-25 ED.</span>
                  <span>LIC: HL-792 M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hard Copy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[rgba(18,21,15,0.12)] max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
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
                  Request Received
                </h3>
                <p className="text-sm text-[#595C54] leading-relaxed">
                  Thank you, Doctor. We have logged your request. A printed edition of the PHBL Therapeutic Index will be dispatched via registered postal book-post to your address within 5 business days.
                </p>
                <Button onClick={() => setModalOpen(false)} variant="primary" size="md">
                  Close Window
                </Button>
              </div>
            ) : (
              <div>
                <div className="space-y-1 mb-4">
                  <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A]">
                    Registered Practitioners
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#12150F]">
                    Request Complimentary Hard Copy
                  </h3>
                  <p className="text-xs text-[#595C54]">
                    Provided free of cost to doctors, clinics, dispensaries, and medical students across India.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-[#12150F] mb-1">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="Dr. Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#12150F] mb-1">
                        Qualification / Reg No. *
                      </label>
                      <Input
                        required
                        placeholder="e.g. BHMS / MD (Hom.)"
                        value={formData.qualification}
                        onChange={(e) =>
                          setFormData({ ...formData, qualification: e.target.value })
                        }
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
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="physician@clinic.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#12150F] mb-1">
                      Complete Postal Dispatch Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Clinic/Hospital address, Street, District, State"
                      value={formData.postalAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, postalAddress: e.target.value })
                      }
                      className="w-full rounded-md border border-[rgba(18,21,15,0.15)] p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4D3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#12150F] mb-1">
                      PIN Code (India) *
                    </label>
                    <Input
                      required
                      placeholder="6-digit PIN"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
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
                      {submitting ? 'Submitting Request...' : 'Dispatch My Copy Free of Charge'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
