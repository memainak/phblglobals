import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BatchSearchWidget } from '@/components/site/BatchSearchWidget';

export function BatchVerificationCallout() {
  return (
    <section className="py-20 bg-[#F0F5F2] border-b border-[rgba(18,21,15,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-[#1F4D3A]/20 p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] text-xs font-mono font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#1F4D3A]" />
                <span>Public Regulatory Traceability</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12150F] leading-tight">
                Verify Any Bottle, Box, or Batch Number Instantly.
              </h2>

              <p className="text-sm sm:text-base text-[#595C54] leading-relaxed">
                In compliance with regulatory transparency and drug quality assurance directives, every commercial batch manufactured by PHBL has an immutable public monograph. Inspect manufacturing dates, active API records, expiration parameters, and authority validations.
              </p>

              <div className="pt-2">
                <BatchSearchWidget placeholder="Enter Batch Number (e.g. BL-2024-0101, BL-2024-0102)" />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#595C54]">
                <span className="font-medium text-[#12150F]">Sample Batches:</span>
                <Link
                  href="/batches/BL-2024-0101"
                  className="font-mono text-[#1F4D3A] hover:underline bg-[#F5F5F2] px-2 py-1 rounded-xs"
                >
                  BL-2024-0101 (Arnica Ø)
                </Link>
                <Link
                  href="/batches/BL-2024-0102"
                  className="font-mono text-[#1F4D3A] hover:underline bg-[#F5F5F2] px-2 py-1 rounded-xs"
                >
                  BL-2024-0102 (Alfalfa Tonic)
                </Link>
                <Link
                  href="/batches/BL-2024-0104"
                  className="font-mono text-[#1F4D3A] hover:underline bg-[#F5F5F2] px-2 py-1 rounded-xs"
                >
                  BL-2024-0104 (Five Phos 6X)
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAFAF8] rounded-md border border-[rgba(18,21,15,0.08)] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#1F4D3A] text-white flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#12150F]">
                    Carton Traceability
                  </h4>
                  <p className="text-xs text-[#595C54]">
                    Batch numbers printed on outer shipping cartons & labels
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#595C54] pt-2 border-t border-[rgba(18,21,15,0.08)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Unique Product Identification Code verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Serial Shipping Container Code (SSCC) verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct downloadable regulatory record sheet for drug inspectors</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/batches"
                  className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1"
                >
                  <span>Browse Full Master Batch Index</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
