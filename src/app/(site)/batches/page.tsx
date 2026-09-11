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
            Public Batch Traceability Index
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            In compliance with drug regulatory norms and Good Manufacturing Practice guidelines, every finished pharmaceutical container produced at our bonded plant features an immutable batch monograph accessible to medical practitioners, distributors, and statutory inspectors.
          </p>
        </div>

        {/* Informational callout grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#595C54]">
          <div className="p-4 bg-white rounded-md border border-[rgba(18,21,15,0.08)] flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#12150F] block">Regulatory Monograph Format</strong>
              11 statutory points including Active API, SSCC container code, and storage conditions.
            </div>
          </div>

          <div className="p-4 bg-white rounded-md border border-[rgba(18,21,15,0.08)] flex items-start gap-3">
            <QrCode className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#12150F] block">Direct Carton QR Verification</strong>
              Outer shipper cartons carry high-density QR links encoding this direct repository.
            </div>
          </div>

          <div className="p-4 bg-white rounded-md border border-[rgba(18,21,15,0.08)] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1F4D3A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#12150F] block">Central Licensing Authority</strong>
              Records audited under Drug Manufacturing License HL-792 M (Bonded).
            </div>
          </div>
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
