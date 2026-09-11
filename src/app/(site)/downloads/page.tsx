import React from 'react';
import type { Metadata } from 'next';
import { getDownloads } from '@/lib/queries';
import { DownloadManager } from '@/components/site/DownloadManager';
import { FileDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Downloads & Publications (Therapeutic Index, Price Lists, MSDS) | PHBL',
  description:
    'Download official pharmaceutical publications: PHBL Therapeutic Index, clinical price lists, material safety data sheets (MSDS), and GMP compliance dossiers.',
};

export const revalidate = 3600;

export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider">
            <FileDown className="w-4 h-4" />
            <span>Official Publications & Dossiers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Downloads & Formularies
          </h1>
          <p className="text-sm sm:text-base text-[#595C54] max-w-3xl leading-relaxed">
            Access downloadable technical dossiers, the comprehensive 2024–25 Therapeutic Index, retail price lists, and Material Safety Data Sheets for registered medical dispensaries and wholesale distributors.
          </p>
        </div>

        {/* Interactive Downloads Table */}
        <DownloadManager initialDownloads={downloads} />
      </div>
    </div>
  );
}
