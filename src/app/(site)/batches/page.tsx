import React from 'react';
import type { Metadata } from 'next';
import { getBatches } from '@/lib/queries';
import { BatchTableFilter } from '@/components/site/BatchTableFilter';
import { ShieldCheck, FileCheck, QrCode } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Public Batch Traceability Portal | PHBL Regulatory Records',
  description:
    'Search and verify commercial homoeopathic pharmaceutical batches manufactured by Purusottam Homeo Bikash Lab(Bonded) (Lic HL-792 M). Regulatory compliance portal.',
};

export const revalidate = 3600;

export default async function BatchesIndexPage() {
  const { batches } = await getBatches({ page: 1, pageSize: 100 });

  // Extract unique authorities
  const authoritiesSet = new Set<string>();
  batches.forEach((b) => {
    if (b.authority) authoritiesSet.add(b.authority);
  });
  const authorities = Array.from(authoritiesSet);

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Statutory Drug Record Repository</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Batch Verification
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Enter a batch number below to confirm it was manufactured at our licensed facility, or browse the full list of verified batches.
          </p>
        </div>



        {/* Interactive Filterable Table */}
        <BatchTableFilter
          initialBatches={batches}
          authorities={authorities}
        />
      </div>
    </div>
  );
}
