'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  FileDown,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  User,
  Phone,
  Mail,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatBytes } from '@/lib/utils';

interface BrochureData {
  title: string;
  description: string;
  fileUrl: string;
  fileSize: number;
  totalPages: number;
  edition: string;
}

interface BrochureDownloadSectionProps {
  brochure: BrochureData;
}

export function BrochureDownloadSection({ brochure }: BrochureDownloadSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState(brochure.fileUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/brochure-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit download request.');
      }

      const finalUrl = data.downloadUrl || brochure.fileUrl;
      setDownloadLink(finalUrl);
      setSubmitted(true);

      // Trigger instant browser download
      const link = document.createElement('a');
      link.href = finalUrl;
      link.setAttribute('download', data.fileName || 'PHBL-Therapeutic-Index-Brochure.pdf');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="brochure-download" className="py-20 bg-[#0F291E] text-white relative overflow-hidden">
      {/* Subtle background radial glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D6A4F]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Authoritative Editorial & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A4533] border border-[#2D6A4F] text-[#84E1BC] text-xs font-mono tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#E3B341]" />
              <span>OFFICIAL PUBLICATION · 44-PAGE COMPENDIUM</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white leading-tight tracking-tight">
              Download the Complete <br />
              <span className="text-[#E3B341] italic font-serif">Therapeutic Index</span> & Product Brochure
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              {brochure.description}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-neutral-200 bg-[#163D2D]/70 p-3 rounded-lg border border-[#235841]">
                <CheckCircle2 className="w-4 h-4 text-[#84E1BC] shrink-0 mt-0.5" />
                <span><strong>569+ Dilutions</strong> indexed from 3X to CM potencies</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-neutral-200 bg-[#163D2D]/70 p-3 rounded-lg border border-[#235841]">
                <CheckCircle2 className="w-4 h-4 text-[#84E1BC] shrink-0 mt-0.5" />
                <span><strong>Mother Tinctures</strong> classified under Grades A–J</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-neutral-200 bg-[#163D2D]/70 p-3 rounded-lg border border-[#235841]">
                <CheckCircle2 className="w-4 h-4 text-[#84E1BC] shrink-0 mt-0.5" />
                <span><strong>Patented Drops & Tonics</strong> with compositions & dosage</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-neutral-200 bg-[#163D2D]/70 p-3 rounded-lg border border-[#235841]">
                <CheckCircle2 className="w-4 h-4 text-[#84E1BC] shrink-0 mt-0.5" />
                <span><strong>Veterinary Homoeopathy</strong> & livestock remedies</span>
              </div>
            </div>

            {/* Meta Strip */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#235841] text-xs text-neutral-300 font-mono">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#E3B341]" />
                <span>44 Full Pages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#84E1BC]" />
                <span>{formatBytes(brochure.fileSize || 1380321)} PDF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#84E1BC]" />
                <span>Official GMP / HPI Standard</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Brochure Preview + Instant Lead Form */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-[#12150F]">
            {/* Visual Cover Preview */}
            <div className="w-44 sm:w-48 shrink-0 relative group">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-neutral-200 shadow-xl bg-neutral-100 group-hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/brochure-cover.webp"
                  alt="PHBL Therapeutic Index & Clinical Literature Brochure Cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 180px, 200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-mono uppercase bg-black/75 text-white py-1 px-2 rounded-sm backdrop-blur-xs font-semibold">
                  44 Pages Full Formulary
                </span>
              </div>
            </div>

            {/* Interactive Lead Form / Unlocked State */}
            <div className="flex-1 w-full space-y-4">
              {submitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#12150F]">
                      Download Started!
                    </h3>
                    <p className="text-xs text-[#595C54] mt-1">
                      Thank you, <strong>{formData.name}</strong>. Your copy of the official PHBL Therapeutic Index brochure is now downloading.
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={downloadLink}
                      download="PHBL-Therapeutic-Index-Brochure.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F4D3A] hover:underline"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Click here if download does not start automatically</span>
                    </a>
                  </div>

                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="space-y-1 mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase text-[#1F4D3A] tracking-wider">
                      Instant PDF Access
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#12150F]">
                      Get Your Free Copy
                    </h3>
                    <p className="text-xs text-[#595C54]">
                      Please provide your details below to instantly download the complete 44-page brochure.
                    </p>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs mb-3">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#12150F] mb-1">
                        Doctor / Contact Name <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          required
                          type="text"
                          placeholder="e.g. Dr. Tarak Prasad"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-9 text-xs h-9"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#12150F] mb-1">
                        Mobile Number / WhatsApp <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          required
                          type="tel"
                          placeholder="e.g. 9800011545"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-9 text-xs h-9"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#12150F] mb-1">
                        Email Address <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          required
                          type="email"
                          placeholder="e.g. doctor@clinic.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-9 text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        size="md"
                        className="w-full gap-2 text-xs font-semibold py-2.5 bg-[#1F4D3A] hover:bg-[#16382A]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing & Verifying...</span>
                          </>
                        ) : (
                          <>
                            <FileDown className="w-4 h-4 text-[#E3B341]" />
                            <span>Download 44-Page PDF Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-[10px] text-center text-[#595C54] pt-1">
                      100% confidential. Immediate browser download starts automatically.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
