import React from 'react';
import type { Metadata } from 'next';
import { getDownloadsList } from '@/lib/queries';
import { DownloadManagementTable } from '@/components/admin/DownloadManagementTable';

export const metadata: Metadata = {
  title: 'Downloads & Publications CMS | PHBL Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminDownloadsPage() {
  const downloads = await getDownloadsList().catch(() => []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(18,21,15,0.08)]">
        <span className="text-xs font-mono uppercase text-[#1F4D3A] font-semibold">
          Publications & Formularies CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#12150F]">
          Downloadable Files Management
        </h1>
        <p className="text-xs text-[#595C54] mt-1">
          Upload, update, protect, and delete downloadable clinical dossiers, Therapeutic Indexes, retail price lists, and MSDS PDFs.
        </p>
      </div>

      {/* Interactive Table */}
      <DownloadManagementTable initialDownloads={downloads} />
    </div>
  );
}
