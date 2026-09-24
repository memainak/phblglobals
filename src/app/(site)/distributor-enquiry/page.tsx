import React from 'react';
import type { Metadata } from 'next';
import { DistributorForm } from '@/components/site/DistributorForm';
import { Network, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Become an Authorized Distributor & Stockist | PHBL',
  description:
    'Distributor onboarding application for pharmaceutical wholesalers, stockists, and hospital vendors across India. Mfg Lic HL-792 M.',
};

export const revalidate = 3600;

export default function DistributorEnquiryPage() {
  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>Commercial Supply & Wholesale Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Become an Authorized Distributor
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Partner with a certified bonded manufacturer with 21+ years of clinical reputation. We offer guaranteed territory exclusivity, timely batch logistics, and complete public regulatory backing.
          </p>
        </div>

        {/* 3 Value Propositions for Stockists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-2">
            <div className="w-9 h-9 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#12150F]">
              Territory Exclusivity
            </h4>
            <p className="text-xs text-[#595C54] leading-relaxed">
              Designated district and regional boundaries with dedicated stockist protection.
            </p>
          </div>

          <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-2">
            <div className="w-9 h-9 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#12150F]">
              Direct Plant Logistics
            </h4>
            <p className="text-xs text-[#595C54] leading-relaxed">
              Consignments dispatched directly from Paschim Medinipur with tamper-evident transport seals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-2">
            <div className="w-9 h-9 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#12150F]">
              Full Traceability
            </h4>
            <p className="text-xs text-[#595C54] leading-relaxed">
              Instant online batch records ensuring zero friction during state drug inspector audits.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <DistributorForm />
      </div>
    </div>
  );
}
