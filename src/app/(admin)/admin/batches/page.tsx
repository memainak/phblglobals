import React from 'react';
import type { Metadata } from 'next';
import { getBatches } from '@/lib/queries';
import { BatchCsvImporter } from '@/components/admin/BatchCsvImporter';
import { BatchManagementTable } from '@/components/admin/BatchManagementTable';

export const metadata: Metadata = {
  title: 'Batch Traceability Management & Bulk CSV | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminBatchesPage() {
  const batchRes = await getBatches({ page: 1, pageSize: 200 }).catch(() => ({ batches: [], total: 0 }));
  const batches = batchRes.batches || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Regulatory Compliance System
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Batch Master Index & CSV Importer
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          Create, edit, and delete individual statutory batch monographs or import entire production runs via CSV.
        </p>
      </div>

      {/* Bulk CSV Importer Section */}
      <BatchCsvImporter />

      {/* Interactive Batches Management Table */}
      <BatchManagementTable initialBatches={batches} />
    </div>
  );
}
